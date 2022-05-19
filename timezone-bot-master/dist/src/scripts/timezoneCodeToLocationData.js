"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timezoneCodes = require(`./timezoneCodesWithPointFives`);
exports.default = (location) => {
    if (!location)
        return;
    location = location // eslint-disable-next-line
        .replace(/[<>\[\]()]/gi, ``) // eslint-disable-next-line
        .replace(/[_　]/gi, ` `)
        .replace(/@!?\d* */gi, ``);
    // check for UTC command
    const UTCMatch = /^(?:utc|gmt) ?(\+|-)? ?(\d*)/gi.exec(location);
    if (UTCMatch) {
        const offset = UTCMatch[2]
            ? parseInt(UTCMatch[2]) *
                (UTCMatch[1] === `-` ? 1 : -1)
            : 0;
        if (offset > 14 || offset < -12)
            return;
        const locationData = {
            timezoneName: `UTC${offset < 0 ? offset : `+` + offset}`,
            location: `Etc/GMT${offset < 0 ? offset : `+` + offset}`,
            utcOffset: `${offset < 0 ? offset : `+` + offset}`,
        };
        return locationData;
    }
    // check for literal timezone code
    const timezoneCodeName = location
        .replace(/\s*/g, ``)
        .toUpperCase();
    const foundTimezoneCode = timezoneCodes[timezoneCodeName];
    if (foundTimezoneCode !== undefined) {
        const locationData = {
            timezoneName: timezoneCodeName,
            location: `Etc/GMT${foundTimezoneCode >= 0 ? `+` : ``}${foundTimezoneCode}`,
            utcOffset: `${foundTimezoneCode >= 0 ? `+` : ``}${foundTimezoneCode}`,
        };
        return locationData;
    }
};
