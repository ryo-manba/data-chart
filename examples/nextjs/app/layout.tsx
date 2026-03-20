import type { Metadata } from "next";
import DataChart from './DataChart';

export const metadata: Metadata = {
  title: "Next.js + data-chart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DataChart />
        {children}
      </body>
    </html>
  );
}
