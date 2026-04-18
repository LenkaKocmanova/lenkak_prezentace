import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { loadPiskvorkyState } from "@/actions/piskvorkyMatice";
import PiskvorkyGame from "./PiskvorkyGame";

export default async function PiskvorkyPage() {
  const { loggedIn, grid } = await loadPiskvorkyState();

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <PiskvorkyGame loggedIn={loggedIn} serverGrid={grid} />
      <Footer />
    </div>
  );
}
