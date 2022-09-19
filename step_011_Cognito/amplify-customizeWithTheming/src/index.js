import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@aws-amplify/ui-react';
export const myTheme = {
  name: 'my-theme',
  tokens: {
    colors: {
      // background: {
      //   primary: {
      //     value: 'hotpink',
      //   },
      // },
      font: {
        primary: {
          value: 'red'
        }
      }
  },
  components:{
    button:{
      primary:{
      backgroundColor:{
          value: 'red'
        }
      }
    },
    textfield:{
      borderColor:{
        value: 'purple'
      },
      borderWidth: {
        value: '4px'
      }
    }
  },
},

};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
    {/* <ThemeProvider theme={myTheme}> */}
      <App/>
  </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
