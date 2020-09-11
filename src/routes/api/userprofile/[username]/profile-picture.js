export function get(req, res, next) {
    const api = req.api;

    api.users.getUserProfile(req.params.username).then((userProfile) => {
        res.writeHead(302, { Location: "/api/images/" + userProfile.profilePictureId });
        res.end();
    });
}