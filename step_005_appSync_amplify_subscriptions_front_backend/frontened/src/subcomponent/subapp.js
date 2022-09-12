import { API } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { All_Movies } from '../queries'

function Subapp() {
  const [data, setdata] = useState();
  
  const fetch_Movies = async ()=>{
    // useEffect(async() => {
      try{
        // const data = await API.graphql({query:All_Movies});
        const check = await API.graphql({query:All_Movies});
        setdata(check.data.getDemos);
        console.log(data)
      }catch(err){
        console.log(err)
      }
    // }, [])
    
  }

  // fetch_Movies();

  const show = ()=>{
  fetch_Movies();
  // console.log('working')
  }

  return (
    <div>
      <button onClick={show}>Click me</button>
      {data ? data.map((element,index)=>{
        <div>
        <p>{index}</p>
        <p>{element.version}</p>
        </div>
      }):
        <p>This is insanely good</p>
      }
    </div>
  )
}

export default Subapp