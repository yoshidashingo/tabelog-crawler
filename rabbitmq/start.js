import {
    getChannel,
    sendMessage
} from './mq.js';

import {
    QUEUE_GO
} from '../constant.js';

async function main() {
    const channel = await getChannel(QUEUE_GO);
    sendMessage(channel, QUEUE_GO);
    console.log(`sent signal`);
}

export default main;