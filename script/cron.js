import cron from 'node-cron';
import firstStepProducer from '../rabbitmq/first-step-producer.js';

// UTC 16PM = JP 1AM
cron.schedule('0 16 * * *', () => {
    console.log(new Date().toLocaleString());
    firstStepProducer();
});