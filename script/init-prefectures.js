import fs from 'fs';
import { getPrefectures } from '../lib/tabelog.js';
import redis from '../redis.js'

(async () => {
    const prefectures = await getPrefectures();
    await redis.set('tabelog:prefectures', JSON.stringify(prefectures));
    console.log('done');
    process.exit(0);
})();