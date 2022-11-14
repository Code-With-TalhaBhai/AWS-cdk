import {APIGatewayProxyEvent,Context,SNSEvent} from 'aws-lambda';

exports.handler = (event:SNSEvent,context:Context)=>{
    console.log(event.Records[0].Sns);
    return event.Records[0].Sns;
}