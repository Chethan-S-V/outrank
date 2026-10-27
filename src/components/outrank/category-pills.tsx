import type { ClaimCategory } from "./category-selector";
import { CategoryIcon } from "./category-icon";

type CategoryPillsProps = {
  categories: readonly ClaimCategory[];
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
};

export function CategoryPills({
  categories,
  selectedCategoryId,
  onChange,
}: CategoryPillsProps) {
  return (
    <div aria-label="Popular categories" className="outrank-category-pills" role="group">
      {categories.map((item) => {
        return (
          <button
            aria-pressed={selectedCategoryId === item.id}
            className="outrank-category-pill inline-flex items-center gap-1.5"
            key={item.id}
            onClick={() => onChange(item.id)}
            type="button"
          >
            <CategoryIcon slug={item.id} category={item.name} className="w-3.5 h-3.5" />
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
