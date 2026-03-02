import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DASTA — ბიზნესის მართვის პლატფორმა",
  description: "სრული პროგრამული უზრუნველყოფა ქართული ბიზნესისთვის: POS, საწყობი, ბუღალტერია და RS.GE ინტეგრაცია.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
