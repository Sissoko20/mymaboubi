import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mymaboubi.app',
  appName: 'mymaboubi',
  webDir: 'out', // Remplace 'public' par 'out'
  server: {
    // Sur iOS, cela aide à maintenir une origine stable pour IndexedDB
    hostname: 'mymaboubi.app',
    androidScheme: 'https'
  }
};

export default config;