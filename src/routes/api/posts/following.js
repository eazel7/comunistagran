export function get(req, res, next) {
    const api = req.api;
    
    api.follows.listFollowing(req.user.username).then((following) => {
        Promise.all(following.map((f) => api.posts.getPostsByUsername(f))).then((results) => {
            let posts = [];

            results.forEach((coll) => posts = posts.concat(coll));

            Promise.all(
                posts.map(p =>
                    api.users.getUserProfile(p.username)
                        .then((userProfile) => {
                            if (userProfile.profilePictureId) {
                            return api.images.getImageUrl(userProfile.profilePictureId)
                                .then((userProfilePictureUrl) => p.userProfilePictureUrl = userProfilePictureUrl);
                            } else {
                                return Promise.resolve();
                            }
                        })
                        .then(() => {
                            if (p.imageId) {
                                api.images.getImageUrl(p.imageId).then((imageUrl) => p.imageUrl = imageUrl);
                            }
                        })
                        .then(() => {
                            p.faved = p.favedBy.indexOf(req.user.username) !== -1;

                            return api.comments.getCommentsByPostId(p.postId).then((comments) => p.comments = comments);
                        })
                )
            ).then(() => res.json(posts));
        });
    });
}