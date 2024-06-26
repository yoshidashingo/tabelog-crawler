import axios from 'axios';
import * as cheerio from 'cheerio';
import {
    URL_PREFECTURES,
    URL_TABELOG
} from '../constant.js';

async function getHtmlStrByUrl(url) {
    const httpResponse = await axios.get(url);
    const html = httpResponse.data;
    return html;
}

/**
 * 店舗のURLで、情報を取得
 * @param {string} url 店舗のURL
 * @returns {object} 店舗情報
 */
export async function getStoreInfo(url) {
    const storeInfoObj = {
        name: '',
        category: '',
        tel: '',
        address: '',
    };

    const storeHtmlContent = await getHtmlStrByUrl(`${URL_TABELOG}${url}`)
    const $ = cheerio.load(storeHtmlContent);
    const name = $('.rstinfo-table__name-wrap span').text();
    const hasAward = $('.rstinfo-badge').length === 1;
    const categoriesTds = $('table.rstinfo-table__table td');
    const category = $(categoriesTds[hasAward ? 2 : 1], 'span').text().trim();
    const tel = $('.rstdtl-side-yoyaku__tel-number').text().trim();
    const address = $('.rstinfo-table__address').text();

    storeInfoObj['name'] = name;
    storeInfoObj['category'] = category;
    storeInfoObj['tel'] = tel;
    storeInfoObj['address'] = address;

    return storeInfoObj;
}

/**
 * 都道府県一覧を取得
 * @return {array} 都道府県一覧
 */
export async function getPrefectures() {
    const html = await getHtmlStrByUrl(URL_PREFECTURES);
    const $ = cheerio.load(html);

    const arr = [];
    const prefectureCategoryDiv = $('.prefarea-content__frame');
    prefectureCategoryDiv.each(function () {
        const category = $(this).find('.prefarea-content__localname').text();
        const prefectureInCategoryLI = $(this).find('.prefarea-content__localname-item');
        prefectureInCategoryLI.each(function () {
            const a = $(this).find('a');
            const url = a.attr('href');
            const key = url.split('/')[2];
            const label = a.text();

            const obj = {
                category,
                key,
                label
            };
            arr.push(obj);
        });
    });
    return arr;
}

/**
 * 都道府県Keyで、該当エリア一覧を取得する
 * @param {string} prefectureId 都道府県のKey
 * @returns {array} エリア一覧
 */
export async function getAreasInPrefecture(prefectureKey) {
    const URL_PREFECTURE = `${URL_PREFECTURES}/${prefectureKey}`
    const html = await getHtmlStrByUrl(URL_PREFECTURE);
    const $ = cheerio.load(html);

    const arr = [];
    const areaA = $('a.area-content__item-target');
    areaA.each(function () {
        const a = $(this);
        const url = a.attr('href');
        const label = a.text();
        const key = url.replace(URL_PREFECTURE, '').replaceAll('/', '');
        const obj = {
            prefectureKey,
            key,
            label
        };
        arr.push(obj);
    });
    return arr;
}

/**
 * 50音順一覧を取得する
 * @param {string} areaId エリアKey
 * @returns {array} 50音順一覧
 */
export async function get50List(prefectureKey, areaKey) {
    const URL_AREA = `${URL_PREFECTURES}/${prefectureKey}/${areaKey}`;
    const html = await getHtmlStrByUrl(URL_AREA);
    const $ = cheerio.load(html);

    const arr = [];
    const items = $('li.sitemap-50on__item');
    items.each(function () {
        const a = $(this).find('a');
        const span = $(this).find('span');
        const obj = {};
        if (span.length) {
            const text = span.text();
            const label = text[0];
            obj['key'] = '';
            obj['label'] = label;
            obj['total'] = 0;
        }
        if (a.length) {
            const url = a.attr('href');
            const text = a.text();
            const label = text[0];
            const total = text.slice(1).replace('）', '').replace('（', '');
            const key = url.replace(URL_AREA, '').replaceAll('/', '');
            obj['key'] = key;
            obj['label'] = label;
            obj['total'] = +total;
        }
        arr.push(obj);
    });
    return arr;
}

/**
 * 店舗一覧を取得する
 * @param {string} fiftyKey 50音Key
 * @returns {array} 店舗一覧
 */
export async function getStoreListBy50Key(prefecture, area, fiftyKey) {
    const URL_FIFTY = `${URL_PREFECTURES}/${prefecture.key}/${area.key}/${fiftyKey}`;
    if (fiftyKey === '-') {
        //tabelog.com/sitemap/saitama/A1101-A110102/-
        console.log('- warning:', URL_FIFTY);
        return [];
    }

    try {
        const arr = [];
        async function setArr(htmlUrl) {
            const html = await getHtmlStrByUrl(htmlUrl);
            const $ = cheerio.load(html);
            const items = $('.sitemap-50dtl__name');
            items.each(function () {
                const a = $(this);
                const name = a.text();
                const url = a.attr('href');
                const obj = {
                    name,
                    prefectureKey: prefecture.key,
                    prefectureLabel: prefecture.label,
                    areaKey: area.key,
                    areaLabel: area.label,
                    url
                };
                arr.push(obj);
            });
            return $;
        }

        const $1 = await setArr(URL_FIFTY);

        const pagenation = $1('.pagenation').find('a');
        const pageLen = pagenation.length;
        if (pageLen > 0) {
            for (let i = 2; i <= pageLen; i++) {
                const pageUrl = `${URL_PREFECTURES}/${prefecture.key}/${area.key}/${fiftyKey}?PG=${i}`;
                await setArr(pageUrl);
            }
        }
        return arr;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('404 warning:', url);
            return [];
        } else {
            console.error(error);
            process.exit(1);
        }
    }
}

export async function getFifties() {
    const arr = [];
    const prefectures = await getPrefectures();
    for (let i = 0; i < prefectures.length; i++) {
        const prefecture = prefectures[i];
        const prefectureKey = prefecture.key;
        console.log("\nprefecture:", prefecture.label);
        const areas = await getAreasInPrefecture(prefectureKey);

        for (let j = 0; j < areas.length; j++) {
            const area = areas[j];
            const areaKey = area.key;
            console.log("area:", area.label);
            const fifties = await get50List(prefectureKey, areaKey);
            const obj = {
                prefectureKey: prefecture.key,
                prefectureLabel: prefecture.label,
                areaKey: area.key,
                areaLabel: area.label,
                fifties: fifties.filter((i) => !!i.total),
            };
            arr.push(obj);
        }
    }
    return arr;
}