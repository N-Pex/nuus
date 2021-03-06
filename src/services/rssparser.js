import axios from "axios";
import sanitizeHTML from 'sanitize-html';
import db from '../database';
import FeedModel from '../models/feedmodel.js';
import ItemModel from '../models/itemmodel.js';

export default class RSSParser {

    static fetchCategoryUrl(url, callback) {
        // TODO - add cat requests to array, so we can cancel them if main feed changes?
        return RSSParser.fetchUrl(url, callback);
    }

    static fetchUrl(url, callback) {
        const self = this;
        if (url.endsWith("zip")) {
            axios.get(url, { responseType: "blob" })
                .then(function (response) {
                    var JSZip = require("jszip");
                    console.log("Loading ZIP file");
                    JSZip.loadAsync(response.data).then(function (zip) {
                        console.log("Loaded ZIP file");
                        var result = null;
                        var promises = [];

                        zip.forEach(function (relativePath, file) {
                            console.log("iterating over", relativePath);
                            if (relativePath == "index.rss") {
                                promises.push(file.async("string")
                                    .then(function (text) {
                                        result = self.parseFeed(self, text, url);
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
                            callback(result.feed, result.items);
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
            console.log("Ask axios to get: " + url);
            axios.get(url)
                .then(function (response) {
                    let result = self.parseFeed(self, response.data, url);
                    callback(result.feed, result.items);
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

    static parseFeed(self, data, url) {
        // Get the parseString function
        var parseString = require('xml2js').parseString;

        var parseResult = null;
        parseString(data, { explicitArray: false }, function (err, result) {
            //console.log(result);
            if (result["rdf:RDF"] != null) {
                parseResult = self.parseRDF(self, result, url);
            } else if (result.rss != null) {
                parseResult = self.parseRSS(self, result, url);
            }
        });
        console.log(parseResult);

        // Store feed in DB
        db.storeFeed(parseResult.feed);

        return parseResult;
    }

    static parseRSS(self, result, feedUrl) {
        return self.parseData(self, result.rss.channel, result.rss.channel, feedUrl);
    }

    static parseRDF(self, result, feedUrl) {
        return self.parseData(self, result["rdf:RDF"].channel, result["rdf:RDF"], feedUrl);
    }

    static getText = function(elt) {
        if (typeof(elt) === 'string') return elt;
        if (typeof(elt) === 'object' && Object.prototype.hasOwnProperty.call(elt, '_')) return elt._;
        return null;
    }

    static parseData(self, channelElement, itemParentElement, feedUrl) {
        var items = [];

        var feed = new FeedModel();
        feed.url = feedUrl;
        feed.title = channelElement.title;
        feed.link = channelElement.link;
        feed.description = channelElement.description;
        if (channelElement.image != null) {
            if (channelElement.image.$ != null && channelElement.image.$["rdf:resource"] != null) {
                feed.imageUrl = channelElement.image.$["rdf:resource"]
            } else {
                feed.imageUrl = channelElement.image.url;
            }
        }
        if (feed.imageUrl == null && channelElement["itunes:image"] != null) {
            feed.imageUrl = channelElement["itunes:image"].$.href;
        }

        // Categories
        var feedCategories = channelElement["itunes:category"];
        if (feedCategories != null) {
            if (Array.isArray(feedCategories) && feedCategories.length > 0) {
                feed.category = feedCategories[0].$.text;
            } else {
                feed.category = feedCategories.$.text;
            }
        }
        if (feed.category == null) {
            var feedCategories = channelElement["category"];
            if (feedCategories != null) {
                if (Array.isArray(feedCategories) && feedCategories.length > 0) {
                    feed.category = self.getText(feedCategories[0]);
                } else {
                    feed.category = self.getText(feedCategories);
                }
            }    
        }

        itemParentElement.item.forEach(i => {
            var item = new ItemModel();
            item.feed = feedUrl;
            item.title = i.title;
            item.link = i.link;
            item.guid = self.getText(i.guid);
            if (item.guid == null || item.guid.length == 0) {
                item.guid = item.title;
            }
            //console.log(item.guid);
            item.description = sanitizeHTML(i.description);
            item.pubDate = i.pubDate;
            if (item.pubDate == null) {
                item.pubDate = self.getText(i["dc:date"]);
            }
            item.author = i.author;
            item.content = self.getText(i["content:encoded"]);
            var mediaContent = i["media:content"];
            if (Array.isArray(mediaContent) && mediaContent.length > 0) {
                item.imageSrc = mediaContent[0].$.url;
            } else if (mediaContent != null) {
                item.imageSrc = mediaContent.$.url;
            }

            var enclosure = i["enclosure"];
            if (Array.isArray(enclosure) && enclosure.length > 0) {
                item.enclosure = enclosure[0].$.url;
                item.enclosureType = enclosure[0].$.type;
            } else if (enclosure != null) {
                item.enclosure = enclosure.$.url;
                item.enclosureType = enclosure.$.type;
            }

            // Try RDF enclosure
            if (item.enclosure == null || item.enclosure.length == 0) {
                enclosure = i["enc:enclosure"];
                if (Array.isArray(enclosure) && enclosure.length > 0) {
                    item.enclosure = enclosure[0].$["rdf:resource"];
                    item.enclosureType = enclosure[0].$.type;
                } else if (enclosure != null) {
                    item.enclosure = enclosure.$["rdf:resource"];
                    item.enclosureType = enclosure.$.type;
                }
            }

            // Try to figure out category from dc:subject.
            var categories = i["dc:subject"];
            if (categories != null) {
                if (Array.isArray(categories) && categories.length > 0) {
                    item.category = self.getText(categories[0]);
                } else if (categories != null) {
                    item.category = self.getText(categories);
                }
            }

            items.push(item);

            if (item.imageSrc == null && item.content != null) {
                //Try to find an image in the content
                var parseString = require('xml2js').parseString;
                parseString("<root>" + item.content + "</root>", {
                    explicitRoot: true,
                    explicitArray: true,
                    strict: true
                }, function (err, result) {
                    console.log("Parsed");
                    if (err == null && result != null) {
                        var image = (result.root.img == null) ? null : result.root.img[0];
                        if (image != null) {
                            item.imageSrc = image.$.src;

                            // Now that we use the first image as "header image", remove that one from the content!
                            console.log("Remove old image!!!" + item.imageSrc);
                            item.content = item.content.replace(/<img[^>]*>/i, "<span></span>");
                        }
                    }
                });
            }
        });
        return {feed: feed, items: items};
    }
}