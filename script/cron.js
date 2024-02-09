import cron from 'node-cron';
import start from '../rabbitmq/start.js';

cron.schedule('36 2 * * *', () => {
    console.log(new Date().toLocaleString());
    start();
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});