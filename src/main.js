import '@babel/polyfill'
import Vue from 'vue'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

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
  render: h => h(App),
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

