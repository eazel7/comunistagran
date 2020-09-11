export class FollowsAPI {
    constructor(db) {
        this.db = db;
    }

    listFollowers(username) {
        return new Promise((resolve, reject) => {
            this.db.collection("follows").find({
                following: username
            }).toArray((err, docs) => {
                if (err) return reject(err);

                resolve(docs.map(d => d.follower));
            });
        });
    }

    listFollowing(username) {
        return new Promise((resolve, reject) => {
            this.db.collection("follows").find({
                follower: username
            }).toArray((err, docs) => {
                if (err) return reject(err);

                resolve(docs.map(d => d.following));
            });
        });
    }

    follow(follower, following) {
        return new Promise((resolve, reject) => {
            this.db.collection("follows").count({ follower: follower, following: following }, (err, count) => {
                if (err) return reject(err);
                if (count) return resolve();

                this.db.collection("follows").insert({
                    follower: follower,
                    following: following
                }, (err) => {
                    if (err) return reject(err);

                    resolve();
                });
            });
        });
    }

    unfollow(follower, following) {
        return new Promise((resolve, reject) => {
            this.db.collection("follows").remove({ follower: follower, following: following }, (err) => {
                if (err) return reject(err);

                resolve();
            });
        });
    }

    isFollowing(follower, following) {
        return new Promise((resolve, reject) => {
            this.db.collection("follows").count({ follower: follower, following: following }, (err, count) => {
                if (err) return reject(err);
                if (count) return resolve(true);

                resolve(false);
            });
        });
    }
}