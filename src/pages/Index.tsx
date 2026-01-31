import { useAuth } from "@/contexts/AuthContext";
import { USER_ROLES } from "@/lib/constants";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  HeroSection,
  CategoriesSection,
  HowItWorksSection,
  CTASection,
} from "@/components/home/HomeSections";
import CustomerHome from "./customer/CustomerHome";

const Index = () => {
  const { user } = useAuth();

  // Show customer-specific home if user is logged in as customer
  if (user && user.role === USER_ROLES.CUSTOMER) {
    return <CustomerHome />;
  }

  // Show default home for guests and other users
  return (
    <MainLayout>
      <HeroSection />
      <CategoriesSection />
      <HowItWorksSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
