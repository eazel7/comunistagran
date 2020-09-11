export function get(req, res, next) {
    const api = req.api;

    api.users.getUserProfile(req.params.username)
        .then((userProfile) => {
            userProfile.self = req.user.username === req.params.username;
            (userProfile.self ? Promise.resolve(userProfile) : api.follows.isFollowing(req.user.username, req.params.username).then((isFollowing) => {
                userProfile.following = isFollowing;

                return userProfile;
            }))
                .then((userProfile) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(userProfile));
                });
        })
        .catch((err) => next(err));
}

export function patch(req, res, next) {
    const api = req.api;

    api.users.updateProfile({
        username: req.params.username,
        bio: req.body.bio,
        name: req.body.name
    })
        .then(() => {
            res.writeHead(200);
            res.end();
        })
        .catch(
            (err) => next(err)
        );
}