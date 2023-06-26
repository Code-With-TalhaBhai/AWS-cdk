

export function handler(e:any){
    console.log(e);

    return {
        name: 'fail_lambda',
        event: e,
        type: 'On_failure_Destination'
    }

}