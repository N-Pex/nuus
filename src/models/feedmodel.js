export default class FeedModel extends Object {
    constructor(o) {
        super();
        if (typeof (o) === 'object') {
            this.title = o.title;
            this.link = o.link;
            this.description = o.description;
            this.imageUrl = o.imageUrl;
        }
    }

    title = "";
    link = "";
    description = "";
    imageUrl = null;
}