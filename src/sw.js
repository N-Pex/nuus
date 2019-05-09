/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox.precaching.precacheAndRoute([
  {
    "url": "App.vue",
    "revision": "d3f25adef8233a7411c46d1ff76a02a9"
  },
  {
    "url": "assets/_Style-Double Weight.pdf",
    "revision": "f128d7614aacc9ef064fc6268b68bfc8"
  },
  {
    "url": "assets/_Style-Single Weight.pdf",
    "revision": "96054598ef4a75d84b2fcd7b363a9b67"
  },
  {
    "url": "assets/Burmese_Zawgyi-One.ttf",
    "revision": "e5e2acb2d3bdf1d128355125e41f1964"
  },
  {
    "url": "assets/item-style.css",
    "revision": "5bac1edc03d0cf0d75a7e19bb5c3636f"
  },
  {
    "url": "assets/Khmer_Hanuman.zip",
    "revision": "dfe5b7048399424a54a012db4e2a90b5"
  },
  {
    "url": "assets/Lao_saysettha_ot.ttf",
    "revision": "65b20f284c153f5ee6bfa12b198d0245"
  },
  {
    "url": "assets/logo.png",
    "revision": "82b9c7a5a3f405032b1db71a25f67021"
  },
  {
    "url": "assets/logo.svg",
    "revision": "63a7d78d42c33b94fc7b957524795cac"
  },
  {
    "url": "assets/Tibet_Monlam ouchan 3 Regular.zip",
    "revision": "76e1abca4f350df1f295500b89e6165e"
  },
  {
    "url": "components/Item.vue",
    "revision": "31517d77e848a5c4948ab7720d40c16a"
  },
  {
    "url": "components/ItemList.vue",
    "revision": "b00e8994f163f2dc68a408a2d9e9539d"
  },
  {
    "url": "components/UrlInput.vue",
    "revision": "87ae84abdde17a23a9b0161ec7ccf1e2"
  },
  {
    "url": "database.js",
    "revision": "cae029eea5ebd29f3ef6d82631581aa3"
  },
  {
    "url": "main.js",
    "revision": "70e9ade88b78a244d9007a6e59f5fd55"
  },
  {
    "url": "models/itemmodel.js",
    "revision": "0bd4aec892e4ece7ef6852621ed16202"
  },
  {
    "url": "plugins/axios.js",
    "revision": "66362e36d77bf40307e370c95c9c0995"
  },
  {
    "url": "plugins/vuetify.js",
    "revision": "ae206c635aa1b1e5ca19e7420cea7eaa"
  },
  {
    "url": "registerServiceWorker.js",
    "revision": "17692e48fd0c161001ca28d491e6fd4d"
  },
  {
    "url": "router.js",
    "revision": "9c8842a3093560161a69335cadb937de"
  },
  {
    "url": "service-worker.js",
    "revision": "32d8537d71b3091a25546bd0b18061d5"
  },
  {
    "url": "services/rssparser.js",
    "revision": "a90bb3ea41536a5da68c0531cf42bc27"
  },
  {
    "url": "store.js",
    "revision": "fb51c6dab1a14933d2f2ef4b0e15ba1c"
  },
  {
    "url": "views/Home.vue",
    "revision": "aa0d9c695c6b6009ed6df99b1029136b"
  },
  {
    "url": "views/Onboarding.vue",
    "revision": "0deed95c66ca187bba27616fc72c5bdd"
  }
]);
