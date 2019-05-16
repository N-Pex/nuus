import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  iconfont: 'md',
  options: {
    customProperties: true
  },
  theme: {
    primary: '#000000',
    secondary: '#9b9b9b',
    accent: '#1b9739',
    cardBackground: '#f2f2f2'
  }
})
