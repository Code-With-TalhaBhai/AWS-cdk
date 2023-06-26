import {SNSClient,PublishCommand} from '@aws-sdk/client-sns';

async function Publish_SNS(type:'success' | 'fail',subject:string,message?:string){
    const client = new SNSClient({region:'us-east-1'});

    const input = {
        TopicArn: process.env.topicArn,
        Subject: subject,
        Message: JSON.stringify({title:type,body:message})
    };

        const command = new PublishCommand(input);
        const response = await client.send(command);
        console.log(command);
        return response;
}

type event = {
    type: 'success' | 'fail',
    Subject: string,
    Message?: string
}

export async function handler(event:event){

    try {
        await Publish_SNS(event.type,event.Subject,event.Message);
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain" },
                body: `Hello, CDK! You've hit ${event}\n`
            }
    } catch (error) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(error)
        }
    }
   
}