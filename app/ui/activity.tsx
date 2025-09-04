"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ActivityDropdownProps {
  weatherDescription?: string;
}

export default function ActivityDropdown({
  weatherDescription,
}: ActivityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const durations = [15, 30, 45, 60, 90];

  const activityOptions: Record<string, string[]> = {
    Soligt: ["Löpning", "Cykling"],
    Molnigt: ["Gym", "Hemmaträning", "Löpning", "Cykling"],
    Regnigt: ["Gym", "Hemmaträning", "Simning"],
  };

  function getActivitiesForWeather(desc: string) {
    const d = desc.toLowerCase();

    if (d.includes("klar") || d.includes("sol")) {
      return activityOptions.Soligt;
    } else if (d.includes("moln")) {
      return activityOptions.Molnigt;
    } else if (d.includes("regn")) {
      return activityOptions.Regnigt;
    } else {
      return ["Löpning", "Simning", "Cykling", "Gym", "Hemmaträning"];
    }
  }

  const activities = weatherDescription
    ? getActivitiesForWeather(weatherDescription)
    : [];

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  if (!weatherDescription) return null;

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-black rounded border-1 border-yellow-400 hover:border-yellow-500"
      >
        {selected
          ? `${selected}${duration ? ` - ${duration} min` : ""}`
          : "Välj aktivitet >"}
      </button>

      {isOpen &&
        createPortal(
          <div
            style={{ top: position.top, left: position.left }}
            className="absolute z-50 w-56 rounded-md shadow-lg text-black bg-amber-50 ring-1 ring-yellow"
          >
            {!selected ? (
              activities.map((activity) => (
                <button
                  key={activity}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSelected(activity);
                    setIsOpen(false);
                    setTimeout(() => setIsOpen(true), 0);
                  }}
                >
                  {activity}
                </button>
              ))
            ) : (
              <>
                <div className="px-4 py-2 font-semibold">Välj tid (min):</div>
                {durations.map((min) => (
                  <button
                    key={min}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDuration(min);
                      setIsOpen(false);
                    }}
                  >
                    {min} minuter
                  </button>
                ))}
                <button
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                  onClick={() => {
                    setSelected(null);
                    setDuration(null);
                    setIsOpen(false);
                  }}
                >
                  Avbryt
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
