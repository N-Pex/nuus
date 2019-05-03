export default class ItemModel extends Object {
    title = "";
    link = "";
    guid = "";
    description = "";
    pubDate = 0;
    author = "";
    content = "";
    imageSrc = "";
    enclosure = "";
    enclosureType = "";

    hasVideoEnclosure = function() {
        return (
            this.enclosureType != null &&
            this.enclosureType.indexOf("video") === 0
        );
    }
    hasAudioEnclosure = function() {
        return (
            this.enclosureType != null &&
            this.enclosureType.indexOf("audio") === 0
        );
    }
}