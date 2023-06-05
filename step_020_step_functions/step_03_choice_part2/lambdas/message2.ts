type event = {
    operation_Accomplished : boolean
    data: string
}




export async function handler(event:event):Promise<string>{
        return 'No Data'
}