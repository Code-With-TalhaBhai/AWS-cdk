import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import awsmobile from './amplify/configure';
import Subapp from './subcomponent/subapp';


function App() {
  Amplify.configure(awsmobile);
  return (
    <div className="App">
      jfkjsdkafls
     <Subapp/>
    </div>
  );
}

export default App;
