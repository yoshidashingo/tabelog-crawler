
import {
    createEC2AndRunConsumer,
    deleteEC2
} from '../lib/ec2.js';

import {
    EC2_COUNT,
    QUEUE_EC2,
    QUEUE_URL
} from '../constant.js';

import {
    consume,
    getChannel
} from './mq.js';

async function main() {
    let channel = await getChannel(QUEUE_EC2);
    consume(channel, QUEUE_EC2, 1, callback);
    async function callback(msg) {
        try {
            const instanceIDs = await createEC2AndRunConsumer(EC2_COUNT);
            await checkQueueISEmpty(instanceIDs);
            channel.ack(msg);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

async function checkQueueISEmpty(instanceIDs) {
    const interval = setInterval(async () => {
        let channel = await getChannel();
        const { messageCount } = await channel.assertQueue(QUEUE_URL, { durable: true });
        console.log('unhandle messages:', messageCount);
        if (messageCount === 0) {
            clearInterval(interval);
            await deleteEC2(instanceIDs);
        }
    }, 1000 * 10);
}

main();
