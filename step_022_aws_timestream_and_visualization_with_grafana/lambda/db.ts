// const https = require('https');
// const AWS = require('aws-sdk');

import * as https from 'https';
import * as AWS from 'aws-sdk';


exports.handler = async (event:any)=>{
    try {
    const agent = new https.Agent({
        maxSockets: 5000,
    });
    const writeClient = new AWS.TimestreamWrite({
        maxRetries: 10,
        httpOptions: {
            timeout: 20000,
            agent: agent
        }
    });

    const method = event.httpMethod;
    if(method === 'POST'){
        const currentTime = Date.now().toString();

        // Dimension for each column
        const dimensions = [
            {Name: 'region', Value: 'us-east-1'},
            {Name: 'az', Value: 'az1'}, // Availablity zone
            {Name: 'hostname', Value: 'host3'},
            {Name: 'Stock_Price', Value: `${event.body.price}`},
            {Name: 'Stock_Volume', Value: `${event.body.volume}`}
        ];


        const stock = {
            'Dimensions': dimensions,
            'MeasureName': 'Amazon_Stock',
            'MeasureValue': '1st Stock',
            'MeasureValueType': 'VARCHAR',
            'Time': currentTime.toString()
        };

        const records = [stock];

        const params = {
            DatabaseName: process.env.Db_Name!,
            TableName: process.env.Table_Name!,
            Records: records
        };

        var addRecord =  writeClient.writeRecords(params);

        await addRecord.promise().then((data:any)=>{
            console.log("Writing Record Successfull",data);
        })
    }
     

    return "Successful, YES we add a record in it"


        
    } catch (error) {
        // console.log("Writing record is not successful",error);
        return `Writing record is not successful, ${error}`;
    }

}