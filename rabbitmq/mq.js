
import amqp from "amqplib";
import dotnenv from "dotenv";

dotnenv.config({ path: process.cwd() + "/.env" });
const connection = await amqp.connect(process.env.RABBITMQ_URL);

export async function getChannel(QUEUE_NAME) {
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    return channel;
}

export async function sendMessage(channel, queue, msg) {
    let str = '';
    if (!msg) {
        str = Date.now().toString();
    } else {
        str = JSON.stringify(msg);
    }
    channel.sendToQueue(queue, Buffer.from(str), {
        persistent: true,
    });
}

export async function consume(channel, queue, prefectCount, cb) {
    channel.prefetch(prefectCount);
    await channel.consume(queue, cb, { noAck: false });
}