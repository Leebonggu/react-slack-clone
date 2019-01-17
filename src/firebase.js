import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyCFDvAcxxh1YoZNdBW87gpbl47O3-WowVA",
  authDomain: "react-slack-clone-fb4a2.firebaseapp.com",
  databaseURL: "https://react-slack-clone-fb4a2.firebaseio.com",
  projectId: "react-slack-clone-fb4a2",
  storageBucket: "react-slack-clone-fb4a2.appspot.com",
  messagingSenderId: "562292367494"
};
firebase.initializeApp(config);

export default firebase;