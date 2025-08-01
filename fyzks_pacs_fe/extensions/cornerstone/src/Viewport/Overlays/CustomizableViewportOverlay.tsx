import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { vec3 } from 'gl-matrix';
import PropTypes from 'prop-types';
import { metaData, Enums, utilities } from '@cornerstonejs/core';
import type { ImageSliceData } from '@cornerstonejs/core/types';
import { ViewportOverlay } from '@ohif/ui-next';
import type { InstanceMetadata } from '@ohif/core/src/types';
import { formatDICOMDate, formatDICOMTime, formatNumberPrecision } from './utils';
import { utils } from '@ohif/core';
import { StackViewportData, VolumeViewportData } from '../../types/CornerstoneCacheService';
import moment from 'moment';

import './CustomizableViewportOverlay.css';
import { useViewportRendering } from '../../hooks';

const EPSILON = 1e-4;
const { formatPN } = utils;

type ViewportData = StackViewportData | VolumeViewportData;

interface OverlayItemProps {
  element: HTMLElement;
  viewportData: ViewportData;
  imageSliceData: ImageSliceData;
  servicesManager: AppTypes.ServicesManager;
  viewportId: string;
  instance: InstanceMetadata;
  customization: any;
  formatters: {
    formatPN: (val) => string;
    formatDate: (val) => string;
    formatTime: (val) => string;
    formatNumberPrecision: (val, number) => string;
  };

  // calculated values
  voi: {
    windowWidth: number;
    windowCenter: number;
  };
  instanceNumber?: number;
  scale?: number;
}

const OverlayItemComponents = {
  'ohif.overlayItem': OverlayItem,
  'ohif.overlayItem.windowLevel': VOIOverlayItem,
  'ohif.overlayItem.zoomLevel': ZoomOverlayItem,
  'ohif.overlayItem.instanceNumber': InstanceNumberOverlayItem,
  'ohif.overlayItem.ruler': RulerOverlayItem,
};

/**
 * Customizable Viewport Overlay
 */
function CustomizableViewportOverlay({
  element,
  viewportData,
  imageSliceData,
  viewportId,
  servicesManager,
}: {
  element: HTMLElement;
  viewportData: ViewportData;
  imageSliceData: ImageSliceData;
  viewportId: string;
  servicesManager: AppTypes.ServicesManager;
}) {
  const { cornerstoneViewportService, customizationService, toolGroupService, displaySetService } =
    servicesManager.services;
  const [voi, setVOI] = useState({ windowCenter: null, windowWidth: null });
  const [scale, setScale] = useState(1);
  const { isViewportBackgroundLight: isLight } = useViewportRendering(viewportId);
  const { imageIndex } = imageSliceData;

  // Historical usage defined the overlays as separate items due to lack of
  // append functionality.  This code enables the historical usage, but
  // the recommended functionality is to append to the default values in
  // cornerstoneOverlay rather than defining individual items.
  const topLeftCustomization = customizationService.getCustomization('viewportOverlay.topLeft');
  const topRightCustomization = customizationService.getCustomization('viewportOverlay.topRight');
  const bottomLeftCustomization = customizationService.getCustomization(
    'viewportOverlay.bottomLeft'
  );
  const bottomRightCustomization = customizationService.getCustomization(
    'viewportOverlay.bottomRight'
  );

  const instances = useMemo(() => {
    if (viewportData != null) {
      return _getViewportInstances(viewportData);
    } else {
      return null;
    }
  }, [viewportData, imageIndex]);

  const instanceNumber = useMemo(
    () =>
      viewportData
        ? getInstanceNumber(viewportData, viewportId, imageIndex, cornerstoneViewportService)
        : null,
    [viewportData, viewportId, imageIndex, cornerstoneViewportService]
  );

  const displaySetProps = useMemo(() => {
    const displaySets = getDisplaySets(viewportData, displaySetService);
    if (!displaySets) {
      return null;
    }
    const [displaySet] = displaySets;
    const { instances, instance: referenceInstance } = displaySet;
    return {
      displaySets,
      displaySet,
      instance: instances?.[imageIndex],
      instances,
      referenceInstance,
    };
  }, [viewportData, viewportId, instanceNumber, cornerstoneViewportService]);

  /**
   * Updating the VOI when the viewport changes its voi
   */
  useEffect(() => {
    const updateVOI = eventDetail => {
      const { range } = eventDetail.detail;

      if (!range) {
        return;
      }

      const { lower, upper } = range;
      const { windowWidth, windowCenter } = utilities.windowLevel.toWindowLevel(lower, upper);

      setVOI({ windowCenter, windowWidth });
    };

    element.addEventListener(Enums.Events.VOI_MODIFIED, updateVOI);

    return () => {
      element.removeEventListener(Enums.Events.VOI_MODIFIED, updateVOI);
    };
  }, [viewportId, viewportData, voi, element]);

  /**
   * Updating the scale when the viewport changes its zoom
   */
  useEffect(() => {
    const updateScale = eventDetail => {
      const { previousCamera, camera } = eventDetail.detail;

      if (
        previousCamera.parallelScale !== camera.parallelScale ||
        previousCamera.scale !== camera.scale
      ) {
        const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);

        if (!viewport) {
          return;
        }

        const imageData = viewport.getImageData();

        if (!imageData) {
          return;
        }

        if (camera.scale) {
          setScale(camera.scale);
          return;
        }

        const { spacing } = imageData;
        // convert parallel scale to scale
        const scale = (element.clientHeight * spacing[0] * 0.5) / camera.parallelScale;
        setScale(scale);
      }
    };

    element.addEventListener(Enums.Events.CAMERA_MODIFIED, updateScale);

    return () => {
      element.removeEventListener(Enums.Events.CAMERA_MODIFIED, updateScale);
    };
  }, [viewportId, viewportData, cornerstoneViewportService, element]);

  const _renderOverlayItem = useCallback(
    (item, props) => {
      const overlayItemProps = {
        ...props,
        element,
        viewportData,
        imageSliceData,
        viewportId,
        servicesManager,
        customization: item,
        isLight,
        formatters: {
          formatPN,
          formatDate: formatDICOMDate,
          formatTime: formatDICOMTime,
          formatNumberPrecision,
        },
        instance: instances ? instances[item?.instanceIndex || 0] : null,
        voi,
        scale,
        instanceNumber,
      };

      if (!item) {
        return null;
      }

      const { inheritsFrom } = item;
      const OverlayItemComponent = OverlayItemComponents[inheritsFrom];

      if (OverlayItemComponent) {
        return <OverlayItemComponent {...overlayItemProps} />;
      } else {
        const renderItem = customizationService.transform(item);

        if (typeof renderItem.contentF === 'function') {
          return renderItem.contentF(overlayItemProps);
        }
      }
    },
    [
      element,
      viewportData,
      imageSliceData,
      viewportId,
      servicesManager,
      customizationService,
      displaySetProps,
      voi,
      scale,
      instanceNumber,
      instances,
    ]
  );

  // Define custom overlay items
  const studyDateItem = {
    id: 'StudyDate',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Study date',
    condition: ({ instance }) => instance && instance.StudyDate,
    contentF: ({ instance, formatters: { formatDate, formatTime } }) => {
      return `${formatDate(instance.StudyDate)} ${formatTime(instance.StudyTime, 'hh:mm A')}`;
    },
  };

  const seriesNumberItem = {
    id: 'SeriesNumber',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Series Number',
    condition: ({ instance }) => instance && instance.SeriesNumber,
    contentF: ({ instance }) => `Series: #${instance?.SeriesNumber}`,
  };

  const patientNameItem = {
    id: 'PatientName',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Patient Name',
    condition: ({ instance }) => instance && instance.PatientName,
    contentF: ({ instance }) => `${formatPN(instance.PatientName.Alphabetic)} (${instance?.PatientID})`,
  };

  const accessionItem = {
    id: 'AccessionNumber',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Accession Number',
    condition: ({ instance }) => instance && instance.AccessionNumber,
    contentF: ({ instance }) => `${instance?.AccessionNumber}`,
  };

  const patientIDItem = {
    id: 'PatientID',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Patient ID',
    condition: ({ instance }) => instance && instance.PatientID,
    contentF: ({ instance }) => instance?.PatientID,
  };

  const patientSexItem = {
    id: 'PatientSex',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Patient Sex',
    condition: ({ instance }) => instance && instance.PatientSex,
    contentF: ({ instance }) => instance?.PatientSex,
  };

  const patientDobItem = {
    id: 'PatientDOB',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Patient DOB',
    condition: ({ instance }) => instance && instance.PatientBirthDate,
    contentF: ({ instance, formatters: { formatDate } }) =>
      `${instance?.PatientSex} | ${formatDate(instance?.PatientBirthDate)} (${moment(instance.PatientBirthDate, 'YYYYMMDD').fromNow(true)})`,
  };

  const seriesDescriptionItem = {
    id: 'SeriesDescription',
    inheritsFrom: 'ohif.overlayItem',
    label: '',
    title: 'Series description',
    condition: ({ instance }) => instance && instance.SeriesDescription,
    contentF: ({ instance }) => `${instance.SeriesDescription}`,
  };

  const instanceNumberItem = {
    id: 'instanceNumber',
    inheritsFrom: 'ohif.overlayItem.instanceNumber',
    label: '',
    title: 'Instance Number',
    condition: ({ instance }) => instance && instance.SeriesDescription,
  };

  const rulerItem = {
    id: 'Ruler',
    inheritsFrom: 'ohif.overlayItem.ruler',
    label: '',
    title: 'Ruler',
    condition: ({ instance, scale }) => !!scale && !!instance,
  };

  const getContent = useCallback(
    (customization, keyPrefix) => {
      const props = {
        ...displaySetProps,
        formatters: {
          formatDate: formatDICOMDate,
          formatTime: formatDICOMTime,
          formatPN,
          formatNumberPrecision,
        },
        voi,
        scale,
        instanceNumber,
        viewportId,
        toolGroupService,
        isLight,
        instances,
      };

      // Create default items based on instances
      const createDefaultItems = () => {
        if (!instances) return [];

        const itemsMap = {
          topLeft: instances.map((instance, index) => [
            { ...patientNameItem, instanceIndex: index },
            { ...accessionItem, instanceIndex: index },
            { ...patientDobItem, instanceIndex: index },
            { ...studyDateItem, instanceIndex: index },
            { ...patientSexItem, instanceIndex: index },
          ]).flat(),
          topRight: instances.map((instance, index) => [
            { ...seriesNumberItem, instanceIndex: index },
            { ...seriesDescriptionItem, instanceIndex: index },
          ]).flat(),
          bottomLeft: instances.map((instance, index) => [
            { ...rulerItem, instanceIndex: index },
          ]).flat(),
          bottomRight: instances.map((instance, index) => [
            { ...instanceNumberItem, instanceIndex: index },
          ]).flat(),
        };

        return itemsMap[keyPrefix] || [];
      };

      const defaultItems = createDefaultItems();
      // const items = customization || defaultItems; // -- rogigginal
      const items = defaultItems || customization;

      return (
        <>
          {items.map((item, index) => (
            <div key={`${keyPrefix}_${index}`}>
              {((!item?.condition || item.condition(props)) && _renderOverlayItem(item, props)) ||
                null}
            </div>
          ))}
        </>
      );
    },
    [_renderOverlayItem, instances, displaySetProps, voi, scale, instanceNumber, toolGroupService, isLight]
  );

  return (
    <ViewportOverlay
      topLeft={getContent(topLeftCustomization, 'topLeft')}
      topRight={getContent(topRightCustomization, 'topRight')}
      bottomLeft={getContent(bottomLeftCustomization, 'bottomLeft')}
      bottomRight={getContent(bottomRightCustomization, 'bottomRight')}
      color={isLight ? 'text-neutral-dark' : 'text-neutral-light'}
      shadowClass={isLight ? 'shadow-light' : 'shadow-dark'}
    />
  );
}

/**
 * Gets an array of display sets for the given viewport, based on the viewport data.
 * Returns null if none found.
 */
function getDisplaySets(viewportData, displaySetService) {
  if (!viewportData?.data?.length) {
    return null;
  }
  const displaySets = viewportData.data
    .map(datum => displaySetService.getDisplaySetByUID(datum.displaySetInstanceUID))
    .filter(it => !!it);
  if (!displaySets.length) {
    return null;
  }
  return displaySets;
}

function _getViewportInstances(viewportData) {
  const imageIds = [];
  if (viewportData.viewportType === Enums.ViewportType.STACK) {
    imageIds.push(viewportData.data[0].imageIds[0]);
  } else if (viewportData.viewportType === Enums.ViewportType.ORTHOGRAPHIC) {
    const volumes = viewportData.data;
    volumes.forEach(volume => {
      if (!volume?.imageIds || volume.imageIds.length === 0) {
        return;
      }
      imageIds.push(volume.imageIds[0]);
    });
  }
  const instances = [];

  imageIds.forEach(imageId => {
    const instance = metaData.get('instance', imageId) || {};
    instances.push(instance);
  });
  return instances;
}

const getInstanceNumber = (viewportData, viewportId, imageIndex, cornerstoneViewportService) => {
  let instanceNumber;

  switch (viewportData.viewportType) {
    case Enums.ViewportType.STACK:
      instanceNumber = _getInstanceNumberFromStack(viewportData, imageIndex);
      break;
    case Enums.ViewportType.ORTHOGRAPHIC:
      instanceNumber = _getInstanceNumberFromVolume(
        viewportData,
        viewportId,
        cornerstoneViewportService,
        imageIndex
      );
      break;
  }

  return instanceNumber ?? null;
};

function _getInstanceNumberFromStack(viewportData, imageIndex) {
  const imageIds = viewportData.data[0].imageIds;
  const imageId = imageIds[imageIndex];

  if (!imageId) {
    return;
  }

  const generalImageModule = metaData.get('generalImageModule', imageId) || {};
  const { instanceNumber } = generalImageModule;

  const stackSize = imageIds.length;

  if (stackSize <= 1) {
    return;
  }

  return parseInt(instanceNumber);
}

// Since volume viewports can be in any view direction, they can render
// a reconstructed image which don't have imageIds; therefore, no instance and instanceNumber
// Here we check if viewport is in the acquisition direction and if so, we get the instanceNumber
function _getInstanceNumberFromVolume(
  viewportData,
  viewportId,
  cornerstoneViewportService,
  imageIndex
) {
  const volumes = viewportData.data;

  if (!volumes) {
    return;
  }

  // Todo: support fusion of acquisition plane which has instanceNumber
  const { volume } = volumes[0];

  if (!volume) {
    return;
  }

  const { direction, imageIds } = volume;

  const cornerstoneViewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);

  if (!cornerstoneViewport) {
    return;
  }

  const camera = cornerstoneViewport.getCamera();
  const { viewPlaneNormal } = camera;
  // checking if camera is looking at the acquisition plane (defined by the direction on the volume)

  const scanAxisNormal = direction.slice(6, 9);

  // check if viewPlaneNormal is parallel to scanAxisNormal
  const cross = vec3.cross(vec3.create(), viewPlaneNormal, scanAxisNormal);
  const isAcquisitionPlane = vec3.length(cross) < EPSILON;

  if (isAcquisitionPlane) {
    const imageId = imageIds[imageIndex];

    if (!imageId) {
      return {};
    }

    const { instanceNumber } = metaData.get('generalImageModule', imageId) || {};
    return parseInt(instanceNumber);
  }
}

function OverlayItem(props) {
  const { instance, customization = {} } = props;
  const { color, attribute, title, label, background } = customization;
  const value = customization.contentF?.(props, customization) ?? instance?.[attribute];
  if (value === undefined || value === null) {
    return null;
  }
  return (
    <div
      className="overlay-item flex flex-row"
      style={{ color, background }}
      title={title}
    >
      {label ? <span className="mr-1 shrink-0">{label}</span> : null}
      <span className="ml-0 mr-2 shrink-0">{value}</span>
    </div>
  );
}

/**
 * Window Level / Center Overlay item
 * //
 */
function VOIOverlayItem({ voi, customization }: OverlayItemProps) {
  const { windowWidth, windowCenter } = voi;
  if (typeof windowCenter !== 'number' || typeof windowWidth !== 'number') {
    return null;
  }

  return (
    <div
      className="overlay-item flex flex-row"
      style={{ color: customization?.color }}
    >
      <span className="mr-0.5 shrink-0 opacity-[0.70]">W:</span>
      <span className="mr-2.5 shrink-0">{windowWidth.toFixed(0)}</span>
      <span className="mr-0.5 shrink-0 opacity-[0.70]">L:</span>
      <span className="shrink-0">{windowCenter.toFixed(0)}</span>
    </div>
  );
}

/**
 * Zoom Level Overlay item
 */
function ZoomOverlayItem({ scale, customization }: OverlayItemProps) {
  return (
    <div
      className="overlay-item flex flex-row"
      style={{ color: (customization && customization.color) || undefined }}
    >
      <span className="mr-0.5 shrink-0 opacity-[0.70]">Zoom:</span>
      <span>{scale.toFixed(2)}x</span>
    </div>
  );
}

/**
 * Instance Number Overlay Item
 */
function InstanceNumberOverlayItem({
  instanceNumber,
  imageSliceData,
  customization,
}: OverlayItemProps) {
  const { imageIndex, numberOfSlices } = imageSliceData;

  return (
    <div
      className="overlay-item flex flex-row"
      style={{ color: (customization && customization.color) || undefined }}
    >
      <span>
        {instanceNumber !== undefined && instanceNumber !== null ? (
          <>
            <span className="mr-0.5 shrink-0 opacity-[0.70]">I:</span>
            <span>{`${instanceNumber} (${imageIndex + 1}/${numberOfSlices})`}</span>
          </>
        ) : (
          `${imageIndex + 1}/${numberOfSlices}`
        )}
      </span>
    </div>
  );
}

/**
 * Ruler Overlay Item
 */
function RulerOverlayItem(props) {
  const { scale, customization, instance } = props;
  const { PixelSpacing } = instance || {};

  if (!PixelSpacing) {
    return null;
  }

  const [x_spacing, y_spacing] = PixelSpacing;

  if (!scale) return null;

  const lengthInMM = 50; // Example length to display in millimeters
  const lengthInPixels = lengthInMM * scale / x_spacing;

  return (
    <div className="overlay-item ruler-overlay" style={{ color: customization?.color }}>
      <div className="ruler-bar" style={{ width: `${lengthInPixels}px` }}></div>
      <span>{lengthInMM} mm</span>
    </div>
  );
}

CustomizableViewportOverlay.propTypes = {
  viewportData: PropTypes.object,
  imageIndex: PropTypes.number,
  viewportId: PropTypes.string,
};

export default CustomizableViewportOverlay;

export { CustomizableViewportOverlay };
