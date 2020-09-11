export function get(req, res, next) {
    const api = req.api;

    api.posts.getPostsByUsername(req.params.username)
        .then((posts) => res.json(posts));
}