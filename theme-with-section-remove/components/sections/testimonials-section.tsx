import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"

interface TestimonialsSectionProps {
  data: {
    items: Array<{
      quote: string
      author: string
      company?: string
    }>
  }
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-3xl lg:text-4xl text-slate-900 mb-4">What Our Clients Say</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.items.map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-emerald-600 mb-4" />
                <blockquote className="text-lg text-slate-700 mb-4 italic">
                  "
                  <EditableText
                    path={`sections.testimonials.items.${index}.quote`}
                    value={testimonial.quote}
                  />
                  "
                </blockquote>
                <div className="text-sm">
                  <div className="font-semibold text-slate-900">
                    <EditableText
                      path={`sections.testimonials.items.${index}.author`}
                      value={testimonial.author}
                    />
                  </div>
                  {testimonial.company && (
                    <div className="text-slate-600">
                      <EditableText
                        path={`sections.testimonials.items.${index}.company`}
                        value={testimonial.company}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
