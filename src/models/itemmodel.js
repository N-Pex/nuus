import db from '../database';

export default class ItemModel extends Object {
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

    /*hasVideoAttachment = function() {
        return (
            this.enclosureType != null &&
            this.enclosureType.indexOf("video") === 0
        );
    }
    hasAudioAttachment = function() {
        return (
            this.enclosureType != null &&
            this.enclosureType.indexOf("audio") === 0
        );
    }*/
}