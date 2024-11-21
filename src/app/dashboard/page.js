"use client"
import { useSession } from "next-auth/react";
import FileUpload from "../compoents/FileUpload";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  // const router = useRouter();
  // const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return <div>Loading...</div>; // Optional loading state
  // }

  // if (!session) {
  //   router.push("/login")
  // }

  return (
    <div className="container">
      <h1>Welcome to the Dashboard</h1>
      {/* <p>You are logged in as {session.user.email}</p> */}
      <FileUpload />
    </div>
  );
};

export default Dashboard;