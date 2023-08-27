import { auth, googleProvider } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth'
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../components/auth.css";
import { FcGoogle } from 'react-icons/fc';

export const Auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try {
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);
          if (signInMethods.length > 0) {
            // Email address already in use
            // Perform login instead of creating a new account
            await signInWithEmailAndPassword(auth, email, password);
          } else {
            // Email address not in use, create a new account
            await createUserWithEmailAndPassword(auth, email, password);
          }
          navigate("/daily_challenge");
        } catch (err) {
          console.error(err);
        }
      };
   

    const signInWithGoogle = async () => {
      await signInWithPopup(auth, googleProvider);
      navigate("/daily_challenge");
    };

    return (
    <div class="mainDivTwo">
        <p className="headingAuth">Log in or create an account</p>
        <p class="headingSmaller">Email Address</p>
        <input
            class="inputBox"
            placeholder=""
            onChange={(e) =>  setEmail(e.target.value)}
        /> 

        <p class="headingSmaller">Password</p>
        <input 
            class="inputBox"
            placeholder=""
            type="password"
            onChange={(e) => setPassword(e.target.value)}
        />
        <button class="signInBtn" onClick={signIn}> Sign In </button>

        <p> or </p>

        <p class="warning">By continuing, you agree to the updated Terms of Sale, Terms of Service, and Privacy Policy.</p>

        <button class="googleBtn" onClick={signInWithGoogle}>
            <FcGoogle size={25}/>
            <span class="CWG">Continue With Google</span>
        </button>

        {/* 
        <button onClick={logout}> Logout </button>
        */}
    </div>
    );
};