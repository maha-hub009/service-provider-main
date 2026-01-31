import { Link } from "react-router-dom";
import { SERVICE_CATEGORIES, Subcategory } from "@/lib/constants";
import { ArrowRight, Star, Clock, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-services.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-4 bottom-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="container relative py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
              <Star className="h-4 w-4 fill-primary" />
              <span>Trusted by 50,000+ customers worldwide</span>
            </div>
            
            <div>
              <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                Professional Services at{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Your Doorstep</span>
              </h1>
              <p className="mt-4 max-w-lg text-lg text-muted-foreground leading-relaxed">
                Connect with verified professionals for home repairs, cleaning, vehicle services, and more. Quality guaranteed with transparent pricing.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg" asChild>
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold" asChild>
                <Link to="/vendor/register">Become a Vendor</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg bg-white/50 dark:bg-white/5 p-3 border border-white/10">
                <div className="rounded-lg bg-success/10 p-2">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <span className="text-sm font-medium">Verified Pros</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white/50 dark:bg-white/5 p-3 border border-white/10">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Same Day Service</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white/50 dark:bg-white/5 p-3 border border-white/10">
                <div className="rounded-lg bg-accent/10 p-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-medium">Guaranteed Quality</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-up lg:ml-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10">
              <img
                src={heroImage}
                alt="Professional service providers"
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card p-5 shadow-xl border border-white/10 animate-float backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 border border-success/20">
                  <CheckCircle2 className="h-7 w-7 text-success" />
                </div>
                <div>
                  <p className="text-lg font-bold">10,000+</p>
                  <p className="text-xs text-muted-foreground">Services Completed</p>
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
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container">
        <div className="mb-16 text-center space-y-4">
          <div className="inline-block">
            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
              Our Services
            </span>
          </div>
          <h2 className="font-heading text-4xl font-bold md:text-5xl">
            Explore Professional Categories
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From home repairs to vehicle services, find verified professionals in your area
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {SERVICE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/services/${category.id}`}
              className="group rounded-2xl border bg-card/50 backdrop-blur-sm p-8 transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:bg-card/80 relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:blur-3xl transition-all" />
              
              <div className="mb-6 flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-service-icon">
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </div>

              <div className="grid grid-cols-2 gap-2 relative z-10">
                {category.subcategories.slice(0, 4).map((sub) => (
                  <ServiceCard key={sub.id} subcategory={sub} categoryId={category.id} />
                ))}
              </div>

              {category.subcategories.length > 4 && (
                <div className="mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all relative z-10">
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
      className="group/card flex items-center gap-2 rounded-lg border bg-background p-3 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-service-icon">
        <subcategory.icon className="h-4 w-4 text-white" />
      </div>
      <span className="text-sm font-medium">{subcategory.name}</span>
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
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="mb-16 text-center space-y-4">
          <div className="inline-block">
            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
              Simple Process
            </span>
          </div>
          <h2 className="font-heading text-4xl font-bold md:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Getting professional service has never been easier
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              <div className="relative rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:bg-card/80">
                <div className="absolute -right-4 -top-4 text-5xl opacity-10 group-hover:opacity-20 transition-all">
                  {step.icon}
                </div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                      <span className="font-heading text-xl font-bold text-primary-foreground">{step.number}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="absolute -right-5 top-1/2 hidden -translate-y-1/2 md:block">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white">
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
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-accent to-primary p-8 md:p-12 lg:p-20">
          {/* Background decoration */}
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          
          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
            <div className="text-primary-foreground space-y-6">
              <h2 className="font-heading text-4xl font-bold md:text-5xl">
                Ready to Experience Professional Service?
              </h2>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Join thousands of satisfied customers who have discovered the convenience of booking verified professionals for all their home and vehicle service needs.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
              >
                <Link to="/services">
                  Book a Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
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
