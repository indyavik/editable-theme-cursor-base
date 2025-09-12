import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"

interface ContactSectionProps {
  data: {
    title: string
    phone: string
    email: string
    address: string
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <EditableText
            path="sections.contact.title"
            value={data.title}
            className="font-sans font-bold text-3xl lg:text-4xl text-slate-900 mb-4 block"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                <EditableText
                  path="sections.contact.phone"
                  value={data.phone}
                  className="text-slate-600 block"
                />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                <EditableText
                  path="sections.contact.email"
                  value={data.email}
                  className="text-slate-600 block"
                />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                <EditableText
                  path="sections.contact.address"
                  value={data.address}
                  className="text-slate-600 block"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
                asChild
              >
                <a href={data.primaryCta?.href || '#'}>
                  <EditableText
                    path="sections.contact.primaryCta.label"
                    value={data.primaryCta?.label || 'Contact Us'}
                  />
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          {data.form?.enabled && (
            <Card className="bg-slate-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  {data.form.fields?.map((field, index) => (
                    <div key={index}>
                      <Label htmlFor={field.name} className="text-slate-700 font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
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
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
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
