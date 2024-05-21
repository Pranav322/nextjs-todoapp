import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./store/AuthContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Todo App",
  description: "A simple todo app built with Next.js and Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
<AuthProvider>
        {children}
</AuthProvider> 
        </body>
    </html>
  );
}
