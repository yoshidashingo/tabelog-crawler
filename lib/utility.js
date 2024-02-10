import moment from "moment";

export function getFormattedDateTime(datetime = new Date(), format = 'YYYY-MM-DD') {
    const JAPAN_OFFSET = '+0900';
    const formattedDateTime = moment(datetime).utcOffset(JAPAN_OFFSET).format(format);
    return formattedDateTime;
}