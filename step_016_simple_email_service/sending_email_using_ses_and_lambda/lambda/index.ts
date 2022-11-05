import {APIGatewayProxyEvent,APIGatewayProxyResult,Context} from 'aws-lambda';
import * as AWS from 'aws-sdk';

var ses = new AWS.SES();

interface emailParam {
  to: string;
  from: string;
  subject?: string;
  text?: string;
}


exports.handler = async(event:APIGatewayProxyEvent,context:Context):Promise<any>=>{
    console.log('REQUEST============>',event.body);

    const {to,from,subject,text} = JSON.parse(event.body || '{}') as emailParam;

    if (!to || !from || !subject || !text) {
      return Responses._400({
          message: 'to, from, subject and text are all required in the body',
      });
  }


    var params = {
        Destination: {
            ToAddresses: ['talhakhalid411@gmail.com']
        }, 
        Message: {
          Body:{
            Text: {Data: 'Infinite'}
          },
          Subject: {Data: 'Sending email using ses and lambda to test its credibility'}
        },
        Source: 'info@realdover.com',
       };


        try {
        await ses.sendEmail(params).promise();
        return Responses._200({ message: 'The email has been sent' });
    } catch (error) {
        console.log('error sending email ', error);
        return Responses._400({ message: 'The email failed to send' });
    }
};

const Responses = {
  _200(data: Object) {
      return {
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Origin': '*',
          },
          statusCode: 200,
          body: JSON.stringify(data),
      };
  },

  _400(data: Object) {
      return {
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Origin': '*',
          },
          statusCode: 400,
          body: JSON.stringify(data),
      };
  },
};