import {
    readFileSync
} from 'fs';

import {
    Client
} from 'ssh2';

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
            privateKey: readFileSync(`${process.env.HOME}/.ssh/tablelog-crawler-dev.pem`)
        });
    });
}

