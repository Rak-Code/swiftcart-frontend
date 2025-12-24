import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}

const AdminLayout = ({ children, title, action }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {action && <div>{action}</div>}
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
