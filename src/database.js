import Dexie from 'dexie';

const db = new Dexie('nuusdb');
db.version(1).stores({
    media: "url",
    items: "id"
});
db.version(2).stores(
    {
        feeds: "url"
    }
)
db.version(3).stores(
    {
        items: "id, feed"
    }
)
db.getMediaFile = async function(url) {
    return await db.media.get(url);
}

db.getFeed = async function(url) {
    return await db.feeds.get(url);
}

db.storeFeed = async function(feedModel) {
    console.log("Store feed:");
    console.log(feedModel);
    if (feedModel.url == null || feedModel.url == "") {
        console.log("Feed url not set, abort store operation");
        return;
    }
    return await db.feeds.put(feedModel);
}

db.getFeedItems = async function(feedModel) {
    if (feedModel.url == null || feedModel.url == "") {
        return [];
    }
    return await db.items.where("feed").equals(feedModel.url).toArray();
}

export default db;