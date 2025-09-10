import { Badge } from "@/components/ui/badge"
import { Award, Users } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"

interface AboutSectionProps {
  data: {
    title: string
    story: string
    credentials: string[]
    badges: string[]
  }
}

export function AboutSection({ data }: AboutSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <EditableText
            path="sections.about.title"
            value={data.title}
            className="font-sans font-bold text-3xl lg:text-4xl text-slate-900 mb-6 block"
          />
          <EditableText
            path="sections.about.story"
            value={data.story}
            className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto block"
            multiline={true}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Credentials</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {data.credentials.map((credential, index) => (
                <Badge key={index} variant="secondary" className="bg-emerald-50 text-emerald-700">
                  <EditableText
                    path={`sections.about.credentials.${index}`}
                    value={credential}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Recognition</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {data.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-amber-50 text-amber-700">
                  <EditableText
                    path={`sections.about.badges.${index}`}
                    value={badge}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
