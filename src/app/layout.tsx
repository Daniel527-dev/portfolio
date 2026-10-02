import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio and blog",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
