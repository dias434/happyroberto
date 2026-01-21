import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "ROBERTO CARLOS - 50 ANOS!",
  description: "RSVP do aniversário do Roberto"
};

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
