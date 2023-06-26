


export function handler(e:any){
    console.log('Success lambda working',e);
    return {
        statusCode: 200,
        body: e,
        data: 'Hello world'
    }
}