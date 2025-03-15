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
    document.getElementById('loginButton').addEventListener('click', openAuthModal);
    document.getElementById('requestCodeButton').addEventListener('click', requestVerificationCode);
    document.getElementById('verifyCodeButton').addEventListener('click', verifyCode);
    
    // Setup modal close button
    document.querySelector('.close').addEventListener('click', closeAuthModal);
    
    // Setup scrapbook functionality
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    
    // Load scrapbook for everyone
    loadScrapbook();
    
    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
        if (user) {
            checkUserRole(user);
        } else {
            // Show guest view (which is default)
            document.getElementById('guestControls').style.display = 'block';
            document.getElementById('editorControls').style.display = 'none';
        }
    });
});

// Modal functions
function openAuthModal() {
    document.getElementById('authModal').style.display = 'block';
    document.getElementById('emailStep').style.display = 'block';
    document.getElementById('codeStep').style.display = 'none';
    document.getElementById('email').value = '';
    document.getElementById('verificationCode').value = '';
    document.getElementById('emailStatus').textContent = '';
    document.getElementById('codeStatus').textContent = '';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
}

async function loadScrapbook() {
    try {
        // Clear existing pages before loading
        document.getElementById('pages').innerHTML = '';
        
        const snapshot = await db.collection('scrapbookItems')
                                 .orderBy('createdAt', 'desc')
                                 .get();
                                 
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

// Email verification code system
async function requestVerificationCode() {
    const email = document.getElementById('email').value;
    const emailStatus = document.getElementById('emailStatus');
    
    if (!email) {
        emailStatus.textContent = 'Please enter an email address';
        emailStatus.className = 'status error';
        return;
    }
    
    try {
        // Check if email is whitelisted
        const userDoc = await db.collection('whitelistedEmails').doc(email).get();
        
        if (!userDoc.exists) {
            emailStatus.textContent = 'This email is not authorized as an editor.';
            emailStatus.className = 'status error';
            return;
        }
        
        // Generate a 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store the code in Firestore with timestamp
        await db.collection('verificationCodes').doc(email).set({
            code: verificationCode,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            used: false
        });
        
        // For this demo, show the code (in production, you'd use Firebase Functions to send emails)
        console.log(`Code for ${email}: ${verificationCode}`);
        alert(`For demo purposes, your verification code is: ${verificationCode}`);
        
        // Show the code verification step
        document.getElementById('emailStep').style.display = 'none';
        document.getElementById('codeStep').style.display = 'block';
        
        // Store email in session for code verification
        sessionStorage.setItem('tempEmail', email);
        
        emailStatus.textContent = '';
        
    } catch (error) {
        console.error("Error requesting code: ", error);
        emailStatus.textContent = `Error: ${error.message}`;
        emailStatus.className = 'status error';
    }
}

async function verifyCode() {
    const enteredCode = document.getElementById('verificationCode').value;
    const codeStatus = document.getElementById('codeStatus');
    const email = sessionStorage.getItem('tempEmail');
    
    if (!enteredCode) {
        codeStatus.textContent = 'Please enter the verification code';
        codeStatus.className = 'status error';
        return;
    }
    
    try {
        // Get the stored code from Firestore
        const codeDoc = await db.collection('verificationCodes').doc(email).get();
        
        if (!codeDoc.exists) {
            codeStatus.textContent = 'Verification failed: Code not found';
            codeStatus.className = 'status error';
            return;
        }
        
        const codeData = codeDoc.data();
        
        // Check if code is used or expired (15 minutes expiration)
        const now = new Date();
        const createdAt = codeData.createdAt.toDate();
        const timeDiff = (now - createdAt) / (1000 * 60); // difference in minutes
        
        if (codeData.used || timeDiff > 15) {
            codeStatus.textContent = 'Verification failed: Code is expired or already used';
            codeStatus.className = 'status error';
            return;
        }
        
        // Verify the code
        if (codeData.code !== enteredCode) {
            codeStatus.textContent = 'Verification failed: Invalid code';
            codeStatus.className = 'status error';
            return;
        }
        
        // Mark code as used
        await db.collection('verificationCodes').doc(email).update({
            used: true
        });
        
        // Create anonymous account and link it with the email
        try {
            // First sign in anonymously
            await auth.signInAnonymously();
            
            // Store the verified email for the anonymous user
            const user = auth.currentUser;
            await db.collection('users').doc(user.uid).set({
                email: email,
                verifiedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Close the modal and check user role
            closeAuthModal();
            
            // Check if user has editor role
            await checkUserRole({ email: email, uid: user.uid });
            
        } catch (error) {
            console.error("Error during auth: ", error);
            codeStatus.textContent = `Authentication error: ${error.message}`;
            codeStatus.className = 'status error';
        }
    } catch (error) {
        console.error("Error verifying code: ", error);
        codeStatus.textContent = `Error: ${error.message}`;
        codeStatus.className = 'status error';
    }
}

async function checkUserRole(user) {
    try {
        let email;
        
        if (user.email) {
            // If user object has email property
            email = user.email;
        } else {
            // For anonymous users, get the email from our users collection
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                email = userDoc.data().email;
            } else {
                console.error("No email found for this user");
                await signOut();
                return;
            }
        }
        
        // Use whitelist check
        const userDoc = await db.collection('whitelistedEmails').doc(email).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData.role === 'editor') {
                // Show editor view
                document.getElementById('guestControls').style.display = 'none';
                document.getElementById('editorControls').style.display = 'block';
                document.getElementById('userEmail').textContent = email; // Show logged in email
            } else {
                alert('You do not have permission to edit the scrapbook.');
                await signOut();
            }
        } else {
            alert('Your email is not whitelisted. Access denied.');
            await signOut();
        }
    } catch (error) {
        console.error("Error checking user role: ", error);
        alert("Error checking permissions: " + error.message);
        await signOut();
    }
}

async function signOut() {
    try {
        await auth.signOut();
        document.getElementById('guestControls').style.display = 'block';
        document.getElementById('editorControls').style.display = 'none';
        sessionStorage.removeItem('tempEmail');
    } catch (error) {
        console.error("Error signing out: ", error);
        alert(error.message);
    }
}

// Setup real-time updates
function setupRealtimeUpdates() {
    db.collection('scrapbookItems')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        // Only handle new additions to avoid duplicates
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const item = change.doc.data();
                let element;
                
                // Check if this is a brand new item (last 10 seconds)
                const itemTime = item.createdAt?.toDate() || new Date();
                const now = new Date();
                const isNew = (now - itemTime) < 10000; // 10 seconds
                
                // Only process if it's a new item to avoid duplicates during initial load
                if (isNew) {
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
                }
            }
        });
      });
}

// Start real-time updates after initial load
loadScrapbook().then(() => {
    setupRealtimeUpdates();
});
