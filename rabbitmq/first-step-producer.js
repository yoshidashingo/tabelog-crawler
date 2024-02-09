
import amqp from "amqplib";
import dotnenv from "dotenv";

dotnenv.config({ path: process.cwd() + "/.env" });
import {
    getFifties
} from '../lib/tabelog.js';
import {
    createEC2AndRunConsumer,
    deleteEC2
} from '../lib/ec2.js';

async function checkQueueISEmpty(instanceID) {
    const interval = setInterval(async () => {
        let connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = QUEUE_NAME;
        const { messageCount } = await channel.assertQueue(queue, { durable: true });
        console.log('count of remaining messages:', messageCount);
        if (messageCount === 0) {
            clearInterval(interval);
            await deleteEC2(instanceID);
            process.exit(0);
        }
    }, 1000 * 60 * 5); // every 5min
}

const QUEUE_NAME = 'tabelog_first_step';

async function main() {
    let connection;
    try {
        // const arr = await getFifties();
        // const fiftyArr = [];

        // arr.forEach((i) => {
        //     const fifties = i.fifties;
        //     fifties.forEach((fifty) => {
        //         fiftyArr.push({
        //             prefectureKey: i.prefectureKey,
        //             prefectureLabel: i.prefectureLabel,
        //             areaKey: i.areaKey,
        //             areaLabel: i.areaLabel,
        //             fiftyKey: fifty.key,
        //             fiftyLabel: fifty.label,
        //             amountOfStores: fifty.total,
        //         });
        //     });
        // });

        // connection = await amqp.connect(process.env.RABBITMQ_URL);
        // const channel = await connection.createChannel();
        // const queue = QUEUE_NAME;

        // await channel.assertQueue(queue, { durable: true });
        // fiftyArr.forEach((i) => {
        //     channel.sendToQueue(queue, Buffer.from(JSON.stringify(i)), {
        //         persistent: true,
        //     });
        // });
        // console.log("done");

        // waiting 10s
        setTimeout(async () => {
            const instanceID = await createEC2AndRunConsumer();
            await checkQueueISEmpty(instanceID);
        }, 1000 * 10);
    } catch (error) {
        console.error(error);
    }
}

export default main;