import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { auth } from "@/config/auth";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="cs">
      <body>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
