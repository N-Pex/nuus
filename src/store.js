import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'settings',
  storage: localStorage,
  reducer: state => ({
    onboarded: state.onboarded,
    showMedia: state.showMedia,
    flavor: state.flavor,
    textSizeAdjustment: state.textSizeAdjustment
  })
})

export default new Vuex.Store({
  state: {
    onboarded: false,
    showMedia: false,
    flavor: "english",
    textSizeAdjustment: 0,
    currentFeedTitle: "",
    currentFeedItems: []
  },
  mutations: {
    onboarded (state, onboarded) {
      state.onboarded = onboarded;
    },
    showMedia (state, value) {
      state.showMedia = value;
    },
    setFlavor(state, flavor) {
      state.flavor = flavor;
    },
    setTextSizeAdjustment(state, adjustment) {
      state.textSizeAdjustment = adjustment;
    },
    setCurrentFeedTitle(state, title) {
      state.currentFeedTitle = title;
    },
    setCurrentFeedItems(state, items) {
      state.currentFeedItems = items;
    }
 },
  plugins: [vuexPersist.plugin]
})
