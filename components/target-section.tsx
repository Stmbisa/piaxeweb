import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

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
  imageSrc: string
  imageAlt: string
  imageRight?: boolean
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
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 sm:gap-3">
                <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-base text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          {buttonsToRender.length > 0 && (
            <div className="pt-2 sm:pt-4 flex flex-wrap gap-2 sm:gap-3">
              {buttonsToRender.map((button, index) => (
                <Button
                  key={index}
                  asChild
                  size="sm"
                  variant={button.variant || "default"}
                  className="rounded-full px-4 sm:px-8 text-xs sm:text-sm"
                >
                  {button.external ? (
                    <a href={button.link} target="_blank" rel="noopener noreferrer">
                      {button.text}
                    </a>
                  ) : (
                    <a href={button.link}>{button.text}</a>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className={cn("aspect-video bg-muted rounded-2xl overflow-hidden", imageRight ? "lg:order-1" : "")}>
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
