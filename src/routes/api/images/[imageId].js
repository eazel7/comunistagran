export function get(req, res, next) {
    const api = req.api;

    return api.images.getImageUrl(req.params.imageId).then((imageUrl) => {
        res.writeHead(301, {
            Location: imageUrl
        });
        res.end();
    });
}