import shortid from "shortid";
import streamBuffers from "stream-buffers";
import ffmpg from "fluent-ffmpeg";
import mktemp from "mktemp";
import os from "os";
import path from "path";

const videosBucketName = "videos";
const region = "us-east-1";

export class VideosAPI {
    constructor(minioClient) {
        this.minioClient = minioClient;
        this.bucketCreated = false;
    }

    getVideoUrl(videoId) {
        return this.minioClient.presignedGetObject(videosBucketName, videoId);
    }

    uploadVideo(bytes) {
        return this.ensureBucketExists().then(() => new Promise((resolve, reject) => {
            const videoId = shortid.generate();

            this.minioClient.putObject(videosBucketName, `${videoId}`, bytes, {
                    "content-type": "video/mp4",
                })
                .then(() => {
                    var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
                        frequency: 10, // in milliseconds.
                        chunkSize: 2048 // in bytes.
                    });

                    myReadableStreamBuffer.put(bytes);

                    const outpath = mktemp.createDirSync(path.join(os.tmpdir(), "XXXXXXXXX"));
                    console.log(outpath)

                    try {
                        ffmpg({
                                source: myReadableStreamBuffer,
                                logger: {
                                    debug: (s) => {
                                        console.log(s);
                                    },
                                    info: (s) => {
                                        console.log(s);
                                    },
                                    warn: (s) => {
                                        console.log(s);
                                    },
                                    error: (s) => {
                                        console.log(s);
                                    }
                                }
                            })
                            .output(outpath + '/video.mpg')
                            .noAudio()
                            .takeScreenshots({
                                timemarks: [1],
                                filename: '%s.png',
                            }, outpath)
                            .on('start', (cl) => {
                                console.log(`started ${cl}`);
                            })
                            .on("error", (err) => {
                                console.error(err);
                                reject(err);
                            })
                            .on("end", () => {
                                console.log(outpath);
                                resolve(videoId);
                            });
                    } catch (e) {
                        reject(e);
                    }
                })
                .catch((err) => reject(err));
        }));
    }

    ensureBucketExists() {
        if (this.bucketCreated) return Promise.resolve();

        return new Promise((resolve, reject) => {
            this.minioClient.bucketExists(videosBucketName).then((exists) => {
                    if (!exists) {
                        this.minioClient.makeBucket(videosBucketName, region)
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