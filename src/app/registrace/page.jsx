import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import RegisterForm from "./RegisterForm";

export default function RegistracePage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col px-4 py-12">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}
