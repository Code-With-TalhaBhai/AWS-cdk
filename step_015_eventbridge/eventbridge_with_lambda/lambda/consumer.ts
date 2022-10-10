exports.handler = async function (event:any, context:any) {
    console.log("EVENT: \n This lamBDA iS pRoDuced by proDUcEr" + JSON.stringify(event, null, 2));
    return context.logStreamName;
  };