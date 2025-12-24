import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  tag: string;
  title: string;
  description: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
  bgImage: string;
}

const slides: Slide[] = [
  {
    tag: "Spring Collection 2025",
    title: "Refined\nElegance",
    description: "Meticulously crafted menswear for the modern gentleman who values quality and timeless style.",
    primaryButton: { text: "Explore Collection", href: "/products" },
    secondaryButton: { text: "View Categories", href: "#categories" },
    bgImage: "https://images.pexels.com/photos/2205839/pexels-photo-2205839.jpeg"
  },
  {
    tag: "New Arrivals",
    title: "Modern\nSophistication",
    description: "Discover our latest collection featuring contemporary designs with classic appeal.",
    primaryButton: { text: "Shop New Arrivals", href: "/products" },
    secondaryButton: { text: "Learn More", href: "/about" },
    bgImage: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg"
  },
  {
    tag: "Premium Quality",
    title: "Timeless\nCraftsmanship",
    description: "Experience the perfect blend of traditional tailoring and modern aesthetics.",
    primaryButton: { text: "View Collection", href: "/products" },
    secondaryButton: { text: "Our Story", href: "/about" },
    bgImage: "https://images.pexels.com/photos/4827144/pexels-photo-4827144.jpeg"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-[500px] sm:h-[600px] lg:h-[700px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
            style={{
              backgroundImage: `url(${slide.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <p className="text-accent text-[11px] font-semibold tracking-[0.2em] uppercase mb-3 animate-fade-in">
                  {slide.tag}
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.1] animate-fade-in-up text-white">
                  {slide.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </h1>
                <p className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-400">
                  <Button 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-11 px-6 text-sm tracking-wide"
                    asChild
                  >
                    <a href={slide.primaryButton.href}>{slide.primaryButton.text}</a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border border-white/30 hover:bg-white/10 text-white h-11 px-6 text-sm font-medium tracking-wide"
                    asChild
                  >
                    <a href={slide.secondaryButton.href}>{slide.secondaryButton.text}</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              index === currentSlide
                ? "w-8 bg-accent"
                : "w-2 bg-white/40 hover:bg-white/60"
            } h-2 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
