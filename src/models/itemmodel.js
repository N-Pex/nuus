import db from '../database';
import FeedModel from './feedmodel';

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

    isFavorite = false;
}