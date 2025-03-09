import React, { useState } from "react";

type ToggleProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function Toggle({ checked = false, onChange }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div
      className="w-6 h-6 border-4 rounded-md flex items-center justify-center cursor-pointer transition-all border-[var(--l2-color)]"
      onClick={toggle}
    >
      <div
        className={`w-4 h-4 bg-l1-color rounded-sm ${isChecked ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
