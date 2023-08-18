import { auth, googleProvider } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../components/auth.css";
import { FcGoogle } from 'react-icons/fc';

export const Auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try{
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/daily_challenge");
        } catch(err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try{
        await signInWithPopup(auth, googleProvider);
        navigate("/daily_challenge");
        } catch(err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try{
        await signOut(auth)
        } catch(err) {
            console.error(err);
        }
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