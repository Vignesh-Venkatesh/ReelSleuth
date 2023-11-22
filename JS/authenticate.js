import {createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

import {auth} from './firebaseConfig.js';

// ========================================================
// Login / Sign Up form 
const loginForm = document.getElementById("login-form")
const signUpForm = document.getElementById("signup-form")
// ========================================================

// ========================================================
// Login Form buttons
const loginFormLoginBtn = document.getElementById("login-form-login")
const loginFormSignUpBtn = document.getElementById("login-form-signUp")
// ========================================================


// ========================================================
// Sign Up form Buttons
const signUpFormSignUpBtn = document.getElementById("signup-form-signUp")
const signUpFormLoginBtn = document.getElementById("signup-form-login")
// ========================================================

// ========================================================
// Login form error messages
const loginFormError = document.getElementById("login-form-error")
// ========================================================

// ========================================================
// Sign Up form error messages
const signUpFormError = document.getElementById("signup-form-error")
// ========================================================

// ========================================================
// Login Form Inputs
const userLoginInput = document.getElementById('login-user')
const passLoginInput = document.getElementById('login-pass')
// ========================================================

// ========================================================
// Sign Up form Inputs
const userSignUpInput = document.getElementById('signup-user')
const passSignUpInput = document.getElementById('signup-pass')
// ========================================================

// ========================================================
// Detecting changes in the input of the login form
userLoginInput.addEventListener("change", () => {
    loginFormError.style.display = "none"
})
userLoginInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        login();
    }
});

passLoginInput.addEventListener("change", () => {
    loginFormError.style.display = "none"
})
passLoginInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        login();
    }
});
// ========================================================

// ========================================================
// Detecting changes in the input of the sign up form
userSignUpInput.addEventListener("change", () => {
    signUpFormError.style.display = "none"
})
userSignUpInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        signUp();
    }
});

passSignUpInput.addEventListener("change", () => {
    signUpFormError.style.display = "none"
})
passSignUpInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        signUp();
    }
});
// ========================================================

// ========================================================
// Switching to sign up form, if sign up button in login form is clicked
loginFormSignUpBtn.addEventListener("click", () => {
    loginForm.style.display = "none"
    signUpForm.style.display = "flex"
})
// ========================================================

// ========================================================
// Switching to login form, if login button in sign up is clicked
signUpFormLoginBtn.addEventListener("click", () => {
    signUpForm.style.display = "none"
    loginForm.style.display = "flex"
})
// ========================================================


// ========================================================
// if login button is clicked in the login form
loginFormLoginBtn.addEventListener("click", () => {
    login()
})
// ========================================================

// ========================================================
// if signup button is clicked in the signup form
signUpFormSignUpBtn.addEventListener("click", () => {
    signUp()
})
// ========================================================


// ========================================================
// Login the user
function login(){
    const email = userLoginInput.value;
    const password = passLoginInput.value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Handle successful login
        if (userCredential.user.emailVerified){
            localStorage.clear();
            window.location.href = "./index.html"
        }

        else {
            loginFormError.innerHTML = "Please verify your email address before logging in"
            loginFormError.style.display = "flex"
        }
        
    })
    .catch((error) => {
        console.log(error)
        const errorCode = error.code.split('/')[1];
        loginFormError.innerHTML = errorCode;
        loginFormError.style.display = "flex";
    });
}
// ========================================================


// ========================================================
// Sign Up the user

async function signUp() {
    try {
        const email = userSignUpInput.value;
        const password = passSignUpInput.value;

        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Send email verification
        await sendEmailVerification(userCredential.user);

        const verify_email = document.getElementById("verify-email");
        verify_email.style.display = "flex";

        const block = document.getElementById("blocker");
        block.style.display = "flex";

    } catch (error) {

        if (error) {
            console.log(error)
            const errorCode = error.code.split('/')[1];
            signUpFormError.innerHTML = errorCode;
            signUpFormError.style.display = "flex";
        }
    }
}


// ========================================================



