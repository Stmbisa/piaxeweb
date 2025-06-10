interface TestimonialProps {
  quote: string
  author: string
  role: string
  company: string
}

function Testimonial({ quote, author, role, company }: TestimonialProps) {
  return (
    <div className="glass-card">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 sm:h-5 sm:w-5 text-primary"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <blockquote className="text-sm sm:text-base lg:text-lg leading-relaxed">"{quote}"</blockquote>
        <div className="mt-auto">
          <p className="font-medium text-sm sm:text-base">{author}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="py-10 sm:py-16 bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-glass-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-glass-float-delayed"></div>

      <div className="container relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-glass-appear">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-4">Trusted by businesses worldwide</h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about our payment solutions
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Testimonial
            quote="This payment system has transformed how we handle transactions in our market. The escrow feature has built trust with our customers."
            author="Jean Claude"
            role="Owner"
            company="Pizuli"
          />
          <Testimonial
            quote="The API integration was seamless. We've seen a 40% increase in successful transactions since implementing this solution."
            author="Mukasa Saidi"
            role="CTO"
            company="Jetslab"
          />
          <Testimonial
            quote="As a consumer, I feel secure knowing my payments are protected. The mobile app is intuitive and makes tracking my finances easy."
            author="David Osei"
            role="Customer"
            company="Regular User"
          />
        </div>
      </div>
    </section>
  )
}
