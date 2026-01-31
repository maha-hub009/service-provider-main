import { MainLayout } from "@/components/layout/MainLayout";
import { Users, Award, Heart, Target } from "lucide-react";

const About = () => {
  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "1,000+", label: "Verified Vendors" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" },
  ];

  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in building strong relationships between customers and service providers.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Every service provider is thoroughly vetted to ensure the highest quality standards.",
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "Your satisfaction is our priority. We're here to make your life easier.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously improve our platform to provide the best experience possible.",
    },
  ];

  return (
    <MainLayout>
      <div className="py-16 lg:py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="font-heading text-4xl font-bold md:text-5xl">
              About ServicePro
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing the way people access professional services. Our platform connects
              customers with verified, skilled professionals for all their home and vehicle service needs.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.number}</div>
                <div className="mt-2 text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="mb-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl font-bold md:text-4xl">
                  Our Mission
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  To make professional services accessible, reliable, and affordable for everyone.
                  We bridge the gap between skilled professionals and customers who need their expertise.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Founded in 2024, ServicePro started with a simple idea: quality services shouldn't be
                  hard to find or expensive. Today, we're proud to serve communities across the country
                  with a network of trusted professionals.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-primary p-8 text-primary-foreground">
                <h3 className="font-heading text-xl font-semibold">Why Choose Us?</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    <span>Verified and insured professionals</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    <span>Quality guarantee on all services</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="mb-12 font-heading text-3xl font-bold text-center md:text-4xl">
              Our Values
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <value.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold">{value.title}</h3>
                    <p className="mt-2 text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;