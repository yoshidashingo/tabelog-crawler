import axios from 'axios';
import * as cheerio from 'cheerio'

export async function getStoreInfo(url) {
    const storeInfoObj = {
        originUrl: url,
        name: '',
        categories: '',
        tel: '',
        address: '',
        // operatingHours: '',
        // budget: '',
        // payMethod: '',
        // openDay: ''
    };

    const storeHttpResponse = await axios.get(url);
    const storeHtmlContent = storeHttpResponse.data;
    const $ = cheerio.load(storeHtmlContent);
    const name = $('.rstinfo-table__name-wrap span').text();
    const hasAward = $('.rstinfo-badge').length === 1;
    const categoriesTds = $('table.rstinfo-table__table td');
    const categories = $(categoriesTds[hasAward ? 2 : 1], 'span').text().trim();
    const tel = $('.rstdtl-side-yoyaku__tel-number').text().trim();
    const address = $('.rstinfo-table__address').text();

    storeInfoObj['name'] = name;
    storeInfoObj['categories'] = categories;
    storeInfoObj['tel'] = tel;
    storeInfoObj['address'] = address;

    return storeInfoObj;
}