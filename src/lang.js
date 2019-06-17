import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      time: {
        never: 'never',
        recently: 'just now',
        minute: '{time} minute ago',
        minutes: '{time} minutes ago',
        hour: '{time} hour ago',
        hours: '{time} hours ago',
        day: '{time} day ago',
        days: '{time} days ago'
      }
    }
  }
})