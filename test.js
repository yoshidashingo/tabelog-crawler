import { getStoreInfo } from './lib/tabelog.js';

const testUrl = process.argv[2] || 'https://tabelog.com/tokyo/A1314/A131401/13136847';

(async () => {
    const result = await getStoreInfo(testUrl);
    console.log(result);
})();