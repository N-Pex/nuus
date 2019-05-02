<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"><v-icon>menu</v-icon></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>NUUS</span>
        <span class="font-weight-light"> RSS READER</span>
      </v-toolbar-title>

    </v-toolbar>

<v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      style="position:fixed; top:0; left:0; overflow-y:scroll;"
      >
        <v-list class="pa-1">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="img/icons/apple-touch-icon-60x60.png">
            </v-list-tile-avatar>
  
            <v-list-tile-content>
              <v-list-tile-title>NUUS</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
  
        <v-list class="pt-0" dense>
          <v-divider></v-divider>
  
          <v-list-tile
            v-for="item in menuItems"
            :key="item.title"
            @click=""
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
  
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="">
              <v-list-tile-action>
                <v-checkbox v-model="$root.showMedia"></v-checkbox>
              </v-list-tile-action>
  
              <v-list-tile-content @click="$root.showMedia = !$root.showMedia">
                <v-list-tile-title>Show media</v-list-tile-title>
                <v-list-tile-sub-title>Show images, video and audio</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

        </v-list>
      </v-navigation-drawer>

    <v-content>
      <UrlInput v-on:update:url="urlUpdated($event)" v-bind:url="url"/>
      <ItemList v-bind:items="items"/>
    </v-content>
  </v-app>
</template>

<script>
import UrlInput from '../components/UrlInput'
import ItemList from '../components/ItemList'
import axios from "axios";
import sanitizeHTML from 'sanitize-html';
import db from '../database';

//import xml2js from "xml2js";

// Make sure Array.isArray is defined
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

export default {
  name: 'Home',
  components: {
    UrlInput,
    ItemList
  },
//mixins: [settings],
  methods: {
    urlUpdated (url) {


  this.url = url

  const self = this;

      if (url.endsWith("zip")) {
        axios.get(url, { responseType:"blob" })
        .then(function (response) {
        var JSZip = require("jszip");
          console.log("Loading ZIP file");
        JSZip.loadAsync(response.data).then(function (zip) {
          console.log("Loaded ZIP file");
          zip.forEach(function (relativePath, file){
              console.log("iterating over", relativePath);
              if (relativePath == "index.rss") {
                file.async("string").then(function (text) {
                  //console.log("Content " + text);
                  self.parseRSS(self, text);
                });
              } else if (relativePath.startsWith("enc/") && !file.dir) {
                let url = "file://" + relativePath;

                // Cached already?
                db.getMediaFile(url).then(function(blob) {
                if (blob == null) {
                  file.async('nodebuffer')
                   .then(function (binaryData) {
                     let blob = new Blob([binaryData], {type: 'audio/mpeg'});
                      db.media.add ({url: "file://" + relativePath, blob: blob });
                   });
                }

                });
                


                // file.internalStream("uint8array")
                //   .accumulate(function updateCallback(metadata) {
                //   })
                //   .then(function (binaryData) {
                //     let blob = new Blob([binaryData], {type: 'audio/mpeg'});
                //      db.media.add ({url: "file://" + relativePath, blob: blob });
                //   });
              }
          });
        });        
      })
      } else {
  axios.get(url)
  .then(function (response) {
        self.parseRSS(self, response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
    }
    },

    parseRSS(self, data) {
            // Get the parseString function
      var parseString = require('xml2js').parseString;
        parseString(data, { explicitArray: false },  function (err, result) {
            var items = [];
            var index = 0;
            result.rss.channel.item.forEach(i => {
              //console.log(i);
              //console.log(sanitizeHTML(i.description));
              var item = { 
                title: i.title, 
                link: i.link,
                guid: i.guid,
                index: index++,
                description: sanitizeHTML(i.description),
                pubDate: i.pubDate,
                author: i.author,
                content: i["content:encoded"]//,
                //enclosure: i.enclosure.url,
                //enclosureType: i.enclosure.type
              };

              var mediaContent = i["media:content"];
              var mediaDesc = i["media:description"];
              if (Array.isArray(mediaContent) && mediaContent.length > 0) {
                  item.imageSrc = mediaContent[0].$.url;
                  //console.log("Setting source to " + item.imageSrc);
                  //item.imageDesc = mediaDesc[0];
              } else if (mediaContent != null) {
                  item.imageSrc = mediaContent.$.url;
                  //item.imageDesc = mediaDesc;
              }

              var enclosure = i["enclosure"];
              if (Array.isArray(enclosure) && enclosure.length > 0) {
                  item.enclosure = enclosure[0].$.url
                  item.enclosureType = enclosure[0].$.type
              } else if (enclosure != null) {
                  item.enclosure = enclosure.$.url
                  item.enclosureType = enclosure.$.type
              }

              items.push(item);
            });
            self.items = items;
        });
    }

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
