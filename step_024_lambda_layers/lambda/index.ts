
const axios = require('axios');
const auth = require('/opt/auth')  // (opt) is the default folder of lambda layers.

exports.handler = async()=>{

    const result = await axios.get('https://jsonplaceholder.typicode.com/todos/1');

    return {
        result: result.data,
        auth: await auth.authorize()
    };  

}