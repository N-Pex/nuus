import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './translations/en.json';
import ug from './translations/ug.json';

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'ug',
  fallbackLocale: 'en',
  messages: {
    en: en,
    ug: ug
  }
})