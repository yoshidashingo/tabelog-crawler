import AWS from 'aws-sdk';
import moment from 'moment';

import {
    sendCommandWithSSH
} from './ssh.js';

AWS.config.update({ region: 'us-west-2' });
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

export async function createEC2AndRunConsumer() {
    const instanceParams = {
        ImageId: 'ami-036d32aa9a737dc9b',
        InstanceType: 't2.micro',
        KeyName: 'tablelog-crawler-dev',
        SecurityGroupIds: [
            "sg-0ea4a1a62c147d5e9"
        ],
        MinCount: 1,
        MaxCount: 1,
        TagSpecifications: [
            {
                ResourceType: "instance",
                Tags: [
                    {
                        Key: "Name",
                        Value: `tabelog-crawler-first-step-consumer_${moment(new Date()).format('YYYY-MM-DD-HH-mm-ss')}`
                    }
                ]
            }
        ]
    };

    const data = await ec2.runInstances(instanceParams).promise();

    const instanceID = data.Instances[0].InstanceId;
    console.log("instanceID:", instanceID);

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
            console.log('waiting 120s')
            setTimeout(async () => {
                console.log('send command with SSH');
                await sendCommandWithSSH(IP);
            }, 1000 * 60 * 2);
        }
    }, 5000);
}

export async function deleteEC2(instanceID) {
    const params = {
        InstanceIds: [
            instanceID,
        ],
    };

    await ec2.terminateInstances(params).promise();
    console.log(`EC2 ${instanceID} is deleted`);
}