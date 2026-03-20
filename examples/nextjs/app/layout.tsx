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
      <head>
        <style dangerouslySetInnerHTML={{ __html: 'body{opacity:0}body.ready{opacity:1;transition:opacity .15s}' }} />
      </head>
      <body>
        <DataChart />
        {children}
      </body>
    </html>
  );
}
