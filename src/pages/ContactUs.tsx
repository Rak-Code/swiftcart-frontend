import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold mb-1">Email</h3>
                  <p className="text-sm sm:text-base text-muted-foreground break-words">support@paribito.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold mb-1">Phone</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold mb-1">Address</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    123 Fashion Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Send us a message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-accent text-accent-foreground py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-md hover:bg-accent/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
