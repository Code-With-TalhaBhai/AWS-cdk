
type diff = {
    info:{
        fieldName: string;
    },
    arguments:{
        input: addDemo;
    }
}

type addDemo = {
    version: string;
}


exports.handler = async (e:diff) => {
    if (e.info.fieldName === 'welcome'){
    return "Welcome buddy"
    }
    else if(e.info.fieldName === 'getDemos'){
        return [{id:'1',version:'typing'},{id:"2",version:'cdkv2'}]
    }
    else if(e.info.fieldName === 'addDemo'){
        return {id:String(Math.ceil(Math.random()*20)),version:e.arguments.input.version}
        // return {id:'fjdsklf',version:'fjkdsl'}
    }
    else{
        return "Not Found 404"
    }
}