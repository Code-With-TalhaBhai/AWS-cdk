import logo from './logo.svg';
import './App.css';
import {Amplify} from 'aws-amplify';
import awsmobile from './aws-exports';
import {withAuthenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';


function App() {
  Amplify.configure(awsmobile);
  return (
    <div className="App">
      
    </div>
  );
}

export default withAuthenticator(App);
