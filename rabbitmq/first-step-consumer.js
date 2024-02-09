
import amqp from "amqplib";
import dotnenv from "dotenv";
import moment from 'moment';
import '../mongodb.js';
import {
    getStoreListBy50Key
} from '../lib/tabelog.js';
import initTemp from '../model/temp.js';

dotnenv.config({ path: process.cwd() + "/.env" });
const QUEUE_NAME = 'tabelog_first_step';

async function main() {
    const date = moment(new Date()).format('YYYY-MM-DD');
    const Temp = initTemp(`2024-02-06`);
    let connection;
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        const queue = QUEUE_NAME;
        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(100);
        await channel.consume(queue, cb, { noAck: false });
        async function cb(msg) {
            try {
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
                await Temp.insertMany(stores.map(i => ({ url: i.url })));
                console.log(`${obj.prefectureLabel} > ${obj.areaLabel} > ${obj.fiftyLabel}(${obj.amountOfStores})`);
                channel.ack(msg);
            } catch (error) {
                console.error(error);
                process.exit(1);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default main;
