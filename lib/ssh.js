import {
    readFileSync
} from 'fs';
import {
    os
} from 'os';

import {
    Client
} from 'ssh2';

const pemFile = (process.platform === 'win32' ? `${os.homedir()}\.ssh\tablelog-crawler-dev.pem` : `${os.homedir()}/.ssh/tablelog-crawler-dev.pem`);

export function sendCommandWithSSH(IP) {
    console.log('curr IP:', IP);
    const conn = new Client();
    return new Promise((resolve, reject) => {
        conn.on('ready', () => {
            conn.exec('bash ~/run.sh', (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                    conn.end();
                    resolve();
                }).on('data', (data) => {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
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

