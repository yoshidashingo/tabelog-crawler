import '../mongodb.js';
import {
    getStoreListBy50Key
} from '../lib/tabelog.js';
import initTemp from '../model/temp.js';
import {
    consume,
    getChannel
} from './mq.js';

import {
    QUEUE_URL,
    RABBITMQ_PREFETCH
} from '../constant.js';

import {
    getFormattedDateTime
} from '../lib/utility.js';

async function main() {
    const tempDay = getFormattedDateTime();
    const Temp = initTemp(tempDay);

    let channel = await getChannel();
    consume(channel, QUEUE_URL, RABBITMQ_PREFETCH, callback);

    async function callback(msg) {
        try {
            const obj = JSON.parse(msg.content.toString());
            const prefecture = {
                key: obj.prefectureKey,
                label: obj.prefectureLabel
            };
            const area = {
                key: obj.areaKey,
                label: obj.areaLabel
            };
            const fiftyKey = obj.fiftyKey;
            const stores = await getStoreListBy50Key(prefecture, area, fiftyKey);
            await Temp.insertMany(stores.map(i => ({ url: i.url })));
            console.log(`${obj.prefectureLabel} > ${obj.areaLabel} > ${obj.fiftyLabel}(${obj.amountOfStores})`);
            channel.ack(msg);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

main();
