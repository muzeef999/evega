"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
  LinkedInLoginButton,
  OktaLoginButton,
} from "react-social-login-buttons";
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await signIn("credentials", {
        redirect: false,
        email, // Using state variables for email
        password, // Using state variables for password
      });

      if (data?.error) {
        console.error(data.error);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading indicator
  }

  if (status === "authenticated") {
    return null; // Prevent showing the login form if authenticated
  }

  return (
    <div className="container container-fluid">
      <div className="row mt-5 d-flex justify-content-center">
        <div className="col-10 col-lg-5">
          <form className="border rounded p-4" onSubmit={submitHandler}>
            <center>
              <h1 className="mb-4">Sign In</h1>
            </center>
            <hr />
            
            <div className="text-center mt-3">
              <p>Or sign in with</p>
              <GoogleLoginButton onClick={() => signIn("google")} />
              <GithubLoginButton onClick={() => signIn("github")} />
              <LinkedInLoginButton onClick={() => signIn("linkedin")} />
              <OktaLoginButton  icon={'1px'} onClick={() => signIn("orcid")}>
                <span>
                  Log in with ORC<span style={{ color: "#a5ce39" }}>iD</span>
                </span>
              </OktaLoginButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
