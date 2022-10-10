// import { APIGatewayProxyEvent } from 'aws-lambda';
import {SecretsManager} from 'aws-sdk';


// exports.handler = async(event:APIGatewayProxyEvent)=>{
exports.handler = async()=>{

    // const secretManager = new SecretsManager();
    // const secretValue = await secretManager.getSecretValue({
    //     SecretId: 'MySecretId'
    // }).promise();

    // console.log('Secret Value =', secretValue);

    return {
        statusCode: 200,
        headers: {"Content-Type":"text/plain"},
        body: `Hello, you have our Secrets: Sec1: ${process.env.Example_Secret_1}, Sec2: ${process.env.Example_Secret_2} and Sec3: ${process.env.Example_Secret_3} and Sec4:${process.env.Example_Secret_4}`
    }
}