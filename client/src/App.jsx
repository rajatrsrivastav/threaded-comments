import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CommentList from './components/ThreadFeed'
function App() {
  const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <main className="min-h-dvh bg-gradient-to-b from-slate-50 to-white text-slate-900">
          <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Threaded Comment System
            </h1>
            <p className="text-sm text-neutral-600">
              A clean, modern take on nested conversations.
            </p>
            <div className="mt-6">
              <CommentList />
            </div>
          </div>
        </main>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
