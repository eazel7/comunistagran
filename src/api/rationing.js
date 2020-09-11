import shortid from "shortid";

export class RationingAPI {
    constructor(db) {
        this.db = db;
    }

    /**
     * 
     * @param {number} date to start returning results. Defaults to Date.now()
     * @param {number} date up to when return results. Returns all next schedules if omitted.
     * @returns {Promise} Promise object with the list of rationing schedules
     */
    getRationingSchedule(from, to) {
        return new Promise((resolve, reject) => {
            if (!from) from = Date.now();

            const filter = {
                date: {
                    $gte: from
                }
            };

            if (to) filter.date['$lte'] = to;
            this.db.collection('rationing-schedules').find(filter).toArray((err, docs ) => {
                if (err) return reject(err);

                resolve(docs);
            })
        });
    }

    /**
     * Creates a new rationing schedule
     * @param {number} start date of the schedule
     * @param {number} end date of the schedule
     * @param {number} end date of the schedule
     * @returns {Promise} Promise object with id of the new schedule
     */
    createRationingSchedule(from, to, name) {
        return new Promise((resolve, reject) => {
            if (!from) from = Date.now();

            const id = shortid.generate();
        
            const filter = {
                date: {
                    $gte: from
                }
            };

            if (to) filter.date['$lte'] = to;
            this.db.collection('rationing-schedules').find(filter).toArray((err, docs ) => {
                if (err) return reject(err);

                resolve(docs);
            })
        });
    }

    /**
     * Get rationing statistics for a given user
     * @param {string} username of the user
     * @param {Number} number of days (positive) to look back in the statistics
     */
    getUserRationingStatistics(username, daysAgo) {
        if (typeof (daysAgo) !== 'string' ||
            !daysAgo) return Promise.reject(new Error("daysAgo must be a string"));
        if (typeof (daysAgo) !== 'number' ||
            daysAgo < 0 ||
            !Number.isInteger(daysAgo)) return Promise.reject(new Error("daysAgo must be a positive integer"));

        if (!daysAgo) daysAgo = 7;

        return new Promise((resolve, reject) => {
            let date = Date.now();

            // a week ago
            date.setDate(date.getDate() - daysAgo);

            this.db.collection("posts").find({ username: username, date: { $gte: date } }, (err, docs) => {
                if (err) return reject(err);

                let stats = docs.length;
                let favs = docs.reduce((pv, cv) => pv + cv.favedBy.length, 0);

                resolve({ stats, favs });
            });
        });
    }
}