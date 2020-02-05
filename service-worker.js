importScripts("precache-manifest.ed2b06cd17d602b22298d57a50a92931.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

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

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.setConfig({
  debug: true
});

self.addEventListener('activate', event => {
  console.log("Workbox: activate!");
  event.waitUntil(clients.claim());
});

const matchFeedRequest = ({url, event}) => {
  console.log("TRYING TO MATCH " + url);
  if (url.href.endsWith(".xml")) {
    console.log("*** FEED REQUEST: " + url);
    return true;
  }
  // const xDestination = event.request.headers.get('x-destination');
  // if (xDestination == 'feed') {
  //   console.log("*** FEED REQUEST: " + url);
  //   return true;
  // } else if (xDestination == 'schedule') {
  //   console.log("*** SCHEDULE REQUEST: " + url);
  //   return true;
  // }
  return false;
};

const handlerFeedRequest = ({url, event, params}) => {
  console.log("Inside handlerFeedRequest");
  const strategy = new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'feed-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // A week
        maxEntries: 20
      }),
    ]
  });
  // Remove ths custom header
  // const headers = new Headers();
  // for (let [key, value] of event.request.headers) {
  //   console.log("Handling key " + key);
  //   if (key != 'x-destination') {
  //     console.log(`${key} = ${value}`);
  //     headers.append(key, value);
  //   }
  // }
  //const request = new Request(event.request, {headers: headers});
  return strategy.makeRequest({
    request: event.request
  });
};

console.log("Registering route!");
workbox.routing.registerRoute(matchFeedRequest, handlerFeedRequest);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year...
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

self.addEventListener('message', (event) => {
  console.log("SW - Got message:");
  console.log(event);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'FEED_URL_UPDATE') {
    console.log("Feed URL update:");
    const {updatedURLs} = event.data.payload;
    console.log(updatedURLs);
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage('0.1.32');
  }
});

// const queue = new workbox.backgroundSync.Queue('syncQueue');

// self.addEventListener('fetch', (event) => {
//   console.log("Fetching: " + event.request.url);
  
//   // Clone the request to ensure it's save to read when
//   // adding to the Queue.
//   const promiseChain = fetch(event.request.clone())
//   .catch((err) => {
//       return queue.pushRequest({request: event.request});
//   });

//   event.waitUntil(promiseChain);
// });

// workbox.routing.registerRoute(
//    new RegExp('index.html'),
// );
//   new workbox.strategies.NetworkOnly({
//       cacheName: 'htmlcache'
//     })
// ); 

// workbox.routing.registerNavigationRoute(
//   workbox.precaching.getCacheKeyForURL('/index.html')
// )


self.addEventListener('sync', function(event) {
  console.log("Received syn event: " + event.tag);
  if (event.tag == 'feedUpdate') {
    console.log("SYNC1");
    event.waitUntil(
      console.log("SYNC!!!")
    );
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
