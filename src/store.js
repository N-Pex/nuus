import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'settings',
  storage: localStorage
})

export default new Vuex.Store({
  state: {
    onboarded: false,
    showMedia: false,
    themeBodyFont: "Open Sans",
    themeBodySize: 14,
    textSizeAdjustment: 0
  },
  mutations: {
    onboarded (state, onboarded) {
      state.onboarded = onboarded;
    },
    showMedia (state, value) {
      state.showMedia = value;
    },
    setThemeBodyFont(state, font) {
      state.themeBodyFont = font;
    },
    setThemeBodySize(state, size) {
      state.themeBodySize = size;
    },
    setTextSizeAdjustment(state, adjustment) {
      state.textSizeAdjustment = adjustment;
    }
 },
  plugins: [vuexPersist.plugin]
})
