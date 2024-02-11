import cron from 'node-cron';
import start from '../rabbitmq/start.js';

// 朝1時
cron.schedule('0 1 * * *', () => {
    console.log(new Date().toLocaleString());
    start();
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});