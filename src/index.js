import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBy8QvALSQgp6OIuGsQhInsvbV5uElLHTc",
  authDomain: "chatz-41da6.firebaseapp.com",
  databaseURL: "https://chatz-41da6.firebaseio.com",
  projectId: "chatz-41da6",
  storageBucket: "chatz-41da6.appspot.com",
  messagingSenderId: "841428548056",
  appId: "1:841428548056:web:7976d41ac3a716d2d6daad",
  measurementId: "G-TXE8PTLHMT",
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
