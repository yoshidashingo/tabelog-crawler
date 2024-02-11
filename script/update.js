import '../mongodb.js';
import {
    getStoreInfo
} from '../lib/tabelog.js';
import Store from '../model/store.js';


async function main() {
    console.log('come in');
    const stores = await Store.find({ status: 'pending' });
    console.log('pending stores:', stores.length);
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        const obj = await getStoreInfo(store.url);
        store['name'] = obj['name'];
        store['category'] = obj['category'];
        store['tel'] = obj['tel'];
        store['address'] = obj['address'];
        store['status'] = 'done';
        await store.save();
    }
    if (stores.length) {
        console.log('stores updated');
    }
}

setInterval(() => {
    main();
}, 1000 * 3600); // every 1 hour