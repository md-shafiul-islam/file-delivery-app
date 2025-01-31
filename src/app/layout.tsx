import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Footer from "@/components/Footer";
import Chat from "@/components/Chat/Chat";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <div className="fixed right-7 bottom-7 h-10 w-10 ring-1 flex items-center justify-center bg-green-600 rounded-full cursor-pointer">
          <Chat />
        </div>
        <Footer />
      </body>
    </html>
  );
}
