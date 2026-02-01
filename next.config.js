/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.mymaboubi.app',
  appName: 'mymaboubi',
  webDir: 'out',
  output: 'export',
  
  // Désactive l'injection de scripts superflus pour gagner en performance
  bundledWebRuntime: false,

  server: {
    // Optimisation pour les appels API et la sécurité CORS
    androidScheme: 'https',
    iosScheme: 'mymaboubi-app',
    cleartext: true
  },

  plugins: {
    // Configuration de l'écran de démarrage
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    // Gestion intelligente du clavier mobile
    Keyboard: {
      resize: 'body',
      style: 'dark',
      keepContentsVisible: true,
    }
  },

  // Paramètres Android avancés
  android: {
    buildOptions: {
      releaseType: 'bundle',
    },
    overScrollMode: 'never'
  }
};

export default config;