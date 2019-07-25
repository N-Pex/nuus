import '@babel/polyfill'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import './plugins/axios'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import i18n from './lang'

Vue.config.productionTip = false

// Make sure Array.isArray is defined
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

router.beforeEach((to, from, next) => {
  console.log("Before router redir " + store.state.onboarded);
  if (to.path.startsWith("/onboarding") || store.state.onboarded) {
    next();
  } else {
    // Not onboarded, redirect!
    console.log("Redirect to onboarding");
    next({
      path: '/onboarding',
      params: { nextUrl: to.fullPath }
    })
  }
})

Vue.instance = new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  vuetify,
  data() {
    return {
      mediaPlayer: null,
      audioPlayer: null,
      mediaPlayerDocked: false,
      mediaPlayerInvisible: false
    }
  },
  computed: {
    onboarded: {
      get: function () {
        return this.$store.state.onboarded;
      },
      set: function (val) {
        this.$store.commit("onboarded", val);
      }
    },
    showMedia: {
      get: function () {
        return this.$store.state.showMedia;
      },
      set: function (val) {
        this.$store.commit("showMedia", val);
      }
    } 
  }
}).$mount('#app')

