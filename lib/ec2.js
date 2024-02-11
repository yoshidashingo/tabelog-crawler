import AWS from 'aws-sdk';
import moment from 'moment';

import {
    sendCommandWithSSH
} from './ssh.js';

AWS.config.update({ region: 'us-west-2' });
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

export async function createEC2AndRunConsumer(EC2_COUNT) {
    const instanceParams = {
        ImageId: 'ami-0944349623c23ae9d',
        InstanceType: 't2.micro',
        KeyName: 'tablelog-crawler-dev',
        SecurityGroupIds: [
            "sg-0ea4a1a62c147d5e9"
        ],
        MinCount: EC2_COUNT,
        MaxCount: EC2_COUNT,
        TagSpecifications: [
            {
                ResourceType: "instance",
                Tags: [
                    {
                        Key: "Name",
                        Value: `tabelog-crawler-url-consumer_${moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')}`
                    }
                ]
            }
        ]
    };

    const data = await ec2.runInstances(instanceParams).promise();
    const instanceIDs = data.Instances.map(i => i.InstanceId);
    console.log("instanceIDs:", instanceIDs);

    async function checkEC2(instanceID) {
        console.log('checking ec2:', instanceID);
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                const describeInstancesData = await ec2.describeInstances({
                    InstanceIds: [
                        instanceID
                    ]
                }).promise();
                const instance = describeInstancesData.Reservations[0].Instances[0];
                const state = instance.State.Name;
                const IP = instance.PublicIpAddress;
                console.log('EC2 state:', state);
                if (state === 'running') {
                    clearInterval(interval);
                    console.log('waiting 60s')
                    setTimeout(async () => {
                        console.log('send command with SSH');
                        await sendCommandWithSSH(IP);
                        resolve();
                    }, 1000 * 60 * 1);
                }
            }, 5000);
        });
    }

    for (let i = 0; i < instanceIDs.length; i++) {
        await checkEC2(instanceIDs[i]);
    }

    return instanceIDs;
}

export async function deleteEC2(instanceIDs) {
    const params = {
        InstanceIds: instanceIDs,
    };
    await ec2.terminateInstances(params).promise();
    console.log(`EC2 ${instanceIDs.join(', ')} is deleted`);
}