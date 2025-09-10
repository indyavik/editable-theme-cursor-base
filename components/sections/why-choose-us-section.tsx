import { CheckCircle } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"

interface WhyChooseUsSectionProps {
  data: {
    bullets: string[]
  }
}

export function WhyChooseUsSection({ data }: WhyChooseUsSectionProps) {
  return (
    <section className="py-16 bg-emerald-600">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-3xl lg:text-4xl text-white mb-4">Why Choose Summit Books?</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.bullets.map((bullet, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-200 mt-1 flex-shrink-0" />
              <span className="text-lg text-white">
                <EditableText
                  path={`sections.whyChooseUs.bullets.${index}`}
                  value={bullet}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
