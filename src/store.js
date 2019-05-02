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
    showMedia: false
  },
  mutations: {
    onboarded (state, onboarded) {
      state.onboarded = onboarded;
    },
    showMedia (state, value) {
      state.showMedia = value;
    }
  },
  plugins: [vuexPersist.plugin]
})
