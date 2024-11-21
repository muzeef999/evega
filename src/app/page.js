"use client"
import Link from "next/link";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { FacebookLoginButton, GithubLoginButton, GoogleLoginButton, LinkedInLoginButton, OktaLoginButton } from "react-social-login-buttons";
import { useRouter } from "next/navigation";
import FileUpload from "./compoents/FileUpload";

const Home = () => {

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading state
  }

  if (session) {
    <FileUpload /> // Optional unauthorized state
  }

  const router = useRouter();

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
              <p>Or sign up with</p>
              <GoogleLoginButton onClick={() => signIn("google", { callbackUrl: "/dashboard" })} />
              <GithubLoginButton onClick={() => signIn("github", { callbackUrl: "/dashboard" })} />
              <LinkedInLoginButton onClick={() => signIn("linkedin", { callbackUrl: "/dashboard" })} />
              <OktaLoginButton  icon={'1px'} onClick={() => signIn("orcid", { callbackUrl: "/dashboard" })}>
              <span>Log in with ORCiD</span>
               </OktaLoginButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;