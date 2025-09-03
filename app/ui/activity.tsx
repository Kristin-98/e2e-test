"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ActivityDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const activities = ["Löpning", "Simning", "Cykling", "Gym", "Hemmaträning"];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-black rounded border-1 border-yellow-400 hover:border-yellow-500"
      >
        {selected || "Välj aktivitet >"}
      </button>

      {isOpen &&
        createPortal(
          <div
            style={{ top: position.top, left: position.left }}
            className="absolute z-50 w-56 rounded-md shadow-lg text-black bg-amber-50 ring-1 ring-yellow"
          >
            {activities.map((activity) => (
              <button
                key={activity}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setSelected(activity);
                  setIsOpen(false);
                }}
              >
                {activity}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
