
const uniqid = require('uniqid');

exports.authorize = async ()=>{

    return {
        id: uniqid(),
        name: 'talha',
        job: 'Daring Developer'
    }

}