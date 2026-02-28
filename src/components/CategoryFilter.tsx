import type { ProductCategory } from "@/data/products";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";

interface Props {
  selected: ProductCategory | "All";
  onSelect: (cat: ProductCategory | "All") => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === "All" ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect("All")}
      >
        All
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selected === cat ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(cat)}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
