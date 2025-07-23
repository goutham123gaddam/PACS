import { useState, useEffect } from 'react';
import { useSystem } from '../contextProviders/SystemProvider';

interface ModalityFavorites {
  [modality: string]: string[];
}

export function useFavorites() {
  const { servicesManager } = useSystem();
  const { favoritesService } = servicesManager.services;

  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const [currentModality, setCurrentModality] = useState<string>('DEFAULT');
  const [allModalityFavorites, setAllModalityFavorites] = useState<ModalityFavorites>({});

  useEffect(() => {
    const updateFavorites = (data: any) => {
      setFavoriteTools(data.favorites || []);
      setCurrentModality(data.modality || 'DEFAULT');
      setAllModalityFavorites(data.allModalityFavorites || {});
    };

    const updateModality = (data: any) => {
      setCurrentModality(data.modality);
      setFavoriteTools(data.favorites || []);
    };

    // Initialize
    setFavoriteTools(favoritesService.getFavoriteTools());
    setCurrentModality(favoritesService.getCurrentModality());
    setAllModalityFavorites(favoritesService.getAllModalityFavorites());

    // Subscribe to changes
    const subscriptions = [
      favoritesService.subscribe(
        favoritesService.events.FAVORITES_UPDATED,
        updateFavorites
      ),
      favoritesService.subscribe(
        favoritesService.events.MODALITY_CHANGED,
        updateModality
      ),
    ];

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [favoritesService]);

  return {
    favoriteTools,
    currentModality,
    allModalityFavorites,
    addToFavorites: (toolId: string, modality?: string) =>
      favoritesService.addToFavorites(toolId, modality),
    removeFromFavorites: (toolId: string, modality?: string) =>
      favoritesService.removeFromFavorites(toolId, modality),
    setFavoriteTools: (toolIds: string[], modality?: string) =>
      favoritesService.setFavoriteTools(toolIds, modality),
    setModalityFavorites: (modalityFavorites: ModalityFavorites) =>
      favoritesService.setModalityFavorites(modalityFavorites),
    isFavorite: (toolId: string, modality?: string) =>
      favoritesService.isFavorite(toolId, modality),
    clearFavorites: (modality?: string) =>
      favoritesService.clearFavorites(modality),
  };
}
