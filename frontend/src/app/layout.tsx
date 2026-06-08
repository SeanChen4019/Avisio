import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "Avisio - AI 智能图表编辑器",
  description: "用思维画图，让 AI 帮你构建 | 开发者: Sean Chen",
  icons: { icon: "/logo1.png" },
  other: {
    "google": "notranslate",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" translate="no">
      <body className="translate-no">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
