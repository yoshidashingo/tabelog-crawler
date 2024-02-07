
import amqp from "amqplib";
import fs from "fs";
import dotnenv from "dotenv";
dotnenv.config({ path: process.cwd() + "/.env" });

const QUEUE_NAME = 'tabelog_first_step';

async function main() {
    let connection;
    try {
        const arr = JSON.parse(fs.readFileSync(process.cwd() + "/json/fifty.json"));
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

        connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = QUEUE_NAME;

        await channel.assertQueue(queue, { durable: true });
        fiftyArr.forEach((i) => {
            console.log(`${i.prefectureLabel} > ${i.areaLabel} > ${i.fiftyLabel}(${i.amountOfStores})`);
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(i)), {
                persistent: true,
            });
        });
        console.log("done");
    } catch (error) {
        console.error(error);
    }
}

main();