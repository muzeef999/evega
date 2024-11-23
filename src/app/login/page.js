'use client';

import React, { useEffect, useState, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { FacebookLoginButton, GithubLoginButton, GoogleLoginButton, LinkedInLoginButton, OktaLoginButton } from "react-social-login-buttons";
import { useRouter, useSearchParams } from "next/navigation";

import dynamic from "next/dynamic";
import Loading from "../compoents/Loading";

// This is a client-side only component
const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize the state for callback URL
  const [callbackUrl, setCallbackUrl] = useState(null);

  useEffect(() => {
    const url = searchParams.get('callbackUrl');
    if (url) {
      const decodedUrl = decodeURIComponent(url);
      setCallbackUrl(decodedUrl);
      console.log('Decoded Callback URL:', decodedUrl);
    }
  }, [searchParams]); // Run this effect when searchParams changes

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />
  }

  if (session) {
    // Redirect to the callback URL if available or default to "/dashboard"
    router.push(callbackUrl || "/dashboard");
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await signIn("credentials", {
        redirect: false,
        email, // Ensure you have defined the email state
        password, // Ensure you have defined the password state
        callbackUrl: callbackUrl || "/dashboard", // Pass the callbackUrl dynamically
      });

      if (data?.error) {
        console.error(data.error);
      } else {
        console.log("Login success");
        router.push(callbackUrl || "/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container container-fluid">
      <div className="row mt-5 d-flex justify-content-center">
        <div className="col-10 col-lg-5">
          <form className="border rounded p-4" onSubmit={submitHandler}>
            <center>
              <h1 className="mb-4">Sign</h1>
            </center>
            <hr />
            <div className="text-center">
              <p>Sign in with</p>
              <GoogleLoginButton onClick={() => signIn("google", { callbackUrl: callbackUrl || "/dashboard" })} />
              <GithubLoginButton onClick={() => signIn("github", { callbackUrl: callbackUrl || "/dashboard" })} />
              <LinkedInLoginButton onClick={() => signIn("linkedin", { callbackUrl: callbackUrl || "/dashboard" })} />
              <OktaLoginButton icon={'1px'} onClick={() => signIn("orcid", { callbackUrl: callbackUrl || "/dashboard" })}>
                <span style={{backgroundColor:'#a5ce39', color:'#FFF', padding:'5px 8px', borderRadius:'50px', marginLeft:'-40px'}}>iD</span>
                &nbsp; <span>Log in with <span style={{color:'#aaabaf'}}>ORC</span><span style={{color:'#a5ce39'}}>iD</span></span>
              </OktaLoginButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Dynamic import with no SSR (client-side only)
export default dynamic(() => Promise.resolve(Login), { ssr: false });
