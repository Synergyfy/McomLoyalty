import { Award, Medal, Trophy, Crown } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"

export default function BadgeExplanation() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Reveal animationClass="text-reveal" delayMs={60}>
          <h2 className="text-3xl font-bold mb-6 text-balance">Your Membership Badge</h2>
        </Reveal>
        <Reveal animationClass="text-reveal" delayMs={140}>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto text-balance mb-8">
            Your membership comes with a physical NFC card — scan to share your business page and rewards instantly.
            Physical NFC card included for annual members.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {[
          { icon: Award, name: "Bronze", desc: "Entry-level visibility" },
          { icon: Medal, name: "Silver", desc: "Growing reach" },
          { icon: Trophy, name: "Gold", desc: "Established presence" },
          { icon: Crown, name: "Platinum", desc: "Premium brand" },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <Reveal key={item.name} animationClass="card-reveal" delayMs={idx * 100}>
              <div className="bg-card rounded-3xl p-8 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 shadow-sm border-2 border-border hover:border-primary hover:bg-primary/5">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 transition-all duration-300">
                  <Icon className="w-10 h-10 text-primary" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">{item.name}</h3>
                <p className="text-sm text-foreground/60">{item.desc}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}