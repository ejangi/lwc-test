import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDFl7umFk-zzChMY_oCIzCcGIrW1Ff8a-8",
    databaseURL: "https://lwc-test-5915d.firebaseio.com",
    projectId: "lwc-test-5915d",
    appId: "1:503510192142:web:7b24de22d9502da6a36c5f"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;