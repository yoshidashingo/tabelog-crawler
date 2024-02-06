import { should } from 'chai';
should();

import {
    getPrefectures,
    getAreasInPrefecture,
    get50List,
    getStoreListBy50Key,
    getStoreInfo
} from '../lib/tabelog.js';

let prefectures, prefecture;
let areas, area;
let fifties, fifty;
let stores, store;

describe("getPrefectures", () => {
    it('should return an array of prefectures', async () => {
        prefectures = await getPrefectures();
        prefectures.should.be.an('array');
        prefectures.should.have.lengthOf(47);
        prefecture = prefectures[0];
        prefecture.should.be.an('object');
        prefecture.should.have.property('category');
        prefecture.should.have.property('key');
        prefecture.should.have.property('label');
    });
});

describe("getAreasInPrefecture", () => {
    it('should return an array of area', async () => {
        const prefectureKey = prefecture.key;
        areas = await getAreasInPrefecture(prefectureKey);
        areas.should.be.an('array');
        area = areas[0];
        area.should.be.an('object');
        area.should.have.property('prefectureKey');
        area.should.have.property('key');
        area.should.have.property('label');
    });
});

describe("get50List", () => {
    it('should return an array of 50list', async () => {
        const prefectureKey = prefecture.key;
        const areaKey = area.key;
        fifties = await get50List(prefectureKey, areaKey);
        fifties.should.be.an('array');
        fifty = fifties[0];
        fifty.should.be.an('object');
        fifty.should.have.property('total');
        fifty['total'].should.be.a('number');
        fifty.should.have.property('key');
        fifty.should.have.property('label');
    });
});

describe("getStoreListBy50Key", () => {
    it('should return an array of stores', async () => {
        stores = await getStoreListBy50Key(prefecture, area, fifty.key);
        stores.should.be.an('array');
        store = stores[0];
        store.should.be.an('object');
        store.should.have.property('name');
        store.should.have.property('prefectureKey');
        store.should.have.property('areaKey');
        store.should.have.property('href');
    });
});

describe("getStoreInfo", () => {
    it('should return an object of store', async () => {
        const sampleUrl = store.href;
        const sampleStore = await getStoreInfo(sampleUrl);
        sampleStore.should.be.an('object');
        sampleStore.should.have.property('name');
        sampleStore.should.have.property('category');
        sampleStore.should.have.property('tel');
        sampleStore.should.have.property('address');
    });
});