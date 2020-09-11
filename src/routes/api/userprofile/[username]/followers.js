export function get (req, res, next) {
    const api = req.api;
    
    api.follows.listFollowers(req.params.username)
        .then((followers) => {
            res.json(followers);
        })
        .catch(
            (err) => next(err)
        );
}