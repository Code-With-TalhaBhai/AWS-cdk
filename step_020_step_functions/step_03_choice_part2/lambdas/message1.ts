type event = {
    operation_Accomplished : boolean
    data: string
}




export async function handler(event:event):Promise<string>{
        console.log('data added successfully');
        return `${event.data}`;
}