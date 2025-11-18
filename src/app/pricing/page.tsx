"use client"

import { useState } from "react"
import Header from "@/components/pricing/header"
import PricingCards from "@/components/pricing/pricing-cards"
import BillingToggle from "@/components/pricing/billing-toggle"
import ComparisonTable from "@/components/pricing/comparison-table"
import BadgeExplanation from "@/components/pricing/badge-explanation"
import FAQ from "@/components/pricing/faq"
import FooterCTA from "@/components/pricing/footer-cta"
import ChatbotFab from "@/components/chatbot/ChatbotFab"
import ChatbotPanel from "@/components/chatbot/ChatbotPanel"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"quarterly" | "annual">("quarterly")
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <section className="fade-in pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Header />
      </section>

      <section className="slide-up px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
      </section>

      <section id="plans" className="slide-up px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <PricingCards billingCycle={billingCycle} />
      </section>

      <section className="slide-up bg-primary/5 py-12 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <BadgeExplanation />
        </div>
      </section>

      <section className="slide-up px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <ComparisonTable />
      </section>

      <section className="slide-up px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <FAQ />
      </section>

      <section className="slide-up bg-primary/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FooterCTA />
        </div>
      </section>

      <ChatbotFab onClick={() => setIsChatbotOpen(!isChatbotOpen)} />
      <ChatbotPanel isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </main>
  )
}
