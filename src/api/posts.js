import shortid from "shortid";

export class PostsAPI {
    constructor(db) {
        this.db = db;
    }
    
    getPostsByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.collection("posts").find({ username: username }).toArray((err, docs) => {
                if (err) return reject(err);

                resolve(docs);
            });
        });
    }

    createPost(username, imageId, caption) {
        const postId = shortid();

        return new Promise((resolve, reject) => {
            this.db.collection("posts").insert({
                postId: postId,
                username: username,
                imageId: imageId,
                caption: caption,
                date: Date.now(),
                favedBy: []
            }, (err) => {
                if (err) return reject(err);

                resolve(postId);
            });
        });
    }

    getPostById(postId) {
        return new Promise((resolve, reject) => {
            this.db.collection("posts").findOne({ postId: postId }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error("invalid post id"));

                delete doc._id;
                resolve(doc);
            });
        });
    }

    favPost(postId, username) {
        return new Promise((resolve, reject) => {
            this.db.collection("posts").findOne({ postId: postId }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error("invalid post id"));

                const newFavedBy = (doc.favedBy || []);

                if (newFavedBy.indexOf(username) === -1) {
                    newFavedBy.push(username);

                    this.db.collection("posts").update({ postId: postId }, {
                        $set: {
                            favedBy: newFavedBy
                        }
                    }, (err) => {
                        if (err) return reject(err);

                        resolve();
                    });
                } else resolve();
            });
        });
    }

    unfavPost(postId, username) {
        return new Promise((resolve, reject) => {
            this.db.collection("posts").findOne({ postId: postId }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error("invalid post id"));

                const newFavedBy = (doc.favedBy || []);

                if (newFavedBy.indexOf(username) !== -1) {
                    newFavedBy.splice(newFavedBy.indexOf(username), 1);

                    this.db.collection("posts").update({ postId: postId }, {
                        $set: {
                            favedBy: newFavedBy
                        }
                    }, (err) => {
                        if (err) return reject(err);

                        resolve();
                    });
                } else resolve();
            });
        });
    }

    getLatests() {
        return new Promise((resolve, reject) => {
            this.db.collection("posts").find({}).sort({ date: -1}).limit(50).toArray((err, docs) => {
                if (err) return reject(err);
                
                resolve(docs);
            });
        });

    }
}