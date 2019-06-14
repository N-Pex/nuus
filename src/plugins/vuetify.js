import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

var icons = {};

// Load ALL icons as components and add to the icons array, that is registered below.
const ComponentContext = require.context('../icons/', true, /\.vue$/i);
ComponentContext.keys().forEach((componentFilePath) => {
    let comp = ComponentContext(componentFilePath).default;
    icons[comp.name] = { component: comp };
});

Vue.use(Vuetify, {
  iconfont: 'md',
  options: {
    customProperties: true
  },
  theme: {
    primary: '#232323',
    secondary: '#949494',
    accent: '#1b9739',
    cardBackground: '#ffffff',
    audioCardBackground: '#fafafa'
  },
  icons: icons
})
