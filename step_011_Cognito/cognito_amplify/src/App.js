import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import SubCategory from './SubCategory';
import {withAuthenticator} from '@aws-amplify/ui-react'
// import {Authenticator} from '@aws-amplify/ui-react'

function App() {
  Amplify.configure(awsmobile)
  return (
    <div className="App">
      <SubCategory/>
      {/* <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator> */}
    </div>
  );
}

export default withAuthenticator(App);
// export default App;
