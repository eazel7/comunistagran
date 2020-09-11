export function post(req, res, next) {
    const api = req.api;
    
    api.posts.createPost(req.user.username, req.body.imageId, req.body.caption)
        .then((postId) => res.json(postId))
        .catch((err) => next(err));
}