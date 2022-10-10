var AWS = require('aws-sdk');


function helper(body:any){
    var eventBridge = new AWS.EventBridge({region: "us-east-1"});
    


    return eventBridge.putEvents({
        Entries:[
            {
        EventBusName: "default",
        Source: "CustomCDK.API",
        DetailType: "WorldWideData",
        Detail: JSON.stringify({"country": `${body.country}`})
            }
        ],
    })
    .promise();
}


exports.handler = async(event:any,context:any)=>{
    console.log("Event Body: \n",event.body);
    const e = await helper(event.body);
    return {
    headers: { "Content-Type": "text/html" },
    body: `<h1>Event Published to Eventbridge</h1>${JSON.stringify(
      e,
      null,
      2
    )}`,
    }
}