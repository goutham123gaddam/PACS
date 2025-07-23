import React, { useState, useEffect } from 'react';
import { MIPThicknessInput } from './MIPThicknessInput';
import { utilities } from '@cornerstonejs/core';
import { ToolGroupManager } from '@cornerstonejs/tools';

interface MIPThicknessIntegrationProps {
  viewportId: string;
  toolGroupId: string;
  servicesManager: any;
}

const MIPThicknessIntegration: React.FC<MIPThicknessIntegrationProps> = ({
  viewportId,
  toolGroupId,
  servicesManager
}) => {
  const [currentThickness, setCurrentThickness] = useState(5.0);
  const [minThickness, setMinThickness] = useState(0.1);
  const [maxThickness, setMaxThickness] = useState(50.0);

  const { cornerstoneViewportService } = servicesManager.services;

  useEffect(() => {
    // Initialize thickness from current crosshairs state
    initializeThickness();
  }, [viewportId]);

  const initializeThickness = () => {
    try {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (viewport) {
        const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
        const crosshairsTool = toolGroup?.getToolInstance('Crosshairs');

        if (crosshairsTool) {
          // Get current slab thickness from crosshairs configuration
          const slabThickness = crosshairsTool.configuration?.slabThickness || 5.0;
          setCurrentThickness(slabThickness);

          // Set reasonable min/max based on image spacing
          const imageData = viewport.getImageData();
          if (imageData) {
            const spacing = imageData.getSpacing();
            const minSpacing = Math.min(...spacing);
            setMinThickness(minSpacing);
            setMaxThickness(minSpacing * 100); // Reasonable max
          }
        }
      }
    } catch (error) {
      console.warn('Error initializing MIP thickness:', error);
    }
  };

  const handleThicknessChange = (newThickness: number) => {
    try {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) return;

      const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
      const crosshairsTool = toolGroup?.getToolInstance('Crosshairs');

      if (crosshairsTool) {
        // Update the crosshairs tool configuration
        crosshairsTool.configuration = {
          ...crosshairsTool.configuration,
          slabThickness: newThickness
        };

        // If using MIP rendering, update the MIP configuration
        const renderingEngine = viewport.getRenderingEngine();
        const viewportInfo = renderingEngine.getViewport(viewportId);

        if (viewportInfo) {
          // Update MIP slab thickness
          viewportInfo.setProperties({
            slabThickness: newThickness
          });

          // Trigger re-render
          viewport.render();
        }

        setCurrentThickness(newThickness);

        // Notify other components of the change
        servicesManager.services.uiNotificationService?.show({
          title: 'MIP Thickness Updated',
          message: `Thickness set to ${newThickness.toFixed(1)}mm`,
          type: 'success',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error updating MIP thickness:', error);
      servicesManager.services.uiNotificationService?.show({
        title: 'Error',
        message: 'Failed to update MIP thickness',
        type: 'error',
        duration: 3000
      });
    }
  };

  return (
    <div className="mip-thickness-integration">
      <MIPThicknessInput
        currentThickness={currentThickness}
        minThickness={minThickness}
        maxThickness={maxThickness}
        onThicknessChange={handleThicknessChange}
        className="mb-2"
      />
    </div>
  );
};
