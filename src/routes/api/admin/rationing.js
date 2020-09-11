export function get(req, res, next) {
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    aWeekAgo.setHours(0, 0, 0, 0);

    req.api.rationing.getRationingSchedule(aWeekAgo.valueOf()).then((schedules) => {
        res.json(schedules);
    })
    .catch((err) => next(err));
}

export function post(req, res, next) {
    req.api.rationing.createRationingSchedule(req.params.from, req.params.to, req.params.name)
    .then((rationingScheduleId) => res.json(rationingScheduleId))
    .catch((err) => next(err));
}