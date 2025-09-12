import { Building2 } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"

interface IndustriesSectionProps {
  data: {
    title: string
    items: string[]
  }
}

export function IndustriesSection({ data }: IndustriesSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <EditableText
            path="sections.industries-served.title"
            value={data.title}
            className="font-sans font-bold text-3xl lg:text-4xl text-slate-900 mb-4 block"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((industry, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Building2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <EditableText
                path={`sections.industries-served.items.${index}`}
                value={industry}
                className="text-slate-700 font-medium block"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
