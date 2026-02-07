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
      <div className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#8F0177]/10 px-4 py-2 text-sm font-semibold text-[#8F0177] border border-[#8F0177]/20">
              <Sparkles className="h-4 w-4" />
              <span>Professional Services Directory</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#360185]">
              {selectedCategory ? selectedCategory.name : "All Services"}
            </h1>
            <p className="text-lg text-gray-600">
              {selectedCategory
                ? selectedCategory.description
                : "Browse our complete range of professional services"}
            </p>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative mt-10 group">
              <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-soft">
                <Search className="h-5 w-5 text-gray-400 ml-3" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  className="bg-[#8F0177] hover:bg-[#6A0156] text-white rounded-lg"
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
            <h3 className="font-semibold text-sm mb-4 text-gray-600 uppercase tracking-widest">Filter by category</h3>
            <div className="flex flex-wrap gap-3">
              {SERVICE_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/services/${category.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#1F2937] transition-all duration-300 hover:border-[#8F0177] hover:bg-[#8F0177]/5 hover:shadow-md"
                >
                  <category.icon className="h-4 w-4 text-[#8F0177]" />
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
              <Zap className="h-5 w-5 text-[#8F0177]" />
              <p className="text-sm font-semibold text-gray-600">{filteredServices.length} services found</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map((service, index) => (
                <Link
                  key={`${service.categoryId}-${service.id}`}
                  to={`/service/${service.categoryId}/${service.id}`}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-[#8F0177] hover:shadow-lg"
                  style={{
                    animation: `slideUp 0.5s ease-out ${index * 0.05}s backwards`
                  }}
                >
                  <div className="relative z-10 space-y-4">
                    {/* Icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#360185] shadow-md group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#360185] group-hover:text-[#8F0177] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-lg font-bold text-[#F4B342]">
                        From ₹{service.basePrice}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8F0177]/10 group-hover:bg-[#8F0177] group-hover:text-white transition-all duration-300">
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
            <div className="mx-auto w-fit rounded-lg bg-gray-100 p-8">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-bold text-[#360185] mb-2">No services found</p>
              <p className="text-sm text-gray-600">
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