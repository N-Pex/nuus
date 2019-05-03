<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import UrlInput from './components/UrlInput'
import ItemList from './components/ItemList'
import axios from "axios";
import sanitizeHTML from 'sanitize-html';
import db from './database';

//import xml2js from "xml2js";

// Make sure Array.isArray is defined
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

export default {
  name: 'App',
  components: {
    UrlInput,
    ItemList
  },
  data () {
    return {
      url: "Please enter a URL",
      items: [],
      drawer: null,
      menuItems: [
        /*
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
        */
      ]
      //
    }
  }
}
</script>
