import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "./navbar";
import Footer from "./footer";

const DefaultLayout = ({ children }) => {
  const bgRef = useRef();

  useEffect(() => {
    gsap.to(bgRef.current, {
      background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
      duration: 3,
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <div
      ref={bgRef}
      className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white"
    >
      <Navbar />
      <main className="flex-grow px-4 md:px-8 lg:px-16 py-10">{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
