type event = {
    operation_Accomplished : boolean
    data: string
}

export async function handler(event:event){
    if(event.operation_Accomplished){
        console.log('data added successfully');
        return `${event.data}`;
    }
    else{
        return 'No data added';
    }
}