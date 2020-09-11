export function get(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    res.writeHead(401)
    res.end()

    return
  }

  req.api.users
    .listUsers()
    .then((users) => res.json(users))
    .catch((err) => next(err))
}
