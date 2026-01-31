import { Link, useParams, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { ArrowRight, Search, Sparkles, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Services = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (trimmedQuery) {
        newParams.set("search", trimmedQuery);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  };

  const selectedCategory = categoryId
    ? SERVICE_CATEGORIES.find((c) => c.id === categoryId)
    : null;

  const filteredCategories = selectedCategory
    ? [selectedCategory]
    : SERVICE_CATEGORIES;

  const allServices = filteredCategories.flatMap((category) =>
    category.subcategories.map((sub) => ({
      ...sub,
      categoryId: category.id,
      categoryName: category.name,
    }))
  );

  const filteredServices = searchQuery
    ? allServices.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allServices;

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-4 bottom-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span>Professional Services Directory</span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
              {selectedCategory ? selectedCategory.name : "All Services"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {selectedCategory
                ? selectedCategory.description
                : "Browse our complete range of professional services"}
            </p>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative mt-10 group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
              <div className="relative flex items-center gap-2 bg-white dark:bg-background border border-border/50 rounded-2xl p-2 shadow-lg">
                <Search className="h-5 w-5 text-muted-foreground ml-3" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-lg rounded-xl"
                  size="sm"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container py-16">
        {/* Category Filter */}
        {!selectedCategory && (
          <div className="mb-12">
            <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-widest">Filter by category</h3>
            <div className="flex flex-wrap gap-3">
              {SERVICE_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/services/${category.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:shadow-md"
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <>
            <div className="mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">{filteredServices.length} services found</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map((service, index) => (
                <Link
                  key={`${service.categoryId}-${service.id}`}
                  to={`/service/${service.categoryId}/${service.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:bg-card/80"
                  style={{
                    animation: `slideUp 0.5s ease-out ${index * 0.05}s backwards`
                  }}
                >
                  {/* Animated Background */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:blur-3xl transition-all duration-500" />
                  <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="relative z-10 space-y-4">
                    {/* Icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-service-icon shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-lg font-bold text-primary">
                        From ₹{service.basePrice}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto w-fit rounded-2xl bg-muted/50 p-8">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No services found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search query or browse other categories
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default Services;