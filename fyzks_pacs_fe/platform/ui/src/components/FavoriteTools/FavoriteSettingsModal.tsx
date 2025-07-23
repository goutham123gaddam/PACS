import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icons, Input } from '@ohif/ui-next';
import { useSystem } from '@ohif/core';
import { Select } from 'antd';

interface ToolItem {
  id: string;
  label: string;
  icon: string;
  tooltip?: string;
  category?: string;
  supportedModalities?: string[]; // New: which modalities support this tool
}

interface ModalityFavorites {
  [modality: string]: string[];
}

interface FavoritesSettingsModalProps {
  onSave: (modalityFavorites: ModalityFavorites) => void;
  onCancel: () => void;
  currentFavorites?: ModalityFavorites;
  maxFavorites?: number;
}

const FavoritesSettingsModal: React.FC<FavoritesSettingsModalProps> = ({
  onSave,
  onCancel,
  currentFavorites = {},
  maxFavorites = 8,
}) => {
  const { t } = useTranslation();
  const { servicesManager } = useSystem();
  const { toolbarService } = servicesManager.services;

  // Available modalities
  const availableModalities = [
    { value: 'DEFAULT', label: 'Default (All)', description: 'Fallback for unknown modalities' },
    { value: 'CT', label: 'CT', description: 'Computed Tomography' },
    { value: 'MR', label: 'MRI', description: 'Magnetic Resonance Imaging' },
    { value: 'DX', label: 'DX', description: 'Digital Radiography' },
    { value: 'CR', label: 'CR', description: 'Computed Radiography' },
    { value: 'US', label: 'Ultrasound', description: 'Ultrasound' },
    { value: 'PT', label: 'PET', description: 'Positron Emission Tomography' },
    { value: 'NM', label: 'Nuclear Medicine', description: 'Nuclear Medicine' },
    { value: 'MG', label: 'Mammography', description: 'Mammography' },
    { value: 'XA', label: 'X-Ray Angiography', description: 'X-Ray Angiography' },
    { value: 'RF', label: 'Radiofluoroscopy', description: 'Radiofluoroscopy' },
  ];

  const [selectedModality, setSelectedModality] = useState<string>('DEFAULT');
  const [modalityFavorites, setModalityFavorites] = useState<ModalityFavorites>(currentFavorites);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTools, setAvailableTools] = useState<ToolItem[]>([]);

  // Get current modality's selected tools
  const currentModalityTools = modalityFavorites[selectedModality] || [];

  // Enhanced tool discovery with modality support
  useEffect(() => {
    const getAllTools = () => {
      const tools: ToolItem[] = [];

      // Method 1: Get all registered buttons from toolbar service
      try {
        const allButtons = toolbarService.state?.buttons || {};
        Object.values(allButtons).forEach((button: any) => {
          if (button && button.props) {
            const { id, props } = button;

            if (props.icon &&
                id &&
                !props.buttonSection &&
                button.uiType !== 'ohif.toolButtonList') {

              tools.push({
                id,
                label: props.label || id,
                icon: props.icon,
                tooltip: props.tooltip || props.label,
                category: getToolCategory(id),
                supportedModalities: getSupportedModalities(id)
              });
            }
          }
        });
      } catch (error) {
        console.error('Error getting tools from toolbar service:', error);
      }

      // Method 2: Fallback - Add known tools with modality support
      if (tools.length === 0) {
        const knownTools = [
          // Navigation tools - universal
          { id: 'Zoom', label: 'Zoom', icon: 'tool-zoom', category: 'Navigation', supportedModalities: ['ALL'] },
          { id: 'Pan', label: 'Pan', icon: 'tool-move', category: 'Navigation', supportedModalities: ['ALL'] },
          { id: 'WindowLevel', label: 'Window Level', icon: 'tool-window-level', category: 'Navigation', supportedModalities: ['CT', 'MR', 'DX', 'CR', 'PT', 'DEFAULT'] },
          { id: 'StackScroll', label: 'Stack Scroll', icon: 'tool-stack-scroll', category: 'Navigation', supportedModalities: ['CT', 'MR', 'PT', 'DEFAULT'] },

          // Measurement tools - most modalities
          { id: 'Length', label: 'Length', icon: 'tool-length', category: 'Measurement', supportedModalities: ['ALL'] },
          { id: 'Bidirectional', label: 'Bidirectional', icon: 'tool-bidirectional', category: 'Measurement', supportedModalities: ['CT', 'MR', 'DX', 'CR', 'DEFAULT'] },
          { id: 'EllipticalROI', label: 'Ellipse', icon: 'tool-ellipse', category: 'Measurement', supportedModalities: ['CT', 'MR', 'PT', 'NM', 'DEFAULT'] },
          { id: 'RectangleROI', label: 'Rectangle', icon: 'tool-rectangle', category: 'Measurement', supportedModalities: ['ALL'] },
          { id: 'CircleROI', label: 'Circle', icon: 'tool-circle', category: 'Measurement', supportedModalities: ['ALL'] },
          { id: 'ArrowAnnotate', label: 'Annotation', icon: 'tool-annotate', category: 'Measurement', supportedModalities: ['ALL'] },
          { id: 'Angle', label: 'Angle', icon: 'tool-angle', category: 'Measurement', supportedModalities: ['DX', 'CR', 'MG', 'DEFAULT'] },
          { id: 'CobbAngle', label: 'Cobb Angle', icon: 'icon-tool-cobb-angle', category: 'Measurement', supportedModalities: ['DX', 'CR', 'DEFAULT'] },

          // CT/MR specific tools
          { id: 'PlanarFreehandROI', label: 'Freehand ROI', icon: 'icon-tool-freehand-roi', category: 'Measurement', supportedModalities: ['CT', 'MR', 'PT', 'DEFAULT'] },
          { id: 'SplineROI', label: 'Spline ROI', icon: 'icon-tool-spline-roi', category: 'Measurement', supportedModalities: ['CT', 'MR', 'DEFAULT'] },

          // Ultrasound specific
          { id: 'UltrasoundDirectionalTool', label: 'US Directional', icon: 'icon-tool-ultrasound-bidirectional', category: 'Measurement', supportedModalities: ['US'] },

          // Actions - universal
          { id: 'Reset', label: 'Reset View', icon: 'tool-reset', category: 'Actions', supportedModalities: ['ALL'] },
          { id: 'rotate-right', label: 'Rotate Right', icon: 'tool-rotate-right', category: 'Actions', supportedModalities: ['DX', 'CR', 'MG', 'DEFAULT'] },
          { id: 'flipHorizontal', label: 'Flip Horizontal', icon: 'tool-flip-horizontal', category: 'Actions', supportedModalities: ['DX', 'CR', 'MG', 'DEFAULT'] },
          { id: 'invert', label: 'Invert', icon: 'tool-invert', category: 'Actions', supportedModalities: ['DX', 'CR', 'MG', 'DEFAULT'] },
          { id: 'Cine', label: 'Cine', icon: 'tool-cine', category: 'Actions', supportedModalities: ['CT', 'MR', 'XA', 'RF', 'US', 'DEFAULT'] },
          { id: 'Capture', label: 'Capture', icon: 'tool-capture', category: 'Actions', supportedModalities: ['ALL'] },

          // More tools
          { id: 'Magnify', label: 'Magnify', icon: 'tool-magnify', category: 'More Tools', supportedModalities: ['ALL'] },
          { id: 'Probe', label: 'Probe', icon: 'tool-probe', category: 'More Tools', supportedModalities: ['CT', 'MR', 'PT', 'NM', 'DEFAULT'] },
          { id: 'ReferenceLines', label: 'Reference Lines', icon: 'tool-referenceLines', category: 'More Tools', supportedModalities: ['CT', 'MR', 'DEFAULT'] },
          { id: 'ImageOverlayViewer', label: 'Image Overlay', icon: 'toggle-dicom-overlay', category: 'More Tools', supportedModalities: ['ALL'] },
          { id: 'CalibrationLine', label: 'Calibration', icon: 'tool-calibration', category: 'More Tools', supportedModalities: ['DX', 'CR', 'MG', 'US', 'DEFAULT'] },
          { id: 'TagBrowser', label: 'DICOM Tags', icon: 'dicom-tag-browser', category: 'More Tools', supportedModalities: ['ALL'] },
        ];

        tools.push(...knownTools);
      }

      // Filter tools based on selected modality
      const modalityFilteredTools = tools.filter(tool => {
        if (!tool.supportedModalities) return true;
        if (tool.supportedModalities.includes('ALL')) return true;
        if (selectedModality === 'DEFAULT') return true;
        return tool.supportedModalities.includes(selectedModality);
      });

      // Remove duplicates and filter invalid tools
      const uniqueTools = modalityFilteredTools
        .filter((tool, index, self) =>
          index === self.findIndex(t => t.id === tool.id) &&
          tool.icon &&
          tool.label
        )
        .sort((a, b) => a.label.localeCompare(b.label));

      setAvailableTools(uniqueTools);
    };

    getAllTools();
  }, [toolbarService, selectedModality]);

  // Helper function to get supported modalities for a tool
  const getSupportedModalities = (toolId: string): string[] => {
    // Define which tools work with which modalities
    const modalitySupport: Record<string, string[]> = {
      'WindowLevel': ['CT', 'MR', 'DX', 'CR', 'PT', 'DEFAULT'],
      'StackScroll': ['CT', 'MR', 'PT', 'DEFAULT'],
      'Angle': ['DX', 'CR', 'MG', 'DEFAULT'],
      'CobbAngle': ['DX', 'CR', 'DEFAULT'],
      'UltrasoundDirectionalTool': ['US'],
      'PlanarFreehandROI': ['CT', 'MR', 'PT', 'DEFAULT'],
      'SplineROI': ['CT', 'MR', 'DEFAULT'],
      'rotate-right': ['DX', 'CR', 'MG', 'DEFAULT'],
      'flipHorizontal': ['DX', 'CR', 'MG', 'DEFAULT'],
      'invert': ['DX', 'CR', 'MG', 'DEFAULT'],
      'Cine': ['CT', 'MR', 'XA', 'RF', 'US', 'DEFAULT'],
      'Probe': ['CT', 'MR', 'PT', 'NM', 'DEFAULT'],
      'ReferenceLines': ['CT', 'MR', 'DEFAULT'],
      'CalibrationLine': ['DX', 'CR', 'MG', 'US', 'DEFAULT'],
    };

    return modalitySupport[toolId] || ['ALL'];
  };

  // Helper function to categorize tools
  const getToolCategory = (toolId: string): string => {
    if (['Zoom', 'Pan', 'WindowLevel', 'StackScroll'].includes(toolId)) {
      return 'Navigation';
    }
    if (['Length', 'Bidirectional', 'EllipticalROI', 'RectangleROI', 'CircleROI', 'Angle', 'CobbAngle', 'ArrowAnnotate', 'PlanarFreehandROI', 'SplineROI', 'UltrasoundDirectionalTool'].includes(toolId)) {
      return 'Measurement';
    }
    if (['Reset', 'rotate-right', 'flipHorizontal', 'invert', 'Cine', 'Capture', 'AutoZoom'].includes(toolId)) {
      return 'Actions';
    }
    if (['Magnify', 'Probe', 'ReferenceLines', 'ImageOverlayViewer', 'CalibrationLine', 'TagBrowser', 'AdvancedMagnify'].includes(toolId)) {
      return 'More Tools';
    }
    return 'Other';
  };

  // Filter tools based on search term
  const filteredTools = availableTools.filter(tool =>
    tool.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group tools by category
  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    const category = tool.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, ToolItem[]>);

  const handleModalityChange = (modality: string) => {
    setSelectedModality(modality);
    setSearchTerm(''); // Clear search when switching modalities
  };

  const handleToolToggle = (toolId: string) => {
    setModalityFavorites(prev => {
      const currentTools = prev[selectedModality] || [];
      let newTools: string[];

      if (currentTools.includes(toolId)) {
        newTools = currentTools.filter(id => id !== toolId);
      } else {
        if (currentTools.length >= maxFavorites) {
          return prev; // Max reached
        }
        newTools = [...currentTools, toolId];
      }

      return {
        ...prev,
        [selectedModality]: newTools
      };
    });
  };

  const handleSave = () => {
    onSave(modalityFavorites);
  };

  const handleSelectAll = (category: string) => {
    const categoryTools = toolsByCategory[category] || [];
    const categoryToolIds = categoryTools.map(tool => tool.id);

    setModalityFavorites(prev => {
      const currentTools = prev[selectedModality] || [];
      const newSelected = [...currentTools];

      categoryToolIds.forEach(toolId => {
        if (!newSelected.includes(toolId) && newSelected.length < maxFavorites) {
          newSelected.push(toolId);
        }
      });

      return {
        ...prev,
        [selectedModality]: newSelected
      };
    });
  };

  const handleDeselectAll = (category: string) => {
    const categoryTools = toolsByCategory[category] || [];
    const categoryToolIds = categoryTools.map(tool => tool.id);

    setModalityFavorites(prev => {
      const currentTools = prev[selectedModality] || [];
      const filteredTools = currentTools.filter(toolId => !categoryToolIds.includes(toolId));

      return {
        ...prev,
        [selectedModality]: filteredTools
      };
    });
  };

  const handleCopyFromModality = (sourceModality: string) => {
    const sourceTools = modalityFavorites[sourceModality] || [];
    setModalityFavorites(prev => ({
      ...prev,
      [selectedModality]: [...sourceTools]
    }));
  };

  const handleClearModality = () => {
    setModalityFavorites(prev => ({
      ...prev,
      [selectedModality]: []
    }));
  };

  // Get total favorites count across all modalities
  const totalFavoritesCount = Object.values(modalityFavorites).reduce(
    (total, tools) => total + tools.length, 0
  );

  return (
    <div className="favorites-settings-modal p-6 max-w-5xl min-h-96">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Modality-Specific Favorite Tools
        </h2>
        <p className="text-gray-400 text-sm">
          Configure different favorite tools for each imaging modality
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Total favorites: {totalFavoritesCount} across {Object.keys(modalityFavorites).length} modalities
        </p>
      </div>

      {/* Modality Selector */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-4 mb-3">
          <label className="text-white font-medium">Current Modality:</label>
          <Select
            value={selectedModality}
            onChange={handleModalityChange}
            options={availableModalities.map(mod => ({
              value: mod.value,
              label: `${mod.label} - ${mod.description}`
            }))}
            className="min-w-64"
            dropdownStyle={{ zIndex: 9999 }}  // Add this
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">
            {currentModalityTools.length} / {maxFavorites} favorites for {selectedModality}
          </span>

          {/* Quick Actions */}
          <div className="flex gap-2 ml-auto">
            {/* {Object.keys(modalityFavorites).length > 0 && (
              <Select
                placeholder="Copy from..."
                onChange={(value) => handleCopyFromModality(value)}
                options={Object.keys(modalityFavorites)
                  .filter(mod => mod !== selectedModality)
                  .map(mod => ({
                    value: mod,
                    label: `Copy from ${mod} (${modalityFavorites[mod].length} tools)`
                  }))}
                className="text-xs"
              />
            )} */}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearModality}
              disabled={currentModalityTools.length === 0}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder={`Search tools for ${selectedModality}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Selected Tools Preview for Current Modality */}
      {currentModalityTools.length > 0 && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">
            Selected Favorites for {selectedModality}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentModalityTools.map(toolId => {
              const tool = availableTools.find(t => t.id === toolId);
              if (!tool) return (
                <div key={toolId} className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs">
                  <span>{toolId} (not available for {selectedModality})</span>
                </div>
              );

              return (
                <div
                  key={toolId}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
                >
                  <span>⭐</span>
                  <span>{tool.label}</span>
                  <button
                    onClick={() => handleToolToggle(toolId)}
                    className="hover:bg-blue-700 rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show message if no tools found */}
      {availableTools.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No tools available for {selectedModality}</p>
          <p className="text-gray-500 text-sm">
            This might be because no tools support this modality, or the toolbar service hasn't finished loading.
          </p>
        </div>
      )}

      {/* Tools List by Category */}
      {availableTools.length > 0 && (
        <div className="max-h-96 overflow-y-auto space-y-4">
          {Object.entries(toolsByCategory).map(([category, tools]) => (
            <div key={category} className="border border-gray-700 rounded-lg">
              {/* Category Header */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-t-lg">
                <h3 className="font-medium text-white">
                  {category} ({tools.length}) - {selectedModality}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAll(category)}
                    className="text-xs"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeselectAll(category)}
                    className="text-xs"
                  >
                    Deselect All
                  </Button>
                </div>
              </div>

              {/* Category Tools */}
              <div className="p-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tools.map(tool => {
                    const isSelected = currentModalityTools.includes(tool.id);
                    const isMaxReached = currentModalityTools.length >= maxFavorites && !isSelected;

                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleToolToggle(tool.id)}
                        disabled={isMaxReached}
                        title={`${tool.tooltip || tool.label}\nSupported: ${tool.supportedModalities?.join(', ') || 'All'}`}
                        className={`
                          flex flex-col items-center p-3 rounded-lg border transition-all relative
                          ${isSelected
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          }
                          ${isMaxReached ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {/* Tool Icon Placeholder */}
                        <div className="flex items-center justify-center w-8 h-8 mb-2 bg-gray-600 rounded">
                          <span className="text-xs">{tool.icon.slice(0, 2).toUpperCase()}</span>
                        </div>

                        {/* Star indicator */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 text-yellow-400 text-xs">
                            ⭐
                          </div>
                        )}

                        <span className="text-xs text-center leading-tight">
                          {tool.label}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {tool.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          {currentModalityTools.length === maxFavorites && (
            <span className="text-yellow-400">
              Maximum favorites reached for {selectedModality} ({maxFavorites})
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={totalFavoritesCount === 0}
          >
            Save All Modalities ({totalFavoritesCount})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesSettingsModal;
