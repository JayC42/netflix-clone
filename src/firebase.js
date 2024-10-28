// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBfU2QFa_G7hzNa247l0QA6wUJS-t4m-nw",
    authDomain: "netflix-clone-f11f5.firebaseapp.com",
    projectId: "netflix-clone-f11f5",
    storageBucket: "netflix-clone-f11f5.appspot.com",
    messagingSenderId: "368325365686",
    appId: "1:368325365686:web:9ad4f3efd90b143729bb17"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User Sign up function
const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
      toast.success("New account successfully created.");
      toast.success("Welcome " + name + "!");
      return { success: true, message: "Account created successfully!"};
    } catch (error) {
      let errorMessage = "An error occurred during signup. Please retry";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak.";
      }
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }
  

// User Sign in function
const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      return { success: true, message: "Logged in successfully!" };
    } catch (error) {
      let errorMessage = "An error occurred during login. Please retry";
      if (error.code.includes('auth/')) {
        errorMessage = "Incorrect email or password. Please try again.";
      }
      toast.error(errorMessage);
      console.error("Login error:", error.code, error.message);
      return { success: false, message: errorMessage };
    }
}
// User sign out function
const logout = () => {
  signOut(auth);
}

export {auth, db, signup, login, logout};