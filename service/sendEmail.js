import {
    getLastestStores
} from './store.js';
import mail from '../lib/email.js';



export default async function main() {
    const stores = await getLastestStores();
    const trs = stores.map((i, index) => {
        const tr = `
        <tr>
            <td style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">${index + 1}</td>
            <td style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">${i.name}</td>
            <td style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">${i.tel}</td>
            <td style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">${i.category}</td>
            <td style="padding: 4px 8px;border: 1px solid #eee;text-align: left;"><a target="_blank" href="https://www.google.com/maps?q=${i.address}">${i.address}</a></td>
         </tr> 
        `
        return tr;
    })
    const html = `
    <table style="border-collapse: collapse;">
        <thead>
            <th style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">ID</th>
            <th style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">店名</th>
            <th style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">電話</th>
            <th style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">ジャンル</th>
            <th style="padding: 4px 8px;border: 1px solid #eee;text-align: left;">住所</th>        
        </thead>
        <tbody>
            ${trs.join('\n')}      
        </tbody>
    </table>
    `;
    await mail(html);
    console.log('done');
}