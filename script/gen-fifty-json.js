import fs from "fs";
import {
    getFifties
} from "../lib/tabelog.js";

async function init() {
    const arr = await getFifties();
    fs.writeFileSync(
        process.cwd() + "/json/fifty.json",
        JSON.stringify(arr, null, 2)
    );
}

init();
