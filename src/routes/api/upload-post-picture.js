import formidable from "formidable"
import fs from "fs";

export function post(req, res, next) {
    const api = req.api;
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        if (!files.file) return next(new Error("No se ha provisto el archivo de imagen correctamente"));

        const buffer = fs.readFileSync(files.file.path);

        api.images.uploadPhoto(buffer).then((imageId) => {
            api.images.getImageUrl(imageId).then((imageUrl) => res.json({
                imageUrl: imageUrl,
                imageId: imageId
            })).catch((err) => next(err));
        })
            .catch((err) => next(err));
    });
}