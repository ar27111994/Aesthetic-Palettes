import React from "react";
import { IconType } from "react-icons/lib";

export interface MenuItem {
  label?: string;
  icon?: IconType;
  href?: string;
  value?: string;
  onClick?: () => void;
  isSeparator?: boolean;
  isButton?: boolean; // Optional: Style as a button within the menu
  disabled?: boolean;
}

export interface MenuProps {
  trigger: React.ReactElement;
  items: MenuItem[];
  ariaLabel: string;
  className?: string;
  menuClassName?: string;
  currentValue?: string;
}
