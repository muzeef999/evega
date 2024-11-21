"use client"
import { useSession } from "next-auth/react";
import FileUpload from "../compoents/FileUpload";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading state
  }

  if (!session) {
    return <div>You are not authorized to view this page.</div>; // Optional unauthorized state
  }

  return (
    <div className="container">
      <h1>Welcome to the Dashboard</h1>
      {/* <p>You are logged in as {session.user.email}</p> */}
      <FileUpload />
    </div>
  );
};

export default Dashboard;