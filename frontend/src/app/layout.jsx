import './globals.css';

export const metadata = {
  title: 'SupportPulse AI - Intelligent Customer Support Ticketing System',
  description: 'AI-powered ticket routing, SLA tracking, agent performance dashboards, and customer satisfaction analytics.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
