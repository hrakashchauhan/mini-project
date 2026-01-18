import { SignInButton, useUser } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';

export default function Landing() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <h1 className="text-5xl font-bold text-indigo-600 mb-2">FocusAI</h1>
      <p className="text-xl text-slate-600 mb-10">Real-time engagement for online classes.</p>
      
      {!isSignedIn ? (
        /* STATE 1: NOT LOGGED IN */
        <div className="p-8 bg-white rounded-xl shadow-lg border border-slate-200 text-center">
            <h2 className="text-xl font-semibold mb-6">Get Started</h2>
            <div className="flex gap-4">
                <SignInButton mode="modal" forceRedirectUrl="/teacher">
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">
                        Teacher Login
                    </button>
                </SignInButton>
                
                <SignInButton mode="modal" forceRedirectUrl="/student">
                    <button className="px-6 py-3 bg-white border-2 border-indigo-200 text-indigo-600 rounded-lg font-bold hover:border-indigo-600 transition">
                        Student Login
                    </button>
                </SignInButton>
            </div>
        </div>
      ) : (
        /* STATE 2: ALREADY LOGGED IN */
        <div className="text-center">
            <p className="text-lg text-slate-700 mb-4">Welcome back, <span className="font-bold">{user.firstName}</span>!</p>
            <div className="flex gap-4 justify-center">
                <Link to="/teacher" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold">Go to Teacher Dash</Link>
                <Link to="/student" className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold">Go to Student Lobby</Link>
            </div>
        </div>
      )}
    </div>
  );
}