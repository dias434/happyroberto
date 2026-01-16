import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Roberto Carlos faz 50!",
  description: "RSVP do aniversário do Roberto"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
