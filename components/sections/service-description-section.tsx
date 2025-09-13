import { EditableText } from "@/components/ui/editable-text"

interface ServiceDescriptionSectionProps {
  description: string;
  features: string[];
}

export function ServiceDescriptionSection({ description, features }: ServiceDescriptionSectionProps) {
  // Ensure features is an array
  const featuresArray = Array.isArray(features) ? features : [];
  
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Service Overview</h2>
            <EditableText
              fieldPath="description"
              className="text-lg text-gray-600 leading-relaxed"
            >
              {description}
            </EditableText>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">What's Included</h3>
            <div className="space-y-4">
              {featuresArray.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
