import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Ecom Operating System",
  description: "Your entire ecommerce operation. One clear picture.",
};

// Applies the saved theme/accent before paint to avoid a flash of the wrong theme.
const noFlash = `(function(){try{
  var t=localStorage.getItem('eos-theme');
  if(t==='dark'){document.documentElement.classList.add('dark');}
  var a=localStorage.getItem('eos-accent');
  if(a){var h=a.replace('#','');var r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    var trip=r+' '+g+' '+b;
    document.documentElement.style.setProperty('--brand',trip);
    document.documentElement.style.setProperty('--brand-soft',trip);}
}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
