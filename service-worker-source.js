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

const matchFeedRequest = ({url, event}) => {
  console.log("Destination is:");
  console.log(event.request);
  console.log(event.request.destination);
  console.log("Matching Path " + url.pathname);
  return url.pathname.includes("nasa");
};

const handlerFeedRequest = ({url, event, params}) => {
  const promiseChain = fetch(event.request.clone())
  .then((response) => {
    // if (Math.random() > 0.5) {
    //   console.log("Throwing error!");
    //   throw new Error("test error outside");
    // }
    return response.text();
  })
  .then((responseBody) => {
    console.log("GOT RESPONSE");
    return new Response(`${responseBody} <!-- Added Content. -->`);
  })
  .catch((err) => {
    console.log("Add to sync queue");
    return queue.pushRequest({request: event.request});
  });
  event.waitUntil(promiseChain);
};

console.log("Registering route!");
workbox.routing.registerRoute(matchFeedRequest, handlerFeedRequest);



self.addEventListener('message', (event) => {
  console.log("SW - Got message:");
  console.log(event);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const queue = new workbox.backgroundSync.Queue('syncQueue');

self.addEventListener('fetch', (event) => {
  console.log("Fetching: " + event.request.url);
  
  // Clone the request to ensure it's save to read when
  // adding to the Queue.
  const promiseChain = fetch(event.request.clone())
  .catch((err) => {
      return queue.pushRequest({request: event.request});
  });

  event.waitUntil(promiseChain);
});

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
workbox.precaching.precacheAndRoute([]);
