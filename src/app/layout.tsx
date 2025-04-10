import "../app/globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper"; // นำเข้า wrapper

export const metadata = {
  title: "My Website",
  description: "This is my awesome website using Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}