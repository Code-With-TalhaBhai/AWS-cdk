

export async function handler(e:any){
    console.log('event working',e.Records[0]);

    const Message = JSON.parse(e.Records[0].Sns.Message);
    const {title,body} = Message;

    if (title.toUpperCase() == 'Success') {
        console.log('success');
        return {
            title,
            body
        };
    }

    throw new Error('Failure from event. Failed to recieve lambda')
}