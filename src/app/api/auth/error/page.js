"use client";
import { Card, Button } from 'react-bootstrap';
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap"; // Importing necessary components

export default function AuthErrorPage({ searchParams }) {
  const error = searchParams?.error || "Default";

  const errorMessage = {
    Configuration: "Configuration error. Please check your settings.",
    AccessDenied: "Access denied. Please check your credentials.",
    Verification: "Verification error. Try logging in again.",
    OAuthSignin: "Error in OAuth sign-in process.",
    OAuthCallback: "OAuth callback failed. Ensure correct client ID and redirect URI.",
    OAuthCreateAccount: "Error creating an account during OAuth.",
    EmailCreateAccount: "Error creating an account with email.",
    Callback: "Callback error. Check your settings.",
    Default: "An unknown error occurred.",
  };

  return (

    <div className="container container-fluid">
      <div className="row mt-5 d-flex justify-content-center">
        <div className="col-10 col-lg-5">
        <div className='border rounded p-4'>
            <div className='justify-content-center align-items-center'>
            <h1 className="mb-4">Authentication Error</h1>
              <p>{errorMessage[error] || errorMessage.Default}</p>
              <Link href="/login" passHref legacyBehavior>
                <button className='donbutton'>
                  Return to Login
                </button>
              </Link>
            </div>
           
           </div>
        </div>
      </div> 
    </div>

  );
}
