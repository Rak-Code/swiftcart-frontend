import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Ruler } from "lucide-react";

const SizeGuide = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Size Guide</h1>
          
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Ruler className="w-6 h-6 sm:w-8 sm:h-8 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">How to Measure</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    For the most accurate measurements, have someone help you measure. 
                    Keep the tape measure parallel to the floor and snug but not tight.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Shirts Size Chart</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Size</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Chest</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Waist</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">S</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">34-36"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">28-30"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">32-33"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">M</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">38-40"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">32-34"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">33-34"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">L</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">42-44"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">36-38"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">34-35"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">XL</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">46-48"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">40-42"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">35-36"</td>
                      </tr>
                      <tr>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">XXL</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">50-52"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">44-46"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">36-37"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">T-Shirts Size Chart</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Size</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Chest</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">S</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">36-38"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">27-28"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">M</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">40-42"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">28-29"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">L</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">44-46"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">29-30"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">XL</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">48-50"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">30-31"</td>
                      </tr>
                      <tr>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">XXL</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">52-54"</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">31-32"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/10 p-4 sm:p-6 rounded-lg border border-accent/20">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                If you're between sizes or need assistance, please contact our customer 
                service team. We're happy to help you find the perfect fit.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SizeGuide;
