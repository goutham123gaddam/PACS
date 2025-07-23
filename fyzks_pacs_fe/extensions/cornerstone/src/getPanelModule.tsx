import React from 'react';

import { Toolbox } from '@ohif/extension-default';
import PanelSegmentation from './panels/PanelSegmentation';
import ActiveViewportWindowLevel from './components/ActiveViewportWindowLevel';
import PanelMeasurement from './panels/PanelMeasurement';
import MIPThicknessInput from './components/MIPsThicknessInput/MIPThicknessPanel';
import MIPThicknessPanel from './components/MIPsThicknessInput/MIPThicknessPanel';

const getPanelModule = ({ commandsManager, servicesManager, extensionManager }: withAppTypes) => {
  const wrappedPanelSegmentation = ({ configuration }) => {
    return (
      <PanelSegmentation
        commandsManager={commandsManager}
        servicesManager={servicesManager}
        extensionManager={extensionManager}
        configuration={{
          ...configuration,
        }}
      />
    );
  };

  const wrappedPanelSegmentationNoHeader = ({ configuration }) => {
    return (
      <PanelSegmentation
        commandsManager={commandsManager}
        servicesManager={servicesManager}
        extensionManager={extensionManager}
        configuration={{
          ...configuration,
        }}
      />
    );
  };

  const wrappedPanelSegmentationWithTools = ({ configuration }) => {
    const { toolbarService } = servicesManager.services;

    return (
      <>
        <Toolbox
          buttonSectionId={toolbarService.sections.segmentationToolbox}
          title="Segmentation Tools"
        />
        <PanelSegmentation
          commandsManager={commandsManager}
          servicesManager={servicesManager}
          extensionManager={extensionManager}
          configuration={{
            ...configuration,
          }}
        />
      </>
    );
  };

  const mipThicknessPanel = {
    name: 'mip-thickness',
    iconName: 'tool-stack-scroll',
    iconLabel: 'MIP Thickness',
    label: 'MIP Thickness',
    component: (props) => (
      <MIPThicknessPanel
        servicesManager={servicesManager}
        commandsManager={commandsManager}
        {...props}
      />
    ),
  }

  return [
    {
      name: 'activeViewportWindowLevel',
      component: () => {
        return <ActiveViewportWindowLevel servicesManager={servicesManager} />;
      },
    },
    {
      name: 'panelMeasurement',
      iconName: 'tab-linear',
      iconLabel: 'Measure',
      label: 'Measurement',
      component: PanelMeasurement,
    },
    {
      name: 'panelSegmentation',
      iconName: 'tab-segmentation',
      iconLabel: 'Segmentation',
      label: 'Segmentation',
      component: wrappedPanelSegmentation,
    },
    {
      name: 'panelSegmentationNoHeader',
      iconName: 'tab-segmentation',
      iconLabel: 'Segmentation',
      label: 'Segmentation',
      component: wrappedPanelSegmentationNoHeader,
    },
    {
      name: 'panelSegmentationWithTools',
      iconName: 'tab-segmentation',
      iconLabel: 'Segmentation',
      label: 'Segmentation',
      component: wrappedPanelSegmentationWithTools,
    },
    mipThicknessPanel,
  ];
};

export default getPanelModule;
