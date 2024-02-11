import {
    getFifties
} from '../lib/tabelog.js';
import {
    QUEUE_EC2,
    QUEUE_URL,
    QUEUE_GO
} from '../constant.js';

import {
    consume,
    getChannel,
    sendMessage
} from './mq.js';


async function main() {
    let channel = await getChannel(QUEUE_GO);
    consume(channel, QUEUE_GO, 1, callback);
    async function callback(msg) {
        try {
            console.log('come in');
            const arr = await getFifties();
            const fiftyArr = [];

            arr.forEach((i) => {
                const fifties = i.fifties;
                fifties.forEach((fifty) => {
                    fiftyArr.push({
                        prefectureKey: i.prefectureKey,
                        prefectureLabel: i.prefectureLabel,
                        areaKey: i.areaKey,
                        areaLabel: i.areaLabel,
                        fiftyKey: fifty.key,
                        fiftyLabel: fifty.label,
                        amountOfStores: fifty.total,
                    });
                });
            });

            const urlChannel = await getChannel(QUEUE_URL);
            fiftyArr.forEach((i) => {
                sendMessage(urlChannel, QUEUE_URL, i)
            });

            const ec2Channel = await getChannel(QUEUE_EC2);
            sendMessage(ec2Channel, QUEUE_EC2)
            channel.ack(msg);
            console.log('done');
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

main();
