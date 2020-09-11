export function post(req, res, next) {
    const api = req.api;

    api.comments.addComment(req.user.username, req.params.postId, req.body.comment)
        .then(() => {
            res.writeHead(200);
            res.end();
        })
        .catch((err) => next(err));
}