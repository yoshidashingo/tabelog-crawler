import {
    getStoreListBy50Key
} from '../lib/tabelog.js';

import {
    consume,
    getChannel
} from './mq.js';

import {
    QUEUE_URL,
    RABBITMQ_PREFETCH
} from '../constant.js';

import {
    getToday
} from '../lib/utility.js';
import redis from '../redis.js';

async function main() {
    const today = getToday();

    let channel = await getChannel(QUEUE_URL);
    consume(channel, QUEUE_URL, RABBITMQ_PREFETCH, callback);

    async function callback(msg) {
        try {
            console.log('come in');
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
            const urls = stores.map(i => i.url);
            if (urls.length) {
                await redis.SADD(today, urls);
            }
            console.log(`${obj.prefectureLabel} > ${obj.areaLabel} > ${obj.fiftyLabel}(${obj.amountOfStores})`);
            channel.ack(msg);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

main();
