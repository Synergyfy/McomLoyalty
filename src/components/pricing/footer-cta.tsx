"use client"

import { Reveal } from "@/components/ui/reveal"

export default function FooterCTA() {
  return (
    <section className="bg-gradient-to-b from-background to-background/50 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal animationClass="text-reveal" delayMs={60}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">Have Questions?</h2>
        </Reveal>
        <Reveal animationClass="text-reveal" delayMs={140}>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto text-balance mb-8">
            Want to know more about our plans or have a specific question? Get in touch with our team.
          </p>
        </Reveal>
        <div className="space-y-4">
          <p className="text-xl text-foreground">
            <strong>Email:</strong> <a href="mailto:contact@mcom.com" className="text-primary hover:underline">contact@mcom.com</a>
          </p>
          <p className="text-xl text-foreground">
            <strong>Phone:</strong> <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-890</a>
          </p>
        </div>
      </div>
    </section>
  )
}
