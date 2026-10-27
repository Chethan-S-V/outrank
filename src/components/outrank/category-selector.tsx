"use client";

import { useEffect, useRef, useState } from "react";
import { CategoryIcon } from "./category-icon";

export type ClaimCategory = { id: string; name: string };

type CategorySelectorProps = {
  categories: readonly ClaimCategory[];
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
};

function ChevronDownIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}

function CheckIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}

export function CategorySelector({ categories, selectedCategoryId, onChange }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);

  useEffect(() => {
    function closeOnOutsideInteraction(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideInteraction);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideInteraction);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return <div className="outrank-category-selector" ref={containerRef}><button aria-expanded={open} aria-haspopup="listbox" aria-label="Select category" onClick={() => setOpen((value) => !value)} type="button"><span className="outrank-category-icon"><CategoryIcon category={selectedCategory?.name ?? "Other"} /></span><span className="outrank-category-label">{selectedCategory?.name ?? "Select category"}</span><span className={`outrank-category-chevron${open ? " is-open" : ""}`}><ChevronDownIcon /></span></button>{open ? <div className="outrank-category-menu" role="listbox">{categories.map((item) => <button aria-selected={selectedCategoryId === item.id} key={item.id} onClick={() => { onChange(item.id); setOpen(false); }} role="option" type="button"><span className="outrank-category-option-icon"><CategoryIcon category={item.name} /></span><span>{item.name}</span>{selectedCategoryId === item.id ? <span className="outrank-category-check"><CheckIcon /></span> : null}</button>)}</div> : null}</div>;
}
