import logo from './logo.svg';
import './App.css';
import { API } from 'aws-amplify';
import { getDemos } from './queries.ts';
import { addDemo } from './mutations.ts';
import { onCreateMovie } from './subscriptions.ts';


function App() {

  const subscribe = ()=>{
    API.graphql({
      query: onCreateMovie
    }).subscribe({
      next: moviedata => console.log(moviedata)
    })
  }
  return (
    <div className="App">
      <button onClick={()=>{(API.graphql({query:getDemos})).then(data=>console.log(data))}}>show</button>
      <button onClick={()=>{(API.graphql({query:addDemo,variables:{DemoInput:{version:`Mutation by Frontened ${Math.random()}`}}})).then(data=>console.log(data))}}>add</button>
      <button onClick={subscribe}>Subscribe</button>
    </div>
  );
}

export default App;
