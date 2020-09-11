import JWT from "jsonwebtoken";

export function post(req, res, next) {
    const api = req.api;
    const username = req.body.username.toLowerCase().trim();

    api.users.validatePassword(username, req.body.password).then((valid) => {
        if (valid) {
            let token = JWT.sign({ username: username, isAdmin: req.body.username === 'eazel7' }, req.jwtSecret);
            req.session["ACCESS_TOKEN"] = token;
            req.session.save((err) => {
                if (err) return next(err);

                res.json(token);
            });
        } else {
            res.writeHead(403);
            res.end();
        }
    })
        .catch((err) => next(err));
}