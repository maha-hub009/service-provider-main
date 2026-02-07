import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type MainLayoutProps = {
  children: ReactNode;
  hideFooter?: boolean;
};

export const MainLayout = ({ children, hideFooter = false }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};
