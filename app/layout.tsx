import "bootstrap/dist/css/bootstrap.min.css"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next App with Supabase"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
