import { ToolGroupManager } from '@cornerstonejs/tools';
import { Enums } from '@cornerstonejs/core';

export interface MIPThicknessConfig {
  viewportId: string;
  thickness: number;
}

export class MIPThicknessHelper {
  static async updateMIPThickness(
    config: MIPThicknessConfig,
    cornerstoneViewportService: any
  ) {
    const { viewportId, thickness } = config;

    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport) {
      throw new Error('Viewport not found');
    }

    // Update crosshairs tool if available
    const toolGroupId = viewport.element?.dataset?.toolGroupId;
    if (toolGroupId) {
      const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
      const crosshairsTool = toolGroup?.getToolInstance('Crosshairs');

      if (crosshairsTool) {
        crosshairsTool.setConfiguration({
          slabThickness: thickness
        });
      }
    }

    // Update viewport camera
    const camera = viewport.getCamera();
    viewport.setCamera({
      ...camera,
      slabThickness: thickness
    });

    // Update MIP properties for volume viewports
    if (viewport.type === Enums.ViewportType.ORTHOGRAPHIC) {
      const properties = viewport.getProperties();
      viewport.setProperties({
        ...properties,
        slabThickness: thickness,
        blendMode: Enums.BlendModes.MAXIMUM_INTENSITY_BLEND
      });
    }

    viewport.render();
  }

  static getCurrentThickness(viewportId: string, cornerstoneViewportService: any): number {
    try {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (viewport) {
        const camera = viewport.getCamera();
        return camera.slabThickness || 5.0;
      }
    } catch (error) {
      console.warn('Error getting current thickness:', error);
    }
    return 5.0;
  }

  static getImageSpacing(viewportId: string, cornerstoneViewportService: any): [number, number] {
    try {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (viewport) {
        const imageData = viewport.getImageData();
        if (imageData) {
          const spacing = imageData.getSpacing();
          const minSpacing = Math.min(...spacing);
          return [minSpacing, minSpacing * 100];
        }
      }
    } catch (error) {
      console.warn('Error getting image spacing:', error);
    }
    return [0.1, 50.0]; // Default min/max
  }
}
