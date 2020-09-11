import shortid from "shortid";

export class CommentsAPI {
    constructor(db) {
        this.db = db;
    }

    getCommentsByPostId(postId) {
        return new Promise((resolve, reject) => {
            this.db.collection("comments").find({ postId: postId }).sort({ "date": 1 }).toArray((err, docs) => {
                if (err) return reject(err);

                resolve(docs.map((d) => ({
                    comment: d.comment,
                    postId: d.postId,
                    username: d.username,
                    date: d.date
                })));
            });
        });
    }

    addComment(username, postId, comment) {
        return new Promise((resolve, reject) => {
            const commentId = shortid.generate();

            this.db.collection("comments").insert({
                commentId: commentId,
                comment: comment,
                postId: postId,
                username: username,
                date: Date.now()
            }, (err) => {
                if (err) return reject(err);

                resolve(commentId);
            });
        });
    }
}