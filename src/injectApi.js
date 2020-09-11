export default function injectApi(api) {
    return function (req, res, next) {
        req.api = api;
        next();
    };
};