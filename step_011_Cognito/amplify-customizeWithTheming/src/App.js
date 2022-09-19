import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsmobile from './aws-exports'
Amplify.configure(awsmobile);


const formFields = {
  signIn: {
    username: {
      // labelHidden: false,
      placeholder: 'Enter your own email'
    },
    password: {
      // labelHidden: false,
      placeholder: 'Enter your own password'
    }
  },
  signUp: {
    username: {
      // labelHidden: false,
      placeholder: 'Enter UserName',
      order: 1
    },
    password: {
      // labelHidden: false,
      placeholder: 'Enter your passcode',
      order: 2
    },
    confirm_password: {
      // labelHidden: false,
      placeholder: 'Confirm your passcode',
      order: 3
    },
    email:{
      // labelHidden: false,
      placeholder: 'Enter your email Address'
    },
  }
}

function App({ signOut, user }) {

  return (
    <div className="App">
      It's Glad to Be a react App
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App,{formFields});
// export default App;
