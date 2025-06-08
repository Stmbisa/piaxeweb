import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

interface TargetSectionProps {
  id: string
  title: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
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
  imageSrc,
  imageAlt,
  imageRight = false,
}: TargetSectionProps) {
  return (
    <section id={id} className="py-10">
      <div
        className={cn("grid gap-8 items-center", imageRight ? "lg:grid-cols-[1fr,1.2fr]" : "lg:grid-cols-[1.2fr,1fr]")}
      >
        <div className={cn("space-y-6", imageRight && "lg:order-2")}>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <a href={buttonLink}>{buttonText}</a>
            </Button>
          </div>
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
