export function get(req, res, next) {
    const api = req.api;
    
    api.posts.getPostById(req.params.postId)
        .then((post) => api.images.getImageUrl(post.imageId).then((imageUrl) => {
            post.imageUrl = imageUrl;

            return post;
        }))
        .then((post) => api.comments.getCommentsByPostId(post.postId).then((comments) => {
            post.comments = comments;

            return post;
        }))
        .then((post) => api.comments.getCommentsByPostId(post.postId).then((comments) => {
            post.comments = comments;

            return post;
        }))
        .then((post) => {
            post.faved = post.favedBy.indexOf(req.user.username) !== -1;
            return post;
        })
        .then((post) => res.json(post))
        .catch((err) => next(err));
}