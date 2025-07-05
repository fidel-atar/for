import { registerRootComponent } from 'expo';
import { checkConnection } from './src/services';

import App from './src/navigation/App.js';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

checkConnection();
