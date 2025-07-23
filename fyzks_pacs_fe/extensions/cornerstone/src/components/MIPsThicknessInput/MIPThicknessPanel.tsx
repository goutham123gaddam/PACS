import React, { useState, useEffect, useCallback } from 'react';
import MIPThicknessInput from './MIPThicknessInput';

interface OrientationSpecificMIPPanelProps {
  servicesManager: any;
  commandsManager?: any;
}

interface AxisThickness {
  sagittal: number;  // Y-axis thickness
  coronal: number;   // X-axis thickness
  axial: number;     // Z-axis thickness
}

const MIPThicknessPanel: React.FC<OrientationSpecificMIPPanelProps> = ({
  servicesManager,
  commandsManager
}) => {
  const [axisThickness, setAxisThickness] = useState<AxisThickness>({
    sagittal: 5.0,
    coronal: 5.0,
    axial: 5.0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [presets] = useState([1, 2, 5, 10, 15, 20]);
  const [minThickness, setMinThickness] = useState(0.1);
  const [maxThickness, setMaxThickness] = useState(50.0);
  const [viewportOrientations, setViewportOrientations] = useState({});

  const { cornerstoneViewportService, uiNotificationService, viewportGridService } = servicesManager.services;

  // Helper function to determine viewport orientation
  const getViewportOrientation = (viewport) => {
    try {
      const camera = viewport.getCamera();
      const { viewPlaneNormal } = camera;

      const absX = Math.abs(viewPlaneNormal[0]);
      const absY = Math.abs(viewPlaneNormal[1]);
      const absZ = Math.abs(viewPlaneNormal[2]);

      if (absZ > absX && absZ > absY) {
        return 'axial';
      } else if (absY > absX && absY > absZ) {
        return 'coronal';
      } else if (absX > absY && absX > absZ) {
        return 'sagittal';
      }

      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  };

  // Update thickness for specific axis - only affects matching viewport orientations
  const updateAxisThickness = useCallback(async (axis: keyof AxisThickness, newThickness: number) => {
    setIsLoading(true);
    try {
      if (commandsManager) {
        // Use the orientation-specific command
        await commandsManager.runCommand('setAxisMIPSlabThickness', {
          axis,
          slabThickness: newThickness
        });
      } else {
        // Fallback: find viewports with matching orientation
        const { viewports } = viewportGridService.getState();

        viewports.forEach((viewport, viewportId) => {
          const cornerstoneViewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);

          if (cornerstoneViewport) {
            const orientation = getViewportOrientation(cornerstoneViewport);

            // Only update viewports that match the axis orientation
            if (orientation === axis) {
              try {
                const properties = cornerstoneViewport.getProperties() || {};
                const axisThickness = properties.axisSlabThickness || {};
                axisThickness[axis] = newThickness;

                cornerstoneViewport.setProperties({
                  ...properties,
                  slabThickness: newThickness,
                  axisSlabThickness: axisThickness
                });

                const camera = cornerstoneViewport.getCamera();
                cornerstoneViewport.setCamera({
                  ...camera,
                  slabThickness: newThickness
                });

                cornerstoneViewport.render();

              } catch (error) {
                console.warn(`Failed to set ${axis} thickness on viewport ${viewportId}:`, error);
              }
            }
          }
        });
      }

      // Update local state
      setAxisThickness(prev => ({
        ...prev,
        [axis]: newThickness
      }));

      uiNotificationService?.show({
        title: 'MIP Thickness Updated',
        message: `${axis.charAt(0).toUpperCase() + axis.slice(1)} viewports set to ${newThickness.toFixed(1)}mm`,
        type: 'success',
        duration: 2000
      });

    } catch (error) {
      console.error('Failed to update MIP thickness:', error);
      uiNotificationService?.show({
        title: 'Error',
        message: `Failed to update ${axis} thickness`,
        type: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, [commandsManager, cornerstoneViewportService, uiNotificationService, viewportGridService]);

  const handlePresetClick = async (axis: keyof AxisThickness, preset: number) => {
    try {
      await updateAxisThickness(axis, preset);
    } catch (error) {
      console.error('Error applying preset:', error);
    }
  };

  const applyToAllAxes = async (thickness: number) => {
    setIsLoading(true);
    try {
      if (commandsManager) {
        await commandsManager.runCommand('setAllAxisMIPSlabThickness', {
          slabThickness: thickness
        });

        // Update local state for all axes
        setAxisThickness({
          sagittal: thickness,
          coronal: thickness,
          axial: thickness
        });
      } else {
        // Apply to each axis individually
        await Promise.all([
          updateAxisThickness('sagittal', thickness),
          updateAxisThickness('coronal', thickness),
          updateAxisThickness('axial', thickness)
        ]);
      }
    } catch (error) {
      console.error('Error applying to all axes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug viewport orientations
  const debugOrientations = useCallback(() => {
    if (commandsManager) {
      const orientations = commandsManager.runCommand('debugViewportOrientations');
      setViewportOrientations(orientations);
    }
  }, [commandsManager]);

  // Initialize thickness and viewport orientations
  useEffect(() => {
    try {
      if (commandsManager) {
        const allThickness = commandsManager.runCommand('getAllAxisMIPSlabThickness');
        setAxisThickness(allThickness);

        // Debug orientations
        // debugOrientations();
      } else {
        // Fallback initialization
        const { activeViewportId } = viewportGridService.getState();
        const viewport = cornerstoneViewportService.getCornerstoneViewport(activeViewportId);

        if (viewport) {
          const properties = viewport.getProperties();
          const axisThickness = properties.axisSlabThickness || {};

          setAxisThickness({
            sagittal: axisThickness.sagittal || 5.0,
            coronal: axisThickness.coronal || 5.0,
            axial: axisThickness.axial || 5.0
          });

          // Set min/max based on image spacing
          try {
            const imageData = viewport.getImageData();
            if (imageData) {
              const spacing = imageData.getSpacing();
              const minSpacing = Math.min(...spacing);
              setMinThickness(minSpacing);
              setMaxThickness(minSpacing * 100);
            }
          } catch (e) {
            setMinThickness(0.1);
            setMaxThickness(50.0);
          }
        }
      }
    } catch (error) {
      console.warn('Error initializing MIP thickness:', error);
    }
  }, [commandsManager, cornerstoneViewportService, viewportGridService, debugOrientations]);

  return (
    <div className="orientation-specific-mip-panel p-4 bg-gray-900 rounded-lg">
      <h3 className="text-white text-sm font-semibold mb-3">MPR Slab Thickness</h3>

      {/* Debug info */}
      {/* {Object.keys(viewportOrientations).length > 0 && (
        <div className="mb-3 p-2 bg-gray-800 rounded text-xs">
          <div className="text-gray-400 mb-1">Viewport Orientations:</div>
          {Object.entries(viewportOrientations).map(([vpId, orientation]) => (
            <div key={vpId} className="text-gray-300">
              {vpId}: <span className="text-blue-400">{orientation}</span>
            </div>
          ))}
        </div>
      )} */}

      {/* Sagittal Axis Controls */}
      <div className="mb-4">
        <h4 className="text-blue-400 text-xs font-medium mb-2">
          🔵 Sagittal Viewports Only
        </h4>
        <MIPThicknessInput
          currentThickness={axisThickness.sagittal}
          minThickness={minThickness}
          maxThickness={maxThickness}
          onThicknessChange={(thickness) => updateAxisThickness('sagittal', thickness)}
          disabled={isLoading}
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {presets.map(preset => (
            <button
              key={`sagittal-${preset}`}
              onClick={() => handlePresetClick('sagittal', preset)}
              disabled={isLoading}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(axisThickness.sagittal - preset) < 0.1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {preset}mm
            </button>
          ))}
        </div>
      </div>

      {/* Coronal Axis Controls */}
      <div className="mb-4">
        <h4 className="text-green-400 text-xs font-medium mb-2">
          🟢 Coronal Viewports Only
        </h4>
        <MIPThicknessInput
          currentThickness={axisThickness.coronal}
          minThickness={minThickness}
          maxThickness={maxThickness}
          onThicknessChange={(thickness) => updateAxisThickness('coronal', thickness)}
          disabled={isLoading}
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {presets.map(preset => (
            <button
              key={`coronal-${preset}`}
              onClick={() => handlePresetClick('coronal', preset)}
              disabled={isLoading}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(axisThickness.coronal - preset) < 0.1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {preset}mm
            </button>
          ))}
        </div>
      </div>

      {/* Axial Axis Controls */}
      <div className="mb-4">
        <h4 className="text-yellow-400 text-xs font-medium mb-2">
          🟡 Axial Viewports Only
        </h4>
        <MIPThicknessInput
          currentThickness={axisThickness.axial}
          minThickness={minThickness}
          maxThickness={maxThickness}
          onThicknessChange={(thickness) => updateAxisThickness('axial', thickness)}
          disabled={isLoading}
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {presets.map(preset => (
            <button
              key={`axial-${preset}`}
              onClick={() => handlePresetClick('axial', preset)}
              disabled={isLoading}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(axisThickness.axial - preset) < 0.1
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {preset}mm
            </button>
          ))}
        </div>
      </div>

      {/* Apply to All Viewports */}
      <div className="mb-3 border-t border-gray-700 pt-3">
        <div className="text-gray-300 text-xs mb-2">Apply to All Orientations:</div>
        <div className="flex flex-wrap gap-1">
          {presets.map(preset => (
            <button
              key={`all-${preset}`}
              onClick={() => applyToAllAxes(preset)}
              disabled={isLoading}
              className="px-2 py-1 text-xs bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors"
            >
              {preset}mm
            </button>
          ))}
        </div>
      </div>

      {/* Debug and Help */}
      {/* <div className="mb-3 space-y-1">
        <button
          onClick={debugOrientations}
          className="w-full px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          Debug Viewport Orientations
        </button>
      </div> */}

      {/* Status */}
      {/* <div className="text-gray-400 text-xs">
        ✅ <strong>Orientation-Specific!</strong> Each axis only affects matching viewports.
        {isLoading && <span className="text-blue-400"> Updating...</span>}
      </div> */}
    </div>
  );
};

export default MIPThicknessPanel;
