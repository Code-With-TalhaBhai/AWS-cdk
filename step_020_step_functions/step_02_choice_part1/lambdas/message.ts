type event = {
    operation_Accomplished : boolean
    data: string
}




export async function handler(event:event):Promise<boolean>{
    if(event.operation_Accomplished){
        console.log('data added successfully');
        // return `${event.data}`;
        return true;
    }
    else{
        // return 'No data added';
        return false;
    }
}