import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import IconPlay from '../icons/IconPlay.vue'

Vue.use(Vuetify, {
  iconfont: 'md',
  options: {
    customProperties: true
  },
  theme: {
    primary: '#232323',
    secondary: '#949494',
    accent: '#1b9739',
    cardBackground: '#ffffff'
  },
  icons: {
    play: {
      component: IconPlay
    }
  }
})
