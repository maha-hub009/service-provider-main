import { Link } from "react-router-dom";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-[#360185] text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B342]">
                <Wrench className="h-5 w-5 text-[#360185]" />
              </div>
              <span className="font-bold text-lg">ServicePro</span>
            </Link>
            <p className="text-sm text-gray-300">
              Your trusted platform for professional home and vehicle services. Quality service providers at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/services" className="hover:text-[#F4B342] transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#F4B342] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/vendor/register" className="hover:text-[#F4B342] transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F4B342] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Popular Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/service/home-services/plumber" className="hover:text-[#F4B342] transition-colors">
                  Plumber
                </Link>
              </li>
              <li>
                <Link to="/service/home-services/electrician" className="hover:text-[#F4B342] transition-colors">
                  Electrician
                </Link>
              </li>
              <li>
                <Link to="/service/home-services/house-cleaning" className="hover:text-[#F4B342] transition-colors">
                  House Cleaning
                </Link>
              </li>
              <li>
                <Link to="/service/vehicle-services/car-service" className="hover:text-[#F4B342] transition-colors">
                  Car Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F4B342]" />
                <span>bmaha5564@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#F4B342]" />
                <span>+91 88077 33641</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#F4B342] mt-0.5" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#4A1A8C] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} ServicePro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-300">
              <Link to="/privacy" className="hover:text-[#F4B342] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#F4B342] transition-colors">
                Terms of Service
              </Link>
              <Link to="/admin/login" className="hover:text-[#F4B342] transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};