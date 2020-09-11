export function get(req, res, next) {
    const api = req.api;

    api.follows.listFollowing(req.params.username)
        .then((following) => {
            res.json(following);
        })
        .catch(
            (err) => next(err)
        );
}