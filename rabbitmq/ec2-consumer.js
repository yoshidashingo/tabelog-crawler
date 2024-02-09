
import amqp from "amqplib";
import dotnenv from "dotenv";
import {
    createEC2AndRunConsumer,
    deleteEC2
} from '../lib/ec2.js';
import {
    EC2_COUNT
} from '../constant.js';

dotnenv.config({ path: process.cwd() + "/.env" });
const QUEUE_NAME = 'ec2';

async function checkQueueISEmpty(instanceIDArr) {
    const interval = setInterval(async () => {
        let connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'url';
        const { messageCount } = await channel.assertQueue(queue, { durable: true });
        console.log('count of remaining messages:', messageCount);
        if (messageCount === 0) {
            clearInterval(interval);
            for (let i = 0; i < instanceIDArr.length; i++) {
                await deleteEC2(instanceIDArr[i]);
            }
            console.log('delete ec2 is done', instanceIDArr)
        }
    }, 1000 * 10); // every 10s
}

async function main() {
    console.log(`start ${QUEUE_NAME}`);
    let connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.prefetch(1);
    await channel.consume(QUEUE_NAME, cb, { noAck: false });
    async function cb(msg) {
        try {
            const instanceIDArr = await createEC2AndRunConsumer(EC2_COUNT);
            await checkQueueISEmpty(instanceIDArr);
            channel.ack(msg);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

main();
