import express from 'express';
import { getStoreInfo, getPrefectures, getAreasInPrefecture, get50List, getStoreListBy50Key } from './lib/tabelog.js';
import morgan from 'morgan';
const app = express();
import moment from 'moment';
import './mongodb.js';
import Store from './model/store.js';

app.use(morgan('dev'));

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

app.get('/stores', async (req, res) => {
    const JAPAN_OFFSET = '+0900';
    const start = moment().utcOffset(JAPAN_OFFSET).startOf('day').toDate();
    const end = moment().utcOffset(JAPAN_OFFSET).startOf('day').add(1, 'day').toDate();
    const result = await Store.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    });
    res.json({
        success: true,
        data: result
    });
});

app.get('/store', async (req, res) => {
    const url = req.query.url;
    const storeInfo = await getStoreInfo(url);
    res.json({
        success: true,
        data: storeInfo
    });
});

app.listen(3000, () => {
    console.log(`tabelog server is listening on http://localhost:3000`);
});