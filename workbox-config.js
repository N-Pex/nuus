module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{vue,pdf,ttf,css,zip,png,svg,js}"
  ],
  //"swDest": "public/service-worker-debug.js",
  "swDest": "dist/service-worker.js",
  "swSrc": "service-worker-source.js"
};