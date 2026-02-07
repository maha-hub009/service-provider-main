import { Link } from "react-router-dom";
import { SERVICE_CATEGORIES, Subcategory } from "@/lib/constants";
import { ArrowRight, Star, Clock, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-services.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container relative py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#8F0177]/10 px-4 py-2 text-sm font-semibold text-[#8F0177] border border-[#8F0177]/20">
              <Star className="h-4 w-4 fill-[#8F0177]" />
              <span>Trusted by 50,000+ customers worldwide</span>
            </div>
            
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#360185]">
                Professional Services at Your Doorstep
              </h1>
              <p className="mt-4 max-w-lg text-lg text-gray-600 leading-relaxed">
                Connect with verified professionals for home repairs, cleaning, vehicle services, and more. Quality guaranteed with transparent pricing.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button size="lg" className="btn-primary" asChild>
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" className="btn-brand" asChild>
                <Link to="/vendor/register">Become a Vendor</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 border border-gray-200">
                <div className="icon-action">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-[#1F2937]">Verified Pros</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 border border-gray-200">
                <div className="icon-brand">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-[#1F2937]">Same Day Service</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 border border-gray-200">
                <div className="icon-accent">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-[#1F2937]">Guaranteed Quality</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:ml-8">
            <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200">
              <img
                src={heroImage}
                alt="Professional service providers"
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-5 shadow-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="icon-action">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#360185]">10,000+</p>
                  <p className="text-xs text-gray-600">Services Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CategoriesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="mb-16 text-center space-y-4">
          <div className="inline-block">
            <span className="rounded-full bg-[#8F0177]/10 px-4 py-2 text-sm font-semibold text-[#8F0177] border border-[#8F0177]/20">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#360185]">
            Explore Professional Categories
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            From home repairs to vehicle services, find verified professionals in your area
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {SERVICE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/services/${category.id}`}
              className="group rounded-lg border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-lg hover:border-[#8F0177] relative overflow-hidden"
            >
              <div className="mb-6 flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="icon-action">
                    <category.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#360185]">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-[#8F0177] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </div>

              <div className="grid grid-cols-2 gap-2 relative z-10">
                {category.subcategories.slice(0, 4).map((sub) => (
                  <ServiceCard key={sub.id} subcategory={sub} categoryId={category.id} />
                ))}
              </div>

              {category.subcategories.length > 4 && (
                <div className="mt-4 text-sm font-semibold text-[#8F0177] opacity-0 group-hover:opacity-100 transition-all relative z-10">
                  +{category.subcategories.length - 4} more services
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ 
  subcategory, 
  categoryId 
}: { 
  subcategory: Subcategory; 
  categoryId: string 
}) => {
  return (
    <Link
      to={`/service/${categoryId}/${subcategory.id}`}
      className="group/card flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all duration-200 hover:border-[#8F0177] hover:bg-[#8F0177]/5"
    >
      <div className="icon-brand h-8 w-8 text-xs">
        <subcategory.icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-semibold text-[#1F2937]">{subcategory.name}</span>
    </Link>
  );
};

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Choose a Service",
      description: "Browse our categories and find the perfect service professional for your needs.",
      icon: "🔍"
    },
    {
      number: "02",
      title: "Book an Appointment",
      description: "Select your preferred date, time, and provide service details easily.",
      icon: "📅"
    },
    {
      number: "03",
      title: "Get It Done",
      description: "Our verified professional arrives on time and completes the job with quality.",
      icon: "✨"
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="mb-16 text-center space-y-4">
          <div className="inline-block">
            <span className="rounded-full bg-[#360185]/10 px-4 py-2 text-sm font-semibold text-[#360185] border border-[#360185]/20">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#360185]">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Getting professional service has never been easier
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              <div className="relative rounded-lg bg-white border border-gray-200 p-8 h-full transition-all duration-300 hover:shadow-lg hover:border-[#8F0177]">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#360185] text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-[#360185]">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="absolute -right-5 top-1/2 hidden -translate-y-1/2 md:block">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8F0177] text-white">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="relative overflow-hidden rounded-xl bg-[#360185] p-8 md:p-12 lg:p-20">
          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Experience Professional Service?
              </h2>
              <p className="text-lg text-gray-200 leading-relaxed">
                Join thousands of satisfied customers who have discovered the convenience of booking verified professionals for all their home and vehicle service needs.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Button
                size="lg"
                asChild
                className="bg-[#F4B342] text-[#360185] hover:bg-[#E6A432] font-semibold"
              >
                <Link to="/services">
                  Book a Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="border-2 border-white text-white hover:bg-white hover:text-[#360185] font-semibold"
              >
                <Link to="/vendor/register">Become a Vendor</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
