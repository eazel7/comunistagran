import bcrypt from "bcrypt";

const rounds = 10;

export class UsersAPI {
    constructor(db) {
        this.db = db;
    }

    listUsers() {
        return new Promise((resolve, reject) => {
            this.db.collection("users").find({}).toArray((err, docs) => {
                if (err) return reject(err);

                resolve(docs.map((d) => ({
                    username: d.username,
                    name: d.name,
                    bio: d.bio,
                    profilePictureId: d.profilePictureId
                })));
            });
        });
    }

    registerUser(username, password) {
        return new Promise((resolve, reject) => {
            username = username.toLowerCase().trim();

            const passwordHash = bcrypt.hashSync(password, rounds);

            this.db.collection("users").insert({ username: username, passwordHash: passwordHash }, (err) => {
                if (err) return reject(err);

                resolve();
            });
        });
    }

    validatePassword(username, password) {
        return new Promise((resolve, reject) => {
            username = username.toLowerCase().trim();

            this.db.collection("users").findOne({ username: username }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return resolve(false);

                resolve(bcrypt.compareSync(password, doc.passwordHash));
            });
        });
    }

    updateProfile(newUserProfile) {
        return new Promise((resolve, reject) => {
            const updateSet = {};

            if (newUserProfile.name) updateSet["name"] = newUserProfile.name;
            if (newUserProfile.bio) updateSet["bio"] = newUserProfile.bio;
            if (newUserProfile.profilePictureId) updateSet["profilePictureId"] = newUserProfile.profilePictureId;

            this.db.collection("users").updateOne({ username: newUserProfile.username }, {
                $set: updateSet
            }, (err) => {
                if (err) return reject(err);

                resolve();
            });
        });
    }

    getUserProfile(username) {
        return new Promise((resolve, reject) => {
            username = username.toLowerCase().trim();
            
            this.db.collection("users").findOne({ username: username }, (err, doc) => {
                if (err) return reject(err);

                if (!doc) return reject(new Error("invalid user id"));

                resolve({
                    name: doc.name,
                    username: username,
                    bio: doc.bio,
                    profilePictureId: doc.profilePictureId
                });
            });
        });
    }
}