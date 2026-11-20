import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId || clientId === 'your_google_oauth_web_client_id') {
    return (
      <div>
        <button
          type="button"
          disabled
          className="w-full rounded-xl border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-neutral-500 disabled:cursor-not-allowed"
        >
          Continue with Google
        </button>
        <p className="mt-2 text-center text-xs text-white/40">
          Google sign-in is unavailable until it is configured.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={(response) => {
            if (!response.credential) {
              onError('Google sign-in did not return a credential. Please try again.');
              return;
            }
            onSuccess(response.credential);
          }}
          onError={() => onError('Google sign-in failed. Please try again.')}
          text="continue_with"
          shape="rectangular"
          theme="outline"
          width="340"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleSignInButton;
