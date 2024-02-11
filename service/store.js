import moment from 'moment';
import Store from '../model/store.js';
import '../mongodb.js';

export async function getLastestStores() {
    const JAPAN_OFFSET = '+0900';
    const start = moment().utcOffset(JAPAN_OFFSET).startOf('day').toDate();
    const end = moment().utcOffset(JAPAN_OFFSET).startOf('day').add(1, 'day').toDate();
    const result = await Store.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    });
    return result;
}