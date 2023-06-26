

export function handler(e:any){
    console.log('event working',e.Records[0]);

    const Message = JSON.parse(e.Records[0].Sns.Message);
    const {title} = Message;

    if(title == 'success'){
        return {
            type: "successful-event",
            action: "success-event-trigger",
            data: "hello-event"
        }
    }
    throw new Error('failed-event');
}