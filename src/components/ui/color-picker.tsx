import colors from "tailwindcss/colors";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { useState } from "react";

type ColorPickerProps = {
  setColor: (color: string) => any;
};

export function ColorPicker({ setColor }: ColorPickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const colorsToChoose: string[] = [];

  Object.values(colors).forEach(color => {
    if (typeof color == "string") return;

    Object.values<string>(color).forEach(color => colorsToChoose.push(color));
  });

  return (
    <HoverCard open={isPickerOpen} onOpenChange={setIsPickerOpen}>
      <HoverCardTrigger
        tabIndex={0}
        className="w-full p-2 max-md:py-4 cursor-pointer text-center font-semibold text-sm border border-input rounded-lg hover:bg-secondary"
        onClick={() => setIsPickerOpen(true)}
      >
        Choose color
      </HoverCardTrigger>

      <HoverCardContent className="h-40 w-[320px] flex flex-wrap justify-between space-y-1 overflow-y-scroll">
        {colorsToChoose.map(color => (
          <div
            onClick={() => setColor(color.toUpperCase())}
            key={color}
            style={{ backgroundColor: color }}
            className="aspect-square rounded-full border border-input w-6 cursor-pointer"
          />
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}
