import { 
  Wrench, 
  Zap, 
  Home, 
  Sparkles, 
  Wind, 
  Refrigerator, 
  WashingMachine, 
  Droplets, 
  Bug, 
  PaintBucket, 
  Hammer, 
  Sofa, 
  Shield,
  Car,
  Bike,
  Settings,
  CircleDot,
  Battery,
  Fuel,
  Search,
  PenTool,
  AlertTriangle,
  Truck,
  LucideIcon
} from "lucide-react";

export type ServiceCategory = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  basePrice: number;
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "home-services",
    name: "Home Services",
    icon: Home,
    description: "Professional home maintenance and repair services",
    subcategories: [
      { id: "plumber", name: "Plumber", icon: Wrench, description: "Pipe repairs, leak fixes, installations", basePrice: 199 },
      { id: "electrician", name: "Electrician", icon: Zap, description: "Wiring, repairs, installations", basePrice: 249 },
      { id: "house-cleaning", name: "House Cleaning", icon: Sparkles, description: "Regular cleaning services", basePrice: 499 },
      { id: "deep-cleaning", name: "Deep Cleaning", icon: Sparkles, description: "Thorough deep cleaning", basePrice: 999 },
      { id: "ac-repair", name: "AC Installation & Repair", icon: Wind, description: "AC service and maintenance", basePrice: 399 },
      { id: "refrigerator-repair", name: "Refrigerator Repair", icon: Refrigerator, description: "Fridge repairs and service", basePrice: 349 },
      { id: "washing-machine", name: "Washing Machine Repair", icon: WashingMachine, description: "Washer repairs and service", basePrice: 299 },
      { id: "ro-purifier", name: "RO Water Purifier", icon: Droplets, description: "Water purifier service", basePrice: 249 },
      { id: "pest-control", name: "Pest Control", icon: Bug, description: "Pest extermination services", basePrice: 599 },
      { id: "painting", name: "Painting", icon: PaintBucket, description: "Interior and exterior painting", basePrice: 1999 },
      { id: "carpenter", name: "Carpenter", icon: Hammer, description: "Furniture repair and custom work", basePrice: 399 },
      { id: "sofa-cleaning", name: "Sofa & Carpet Cleaning", icon: Sofa, description: "Upholstery cleaning", basePrice: 699 },
      { id: "sanitization", name: "Home Sanitization", icon: Shield, description: "Complete home sanitization", basePrice: 799 },
    ],
  },
  {
    id: "vehicle-services",
    name: "Vehicle Services",
    icon: Car,
    description: "Complete vehicle care and maintenance",
    subcategories: [
      { id: "car-wash", name: "Car Wash", icon: Car, description: "Professional car washing", basePrice: 299 },
      { id: "bike-wash", name: "Bike Wash", icon: Bike, description: "Bike cleaning services", basePrice: 149 },
      { id: "car-service", name: "Car Service", icon: Settings, description: "Complete car servicing", basePrice: 1999 },
      { id: "bike-service", name: "Bike Service", icon: Settings, description: "Bike servicing and tune-up", basePrice: 599 },
      { id: "engine-repair", name: "Engine Repair", icon: Settings, description: "Engine diagnostics and repair", basePrice: 2999 },
      { id: "tyre-replacement", name: "Tyre Replacement", icon: CircleDot, description: "Tyre fitting and balancing", basePrice: 499 },
      { id: "battery-replacement", name: "Battery Replacement", icon: Battery, description: "Battery testing and replacement", basePrice: 799 },
      { id: "oil-change", name: "Oil Change", icon: Fuel, description: "Engine oil replacement", basePrice: 399 },
      { id: "vehicle-inspection", name: "Vehicle Inspection", icon: Search, description: "Complete vehicle checkup", basePrice: 499 },
      { id: "denting-painting", name: "Denting & Painting", icon: PenTool, description: "Body work and painting", basePrice: 1499 },
      { id: "roadside-assistance", name: "Roadside Assistance", icon: AlertTriangle, description: "Emergency roadside help", basePrice: 299 },
      { id: "towing", name: "Towing Service", icon: Truck, description: "Vehicle towing services", basePrice: 999 },
    ],
  },
];

export const BOOKING_STATUSES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatus = typeof BOOKING_STATUSES[keyof typeof BOOKING_STATUSES];

export const USER_ROLES = {
  ADMIN: "admin",
  VENDOR: "vendor",
  CUSTOMER: "customer",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
