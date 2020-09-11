export function del(req, res, next) {
    const api = req.api;
    
    api.follows.unfollow(req.params.username, req.params.following)
        .then(() => {
            res.writeHead(200);
            res.end();
        })
        .catch(
            (err) => next(err)
        );
}

export function post(req, res, next) {
    const api = req.api;
    api.follows.follow(req.params.username, req.params.following)
        .then(() => {
            res.writeHead(200);
            res.end();
        })
        .catch(
            (err) => next(err)
        );
}