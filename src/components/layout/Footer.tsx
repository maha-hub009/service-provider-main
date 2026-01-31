import { Link } from "react-router-dom";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ServicePro Logo" className="h-9 w-9" />
              <span className="font-heading text-xl font-bold">ServicePro</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for professional home and vehicle services. Quality service providers at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/services" className="hover:text-foreground">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/vendor/register" className="hover:text-foreground">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-foreground">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Popular Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/service/home-services/plumber" className="hover:text-foreground">
                  Plumber
                </Link>
              </li>
              <li>
                <Link to="/service/home-services/electrician" className="hover:text-foreground">
                  Electrician
                </Link>
              </li>
              <li>
                <Link to="/service/home-services/house-cleaning" className="hover:text-foreground">
                  House Cleaning
                </Link>
              </li>
              <li>
                <Link to="/service/vehicle-services/car-service" className="hover:text-foreground">
                  Car Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>bmaha5564@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 88077 33641</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ServicePro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/admin/login" className="hover:text-foreground">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};