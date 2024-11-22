"use client"
import Link from "next/link";
import React from "react";
import { PiLockKeyThin, PiLockKeyOpenThin, PiUserCircleThin } from "react-icons/pi";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Header = () => {
  const { data } = useSession();


  const router = useRouter();

  const handleLogout = () => {
    signOut();
    toast.success("You have logged out successfully!"); 
    router.push('/login');
  };

  const handleClick = () => {
    router.push('/login'); 
    
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container cont">
        <div className="col-3 p-0">
          <span className="navbar-brand" style={{ marginLeft: "20px", color:'#FFF', cursor:'pointer' }}>
          <b>eVega!</b>
          </span>
        </div>


        <div style={{ border: "3px solid #27b9ec", borderRadius: "22px", backgroundColor: "#27b9ec" }} className="admin_btn">
          {data?.user ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="d-flex justify-content-center align-items-center" style={{color:'#FFF'}}>
                <img style={{borderRadius:'50%', border:'1px solid #FFF'}}
                  src={data?.user?.image}
                  height="32"
                  width="32"
                  alt="user image"
                />&nbsp;
                Hi, {data?.user?.name}&nbsp;
              </div>
              <button style={{padding:'10px 12px'}} className="d-flex justify-content-center align-items-center admin_button" onClick={handleLogout}>
              <PiLockKeyThin />&nbsp;
                Logout
              </button>
            </div>
          ) : (
           
              <button onClick={handleClick} style={{padding:'10px 12px'}} className="d-flex justify-content-center align-items-center admin_button">  
                 <PiLockKeyOpenThin />&nbsp;
                Login
              </button>
        
          )} 
        </div>
      </div>
    </nav>
  );
};

export default Header;