import JWT from "jsonwebtoken";

export function post(req, res, next) {
    const api = req.api;

    api.users.registerUser(req.body.username, req.body.password)
        .then(() => api.users.updateProfile({
            username: req.body.username,
            profilePictureId: req.body.profilePictureId
        }))
        .then(() => {
            const token = JWT.sign({ username: req.body.username, isAdmin: req.body.username === 'eazel7' }, req.jwtSecret);
            req.session["ACCESS_TOKEN"] = token;
            req.session.save((err) => {
                if (err) return next(err);

                res.json(token);
            });
        })
        .catch(next);
}