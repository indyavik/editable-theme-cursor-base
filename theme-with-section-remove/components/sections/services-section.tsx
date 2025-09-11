import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calculator, Users, FileText, BarChart3 } from "lucide-react"

interface ServicesSectionProps {
  data: {
    items: Array<{
      name: string
      summary?: string
      bullets: string[]
    }>
  }
}

const serviceIcons = {
  "Monthly Bookkeeping": Calculator,
  Payroll: Users,
  "AP/AR": FileText,
  "Financial Reporting": BarChart3,
}

export function ServicesSection({ data }: ServicesSectionProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-3xl lg:text-4xl text-slate-900 mb-4">Our Services</h2>
          <p className="text-lg text-slate-600">Comprehensive bookkeeping solutions tailored to your business needs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((service, index) => {
            const IconComponent = serviceIcons[service.name as keyof typeof serviceIcons] || Calculator

            return (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900">{service.name}</CardTitle>
                  {service.summary && <p className="text-sm text-slate-600">{service.summary}</p>}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
