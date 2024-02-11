import moment from "moment";

function getFormattedDateTime(subtractDay = 0, datetime = new Date(), format = 'YYYY-MM-DD') {
    const JAPAN_OFFSET = '+0900';
    let formattedDateTime;
    if (subtractDay) {
        formattedDateTime = moment(datetime).subtract(subtractDay, "days").utcOffset(JAPAN_OFFSET).format(format);
    } else {
        formattedDateTime = moment(datetime).utcOffset(JAPAN_OFFSET).format(format);
    }
    return formattedDateTime;
}

export function getToday() {
    return getFormattedDateTime();
}

export function getLastDay() {
    return getFormattedDateTime(1);
}