// Initialize Firebase
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', loadScrapbook);
document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

async function loadScrapbook() {
    try {
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
    } catch (error) {
        console.error("Error loading scrapbook items: ", error);
    }
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    const storageRef = storage.ref('images/' + file.name);
    try {
        await storageRef.put(file);
        const url = await storageRef.getDownloadURL();
        const img = document.createElement('img');
        img.src = url;
        addPageElement(img);
        await db.collection('scrapbookItems').add({ type: 'image', content: url });
    } catch (error) {
        console.error("Error uploading image: ", error);
    }
}

async function addText() {
    const text = prompt("Enter your text:");
    if (text) {
        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.textContent = text;
        addPageElement(textElement);
        try {
            await db.collection('scrapbookItems').add({ type: 'text', content: text });
        } catch (error) {
            console.error("Error adding text: ", error);
        }
    }
}

async function addVideo() {
    const url = prompt("Enter video URL:");
    if (url) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        addPageElement(video);
        try {
            await db.collection('scrapbookItems').add({ type: 'video', content: url });
        } catch (error) {
            console.error("Error adding video: ", error);
        }
    }
}

function addPageElement(element) {
    const page = document.createElement('div');
    page.className = 'page';
    page.appendChild(element);
    document.getElementById('pages').appendChild(page);
}



// Firebase Authentication functions for Phone Authentication
let confirmationResult;

// Setup reCAPTCHA
function setupRecaptcha() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function(response) {
            // reCAPTCHA solved, allow sendVerificationCode
            sendVerificationCode();
        }
    });
}

function sendVerificationCode() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const appVerifier = window.recaptchaVerifier;

    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(result => {
            confirmationResult = result;
            alert('Verification code sent');
        }).catch(error => {
            console.error("Error during signInWithPhoneNumber: ", error);
            alert(error.message);
        });
}

function verifyCode() {
    const code = document.getElementById('verificationCode').value;
    confirmationResult.confirm(code)
        .then(result => {
            const user = result.user;
            alert('Phone number verified successfully');
            checkUserRole();
        }).catch(error => {
            console.error("Error during confirmationResult.confirm: ", error);
            alert(error.message);
        });
}

async function signOut() {
    try {
        await auth.signOut();
        alert('Sign-out successful!');
        document.getElementById('auth').style.display = 'block';
        document.getElementById('scrapbook').style.display = 'none';
    } catch (error) {
        console.error("Error signing out: ", error);
        alert(error.message);
    }
}

async function checkUserRole() {
    auth.onAuthStateChanged(async user => {
        if (user) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            if (userData && userData.role === 'editor') {
                document.getElementById('auth').style.display = 'none';
                document.getElementById('scrapbook').style.display = 'block';
            } else {
                alert('You do not have permission to edit the scrapbook.');
                signOut();
            }
        } else {
            document.getElementById('auth').style.display = 'block';
            document.getElementById('scrapbook').style.display = 'none';
        }
    });
}

// Call setupRecaptcha on load
document.addEventListener('DOMContentLoaded', setupRecaptcha);

