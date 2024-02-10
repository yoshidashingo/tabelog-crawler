import {
    readFileSync
} from 'fs';
import os from 'os';

import {
    Client
} from 'ssh2';

const pemFile = (process.platform === 'win32' ? `${os.homedir()}\\.ssh\\tablelog-crawler-dev.pem` : `${os.homedir()}/.ssh/tablelog-crawler-dev.pem`);

export function sendCommandWithSSH(IP) {
    const conn = new Client();
    return new Promise((resolve, reject) => {
        conn.on('ready', () => {
            conn.exec('bash ~/run.sh', (err, stream) => {
                if (err) {
                    return reject(err);
                }
                stream.on('close', (code, signal) => {
                    conn.end();
                    resolve();
                }).on('data', (data) => {
                    console.log(data.toString());
                }).stderr.on('data', (data) => {
                    console.log(data.toString());
                });
            });
        }).connect({
            host: IP,
            port: 22,
            username: 'ubuntu',
            privateKey: readFileSync(pemFile)
        });
    });
}

