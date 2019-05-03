import axios from "axios";
import sanitizeHTML from 'sanitize-html';
import db from '../database';
import ItemModel from '../models/itemmodel.js';

export default class RSSParser {
    static fetchUrl(url, callback) {
        const self = this;
        if (url.endsWith("zip")) {
            axios.get(url, { responseType: "blob" })
                .then(function (response) {
                    var JSZip = require("jszip");
                    console.log("Loading ZIP file");
                    JSZip.loadAsync(response.data).then(function (zip) {
                        console.log("Loaded ZIP file");
                        var items = [];
                        var promises = [];

                        zip.forEach(function (relativePath, file) {
                            console.log("iterating over", relativePath);
                            if (relativePath == "index.rss") {
                                promises.push(file.async("string")
                                    .then(function (text) {
                                        items = self.parseRSS(self, text);
                                    }));
                            } else if (relativePath.startsWith("enc/") && !file.dir) {
                                let url = "file://" + relativePath;

                                // Cached already?
                                promises.push(
                                    db.getMediaFile(url).then(function (blob) {
                                        if (blob == null) {
                                            promises.push(file.async('nodebuffer').then(function (binaryData) {
                                                let blob = new Blob([binaryData], { type: 'audio/mpeg' });
                                                db.media.add({ url: "file://" + relativePath, blob: blob });
                                            }));
                                        }

                                    }));
                            }
                        });

                        // Wait until all promises are fulfilled
                        Promise.all(promises).then(function () {
                            callback(items);
                        });
                    });
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        } else {
            axios.get(url)
                .then(function (response) {
                    let items = self.parseRSS(self, response.data);
                    callback(items);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }
    }

    static parseRSS(self, data) {
        // Get the parseString function
        var parseString = require('xml2js').parseString;

        var items = [];
        var index = 0;
        parseString(data, { explicitArray: false }, function (err, result) {
            result.rss.channel.item.forEach(i => {
                var item = new ItemModel();
                item.title = i.title;
                item.link = i.link;
                item.guid = i.guid;
                item.description = sanitizeHTML(i.description);
                item.pubDate = i.pubDate;
                item.author = i.author;
                item.content = i["content:encoded"];
                var mediaContent = i["media:content"];
                if (Array.isArray(mediaContent) && mediaContent.length > 0) {
                    item.imageSrc = mediaContent[0].$.url;
                } else if (mediaContent != null) {
                    item.imageSrc = mediaContent.$.url;
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
        });
        return items;
    }
}