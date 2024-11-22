"use client"
import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { FacebookLoginButton, GithubLoginButton, GoogleLoginButton, LinkedInLoginButton, OktaLoginButton } from "react-social-login-buttons";
import { useRouter, useSearchParams } from "next/navigation";
import FileUpload from "../compoents/FileUpload";

const Login = () => {

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the callbackUrl from the searchParams (query parameters)
    const callbackUrl = searchParams.get('callbackUrl');

    if (callbackUrl) {
      const decodedUrl = decodeURIComponent(callbackUrl);
      console.log('Decoded Callback URL:', decodedUrl);
    }
  }, [searchParams]); // This will rerun when searchParams change



  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading state
  }

  if (session) {
    router.push("/dashboard");
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await signIn("credentials", {
        redirect: false,
        email, // Ensure you have defined the email state
        password, // Ensure you have defined the password state
      });

      if (data?.error) {
        console.error(data.error);
      } else {

        console.log("login sucess")
        router.push("/dashboard")
 
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container container-fluid">
      <div className="row mt-5 d-flex justify-content-center">
        <div className="col-10 col-lg-5 ">
          <form
            className="border  rounded p-4"
            onSubmit={submitHandler}
          >
            <center>
            <h1 className="mb-4">Sign</h1>
            </center>
            <hr/>
            <div className="text-center">
              <p>Sign in with</p>
              <GoogleLoginButton onClick={() => signIn("google", { callbackUrl: "/dashboard" })} />
              <GithubLoginButton onClick={() => signIn("github", { callbackUrl: "/dashboard" })} />
              <LinkedInLoginButton onClick={() => signIn("linkedin", { callbackUrl: "/dashboard" })} />
              <OktaLoginButton  icon={'1px'} onClick={() => signIn("orcid", { callbackUrl: "/dashboard" })}><span style={{backgroundColor:'#a5ce39', color:'#FFF', padding:'5px 8px', borderRadius:'50px', marginLeft:'-40px'}}>iD</span>
             &nbsp; <span>Log in with <span style={{color:'#aaabaf'}}>ORC</span><span style={{color:'#a5ce39'}}>iD</span></span>
               </OktaLoginButton>
            </div>
          </form>
        </div>
      </div>
      
    </div> 
  );
};

export default Login;