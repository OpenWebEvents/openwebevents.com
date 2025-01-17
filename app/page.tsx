"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Turnstile {
  render: (container: string | HTMLElement, options: object) => string;
  reset: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile: Turnstile;
  }
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = document.querySelector<HTMLInputElement>(
        '[name="cf-turnstile-response"]'
      )?.value;

      if (!token) {
        throw new Error("Please complete the challenge");
      }

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setEmail("");
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to subscribe. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      // Reset Turnstile
      window.turnstile?.reset();
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-12 py-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          Open Web Events
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Fostering a vibrant community centred around open-source initiatives
          and the open web.
        </p>
        <Button asChild>
          <Link href="#about">Learn More</Link>
        </Button>
      </section>

      <section id="about" className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">About Us</h2>
        <p>
          Open Web Events and the Open Web Conference are dedicated to bringing
          together enthusiasts, developers, designers, and thought leaders to
          collaborate, share knowledge, and drive the future of open-source
          technologies.
        </p>
        <h3 className="text-2xl font-semibold">Open Web Events</h3>
        <p>
          Open Web Events serves as a hub for meetups, workshops, and networking
          opportunities focused on open-source and open web topics. Our events
          are inclusive, and open to all, providing a platform for individuals
          to engage with the community, learn from experts, and contribute to
          the open-source ecosystem.
        </p>
        <h3 className="text-2xl font-semibold">Open Web Conference</h3>
        <p>
          Open Web Conference is our flagship annual event, bringing together a
          diverse group of speakers and attendees to discuss the latest trends,
          challenges, and innovations in the open-source world. The conference
          features keynote presentations, panel discussions, and hands-on
          workshops designed to inspire and empower participants to advance the
          open web.
        </p>
      </section>

      <section className="space-y-4 max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center">Stay Updated</h2>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex justify-center">
            <div
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              data-theme="auto"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Connect With Us</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link
              href="https://x.com/OpenWebEvents"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link
              href="https://www.linkedin.com/company/openwebevents"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link
              href="https://github.com/danmaby/OpenWebEvents"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
        </div>
      </section>

      <section className="text-center space-y-2 text-sm text-muted-foreground">
        <Link href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
        <span> | </span>
        <Link href="/code-of-conduct" className="hover:underline">
          Code of Conduct
        </Link>
      </section>
    </div>
  );
}
