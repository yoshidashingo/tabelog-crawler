
import amqp from "amqplib";
import dotnenv from "dotenv";

dotnenv.config({ path: process.cwd() + "/.env" });

const QUEUE_NAME = 'go';

async function main() {
    console.log(`start ${QUEUE_NAME}`);
    let connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = QUEUE_NAME;

    channel.sendToQueue(queue, Buffer.from(Date.now().toString()), {
        persistent: true,
    });
    setTimeout(() => {
        console.log("done");
        process.exit(0);
    }, 1000);
}

export default main;