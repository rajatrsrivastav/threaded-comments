import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { getUser, signOut, handleGoogleLogin } from "../auth";

export default function AuthBar() {
  const [user, setUser] = useState(getUser());
  
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white grid place-content-center text-sm font-semibold">
          {user.displayName[0]?.toUpperCase()}
        </div>
        <span className="text-sm text-neutral-700">{user.displayName}</span>
        <button
          onClick={() => {
            signOut();
            setUser(null);
          }}
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={async (response) => {
        try {
          if (response.credential) {
            const decoded = jwtDecode(response.credential);
            console.log('Decoded Google user:', decoded);
            
            const user = await handleGoogleLogin(decoded);
            setUser(user);
          }
        } catch (error) {
          console.error('Login failed:', error);
          alert('Login failed. Please try again.');
        }
      }}
      onError={() => {
        console.error('Login Failed');
        alert('Login failed. Please try again.');
      }}
    />
  );
}
