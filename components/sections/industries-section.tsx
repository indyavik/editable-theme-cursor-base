import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"

interface IndustriesSectionProps {
  data: {
    items: string[]
  }
}

export function IndustriesSection({ data }: IndustriesSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-sans font-bold text-3xl lg:text-4xl text-slate-900 mb-4">Industries We Serve</h2>
          <p className="text-lg text-slate-600">Specialized expertise across diverse business sectors</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {data.items.map((industry, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 px-4 py-2 text-base font-medium"
            >
              <EditableText
                path={`sections.industriesServed.items.${index}`}
                value={industry}
              />
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
