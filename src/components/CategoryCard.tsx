import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  href: string;
}

const CategoryCard = ({ title, imageUrl, href }: CategoryCardProps) => {
  return (
    <Link 
      to={href}
      className="group relative overflow-hidden bg-card border border-border hover:border-foreground/20 transition-all duration-200"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-primary-foreground">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight uppercase">{title}</h3>
        <div className="inline-flex items-center gap-1.5 text-accent font-medium group-hover:gap-2.5 transition-all text-xs tracking-wider">
          <span>DISCOVER</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
