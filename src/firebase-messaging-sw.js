importScripts('https://www.gstatic.com/firebasejs/8.0.2/firebase-app.js'); 
importScripts('https://www.gstatic.com/firebasejs/8.0.2/firebase-messaging.js');
firebase.initializeApp({ 
    apiKey: "AIzaSyCsFeMUlnNGOT7TuHQx4bxUzsIrPyIEH7A",
    authDomain: "facility-management-b729d.firebaseapp.com",
    projectId: "facility-management-b729d",
    storageBucket: "facility-management-b729d.appspot.com",
    messagingSenderId: "182480860179",
    appId: "1:182480860179:web:71e495db787b6221457be6",
    measurementId: "G-8BLDJ70F71"
});
const messaging = firebase.messaging();