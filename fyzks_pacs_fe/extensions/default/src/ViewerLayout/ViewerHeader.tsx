import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Header, Icons, useModal } from '@ohif/ui-next';
import { useSystem } from '@ohif/core';
import { Toolbar } from '../Toolbar/Toolbar';
import HeaderPatientInfo from './HeaderPatientInfo';
import { PatientInfoVisibility } from './HeaderPatientInfo/HeaderPatientInfo';
import { preserveQueryParameters } from '../../../../platform/app/src/utils/preserveQueryParameters';
import { Types } from '@ohif/core';
import FavoritesSettingsModal from '../../../../platform/ui/src/components/FavoriteTools/FavoriteSettingsModal';

function ViewerHeader({ appConfig }: withAppTypes<{ appConfig: AppTypes.Config }>) {
  const { servicesManager, extensionManager, commandsManager } = useSystem();
  const { customizationService, favoritesService } = servicesManager.services;
  const navigate = useNavigate();
  const location = useLocation();

  const onClickReturnButton = () => {
    const { pathname } = location;
    const dataSourceIdx = pathname.indexOf('/', 1);

    const dataSourceName = pathname.substring(dataSourceIdx + 1);
    const existingDataSource = extensionManager.getDataSources(dataSourceName);

    const searchQuery = new URLSearchParams();
    if (dataSourceIdx !== -1 && existingDataSource) {
      searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
    }
    preserveQueryParameters(searchQuery);

    navigate({
      pathname: '/',
      search: decodeURIComponent(searchQuery.toString()),
    });
  };

  const { t } = useTranslation();
  const { show, hide } = useModal();

  const AboutModal = customizationService.getCustomization(
    'ohif.aboutModal'
  ) as Types.MenuComponentCustomization;

  const UserPreferencesModal = customizationService.getCustomization(
    'ohif.userPreferencesModal'
  ) as Types.MenuComponentCustomization;

  // Favorites modal handler
  const handleOpenFavoritesSettings = () => {
    const currentModalityFavorites = favoritesService.getAllModalityFavorites();

    show({
      content: FavoritesSettingsModal,
      title: t('FavoritesModal:Modality-Specific Favorite Tools'),
      containerClassName: 'max-w-6xl',
      contentProps: {
        currentFavorites: currentModalityFavorites,
        maxFavorites: 8,
        onSave: (modalityFavorites: ModalityFavorites) => {
          favoritesService.setModalityFavorites(modalityFavorites);
          hide();
          // Optional: Show success notification
          console.log('Modality favorites updated:', modalityFavorites);
        },
        onCancel: () => {
          hide();
        },
      },
    });
  };

  const menuOptions = [
    {
      title: AboutModal?.menuTitle ?? t('Header:About'),
      icon: 'info',
      onClick: () =>
        show({
          content: AboutModal,
          title: AboutModal?.title ?? t('AboutModal:About OHIF Viewer'),
          containerClassName: AboutModal?.containerClassName ?? 'max-w-md',
        }),
    },
    {
      title: UserPreferencesModal.menuTitle ?? t('Header:Preferences'),
      icon: 'settings',
      onClick: () =>
        show({
          content: UserPreferencesModal,
          title: UserPreferencesModal.title ?? t('UserPreferencesModal:User preferences'),
          containerClassName:
            UserPreferencesModal?.containerClassName ?? 'flex max-w-4xl p-6 flex-col',
        }),
    },
    // NEW: Add Favorites Settings
    {
      title: t('Header:Favorite Tools'),
      icon: 'star',
      onClick: handleOpenFavoritesSettings,
    },
  ];

  if (appConfig.oidc) {
    menuOptions.push({
      title: t('Header:Logout'),
      icon: 'power-off',
      onClick: async () => {
        navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
      },
    });
  }

  return (
    <Header
      menuOptions={menuOptions}
      isReturnEnabled={!!appConfig.showStudyList}
      onClickReturnButton={onClickReturnButton}
      WhiteLabeling={appConfig.whiteLabeling}
      Secondary={<Toolbar buttonSection="secondary" />}
      PatientInfo={
        appConfig.showPatientInfo !== PatientInfoVisibility.DISABLED && (
          <HeaderPatientInfo
            servicesManager={servicesManager}
            appConfig={appConfig}
          />
        )
      }
      UndoRedo={
        <div className="text-primary flex cursor-pointer items-center">
          <Button
            variant="ghost"
            className="hover:bg-primary-dark"
            onClick={() => {
              commandsManager.run('undo');
            }}
          >
            <Icons.Undo className="" />
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-primary-dark"
            onClick={() => {
              commandsManager.run('redo');
            }}
          >
            <Icons.Redo className="" />
          </Button>
        </div>
      }
    >
      <div className="relative flex justify-center gap-[4px]">
        <Toolbar buttonSection="primary" />
      </div>
    </Header>
  );
}

export default ViewerHeader;
