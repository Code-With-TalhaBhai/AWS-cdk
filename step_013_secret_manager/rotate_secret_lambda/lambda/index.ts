import {SecretsManager} from 'aws-sdk';
import { randomBytes } from 'crypto';



const secretManager = new SecretsManager({
    region: process.env.my_region || 'us-east-1'
})

const secret_key = process.env.secret_key || '';

interface Event{
    secretId: string
    ClientRequestToken: string
    Step: 'createSecret' | 'setSecret' | 'testSecret' | 'finishSecret'
}

exports.handler = async(event:Event)=>{
    if(event.Step === 'createSecret'){
        await secretManager.putSecretValue(
            {
                SecretId: process.env.secret_name || '',
                SecretString: JSON.stringify({
                    [secret_key]: randomBytes(32).toString('hex')
                }),
                VersionStages: ['AWSCURRENT']
            }
        ).promise()
    };

    const getSecret = await secretManager.getSecretValue({
        SecretId: process.env.secret_name || ''
    }).promise();

    console.log('My Secret value is:', getSecret);

    return {
        "statusCode": 200,
        "headers": {"Content-Type":"text/plain"},
        "body": `Hello, this me and my region is ${process.env.my_region} and my secretkey is ${process.env.OurRotationSecret} and my rotation key is ${process.env.secret_key}`
    }
}