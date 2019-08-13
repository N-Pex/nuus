import db from '../database';
import FeedModel from './feedmodel';
import axios from "axios";

export default class ItemModel extends Object {
    constructor(o) {
        super();
        if (typeof (o) === 'object') {
            this.feed = new FeedModel(o.feed);
            this.title = o.title;
            this.link = o.link;
            this.guid = o.guid;
            this.description = o.description;
            this.pubDate = o.pubDate;
            this.author = o.author;
            this.content = o.content;
            this.imageSrc = o.imageSrc;
            this.enclosure = o.enclosure;
            this.enclosureType = o.enclosureType;
            this.category = o.category;

            this.savedByUser = o.savedByUser;
        }
    }

    // The feed this item is part of
    feed = null;

    title = "";
    link = "";
    guid = "";
    description = "";
    pubDate = null;
    author = "";
    content = "";
    imageSrc = null;
    enclosure = "";
    enclosureType = "";
    category = "";

    // Date when this item was saved. If null, it is not saved by the user.
    savedByUser = null;

    hasVideoAttachment = function () {
        return (
            this.enclosureType != null && this.enclosureType.indexOf("video") === 0
        );
    }

    hasAudioAttachment = function () {
        return (
            this.enclosureType != null && this.enclosureType.indexOf("audio") === 0
        );
    }

    downloadTokens = {};

    cancelDownloadMedia = function () {
        for (var url in this.downloadTokens) {
            console.log("So url is " + url);
            this.downloadTokens[url].cancel("Canceled by user");
        } 
        this.downloadTokens = {};
    }

    downloadMedia = function () {
        this.cancelDownloadMedia();
        this.downloadIfNeeded(this.imageSrc);
        this.downloadIfNeeded(this.enclosure);
    }

    downloadIfNeeded = function(url) {
        const self = this;
        db.getMediaFile(url).then(function (blob) {
            if (blob == null) {
                self.downloadMediaItem(url, function(url, response) {
                    db.media.add({ url: url, blob: response.data });
                });
            }});
    }

    downloadMediaItem = function(url, success) {
        if (url == null) {
            return;
        }

        console.log("Download media item: " + url);

        const self = this;

        const CancelToken = axios.CancelToken;
        var token = CancelToken.source();
        this.downloadTokens[url] = token;

        console.log("Cancel token is ");
        console.log(this.downloadTokens[url]);

        axios.get(url, {
            responseType: "blob",
            cancelToken: token.token
        }).then(function (response) {
            delete self.downloadTokens[url];
            success(url, response);
        }).catch(function (thrown) {
            delete self.downloadTokens[url];
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            } else {
                // handle error
                console.log("Error");
                console.log(thrown.message);
            }
        });
    }

    deleteDownloadedMedia = function() {
        if (this.imageSrc != null) {
            db.media.where("url").equals(this.imageSrc).delete();
        }
        if (this.enclosure != null) {
            db.media.where("url").equals(this.enclosure).delete();
        }
    }

    serialize = function () {
        var itemObject = JSON.stringify(this, function (key, value) {
            // Filtering out functions
            if (typeof value === 'function') {
                return undefined;
            } else if (key === 'downloadTokens') {
                return undefined;
            }
            return value;
        });
        return itemObject;
    }

    static fromString = function (objectString) {
        var object = JSON.parse(objectString);
        return new ItemModel(object);
    }
}