const CARDIO_THORACIC_RATIO = 'CardioThoracicRatio';

const CardioThoracicRatio = {
  toAnnotation: measurement => {
    return {
      annotationType: CARDIO_THORACIC_RATIO,
      data: {
        cardiacWidth: measurement.cardiacWidth,
        thoracicWidth: measurement.thoracicWidth,
        cardioThoracicRatio: measurement.cardioThoracicRatio,
      },
    };
  },

  toMeasurement: (
    csToolsAnnotation,
    displaySetInstanceUID,
    cornerstoneViewportService
  ) => {
    const { data, annotationUID } = csToolsAnnotation;
    const { cachedStats } = data;

    const cardiacWidth = cachedStats?.cardiacWidth || 0;
    const thoracicWidth = cachedStats?.thoracicWidth || 0;
    const ratio = cachedStats?.ratio || 0;

    return {
      uid: annotationUID,
      label: 'Cardio-Thoracic Ratio',
      description: `CTR: ${ratio.toFixed(3)}`,
      type: CARDIO_THORACIC_RATIO,
      cardiacWidth,
      thoracicWidth,
      cardioThoracicRatio: ratio,
      displaySetInstanceUID,

      getReport: () => ({
        values: [
          thoracicWidth.toFixed(2),
          cardiacWidth.toFixed(2),
          ratio.toFixed(3)
        ],
        columns: [
          'Thoracic Width (mm)',
          'Cardiac Width (mm)',
          'CTR'
        ],
      }),
    };
  },
};

export default CardioThoracicRatio;
