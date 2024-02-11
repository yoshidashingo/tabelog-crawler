import sendEmail from '../service/sendEmail.js';
import cron from 'node-cron';

// 朝10時
cron.schedule('0 10 * * *', () => {
    console.log(new Date().toLocaleString());
    sendEmail();
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});