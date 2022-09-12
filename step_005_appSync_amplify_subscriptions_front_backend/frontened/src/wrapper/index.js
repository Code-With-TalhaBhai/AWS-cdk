

import Amplify from 'aws-amplify'
// import Amplify from '@aws-amplify/core';
import React from 'react'
import awsmobile from '../amplify/configure'

Amplify.configure(awsmobile);

function index({children}) {
    
  return (
    <div>{children}</div>
  )
}

export default index