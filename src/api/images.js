import Jimp from "jimp";
import shortid from "shortid";

const imagesBucketName = "images";
const region = "us-east-1";

export class ImagesAPI {
    constructor(minioClient) {
        this.minioClient = minioClient;
        this.bucketCreated = false;
    }

    getResizedImage(originalImageId, height, width) {
        return this.ensureBucketExists().then(() => new Promise((resolve, reject) => {
            const split = originalImageId.split("_");
            const resizedImageId = `${split[0]}_${height}_${width}`;

            if (resizedImageId === originalImageId) return resolve(originalImageId);

            this.minioClient.statObject(imagesBucketName, resizedImageId).then((stat) => {
                if (stat) {
                    return resolve(resizedImageId);
                }
            })
                .catch((err) => {
                    this.minioClient.getObject(imagesBucketName, split[0])
                        .then((stream) => {
                            let originalImageBuffer = Buffer.from([]);

                            stream.on("data", (buffer) => {
                                originalImageBuffer = Buffer.concat([originalImageBuffer, buffer]);
                            })
                                .on("end", () => {
                                    Jimp.read(originalImageBuffer)
                                        .then((jimpImage) => {
                                            jimpImage
                                                .resize(height, width)
                                                .quality(90)
                                                .getBufferAsync("image/jpeg")
                                                .then((newImageBuffer) => {
                                                    this.minioClient.putObject(imagesBucketName, resizedImageId, newImageBuffer, {
                                                        "content-type": "image/jpeg",
                                                        "width": jimpImage.getWidth(),
                                                        "height": jimpImage.getHeight()
                                                    })
                                                        .then(() => resolve(resizedImageId));
                                                })
                                                .catch((err) => reject(err));
                                        })
                                        .catch((err) => reject(err));
                                });
                        })
                        .catch((err) => reject(err));
                });
        }));
    }

    getImageUrl(imageId) {
        return this.minioClient.presignedGetObject(imagesBucketName, imageId);
    }

    uploadPhoto(bytes) {
        return this.ensureBucketExists().then(() => new Promise((resolve, reject) => {
            const imageId = shortid.generate();

            Jimp.read(bytes)
                .then((jimpImage) => {
                    jimpImage
                        .quality(90)
                        .getBufferAsync("image/jpeg")
                        .then((newImageBuffer) => {
                            this.minioClient.putObject(imagesBucketName, `${imageId}`, newImageBuffer, {
                                "content-type": "image/jpeg",
                                "width": jimpImage.getWidth(),
                                "height": jimpImage.getHeight()
                            })
                                .then(() => resolve(imageId));
                        })
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        }));
    }

    ensureBucketExists() {
        if (this.bucketCreated) return Promise.resolve();

        return new Promise((resolve, reject) => {
            this.minioClient.bucketExists(imagesBucketName).then((exists) => {
                if (!exists) {
                    this.minioClient.makeBucket(imagesBucketName, region)
                        .then(() => {
                            this.bucketCreated = true;

                            resolve();
                        })
                        .catch((err) => reject(err));
                } else resolve();
            })
                .catch((err) => reject(err));
        });
    }
}