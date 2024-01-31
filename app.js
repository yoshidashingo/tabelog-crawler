import express from 'express';
import { getStoreInfo } from './lib/tabelog.js';

const app = express();

app.get('/store', async (req, res) => {
    const url = req.query.url || 'https://tabelog.com/tokyo/A1314/A131401/13136847';
    const storeInfo = await getStoreInfo(url);
    res.json({
        success: true,
        data: storeInfo
    });
});

app.listen(3000, () => {
    console.log(`tabelog server is listening on http://localhost:3000`);
});