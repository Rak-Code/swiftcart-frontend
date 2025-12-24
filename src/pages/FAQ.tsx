import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                What is your return policy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer a 30-day return policy for all unworn items with original tags. 
                Items must be in their original condition. Refunds are processed within 
                5-7 business days after we receive your return.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                How long does shipping take?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Standard shipping takes 5-7 business days. Express shipping (2-3 days) 
                and next-day delivery options are also available. Orders are processed 
                within 1-2 business days.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Do you ship internationally?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, we ship to select international destinations. Shipping costs and 
                delivery times vary by location. International orders may be subject to 
                customs duties and taxes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                How do I track my order?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Once your order ships, you'll receive a tracking number via email. You 
                can also view your order status by logging into your account and visiting 
                the Orders page.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We accept all major credit cards (Visa, MasterCard, American Express), 
                debit cards, and UPI payments through our secure payment gateway powered 
                by Razorpay.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                How do I know what size to order?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Please refer to our Size Guide page for detailed measurements. If you're 
                between sizes or need assistance, our customer service team is happy to 
                help you find the perfect fit.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Can I cancel or modify my order?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Orders can be cancelled or modified within 2 hours of placement. After 
                that, the order enters processing and cannot be changed. Please contact 
                us immediately if you need to make changes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Do you offer gift wrapping?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, we offer complimentary gift wrapping on all orders. Simply select 
                the gift wrap option during checkout and add a personalized message.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                How do I contact customer service?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can reach us via email at support@paribito.com or call us at 
                +1 (555) 123-4567. Our customer service team is available Monday-Friday, 
                9 AM - 6 PM EST.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
