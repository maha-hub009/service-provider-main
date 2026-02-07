import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { USER_ROLES } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Wrench,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  ChevronDown,
  Briefcase,
  Search,
  TextSearch,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate("/services");
    }
    setSearchValue("");
    setMobileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case USER_ROLES.ADMIN:
        return "/admin";
      case USER_ROLES.VENDOR:
        return "/vendor";
      case USER_ROLES.CUSTOMER:
        return "/customer/bookings";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#360185] border-[#2A0154]">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B342]">
            <Wrench className="h-5 w-5 text-[#360185]" />
          </div>
          <span className="hidden sm:inline font-bold text-lg text-white">ServicePro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              placeholder="Search services..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-10 w-64 max-w-xs pl-10 bg-[#4A1A8C] text-white placeholder:text-gray-300 border-[#6A3AAC]"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
            >
              <TextSearch className="h-4 w-4" />
            </Button>
          </form>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/vendor/login")}
                className="gap-2 text-white hover:bg-[#4A1A8C]"
              >
                <Briefcase className="h-4 w-4" />
                Become a Vendor
              </Button>
              <Button 
                onClick={() => navigate("/login")}
                className="bg-[#8F0177] text-white hover:bg-[#6A0156] font-semibold"
              >
                Sign In
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 text-white hover:bg-[#4A1A8C]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4B342]">
                    <User className="h-4 w-4 text-[#360185]" />
                  </div>
                  <span className="max-w-32 truncate">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-[#360185]">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                  <p className="mt-1 text-xs capitalize text-[#8F0177] font-medium">{user.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  <LayoutDashboard className="mr-2 h-4 w-4 text-[#8F0177]" />
                  <span className="text-[#1F2937]">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-[#DE1A58]">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#4A1A8C]">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-10 pl-10 bg-gray-50 border-gray-200 text-[#1F2937]"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <nav className="flex flex-col gap-4">
              <div className="my-4 h-px bg-gray-200" />
              {!isAuthenticated ? (
                <>
                  <Button
                    onClick={() => {
                      navigate("/vendor/login");
                      setMobileOpen(false);
                    }}
                    className="gap-2 bg-white border-2 border-[#8F0177] text-[#8F0177] hover:bg-[#8F0177] hover:text-white font-semibold"
                  >
                    <Briefcase className="h-4 w-4" />
                    Become a Vendor
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setMobileOpen(false);
                    }}
                    className="bg-[#8F0177] text-white hover:bg-[#6A0156] font-semibold"
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                    <p className="font-semibold text-[#360185]">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <Button
                    onClick={() => {
                      navigate(getDashboardLink());
                      setMobileOpen(false);
                    }}
                    className="gap-2 bg-white border-2 border-gray-200 text-[#1F2937] hover:border-[#8F0177] font-semibold"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="bg-[#DE1A58] text-white hover:bg-[#B91547] font-semibold"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};