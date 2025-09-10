import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Calendar } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"

interface ContactSectionProps {
  data: {
    phone: string
    email: string
    address: string
    calendarUrl: string
    primaryCta: { label: string; href: string }
    form: {
      enabled: boolean
      fields: Array<{
        name: string
        label: string
        type: string
        required: boolean
      }>
    }
  }
}

export function ContactSection({ data }: ContactSectionProps) {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-3xl lg:text-4xl text-slate-900 mb-4">Get Started Today</h2>
          <p className="text-lg text-slate-600">Ready to simplify your bookkeeping? Let's talk about your needs.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="font-semibold text-xl text-slate-900 mb-6">Contact Information</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600" />
                <EditableText
                  path="sections.contact.phone"
                  value={data.phone}
                  className="text-slate-700"
                />
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600" />
                <EditableText
                  path="sections.contact.email"
                  value={data.email}
                  className="text-slate-700"
                />
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <EditableText
                  path="sections.contact.address"
                  value={data.address}
                  className="text-slate-700"
                />
              </div>
            </div>

            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full" asChild>
              <a href={data.primaryCta.href}>
                <Calendar className="mr-2 h-5 w-5" />
                <EditableText
                  path="sections.contact.primaryCta.label"
                  value={data.primaryCta.label}
                />
              </a>
            </Button>
          </div>

          {data.form.enabled && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  {data.form.fields.map((field, index) => (
                    <div key={index}>
                      <Label htmlFor={field.name} className="text-slate-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          className="mt-1"
                          rows={4}
                        />
                      ) : (
                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          required={field.required}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
