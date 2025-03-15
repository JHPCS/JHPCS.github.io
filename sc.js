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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    // Setup authentication listeners
    document.getElementById('loginButton').addEventListener('click', login);
    document.getElementById('signupButton').addEventListener('click', signUp);
    document.getElementById('signOutButton').addEventListener('click', signOut);
    
    // Setup scrapbook functionality
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    
    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
        if (user) {
            checkUserRole(user);
        } else {
            document.getElementById('auth').style.display = 'block';
            document.getElementById('scrapbook').style.display = 'none';
        }
    });
});

async function loadScrapbook() {
    try {
        // Clear existing pages before loading
        document.getElementById('pages').innerHTML = '';
        
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
        await db.collection('scrapbookItems').add({ 
            type: 'image', 
            content: url,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: auth.currentUser.email
        });
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
            await db.collection('scrapbookItems').add({ 
                type: 'text', 
                content: text,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: auth.currentUser.email
            });
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
            await db.collection('scrapbookItems').add({ 
                type: 'video', 
                content: url,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: auth.currentUser.email
            });
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

// Email/Password Authentication Functions
async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('User created successfully');
        // After signup, we check if this user is whitelisted
        checkUserRole(auth.currentUser);
    } catch (error) {
        console.error("Error signing up: ", error);
        alert(error.message);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await checkUserRole(user);
    } catch (error) {
        console.error("Error logging in: ", error);
        alert(error.message);
    }
}

async function checkUserRole(user) {
    try {
        const email = user.email;
        
        // Use whitelist check
        const userDoc = await db.collection('whitelistedEmails').doc(email).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData.role === 'editor') {
                document.getElementById('auth').style.display = 'none';
                document.getElementById('scrapbook').style.display = 'block';
                document.getElementById('userEmail').textContent = email; // Show logged in email
                loadScrapbook();
            } else {
                alert('You do not have permission to edit the scrapbook.');
                signOut();
            }
        } else {
            alert('Your email is not whitelisted. Access denied.');
            signOut();
        }
    } catch (error) {
        console.error("Error checking user role: ", error);
        alert("Error checking permissions: " + error.message);
    }
}

async function signOut() {
    try {
        await auth.signOut();
        document.getElementById('auth').style.display = 'block';
        document.getElementById('scrapbook').style.display = 'none';
    } catch (error) {
        console.error("Error signing out: ", error);
        alert(error.message);
    }
}
