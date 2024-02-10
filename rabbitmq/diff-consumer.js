import mongoose from 'mongoose';

import {
    consume,
    getChannel,
    sendMessage
} from './mq.js';

import {
    QUEUE_DIFF,
    QUEUE_UPDATE
} from '../constant.js';

import {
    getLastDay,
    getToday
} from '../lib/utility.js';
import '../mongodb.js';
import redis from '../redis.js';
import Store from '../model/store.js';

async function main() {
    let channel = await getChannel(QUEUE_DIFF);
    consume(channel, QUEUE_DIFF, 1, callback);

    async function callback(msg) {
        try {
            await createStoresByDiff();
            channel.ack(msg);
            let updateChannel = await getChannel(QUEUE_UPDATE);
            sendMessage(updateChannel, QUEUE_UPDATE);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}


async function createStoresByDiff() {
    const yesterdayKey = getLastDay();
    const todayKey = getToday();
    const yesterdayIsExist = await redis.EXISTS(yesterdayKey);
    if (yesterdayIsExist === 1) {
        const diffs = await redis.SDIFF([todayKey, yesterdayKey]);
        const arr = diffs.map(i => ({ url: i }));
        await Store.insertMany(arr);
        await redis.DEL(yesterdayKey);
        console.log('done');
    } else {
        console.log('yesterday key not exist');
    }
}

main();