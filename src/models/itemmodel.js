import MediaCache from "../mediacache";

export default class ItemModel extends Object {
    constructor(o) {
        super();
        if (typeof (o) === 'object') {
            this.feed = o.feed;
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

    downloadMedia = function () {
        MediaCache.getMedia(this.imageSrc, true, null);
        MediaCache.getMedia(this.enclosure, true, null);
    }

    deleteDownloadedMedia = function() {
        MediaCache.deleteMedia(this.imageSrc);
        MediaCache.deleteMedia(this.enclosure);
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