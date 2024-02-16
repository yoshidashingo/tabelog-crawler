import { getPrefectures, getAreasInPrefecture } from '../lib/tabelog.js';
import redis from '../redis.js'

(async () => {
    const prefectures = await getPrefectures();
    for (let i = 0; i < prefectures.length; i++) {
        const prefecture = prefectures[i];
        const prefectureKey = prefecture.key;
        console.log('current prefecture:', prefecture.label);
        const areas = await getAreasInPrefecture(prefectureKey);
        const arr = areas.map(i => ({ key: i.key, label: i.label }));

        await redis.set(`tabelog:${prefectureKey}:areas`, JSON.stringify(arr));

    }
    console.log('done');
    process.exit(0);
})();