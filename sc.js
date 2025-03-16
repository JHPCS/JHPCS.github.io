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
    document.getElementById('signOutButton').addEventListener('click', signOut);
    
    
    // Setup modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the parent modal and close it
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Setup scrapbook editor functionality
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('addTextButton').addEventListener('click', openTextModal);
    document.getElementById('saveTextButton').addEventListener('click', saveText);
    
    // Setup layout and theme selectors
    document.getElementById('layoutSelector').addEventListener('change', changeLayout);
    document.getElementById('colorScheme').addEventListener('change', changeColorScheme);
    
    // Set up real-time updates for scrapbook items
    setupRealtimeUpdates();
    loadSiteSettings();
    
    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
        if (user) {
            checkUserRole(user);
        } else {
            // Show guest view (which is default)
            document.getElementById('guestControls').style.display = 'block';
            document.getElementById('editorControls').style.display = 'none';
            document.body.classList.remove('editor-mode');
        }
    });
    
    // Load saved preferences if any
    loadUserPreferences();
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

function openTextModal() {
    document.getElementById('textModal').style.display = 'block';
    document.getElementById('textInput').value = '';
    document.getElementById('textInput').focus();
}

function closeTextModal() {
    document.getElementById('textModal').style.display = 'none';
}

// When the user clicks anywhere outside of the modals, close them
window.onclick = function(event) {
    const authModal = document.getElementById('authModal');
    const textModal = document.getElementById('textModal');
    
    if (event.target === authModal) {
        closeAuthModal();
    }
    
    if (event.target === textModal) {
        closeTextModal();
    }
}

// Layout and Theme Functions
function changeLayout(event) {
    const layoutValue = event.target.value;
    const pagesContainer = document.getElementById('pages');
    
    // Remove all existing layout classes
    pagesContainer.classList.remove('layout-1', 'layout-2', 'layout-3', 'layout-4');
    
    // Add the selected layout class
    pagesContainer.classList.add(layoutValue);
    
    // Save as global site setting, not user preference
    if (auth.currentUser) {
        saveSiteSettings('layout', layoutValue);
    }
}

function changeColorScheme(event) {
    const theme = event.target.value;
    
    // Remove all existing theme classes
    document.body.classList.remove('theme-blue', 'theme-dark', 'theme-earth');
    
    // Add the selected theme class if not default
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
    
    // Save as global site setting, not user preference
    if (auth.currentUser) {
        saveSiteSettings('theme', theme);
    }
}

// New function to save global site settings
async function saveSiteSettings(key, value) {
    try {
        // Check if user is an editor
        let email = '';
        
        if (auth.currentUser.email) {
            email = auth.currentUser.email;
        } else {
            // For anonymous users, get the email from our users collection
            const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
            if (userDoc.exists) {
                email = userDoc.data().email;
            }
        }
        
        // Verify the user is actually an editor before allowing them to change global settings
        if (email) {
            const editorDoc = await db.collection('whitelistedEmails').doc(email).get();
            if (editorDoc.exists && editorDoc.data().role === 'editor') {
                // Save to a global site settings document
                await db.collection('siteSettings').doc('global').set({
                    [key]: value,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedBy: email
                }, { merge: true });
                console.log(`Global ${key} updated to ${value}`);
            } else {
                console.error("Only editors can change global site settings");
            }
        }
    } catch (error) {
        console.error("Error saving site setting:", error);
    }
}

// New function to load global site settings at startup
async function loadSiteSettings() {
    try {
        // Set up a real-time listener for site settings
        db.collection('siteSettings').doc('global').onSnapshot((doc) => {
            if (doc.exists) {
                const settings = doc.data();
                
                // Apply layout setting
                if (settings.layout) {
                    document.getElementById('layoutSelector').value = settings.layout;
                    const pagesContainer = document.getElementById('pages');
                    pagesContainer.classList.remove('layout-1', 'layout-2', 'layout-3', 'layout-4');
                    pagesContainer.classList.add(settings.layout);
                }
                
                // Apply theme setting
                if (settings.theme) {
                    document.getElementById('colorScheme').value = settings.theme;
                    document.body.classList.remove('theme-blue', 'theme-dark', 'theme-earth');
                    if (settings.theme !== 'default') {
                        document.body.classList.add(`theme-${settings.theme}`);
                    }
                }
                
                console.log("Applied global site settings");
            }
        }, (error) => {
            console.error("Error loading site settings:", error);
        });
    } catch (error) {
        console.error("Error setting up site settings listener:", error);
    }
}
// Use real-time updates for scrapbook items
function setupRealtimeUpdates() {
    const pagesContainer = document.getElementById('pages');
    const emptyState = document.getElementById('emptyState');
    
    // Add empty state back to the pages container if it was removed
    if (!document.getElementById('emptyState')) {
        pagesContainer.appendChild(emptyState);
    }
    
    // Keep track of item count
    let itemCount = 0;
    
    db.collection('scrapbookItems')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        // Process all changes in this snapshot
        snapshot.docChanges().forEach((change) => {
            // Handle added items
            if (change.type === 'added') {
                const item = change.doc.data();
                const itemId = change.doc.id;
                
                if (item.type === 'image') {
                    createImagePage(item, itemId);
                    itemCount++;
                } else if (item.type === 'text') {
                    createTextPage(item, itemId);
                    itemCount++;
                }
            } 
            // Handle removed items
            else if (change.type === 'removed') {
                const itemId = change.doc.id;
                const pageElement = document.getElementById(`page-${itemId}`);
                if (pageElement) {
                    pageElement.remove();
                    itemCount--;
                }
            }
            // Handle modified items
            else if (change.type === 'modified') {
                const item = change.doc.data();
                const itemId = change.doc.id;
                
                // Remove old element and create new one
                const oldElement = document.getElementById(`page-${itemId}`);
                if (oldElement) {
                    oldElement.remove();
                    
                    if (item.type === 'image') {
                        createImagePage(item, itemId);
                    } else if (item.type === 'text') {
                        createTextPage(item, itemId);
                    }
                }
            }
        });
        
        // Show or hide empty state based on item count
        if (itemCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
      }, (error) => {
        console.error("Error getting real-time updates:", error);
      });
}

function createImagePage(item, itemId) {
    const page = document.createElement('div');
    page.className = 'page';
    page.id = `page-${itemId}`;
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    
    // Create and add the image
    const img = document.createElement('img');
    img.src = item.content;
    img.alt = 'Scrapbook image';
    img.loading = 'lazy';
    
    imageContainer.appendChild(img);
    page.appendChild(imageContainer);
    
    // Add text container if there's a caption
    if (item.caption) {
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.textContent = item.caption;
        page.appendChild(textDiv);
    }
    
    // Add delete button
    addDeleteButton(page, itemId, item);
    
    // Add metadata
    addMetaInfo(page, item);
    
    // Add to the container
    document.getElementById('pages').appendChild(page);
}

function createTextPage(item, itemId) {
    const page = document.createElement('div');
    page.className = 'page text-only';
    page.id = `page-${itemId}`;
    
    // Create and add the text content
    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = item.content;
    
    page.appendChild(textDiv);
    
    // Add delete button
    addDeleteButton(page, itemId, item);
    
    // Add metadata
    addMetaInfo(page, item);
    
    // Add to the container
    document.getElementById('pages').appendChild(page);
}

function addDeleteButton(page, itemId, itemData) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button editor-only';
    deleteButton.innerHTML = '&times;';
    deleteButton.title = 'Delete item';
    deleteButton.onclick = (e) => {
        e.stopPropagation(); // Prevent any click events from bubbling up
        deleteItem(itemId, itemData);
    };
    
    page.appendChild(deleteButton);
}

function addMetaInfo(page, itemData) {
    const metaInfo = document.createElement('div');
    metaInfo.className = 'meta-info editor-only';
    
    const createdDate = itemData.createdAt ? 
        itemData.createdAt.toDate().toLocaleString() : 
        'Unknown date';
        
    metaInfo.innerHTML = `Added by: ${itemData.createdBy || 'Unknown'}<br>Date: ${createdDate}`;
    
    page.appendChild(metaInfo);
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image is too large. Please select an image under 5MB.');
        event.target.value = '';
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        event.target.value = '';
        return;
    }
    
    // Show loading state
    const uploadButton = event.target;
    uploadButton.disabled = true;
    uploadButton.classList.add('uploading');
    
    const storageRef = storage.ref('images/' + file.name);
    try {
        await storageRef.put(file);
        const url = await storageRef.getDownloadURL();
        
        // Optional: prompt for a caption
        const caption = prompt("Add a caption for this image (optional):", "");
        
        // Add to Firestore - the listener will add it to the DOM
        await db.collection('scrapbookItems').add({ 
            type: 'image', 
            content: url,
            caption: caption || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: await getUserEmail() || 'unknown'
        });
        
    } catch (error) {
        console.error("Error uploading image: ", error);
        alert(`Error uploading image: ${error.message}`);
    } finally {
        // Reset upload button state
        uploadButton.disabled = false;
        uploadButton.classList.remove('uploading');
        uploadButton.value = '';
    }
}

async function saveText() {
    const text = document.getElementById('textInput').value.trim();
    
    if (!text) {
        alert('Please enter some text before saving.');
        return;
    }
    
    try {
        await db.collection('scrapbookItems').add({ 
            type: 'text', 
            content: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: await getUserEmail() || 'unknown'
        });
        
        // Close the modal
        closeTextModal();
        
    } catch (error) {
        console.error("Error adding text: ", error);
        alert(`Error adding text: ${error.message}`);
    }
}

async function deleteItem(itemId, itemData) {
    try {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }
        
        // If it's an image stored in Firebase Storage, delete the file too
        if (itemData.type === 'image' && itemData.content && itemData.content.includes('firebasestorage')) {
            try {
                // Extract the path from the URL
                const url = new URL(itemData.content);
                const pathMatch = url.pathname.match(/\/o\/([^?]+)/);
                
if (pathMatch && pathMatch[1]) {
                    const path = decodeURIComponent(pathMatch[1]);
                    const fileRef = storage.ref(path);
                    await fileRef.delete();
                }
            } catch (storageError) {
                console.error("Error deleting the file from storage:", storageError);
                // Continue with Firestore deletion even if Storage deletion fails
            }
        }
        
        // Delete the item from Firestore
        await db.collection('scrapbookItems').doc(itemId).delete();
        
    } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete: " + error.message);
    }
}

// Helper function to get user email (works for both direct and anonymous auth)
async function getUserEmail() {
    if (auth.currentUser) {
        if (auth.currentUser.email) {
            return auth.currentUser.email;
        } else {
            // For anonymous users, get the email from our users collection
            try {
                const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
                if (userDoc.exists) {
                    return userDoc.data().email;
                }
            } catch (error) {
                console.error("Error getting user email:", error);
            }
        }
    }
    return null;
}

// Email verification code system
async function requestVerificationCode() {
    const email = document.getElementById('email').value.trim();
    const emailStatus = document.getElementById('emailStatus');
    
    if (!email) {
        emailStatus.textContent = 'Please enter an email address';
        emailStatus.className = 'status error';
        return;
    }
    
    if (!isValidEmail(email)) {
        emailStatus.textContent = 'Please enter a valid email address';
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

// Simple email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function verifyCode() {
    const enteredCode = document.getElementById('verificationCode').value.trim();
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
            
            // Load user preferences after successful login
            await loadUserPreferences();
            
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
                
                // Show editor-only elements
                document.body.classList.add('editor-mode');
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
        
        // Hide editor-only elements
        document.body.classList.remove('editor-mode');
        
        // Reset to default layout and theme
        document.getElementById('layoutSelector').value = 'layout-2';
        document.getElementById('colorScheme').value = 'default';
        
        const pagesContainer = document.getElementById('pages');
        pagesContainer.classList.remove('layout-1', 'layout-3', 'layout-4');
        pagesContainer.classList.add('layout-2');
        
        document.body.classList.remove('theme-blue', 'theme-dark', 'theme-earth');
        
        alert('You have been signed out successfully.');
    } catch (error) {
        console.error("Error signing out: ", error);
        alert(error.message);
    }
}
