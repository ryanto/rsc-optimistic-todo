import { ReactNode } from "react";
import TwofoldFramework from "@twofold/framework/twofold-framework";
import "./global.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <title>RSC Optimistic</title>
        <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
      </head>
      <body className="bg-blue-600 text-gray-50">
        <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
      </body>

      {/* This component is needed to start Twofold */}
      <TwofoldFramework />
    </html>
  );
}
