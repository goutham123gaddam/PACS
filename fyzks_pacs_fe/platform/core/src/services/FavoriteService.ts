import { PubSubService } from './_shared/pubSubServiceInterface';

interface ModalityFavorites {
  [modality: string]: string[];
}

const EVENTS = {
  FAVORITES_UPDATED: 'event::favoritesService:favoritesUpdated',
  MODALITY_CHANGED: 'event::favoritesService:modalityChanged',
  TOOLBAR_STYLING_UPDATED: 'event::favoritesService:toolbarStylingUpdated',
};

export default class FavoritesService extends PubSubService {
  public static REGISTRATION = {
    name: 'favoritesService',
    create: ({ servicesManager }) => {
      return new FavoritesService(servicesManager);
    },
  };

  private _modalityFavorites: ModalityFavorites = {};
  private _currentModality: string = 'DEFAULT';
  private _storageKey = 'ohif-favorite-tools-by-modality';
  private _servicesManager: any;
  private _toolbarService: any;
  private _favoriteClassName: string = 'favorite-tool';

  constructor(servicesManager: any) {
    super(EVENTS); // Pass EVENTS to parent constructor
    this._servicesManager = servicesManager;
    this._loadFromStorage();
    this._subscribeToModalityChanges();
  }

  public get events() {
    return EVENTS;
  }

  /**
   * Initialize toolbar integration - call this after toolbarService is available
   */
  public initializeToolbarIntegration(modality): void {
    this._toolbarService = this._servicesManager.services.toolbarService;

    if (this._toolbarService) {
      // Listen for our own favorites updates to refresh toolbar styling
      this.subscribe(EVENTS.FAVORITES_UPDATED, this._updateToolbarStyling.bind(this));
      this.subscribe(EVENTS.MODALITY_CHANGED, this._updateToolbarStyling.bind(this));

      // Initial toolbar styling
      this._updateToolbarStyling(modality);
    }
  }

  /**
   * Set custom CSS class name for favorite buttons
   */
  public setFavoriteClassName(className: string): void {
    this._favoriteClassName = className;
    this._updateToolbarStyling();
  }

  /**
   * Get current favorite CSS class name
   */
  public getFavoriteClassName(): string {
    return this._favoriteClassName;
  }

  private _subscribeToModalityChanges(): void {
    // Listen for viewport changes to detect modality
    const { viewportGridService } = this._servicesManager.services;

    if (viewportGridService) {
      viewportGridService.subscribe(
        viewportGridService.EVENTS.ACTIVE_VIEWPORT_ID_CHANGED,
        this._handleViewportChange.bind(this)
      );
    }
  }

  private _handleViewportChange(): void {
    // Get current modality from active viewport
    const modality = this._getCurrentModality();
    if (modality && modality !== this._currentModality) {
      const previousModality = this._currentModality;
      this._currentModality = modality;

      this._broadcastEvent(EVENTS.MODALITY_CHANGED, {
        modality,
        previousModality,
        favorites: this.getFavoriteTools(modality),
      });
    }
  }

  private _getCurrentModality(): string {
    try {
      const { viewportGridService, displaySetService } = this._servicesManager.services;
      const activeViewportId = viewportGridService?.getActiveViewportId();

      if (activeViewportId) {
        const viewport = viewportGridService.getViewportInfo(activeViewportId);
        const displaySetInstanceUIDs = viewport?.getDisplaySetInstanceUIDs?.();

        if (displaySetInstanceUIDs?.length > 0) {
          const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUIDs[0]);
          return displaySet?.Modality || 'DEFAULT';
        }
      }
    } catch (error) {
      console.warn('Could not determine current modality:', error);
    }

    return 'DEFAULT';
  }

  private _loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this._storageKey);
      if (stored) {
        this._modalityFavorites = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load favorites from storage:', error);
      this._modalityFavorites = {};
    }
  }

  private _saveToStorage(): void {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify(this._modalityFavorites));
    } catch (error) {
      console.warn('Failed to save favorites to storage:', error);
    }
  }

  /**
   * Update toolbar button styling based on current favorites
   */
  private _updateToolbarStyling(modality?): void {
    if (!this._toolbarService) {
      return;
    }

    const currentFavorites = this.getFavoriteTools(modality);
    const allButtons = this._toolbarService.getButtons();

    // Update each button's evaluate function to include favorite styling
    Object.values(allButtons).forEach((button: any) => {
      if (button && button.props) {
        const isFavorite = currentFavorites.includes(button.id);
        this._updateButtonEvaluateFunction(button, isFavorite);
      }
    });

    // Refresh toolbar to apply changes
    this._toolbarService.refreshToolbarState({});

    this._broadcastEvent(EVENTS.TOOLBAR_STYLING_UPDATED, {
      modality: this._currentModality,
      favorites: currentFavorites,
      className: this._favoriteClassName,
    });
  }

  /**
   * Update a button's evaluate function to include favorite styling
   */
  private _updateButtonEvaluateFunction(button: any, isFavorite: boolean): void {
    const originalEvaluate = button.props._originalEvaluate || button.props.evaluate;

    // Store original evaluate function if not already stored
    if (!button.props._originalEvaluate) {
      button.props._originalEvaluate = originalEvaluate;
    }

    // Create new evaluate function that adds favorite className
    button.props.evaluate = (args: any) => {
      let result = { disabled: false, isActive: false, className: '' };

      // Call original evaluate function
      if (typeof originalEvaluate === 'function') {
        result = { ...result, ...(originalEvaluate(args) || {}) };
      } else if (typeof originalEvaluate === 'string') {
        const evaluateFunction = this._toolbarService._evaluateFunction[originalEvaluate];
        if (evaluateFunction) {
          result = { ...result, ...(evaluateFunction(args) || {}) };
        }
      }



      // Add favorite className if this button is a favorite
      if (isFavorite) {
        const existingClassName = result.className || '';
        result.className = existingClassName
          ? `${existingClassName} ${this._favoriteClassName}`
          : this._favoriteClassName;
      }

      return result;
    };
  }

  public getFavoriteTools(modality?: string): string[] {
    const targetModality = modality || this._currentModality;
    return [...(this._modalityFavorites[targetModality] || this._modalityFavorites['DEFAULT'] || [])];
  }

  public setModalityFavorites(modalityFavorites: ModalityFavorites): void {
    this._modalityFavorites = { ...modalityFavorites };
    this._saveToStorage();
    this._broadcastEvent(EVENTS.FAVORITES_UPDATED, {
      modality: this._currentModality,
      favorites: this.getFavoriteTools(),
      allModalityFavorites: this._modalityFavorites,
    });
  }

  public setFavoriteTools(toolIds: string[], modality?: string): void {
    const targetModality = modality || this._currentModality;
    this._modalityFavorites[targetModality] = [...toolIds];
    this._saveToStorage();
    this._broadcastEvent(EVENTS.FAVORITES_UPDATED, {
      modality: targetModality,
      favorites: toolIds,
      allModalityFavorites: this._modalityFavorites,
    });
  }

  public addToFavorites(toolId: string, modality?: string): boolean {
    const targetModality = modality || this._currentModality;
    const currentFavorites = this._modalityFavorites[targetModality] || [];

    if (!currentFavorites.includes(toolId)) {
      this._modalityFavorites[targetModality] = [...currentFavorites, toolId];
      this._saveToStorage();
      this._broadcastEvent(EVENTS.FAVORITES_UPDATED, {
        modality: targetModality,
        favorites: this._modalityFavorites[targetModality],
        allModalityFavorites: this._modalityFavorites,
        added: toolId,
      });
      return true;
    }
    return false;
  }

  public removeFromFavorites(toolId: string, modality?: string): boolean {
    const targetModality = modality || this._currentModality;
    const currentFavorites = this._modalityFavorites[targetModality] || [];
    const index = currentFavorites.indexOf(toolId);

    if (index > -1) {
      this._modalityFavorites[targetModality] = currentFavorites.filter(id => id !== toolId);
      this._saveToStorage();
      this._broadcastEvent(EVENTS.FAVORITES_UPDATED, {
        modality: targetModality,
        favorites: this._modalityFavorites[targetModality],
        allModalityFavorites: this._modalityFavorites,
        removed: toolId,
      });
      return true;
    }
    return false;
  }

  /**
   * Toggle a tool's favorite status
   */
  public toggleFavorite(toolId: string, modality?: string): boolean {
    if (this.isFavorite(toolId, modality)) {
      return this.removeFromFavorites(toolId, modality);
    } else {
      return this.addToFavorites(toolId, modality);
    }
  }

  public isFavorite(toolId: string, modality?: string): boolean {
    const targetModality = modality || this._currentModality;
    const favorites = this._modalityFavorites[targetModality] || this._modalityFavorites['DEFAULT'] || [];
    return favorites.includes(toolId);
  }

  public clearFavorites(modality?: string): void {
    const targetModality = modality || this._currentModality;
    this._modalityFavorites[targetModality] = [];
    this._saveToStorage();
    this._broadcastEvent(EVENTS.FAVORITES_UPDATED, {
      modality: targetModality,
      favorites: [],
      allModalityFavorites: this._modalityFavorites,
      cleared: true,
    });
  }

  public getAllModalityFavorites(): ModalityFavorites {
    return { ...this._modalityFavorites };
  }

  public getCurrentModality(): string {
    return this._currentModality;
  }

  public setCurrentModality(modality: string): void {
    if (modality !== this._currentModality) {
      const previousModality = this._currentModality;
      this._currentModality = modality;
      this._broadcastEvent(EVENTS.MODALITY_CHANGED, {
        modality,
        previousModality,
        favorites: this.getFavoriteTools(modality),
      });
    }
  }

  /**
   * Get all available tool buttons from toolbar service
   */
  public getAvailableTools(): string[] {
    if (!this._toolbarService) {
      return [];
    }

    const buttons = this._toolbarService.getButtons();
    return Object.keys(buttons).filter(buttonId => {
      const button = buttons[buttonId];
      // Filter out section buttons and other non-tool buttons
      return button?.uiType === 'ohif.toolButton' && !button?.props?.buttonSection;
    });
  }

  /**
   * Get favorite tools that are currently available in the toolbar
   */
  public getAvailableFavoriteTools(modality?: string): string[] {
    const favorites = this.getFavoriteTools(modality);
    const availableTools = this.getAvailableTools();
    return favorites.filter(toolId => availableTools.includes(toolId));
  }

  /**
   * Force refresh of toolbar styling (useful for external updates)
   */
  public refreshToolbarStyling(): void {
    this._updateToolbarStyling();
  }

  /**
   * Reset all favorites to default for a modality
   */
  public resetToDefaults(modality?: string): void {
    const targetModality = modality || this._currentModality;

    // Define default favorites per modality
    const defaults = {
      'DEFAULT': ['Zoom', 'Pan', 'Length', 'WindowLevel'],
      'CT': ['Zoom', 'Pan', 'WindowLevel', 'EllipticalROI', 'ReferenceLines'],
      'MR': ['Zoom', 'Pan', 'WindowLevel', 'EllipticalROI', 'StackScroll'],
      'DX': ['Zoom', 'Pan', 'Length', 'Angle', 'invert'],
      'CR': ['Zoom', 'Pan', 'Length', 'Angle', 'invert'],
      'US': ['Zoom', 'Pan', 'UltrasoundDirectionalTool', 'Cine'],
      'MG': ['Zoom', 'Pan', 'Length', 'Angle', 'Magnify'],
      'PT': ['Zoom', 'Pan', 'WindowLevel', 'EllipticalROI', 'Probe'],
    };

    const defaultFavorites = defaults[targetModality] || defaults['DEFAULT'];
    this.setFavoriteTools(defaultFavorites, targetModality);
  }

  /**
   * Cleanup method for mode exit
   */
  public destroy(): void {
    // Reset any modified button evaluate functions
    if (this._toolbarService) {
      const allButtons = this._toolbarService.getButtons();
      Object.values(allButtons).forEach((button: any) => {
        if (button?.props?._originalEvaluate) {
          button.props.evaluate = button.props._originalEvaluate;
          delete button.props._originalEvaluate;
        }
      });
    }

    // Clear subscriptions
    this.unsubscriptions.forEach(unsub => unsub());
    this.unsubscriptions = [];
  }
}
