// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Now you can use Firebase services
const db = firebase.firestore();
const storage = firebase.storage();

// Rest of your code
document.addEventListener('DOMContentLoaded', loadScrapbook);
document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

// Other functions...


async function loadScrapbook() {
    const snapshot = await db.collection('scrapbookItems').get();
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
    const storageRef = storage.ref('images/' + file.name);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();

    const img = document.createElement('img');
    img.src = url;
    addPageElement(img);

    // Save to Firestore
    await db.collection('scrapbookItems').add({ type: 'image', content: url });
}

async function addText() {
    const text = prompt("Enter your text:");
    if (text) {
        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.textContent = text;
        addPageElement(textElement);

        // Save to Firestore
        await db.collection('scrapbookItems').add({ type: 'text', content: text });
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
        await db.collection('scrapbookItems').add({ type: 'video', content: url });
    }
}

function addPageElement(element) {
    const page = document.createElement('div');
    page.className = 'page';
    page.appendChild(element);
    document.getElementById('pages').appendChild(page);
}
