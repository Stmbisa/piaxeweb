import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { ReactNode } from "react"

interface TargetSectionProps {
  id: string
  title: string
  description: string
  features: string[]
  buttonText?: string
  buttonLink?: string
  buttons?: Array<{
    text: string
    link: string
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    external?: boolean
  }>
  imageSrc?: string
  imageAlt?: string
  imageRight?: boolean
  visual?: ReactNode
}

export function TargetSection({
  id,
  title,
  description,
  features,
  buttonText,
  buttonLink,
  buttons,
  imageSrc,
  imageAlt,
  imageRight = false,
  visual,
}: TargetSectionProps) {
  // Use either the new buttons array or the legacy single button
  const buttonsToRender = buttons || (buttonText && buttonLink ? [{ text: buttonText, link: buttonLink }] : [])

  return (
    <section id={id} className="py-4 sm:py-10">
      <div
        className={cn("grid gap-3 sm:gap-8 items-center", imageRight ? "lg:grid-cols-[1fr,1.2fr]" : "lg:grid-cols-[1.2fr,1fr]")}
      >
        <div className={cn("space-y-3 sm:space-y-6", imageRight && "lg:order-2")}>
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <ul className="space-y-1.5 sm:space-y-3">
            {features.map((feature, index) => (
              <li key={feature} className="flex items-start gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0 animate-pulse" />
                <span className="text-xs sm:text-base text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          {buttonsToRender.length > 0 && (
            <div className="pt-2 sm:pt-4 flex flex-wrap gap-2 sm:gap-3">
              {buttonsToRender.map((button, index) => {
                const isDownloadApp = button.text === "Download App";
                const isStartSelling = button.text === "Start Selling" || button.text === "Start Social Selling";
                
                let buttonClass = "rounded-full px-4 sm:px-8 text-xs sm:text-sm font-medium shadow-lg hover:scale-105 transition-all duration-300";
                
                if (isDownloadApp || isStartSelling) {
                  buttonClass = `glass-button-primary ${buttonClass}`;
                } else {
                  buttonClass = `glass-button-secondary ${buttonClass}`;
                }
                
                const finalLink = isDownloadApp ? "#mobile-preview" : button.link;
                
                return (
                  <a
                    key={index}
                    href={finalLink}
                    className={buttonClass}
                    {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {button.text}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div className={cn("aspect-video bg-muted rounded-2xl overflow-hidden relative", imageRight ? "lg:order-1" : "")}>
          {visual ? (
            visual
          ) : (
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={imageAlt || "Section image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </div>
    </section>
  )
}
