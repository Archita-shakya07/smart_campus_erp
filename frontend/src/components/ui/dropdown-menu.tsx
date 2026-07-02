import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: Array<{ label: string; onClick: () => void; variant?: "default" | "danger" }>;
}

export const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {trigger}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                item.variant === "danger"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              } ${i === items.length - 1 ? "" : "border-b border-gray-100"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};