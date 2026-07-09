// import Navbar from "../components/layout/Navbar";
// import Hero from "../components/sections/Hero";
// import Stats from "../components/sections/Stats";
// import Features from "../components/sections/Features";

// function Home() {
//   return (
//     <>
//       <Navbar />
//       <Hero />
//       <Stats />
//       <Features />
//     </>
//   );
// }

// export default Home;

import { useEffect, useState } from "react";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold text-cyan-400">
        {message}
      </h1>
    </div>
  );
}

export default Home;