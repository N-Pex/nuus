import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import IconPlay from '../icons/IconPlay.vue'
import IconPause from '../icons/IconPause.vue'
import IconClose from '../icons/IconClose.vue'
import IconTypeText from '../icons/IconTypeText.vue'
import IconTypeAudio from '../icons/IconTypeAudio.vue'
import IconTypeVideo from '../icons/IconTypeVideo.vue'
import IconExpand from '../icons/IconExpand.vue'

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
    },
    pause: {
      component: IconPause
    },
    close: {
      component: IconClose
    },
    typeText: {
      component: IconTypeText
    },
    typeAudio: {
      component: IconTypeAudio
    },
    typeVideo: {
      component: IconTypeVideo
    },
    expand: {
      component: IconExpand
    }
  }
})
