import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoginForm from "./LoginForm";

export default async function LoginPage(props) {
  const searchParams = await Promise.resolve(props.searchParams);
  const registered =
    searchParams?.registered === "1" || searchParams?.registered === "true";
  const rawCallback = searchParams?.callbackUrl;
  const raw =
    typeof rawCallback === "string"
      ? rawCallback
      : Array.isArray(rawCallback)
        ? rawCallback[0]
        : "/";
  const callbackUrl =
    typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//")
      ? raw
      : "/";

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col px-4 py-12">
        <LoginForm registered={registered} callbackUrl={callbackUrl} />
      </main>
      <Footer />
    </div>
  );
}
