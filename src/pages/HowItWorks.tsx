import { MainLayout } from "@/components/layout/MainLayout";
import { CheckCircle2, Clock, Shield, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose a Service",
      description: "Browse our categories and select the service you need from verified professionals.",
      icon: Star,
    },
    {
      number: "02",
      title: "Book an Appointment",
      description: "Pick a convenient date and time for your service. We'll match you with the best provider.",
      icon: Clock,
    },
    {
      number: "03",
      title: "Get It Done",
      description: "Our professional arrives on time, completes the job with quality assurance.",
      icon: CheckCircle2,
    },
    {
      number: "04",
      title: "Rate & Review",
      description: "Share your experience to help us maintain high standards for all our services.",
      icon: Shield,
    },
  ];

  return (
    <MainLayout>
      <div className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-16 text-center">
            <h1 className="font-heading text-4xl font-bold md:text-5xl">
              How It Works
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting professional services has never been easier. Follow these simple steps to get started.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="mb-4 text-2xl font-bold text-primary">{step.number}</div>
                <h3 className="mb-3 font-heading text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="rounded-2xl bg-gradient-primary p-8 text-primary-foreground md:p-12">
              <h2 className="font-heading text-2xl font-bold md:text-3xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Join thousands of satisfied customers who trust us for their service needs.
              </p>
              <div className="mt-6">
                <a
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 font-medium text-primary hover:bg-primary-foreground/90"
                >
                  Browse Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HowItWorks;