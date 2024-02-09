
import amqp from "amqplib";
import dotnenv from "dotenv";
import {
    getFifties
} from '../lib/tabelog.js';

dotnenv.config({ path: process.cwd() + "/.env" });
const QUEUE_NAME = 'go';

async function main() {
    console.log(`start ${QUEUE_NAME}`);
    let connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = QUEUE_NAME;
    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);
    await channel.consume(queue, cb, { noAck: false });
    async function cb(msg) {
        try {
            const date = msg.content.toString();
            const urlQueue = 'url';
            console.log(`start ${urlQueue}`);
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
            const urlChannel = await connection.createChannel();

            await urlChannel.assertQueue(urlQueue, { durable: true });
            fiftyArr.forEach((i) => {
                urlChannel.sendToQueue(urlQueue, Buffer.from(JSON.stringify(i)), {
                    persistent: true,
                });
            });
            const ec2Queue = 'ec2';
            console.log(`start ${ec2Queue}`);

            const ec2Channel = await connection.createChannel();
            await ec2Channel.assertQueue(ec2Queue, { durable: true });
            ec2Channel.sendToQueue(ec2Queue, Buffer.from(date), {
                persistent: true,
            });
            channel.ack(msg);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

main();
