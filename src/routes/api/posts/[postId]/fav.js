
export function post(req, res, next) {
    const api = req.api;

    api.posts.favPost(req.params.postId, req.user.username).then(() => {
        res.writeHead(200);
        res.end();
    }).catch((err) => next(err));
}

export function del(req, res, next) {
    const api = req.api;

    api.posts.unfavPost(req.params.postId, req.user.username).then(() => {
        res.writeHead(200);
        res.end();
    }).catch((err) => next(err));
}