import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"

interface BlogTeaserSectionProps {
  data: {
    items: Array<{
      title: string
      href: string
      excerpt?: string
    }>
  }
}

export function BlogTeaserSection({ data }: BlogTeaserSectionProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-sans font-bold text-3xl lg:text-4xl text-slate-900 mb-4">Latest Insights</h2>
          <p className="text-lg text-slate-600">Stay informed with our bookkeeping tips and industry updates</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {data.items.map((post, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 hover:text-emerald-600 transition-colors">
                  <a href={post.href}>{post.title}</a>
                </CardTitle>
              </CardHeader>
              {post.excerpt && (
                <CardContent>
                  <p className="text-slate-600 mb-4">{post.excerpt}</p>
                  <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 p-0" asChild>
                    <a href={post.href}>
                      Read more <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            asChild
          >
            <a href="/blog">
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
