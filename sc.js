// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAl6otwxebB8nIuc5LJC3WyGF9zmMAPVqc",
    authDomain: "scrapbook-4479a.firebaseapp.com",
    projectId: "scrapbook-4479a",
    storageBucket: "scrapbook-4479a.appspot.com",
    messagingSenderId: "920077054891",
    appId: "1:920077054891:web:10afa14cb38920302dd8ee",
    measurementId: "G-PJWS9K4TRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Now you can use Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

// Rest of your code
document.addEventListener('DOMContentLoaded', loadScrapbook);
document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

async function loadScrapbook() {
    const snapshot = await getDocs(collection(db, 'scrapbookItems'));
    snapshot.forEach(doc => {
        const item = doc.data();
        let element;
        if (item.type === 'image') {
            element = document.createElement('img');
            element.src = item.content;
        } else if (item.type === 'text') {
            element = document.createElement('div');
            element.className = 'text';
            element.textContent = item.content;
        } else if (item.type === 'video') {
            element = document.createElement('video');
            element.src = item.content;
            element.controls = true;
        }
        if (element) {
            addPageElement(element);
        }
    });
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    const storageRef = ref(storage, 'images/' + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const img = document.createElement('img');
    img.src = url;
    addPageElement(img);

    // Save to Firestore
    await addDoc(collection(db, 'scrapbookItems'), { type: 'image', content: url });
}

async function addText() {
    const text = prompt("Enter your text:");
    if (text) {
        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.textContent = text;
        addPageElement(textElement);

        // Save to Firestore
        await addDoc(collection(db, 'scrapbookItems'), { type: 'text', content: text });
    }
}

async function addVideo() {
    const url = prompt("Enter video URL:");
    if (url) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        addPageElement(video);

        // Save to Firestore
        await addDoc(collection(db, 'scrapbookItems'), { type: 'video', content: url });
    }
}

function addPageElement(element) {
    const page = document.createElement('div');
    page.className = 'page';
    page.appendChild(element);
    document.getElementById('pages').appendChild(page);
}
