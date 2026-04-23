import { Footer } from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Amsy",
  description: "Get in touch with Amsy for support, inquiries, and assistance.",
};

export default function ContactPage() {
  const contactOptions = [
    {
      icon: MessageCircle,
      title: "WhatsApp Chat",
      description: "Fastest response via WhatsApp",
      action: "Start Chat",
      href: "https://wa.me/2349000000000",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@amsydatasub.com",
      action: "Send Email",
      href: "mailto:support@amsydatasub.com",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Available 9AM - 6PM",
      action: "Call Now",
      href: "tel:+2349000000000",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Contact Support
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              We&apos;re here to help you with any questions or issues. Choose
              your preferred way to reach out.
            </p>
          </div>

          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {contactOptions.map((option) => (
              <Card
                key={option.title}
                className="flex h-full flex-col transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div
                    className={`mb-4 w-fit rounded-full p-3 ${option.color}`}
                  >
                    <option.icon className="size-6" />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={option.href}
                      target={
                        option.href.startsWith("http") ? "_blank" : undefined
                      }
                    >
                      {option.action}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="rounded-full bg-white/20 p-6">
                  <Headphones className="size-16" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="mb-2 text-2xl font-bold">
                    Need immediate help?
                  </h2>
                  <p className="text-primary-foreground/90 mb-6">
                    Check our Frequently Asked Questions for quick answers to
                    common issues.
                  </p>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/#faq">View FAQs</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
