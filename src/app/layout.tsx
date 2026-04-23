import { MarkupSyncer } from "@/components/MarkupSyncer";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ServiceWorkerNavigationListener } from "@/components/ServiceWorkerNavigationListener";
import { NetworkStatusBanner } from "@/components/layout/network-status-banner";
import { WhatsAppWidget } from "@/components/layout/whatsapp-widget";
import { SoftLockScreen } from "@/components/pwa/SoftLockScreen";
// import { HealthMonitor } from "@/components/HealthMonitor";
import { AuthProvider } from "@/context/AuthContext";
import { SoftLockProvider } from "@/context/SoftLockContext";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Amsy - Premium Data & Airtime Services",
    template: "%s | Amsy",
  },
  description:
    "Buy cheap data bundles, airtime, and pay bills instantly with Amsy. Premium data and airtime services with instant delivery and best prices.",
  keywords: [
    "cheap data",
    "buy airtime",
    "data bundle",
    "mtn data",
    "glo data",
    "airtel data",
    "9mobile data",
    "cheap airtime nigeria",
    "data reseller",
    "bill payment",
    "amsy",
  ],
  authors: [{ name: "Amsy" }],
  creator: "Amsy",
  publisher: "Amsy",
  metadataBase: new URL("https://amsydatasub.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://amsydatasub.com",
    siteName: "Amsy",
    title: "Amsy - Premium Data & Airtime Services",
    description:
      "Buy cheap data bundles, airtime, and pay bills instantly. Premium data and airtime services.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Amsy - Premium Data & Airtime Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amsy - Premium Data & Airtime Services",
    description: "Buy cheap data bundles, airtime, and pay bills instantly.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Amsy",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Amsy",
    "theme-color": "#25b4d2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Dynamic theme-color based on system preference */}
        <meta
          name="theme-color"
          content="#25b4d2"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#09090b"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Amsy" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <SoftLockProvider>
                {/* <HealthMonitor> */}
                <div data-app-root>
                  <NetworkStatusBanner />
                  <MarkupSyncer />
                  <ServiceWorkerNavigationListener />
                  <PWAInstallPrompt />
                  {/* <FcmSyncer /> */}
                  <Toaster richColors position="top-right" />
                  <SoftLockScreen />
                  {children}
                  <WhatsAppWidget />
                </div>
                {/* </HealthMonitor> */}
              </SoftLockProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
