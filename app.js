import express from 'express';
import { getStoreInfo, getPrefectures, getAreasInPrefecture, get50List } from './lib/tabelog.js';
import morgan from 'morgan';
const app = express();

app.use(morgan('dev'));

app.get('/store', async (req, res) => {
    const url = req.query.url || 'https://tabelog.com/tokyo/A1314/A131401/13136847';
    const storeInfo = await getStoreInfo(url);
    res.json({
        success: true,
        data: storeInfo
    });
});

app.get('/prefectures', async (req, res) => {
    const result = await getPrefectures();
    res.json({
        success: true,
        data: result
    });
});

app.get('/areas', async (req, res) => {
    const prefectureKey = req.query.prefectureKey;
    const result = await getAreasInPrefecture(prefectureKey);
    res.json({
        success: true,
        data: result
    });
});

app.get('/fifty', async (req, res) => {
    const prefectureKey = req.query.prefectureKey;
    const areaKey = req.query.areaKey;
    const result = await get50List(prefectureKey, areaKey);
    res.json({
        success: true,
        data: result
    });
});

app.listen(3000, () => {
    console.log(`tabelog server is listening on http://localhost:3000`);
});