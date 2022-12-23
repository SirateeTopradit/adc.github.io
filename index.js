import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getDatabase, ref, set, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC8pv1zCFvVcLjtMhODMyK53VWBExZWf2A",
    authDomain: "automated-dispensing-cabinet.firebaseapp.com",
    projectId: "automated-dispensing-cabinet",
    storageBucket: "automated-dispensing-cabinet.appspot.com",
    messagingSenderId: "153898153358",
    appId: "1:153898153358:web:075eb353108a7d8a9060df",
    measurementId: "G-GNE9XD73D2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase();

async function getData(db) {
    const dat = collection(db, "Code");
    const empSnapshot = getDocs(dat);
    return empSnapshot;
}

const data = await getData(db);

const verifyBtn = document.querySelector("#verify-btn");

const getOtpText = () => {
    let text = "";
    text = document.getElementById("1234").value;
    return text;
};

const verifyOTP = () => {
        let flags = false;
        const text = getOtpText();
        console.log(text);
        data.forEach(async (x) => {
            if (text == x.data().code&&x.data().flag=="1") {
                console.log(x.id);
                flags = true;

                await updateDoc(doc(db, "Code", x.id), {
                    flag: "0",
                });

                await updateDoc(doc(db, "esp", "o"), {
                    io: x.data().io,
                    flag: "1",
                });
                set(ref(rtdb, 'o/'), {
                    io: x.data().io,
                    flag: "1",
                });
            }
        });

        if (flags) {
            alert(`Your OTP is "${text}". OTP is correct`);
            location.reload();
        } else {
            alert(`no`);
            location.reload();
        }
        
};



verifyBtn.addEventListener("click", () => {
    
    verifyOTP();
});


