"use client";

import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export default function NativeMobileUtils() {
  useEffect(() => {
    // On vérifie qu'on est bien sur un appareil natif (iOS ou Android)
    if (Capacitor.isNativePlatform()) {
      
      const setupStatusBar = async () => {
        // Définit le style des icônes (Heure, Batterie)
        // Style.Light = icônes blanches (pour fond sombre)
        // Style.Dark = icônes noires (pour fond clair)
        await StatusBar.setStyle({ style: Style.Dark });

        // Sur Android uniquement, on peut changer la couleur de fond
        // Ici, on utilise le bleu pharma de ton thème (#0b47a1 ou équivalent HSL)
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#f8fafc' }); // --background hsl
        }
      };

      setupStatusBar();
    }
  }, []);

  return null; // Ce composant ne rend rien visuellement
}