interface TestimonialProps {
  quote: string
  author: string
  role: string
  company: string
}

function Testimonial({ quote, author, role, company }: TestimonialProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-primary"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <blockquote className="text-lg">"{quote}"</blockquote>
        <div className="mt-auto">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Trusted by businesses worldwide</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about our payment solutions
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
