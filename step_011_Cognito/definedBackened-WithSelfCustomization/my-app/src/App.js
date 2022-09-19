import logo from './logo.svg';
import './App.css';
import awsmobile from './aws-exports';
import {Amplify,Auth} from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect,useState } from 'react';
Amplify.configure(awsmobile);


function App() {
  const [user, setUser] = useState(undefined);
  // useEffect(() => {
  //   setUser(Auth.currentAuthenticatedUser({bypassCache:true}));
  // }, [])

  const signIn = async()=>{
    console.log('SignedIn');
    // await Auth.signIn({username:'bhai',password:'bhaiyya'});
    await Auth.signIn({username:'bhai',password:'bhaiyya'});
    const authUser = await Auth.currentAuthenticatedUser({bypassCache:true});
    setUser(authUser)
    console.log(authUser);
  };

  const signOut = async()=>{
    console.log('signOut');
    await Auth.signOut();
    setUser(undefined)
  }
  
  const signUp = async()=>{
    console.log('signup');
    await Auth.signUp({username:'bhai',password:'bhaiyya',attributes:{email:'talhakhalid411@gmail.com',name:'talha bhai'}})
  }

  const confirmUp = async()=>{
    console.log('confirming signup');
    // const myVar = await Auth.confirmSignUp({username:'bhai',code:'935198'});
    // console.log(myVar)
    let username = "bhai";
    let code = '935198';
    Auth.confirmSignUp().then(data=>console.log(data)).catch(e=>console.warn(e))
    Auth.confirmSignUp(username,code).then(data=>console.log(data)).catch(e=>console.warn(e))
    console.log('All done')
  }


  return (
    <div className="App">
      <button onClick={signIn}>SignIn</button>
      <button onClick={signUp}>SignUp</button>
      <button onClick={signOut}>SignOut</button>
      <button onClick={confirmUp}>Confirm SignUp</button>
      { user? (
          <p>Welcome! form {user.username} and its email is {user.attributes.email}</p>
      ): 'Not Working'
      }
    </div>
  );
}

// export default withAuthenticator(App);
export default App;
