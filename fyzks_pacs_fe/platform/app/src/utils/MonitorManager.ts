// Dual Monitor Detection and Window Management

interface ScreenInfo {
  left: number;
  top: number;
  width: number;
  height: number;
  availLeft: number;
  availTop: number;
  availWidth: number;
  availHeight: number;
  isPrimary?: boolean;
}

interface MonitorConfig {
  hasMultipleMonitors: boolean;
  screens: ScreenInfo[];
  primaryScreen: ScreenInfo;
  secondaryScreen?: ScreenInfo;
}

interface LaunchResult {
  success: boolean;
  viewerWindow: Window | null;
  message: string;
}

class MonitorManager {
  private screens: ScreenInfo[] = [];
  private isExtendedMode = false;
  private primaryScreen: ScreenInfo | null = null;
  private secondaryScreen: ScreenInfo | null = null;

  async detectScreens(): Promise<MonitorConfig> {
    try {
      // Modern Screen API (Chrome 86+)
      if ('getScreenDetails' in window) {
        const permission = await navigator.permissions.query({ name: 'window-management' as PermissionName });
        
        if (permission.state !== 'denied') {
          const screenDetails = await (window as any).getScreenDetails();
          this.screens = screenDetails.screens;
          this.isExtendedMode = this.screens.length > 1;
          this.primaryScreen = this.screens.find(s => s.isPrimary) || this.screens[0];
          this.secondaryScreen = this.screens.find(s => !s.isPrimary);
          
          return this.getConfig();
        }
      }
    } catch (error) {
      console.warn('Modern Screen API not available:', error);
    }
    
    return this.detectLegacy();
  }

  private detectLegacy(): MonitorConfig {
    const { width, height, availWidth, availHeight } = window.screen;
    
    this.isExtendedMode = availWidth > width || availHeight > height;
    this.primaryScreen = {
      left: 0, top: 0, width, height,
      availLeft: 0, availTop: 0,
      availWidth: Math.min(availWidth, width),
      availHeight: Math.min(availHeight, height),
      isPrimary: true
    };

    if (this.isExtendedMode) {
      this.secondaryScreen = {
        left: width, top: 0,
        width: availWidth - width, height,
        availLeft: width, availTop: 0,
        availWidth: availWidth - width, availHeight,
        isPrimary: false
      };
    }

    return this.getConfig();
  }

  private getConfig(): MonitorConfig {
    return {
      hasMultipleMonitors: this.isExtendedMode,
      screens: this.isExtendedMode ? [this.primaryScreen!, this.secondaryScreen!] : [this.primaryScreen!],
      primaryScreen: this.primaryScreen!,
      secondaryScreen: this.secondaryScreen
    };
  }

  private getWindowFeatures(screen: ScreenInfo, width?: number, height?: number): string {
    const w = width || screen.availWidth * 0.95;
    const h = height || screen.availHeight * 0.95;
    const left = screen.availLeft + (screen.availWidth - w) / 2;
    const top = screen.availTop + (screen.availHeight - h) / 2;

    return [
      `width=${Math.round(w)}`,
      `height=${Math.round(h)}`,
      `left=${Math.round(left)}`,
      `top=${Math.round(top)}`,
      'resizable=yes,scrollbars=yes,status=yes'
    ].join(',');
  }

  async launchDualMonitorSetup(studyUID: string): Promise<LaunchResult> {
    try {
      const config = await this.detectScreens();
      
      if (config.hasMultipleMonitors && config.secondaryScreen) {
        const features = this.getWindowFeatures(config.secondaryScreen);
        const viewerWindow = window.open(`/viewer?StudyInstanceUIDs=${studyUID}`, 'viewer', features);
        
        return {
          success: true,
          viewerWindow,
          message: 'Viewer opened on secondary monitor'
        };
      }
      
      // Single monitor fallback
      const viewerWindow = window.open(`/viewer?StudyInstanceUIDs=${studyUID}`, '_blank');
      return {
        success: true,
        viewerWindow,
        message: 'Single monitor - opened in new tab'
      };
      
    } catch (error) {
      const viewerWindow = window.open(`/viewer?StudyInstanceUIDs=${studyUID}`, '_blank');
      return {
        success: false,
        viewerWindow,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getMonitorInfo(): Promise<MonitorConfig & { configuration: string }> {
    const config = await this.detectScreens();
    return {
      ...config,
      configuration: config.hasMultipleMonitors ? 'Extended' : 'Single Monitor'
    };
  }
}

// Utility functions
const monitorManager = new MonitorManager();

export const launchViewerOnDualMonitor = async (studyUID: string): Promise<Window | null> => {
  const result = await monitorManager.launchDualMonitorSetup(studyUID);
  if (!result.success) console.warn(result.message);
  return result.viewerWindow;
};

export const checkMonitorSetup = async (): Promise<MonitorConfig & { configuration: string }> => {
  return await monitorManager.getMonitorInfo();
};

export { MonitorManager };
export type { MonitorConfig, LaunchResult, ScreenInfo };