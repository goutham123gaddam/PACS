import { AnnotationTool } from '@cornerstonejs/tools';
import {
  getEnabledElement,
  utilities as csUtils,
  triggerEvent,
  eventTarget,
} from '@cornerstonejs/core';
import {
  annotation,
  drawing,
  Enums
} from '@cornerstonejs/tools';
import { vec3 } from 'gl-matrix';

class CardioThoracicRatioTool extends AnnotationTool {
  static toolName = 'CardioThoracicRatio';

  constructor(
    toolProps = {},
    defaultToolProps = {
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        shadow: true,
        preventHandleOutsideImage: false,
      },
    }
  ) {
    super(toolProps, defaultToolProps);
  }

  addNewAnnotation(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;

    const enabledElement = getEnabledElement(element);
    const { viewport, renderingEngine } = enabledElement;

    // Check if we already have an incomplete annotation
    const existingAnnotations = annotation.state.getAnnotations(this.getToolName(), element);
    let currentAnnotation = existingAnnotations.find(ann =>
      ann.data.handles.points.length < 4
    );

    if (!currentAnnotation) {
      // Create new annotation
      const camera = viewport.getCamera();
      const { viewPlaneNormal, viewUp } = camera;

      const referencedImageId = this.getReferencedImageId(
        viewport,
        worldPos,
        viewPlaneNormal,
        viewUp
      );

      const annotationUID = csUtils.uuidv4();

      currentAnnotation = {
        annotationUID,
        highlighted: true,
        invalidated: true,
        metadata: {
          toolName: this.getToolName(),
          viewPlaneNormal: [...viewPlaneNormal],
          viewUp: [...viewUp],
          FrameOfReferenceUID: viewport.getFrameOfReferenceUID(),
          referencedImageId,
        },
        data: {
          label: '',
          handles: {
            points: [worldPos],
            activeHandleIndex: null,
            textBox: {
              hasMoved: false,
              worldPosition: [0, 0, 0],
              worldBoundingBox: {
                topLeft: [0, 0, 0],
                topRight: [0, 0, 0],
                bottomLeft: [0, 0, 0],
                bottomRight: [0, 0, 0],
              },
            },
          },
          cachedStats: {
            thoracicWidth: 0,
            cardiacWidth: 0,
            ratio: 0,
          },
        },
      };

      annotation.state.addAnnotation(currentAnnotation, element);
    } else {
      // Add point to existing annotation
      currentAnnotation.data.handles.points.push(worldPos);

      // Calculate stats if we have all 4 points
      if (currentAnnotation.data.handles.points.length === 4) {
        this._calculateCachedStats(currentAnnotation, renderingEngine, enabledElement);
      }
    }

    // Trigger viewport render instead of events
    viewport.render();

    evt.preventDefault();
    return currentAnnotation;
  }

  isPointNearTool(element, annotation, canvasCoords, proximity) {
    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;

    const { data } = annotation;
    const { points } = data.handles;

    if (!points || points.length === 0) {
      return false;
    }

    const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));

    // Check proximity to any handle first
    for (const canvasPoint of canvasCoordinates) {
      const distance = Math.sqrt(
        Math.pow(canvasCoords[0] - canvasPoint[0], 2) +
        Math.pow(canvasCoords[1] - canvasPoint[1], 2)
      );

      if (distance <= proximity) {
        return true;
      }
    }

    // Simple line proximity check for thoracic line (points 0-1)
    if (canvasCoordinates.length >= 2) {
      const distance = this._distanceToLineSegment(
        canvasCoords,
        canvasCoordinates[0],
        canvasCoordinates[1]
      );
      if (distance <= proximity) {
        return true;
      }
    }

    // Simple line proximity check for cardiac line (points 2-3)
    if (canvasCoordinates.length >= 4) {
      const distance = this._distanceToLineSegment(
        canvasCoords,
        canvasCoordinates[2],
        canvasCoordinates[3]
      );
      if (distance <= proximity) {
        return true;
      }
    }

    return false;
  }

  toolSelectedCallback(evt, annotation) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;

    annotation.highlighted = true;

    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;

    viewport.render();
  }

  handleSelectedCallback(evt, annotation, handle) {
    const eventDetail = evt.detail;
    const { element } = eventDetail;

    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;

    annotation.highlighted = true;

    viewport.render();
  }

  _calculateCachedStats(annotation, renderingEngine, enabledElement) {
    const { data } = annotation;
    const { points } = data.handles;

    if (points.length !== 4) {
      return null;
    }

    const [point1, point2, point3, point4] = points;

    // Calculate distances
    const thoracicWidth = vec3.distance(point1, point2);
    const cardiacWidth = vec3.distance(point3, point4);

    // Calculate CTR (ensure it's always <= 1)
    let ratio = cardiacWidth / thoracicWidth;
    if (ratio > 1) {
      ratio = 1 / ratio;
    }

    const stats = {
      thoracicWidth: thoracicWidth,
      cardiacWidth: cardiacWidth,
      ratio: ratio,
      unit: 'mm',
    };

    data.cachedStats = stats;
    annotation.invalidated = false;

    // Trigger viewport render
    enabledElement.viewport.render();

    return stats;
  }

  _distanceToLineSegment(point, lineStart, lineEnd) {
    const A = point[0] - lineStart[0];
    const B = point[1] - lineStart[1];
    const C = lineEnd[0] - lineStart[0];
    const D = lineEnd[1] - lineStart[1];

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    if (lenSq === 0) {
      return Math.sqrt(A * A + B * B);
    }

    let param = dot / lenSq;

    if (param < 0) {
      param = 0;
    } else if (param > 1) {
      param = 1;
    }

    const xx = lineStart[0] + param * C;
    const yy = lineStart[1] + param * D;

    const dx = point[0] - xx;
    const dy = point[1] - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  renderAnnotation = (enabledElement, svgDrawingHelper) => {
    let renderStatus = false;
    const { viewport } = enabledElement;
    const { element } = viewport;

    let annotations = annotation.state.getAnnotations(this.getToolName(), element);

    if (!annotations?.length) {
      return renderStatus;
    }

    annotations = this.filterInteractableAnnotationsForElement(
      element,
      annotations
    );

    if (!annotations?.length) {
      return renderStatus;
    }

    const styleSpecifier = {
      toolGroupId: this.toolGroupId,
      toolName: this.getToolName(),
      viewportId: enabledElement.viewportId,
    };

    for (let i = 0; i < annotations.length; i++) {
      const annotationData = annotations[i];
      const { annotationUID, data } = annotationData;
      const { points } = data.handles;

      if (!points || points.length === 0) {
        continue;
      }

      styleSpecifier.annotationUID = annotationUID;

      const lineWidth = this.getStyle('lineWidth', styleSpecifier, annotationData);
      const lineDash = this.getStyle('lineDash', styleSpecifier, annotationData);
      const color = this.getStyle('color', styleSpecifier, annotationData);

      const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));

      // Draw thoracic line (first two points)
      if (canvasCoordinates.length >= 2) {
        const thoracicLineUID = `${annotationUID}-thoracic-line`;
        drawing.drawLine(
          svgDrawingHelper,
          annotationUID,
          thoracicLineUID,
          canvasCoordinates[0],
          canvasCoordinates[1],
          {
            color: color,
            width: lineWidth,
            lineDash: lineDash,
          }
        );
      }

      // Draw cardiac line (last two points)
      if (canvasCoordinates.length >= 4) {
        const cardiacLineUID = `${annotationUID}-cardiac-line`;
        drawing.drawLine(
          svgDrawingHelper,
          annotationUID,
          cardiacLineUID,
          canvasCoordinates[2],
          canvasCoordinates[3],
          {
            color: color,
            width: lineWidth,
            lineDash: lineDash,
          }
        );

        // Draw text
        const textLines = this.getTextLines(data);
        if (textLines && textLines.length > 0) {
          const textUID = `${annotationUID}-text`;
          const textOptions = {
            color: color,
          };

          // Position text near the cardiac line
          const midpoint = [
            (canvasCoordinates[2][0] + canvasCoordinates[3][0]) / 2,
            (canvasCoordinates[2][1] + canvasCoordinates[3][1]) / 2,
          ];

          drawing.drawLinkedTextBox(
            svgDrawingHelper,
            annotationUID,
            textUID,
            textLines,
            midpoint,
            textOptions
          );
        }
      }

      // Draw handles
      const handleGroupUID = `${annotationUID}-handles`;
      drawing.drawHandles(
        svgDrawingHelper,
        annotationUID,
        handleGroupUID,
        canvasCoordinates,
        {
          color: color,
        }
      );

      renderStatus = true;
    }

    return renderStatus;
  };

  getTextLines(data) {
    const cachedStats = data.cachedStats;

    if (!cachedStats) {
      return [];
    }

    const { thoracicWidth, cardiacWidth, ratio, unit } = cachedStats;

    if (ratio === undefined || ratio === null) {
      return [];
    }

    const textLines = [
      `Thoracic: ${thoracicWidth.toFixed(1)} ${unit}`,
      `Cardiac: ${cardiacWidth.toFixed(1)} ${unit}`,
      `CTR: ${ratio.toFixed(3)}`,
    ];

    return textLines;
  }

  cancel(element) {
    // Remove incomplete annotations
    const annotations = annotation.state.getAnnotations(this.getToolName(), element);
    const incompleteAnnotations = annotations.filter(ann =>
      ann.data.handles.points.length < 4
    );

    incompleteAnnotations.forEach(ann => {
      annotation.state.removeAnnotation(ann.annotationUID);
    });

    return this.getToolName();
  }
}

export default CardioThoracicRatioTool;
