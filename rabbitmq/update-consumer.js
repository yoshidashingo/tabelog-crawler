import '../mongodb.js';
import {
    getStoreInfo
} from '../lib/tabelog.js';
import Store from '../model/store.js';
import {
    consume,
    getChannel
} from './mq.js';

import {
    QUEUE_UPDATE
} from '../constant.js';


async function main() {
    let channel = await getChannel(QUEUE_UPDATE);
    consume(channel, QUEUE_UPDATE, 1, callback);

    async function callback(msg) {
        try {
            console.log('come in');
            const stores = await Store.find({ status: 'pending' });
            console.log('pending stores:', stores.length);
            for (let i = 0; i < stores.length; i++) {
                const store = stores[i];
                const obj = await getStoreInfo(store.url);
                store['name'] = obj['name'];
                store['category'] = obj['category'];
                store['tel'] = obj['tel'];
                store['address'] = obj['address'];
                store['status'] = 'done';
                await store.save();
            }
            channel.ack(msg);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

main();