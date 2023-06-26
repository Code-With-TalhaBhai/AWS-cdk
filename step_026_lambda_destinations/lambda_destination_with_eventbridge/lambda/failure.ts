


export function handler(e:any){
    console.log('Failure lambda working',e);
    return {
        statusCode: 404,
        body: e,
        data: 'No world'
    }
}