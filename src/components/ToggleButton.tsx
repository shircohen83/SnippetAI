import React from "react";
import "./ToggleButtonStyle.css";

type ToggleButtonProps = {
  isOn: boolean;
  onToggle: () => void;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({ isOn, onToggle }) => {
  return (
    <button
      className={`toggle-button ${isOn ? "on" : "off"}`}
      onClick={onToggle}
      aria-label="Toggle"
    >
      <span className="toggle-knob" />
    </button>
  );
};
