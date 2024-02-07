import fs from "fs";
import {
    getPrefectures,
    getAreasInPrefecture,
    get50List,
} from "../lib/tabelog.js";

async function init() {
    const arr = [];
    const prefectures = await getPrefectures();
    for (let i = 0; i < prefectures.length; i++) {
        const prefecture = prefectures[i];
        const prefectureKey = prefecture.key;
        console.log("current prefecture:", prefecture.label);
        const areas = await getAreasInPrefecture(prefectureKey);

        for (let j = 0; j < areas.length; j++) {
            const area = areas[j];
            const areaKey = area.key;
            console.log("current area:", area.label);
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
    fs.writeFileSync(
        process.cwd() + "/json/fifty.json",
        JSON.stringify(arr, null, 2)
    );
}

init();
