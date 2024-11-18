import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCCzMZiys-AcKyFRR_lIrYJsj-TO4rZylc",
    authDomain: "my-task-list-b62c7.firebaseapp.com",
    databaseURL: "https://my-task-list-b62c7-default-rtdb.firebaseio.com",
    projectId: "my-task-list-b62c7",
    storageBucket: "my-task-list-b62c7.appspot.com",
    messagingSenderId: "828162683106",
    appId: "1:828162683106:web:b629404f2037d26e7e6ebb"
  };

const app = initializeApp(firebaseConfig);

export default app;
