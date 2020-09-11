export function get(req, res, next) {
    const api = req.api;

    api.posts.getLatests().then((posts) => {
        res.writeHead(200);
        res.end(JSON.stringify(posts));
    });
}