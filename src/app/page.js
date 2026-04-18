import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/components/Home";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
