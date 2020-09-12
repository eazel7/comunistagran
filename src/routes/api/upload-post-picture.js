'use strict'

import formidable from "formidable";
import fs from "fs";
import FileType from "file-type";
import readChunk from "read-chunk";


export function post(req, res, next) {
    const api = req.api;
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        if (!files.file) return next(new Error("No se ha provisto el archivo de imagen correctamente"));
        
        (async() => {
            let buffer = readChunk.sync(files.file.path, 0, 4100);

            let fileInfo = await FileType.fromBuffer(buffer);

            if (fileInfo.mime === "video/mp4") {
                api.videos.uploadVideo(buffer).then((videoId) => {
                        res.json({
                            videoUrl: videoUrl,
                            videoId: videoId
                        });
                        // api.images.getImageUrl(imageId).then((imageUrl) => res.json({
                        //     imageUrl: imageUrl,
                        //     imageId: imageId
                        // })).catch((err) => next(err));
                    })
                    .catch((err) => next(err));
            } else {
                buffer = fs.readFileSync(files.file.path);

                api.images.uploadPhoto(buffer).then((imageId) => {
                        api.images.getImageUrl(imageId).then((imageUrl) => res.json({
                            imageUrl: imageUrl,
                            imageId: imageId
                        })).catch((err) => next(err));
                    })
                    .catch((err) => next(err));
            }
        })();
    });
}