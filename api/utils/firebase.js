const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyBhgoj5SG2hjSkFwWdl49Wa4U3c-SmyHBY",
    authDomain: "digmart-7f2d3.firebaseapp.com",
    projectId: "digmart-7f2d3",
    storageBucket: "digmart-7f2d3.appspot.com",
    messagingSenderId: "810161482029",
    appId: "1:810161482029:web:b1a70b102c2e07d9210ba4",
    measurementId: "G-00ZDP0KMW7"
};

const db = firebase.initializeApp(firebaseConfig);

module.exports = db;