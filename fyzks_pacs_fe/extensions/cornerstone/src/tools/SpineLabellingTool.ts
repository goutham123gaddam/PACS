import { AnnotationTool } from '@cornerstonejs/tools';
import {
  getEnabledElement,
  utilities as csUtils,
} from '@cornerstonejs/core';
import {
  annotation,
  drawing,
} from '@cornerstonejs/tools';

class SpineLabelingTool extends AnnotationTool {
  static toolName = 'SpineLabeling';

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

    this.currentIndex = 0;
    this.vertebraeSequence = [
      'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
      'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
      'L1', 'L2', 'L3', 'L4', 'L5'
    ];
    this.isInitialized = false;
    this.isDescending = false;
    this.startingLabel = 'C1';
  }

  async initialize(element) {
    return new Promise((resolve) => {
      const dialog = document.createElement('dialog');
      dialog.innerHTML = `
        <div style="
          padding: 20px;
          font-family: sans-serif;
          background: #151515;
          color: #ffffff;
          border-radius: 8px;
          min-width: 300px;
        ">
          <h3 style="
            margin: 0 0 15px 0;
            color: #0944b3;
            font-size: 18px;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
          ">Spine Labeling Configuration</h3>

          <div style="margin-bottom: 15px;">
            <label style="color: #91b9ff;">Starting vertebra:</label><br>
            <select id="vertebra" style="
              margin: 5px 0;
              padding: 8px;
              width: 100%;
              background: #2a2a2a;
              border: 1px solid #444;
              color: #ffffff;
              border-radius: 4px;
            ">
              ${this.vertebraeSequence.map(v => `<option value="${v}">${v}</option>`).join('')}
            </select>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="color: #91b9ff;">Labeling order:</label><br>
            <select id="order" style="
              margin: 5px 0;
              padding: 8px;
              width: 100%;
              background: #2a2a2a;
              border: 1px solid #444;
              color: #ffffff;
              border-radius: 4px;
            ">
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>

          <button style="
            padding: 10px 20px;
            cursor: pointer;
            background: #0944b3;
            color: white;
            border: none;
            border-radius: 4px;
            width: 100%;
            font-weight: 500;
            transition: background 0.2s;
          " onmouseover="this.style.background='#0b5ed7'" onmouseout="this.style.background='#0944b3'">
            Start Labeling
          </button>
        </div>
      `;

      dialog.style.padding = '0';
      dialog.style.border = 'none';
      dialog.style.background = 'transparent';

      document.body.appendChild(dialog);
      dialog.showModal();

      const vertebraSelect = dialog.querySelector('#vertebra');
      const orderSelect = dialog.querySelector('#order');
      const button = dialog.querySelector('button');

      button.addEventListener('click', () => {
        this.startingLabel = vertebraSelect.value;
        this.isDescending = orderSelect.value === 'Descending';
        this.currentIndex = this.vertebraeSequence.indexOf(this.startingLabel);

        if (this.isDescending) {
          this.vertebraeSequence.reverse();
          this.currentIndex = this.vertebraeSequence.indexOf(this.startingLabel);
        }

        this.isInitialized = true;
        dialog.close();
        dialog.remove();
        resolve();
      });
    });
  }

  getCurrentLabel() {
    return this.vertebraeSequence[this.currentIndex] || 'Done';
  }

  addNewAnnotation(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;

    // Initialize if not done yet
    if (!this.isInitialized) {
      this.initialize(element).then(() => {
        // Create annotation after initialization
        this.createSpineAnnotation(evt);
      });
      evt.preventDefault();
      return null;
    }

    return this.createSpineAnnotation(evt);
  }

  createSpineAnnotation(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, element } = eventDetail;
    const worldPos = currentPoints.world;

    const enabledElement = getEnabledElement(element);
    const { viewport, renderingEngine } = enabledElement;

    // Check if we've labeled all vertebrae
    if (this.currentIndex >= this.vertebraeSequence.length) {
      console.log('All vertebrae labeled');
      return null;
    }

    const camera = viewport.getCamera();
    const { viewPlaneNormal, viewUp } = camera;

    const referencedImageId = this.getReferencedImageId(
      viewport,
      worldPos,
      viewPlaneNormal,
      viewUp
    );

    const annotationUID = csUtils.uuidv4();

    const annotationData = {
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
        label: this.getCurrentLabel(),
        handles: {
          points: [worldPos],
          activeHandleIndex: null,
        },
        cachedStats: {
          vertebra: this.getCurrentLabel(),
        },
      },
    };

    annotation.state.addAnnotation(annotationData, element);

    // Move to next vertebra
    if (this.currentIndex < this.vertebraeSequence.length - 1) {
      this.currentIndex++;
    }

    // Trigger viewport render
    viewport.render();

    evt.preventDefault();
    return annotationData;
  }

  isPointNearTool(element, annotation, canvasCoords, proximity) {
    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;

    const { data } = annotation;
    const { points } = data.handles;

    if (!points || points.length === 0) {
      return false;
    }

    const canvasPoint = viewport.worldToCanvas(points[0]);
    const distance = Math.sqrt(
      Math.pow(canvasCoords[0] - canvasPoint[0], 2) +
      Math.pow(canvasCoords[1] - canvasPoint[1], 2)
    );

    return distance <= proximity;
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
      const { label } = data;

      if (!points || points.length === 0) {
        continue;
      }

      styleSpecifier.annotationUID = annotationUID;

      const color = this.getStyle('color', styleSpecifier, annotationData);
      const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));

      // Draw point
      const pointUID = `${annotationUID}-point`;
      drawing.drawCircle(
        svgDrawingHelper,
        annotationUID,
        pointUID,
        canvasCoordinates[0],
        4,
        {
          color: color,
          fill: color,
        }
      );

      // Draw label text
      const textUID = `${annotationUID}-text`;
      const textOptions = {
        color: color,
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      };

      const textPosition = [
        canvasCoordinates[0][0] + 0,
        canvasCoordinates[0][1] - 0,
      ];

      drawing.drawTextBox(
        svgDrawingHelper,
        annotationUID,
        textUID,
        [label],
        textPosition,
        textOptions
      );

      // drawing.drawLinkedTextBox(
      //   svgDrawingHelper,
      //   annotationUID,
      //   textUID,
      //   [label],
      //   canvasCoordinates[0],
      //   canvasCoordinates,
      //   { hasMoved: false },
      //   textOptions
      // );

      renderStatus = true;
    }

    return renderStatus;
  };

  cancel(element) {
    // Reset the tool state
    this.isInitialized = false;
    this.currentIndex = 0;
    return this.getToolName();
  }
}

export default SpineLabelingTool;
