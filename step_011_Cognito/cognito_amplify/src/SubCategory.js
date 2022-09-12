import React from 'react'
import '@aws-amplify/ui-react/styles.css';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';


function SubCategory() {
    console.log('subCategory working');
    // console.log(user);
    // console.log(signOut)
  // return (
    // <div>
    //       <h1>Hello {user.username}</h1>
    //       <button onClick={signOut}>Sign out</button>
    // </div>
    // )
  // }

  // const [authState, setAuthState] = React.useState<AuthState>(null);
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();
  // const [user, setUser] = React.useState<any>();

  React.useEffect(() => {
      onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData)
      });
  }, []);

return authState === AuthState.SignedIn && user ? (
    <div className="App">
        <div>Hello, {user.username}</div>
        <AmplifySignOut />
    </div>
) : (
    <AmplifyAuthenticator />
);
}

export default SubCategory