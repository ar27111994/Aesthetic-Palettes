// app/palettes/[id]/components/controls/MoreOptionsDropdown.tsx
import React, { memo } from "react";
import { Button } from "@components/Button";
import { FiSettings } from "react-icons/fi";
import { MenuItem } from "@lib/typings/Menu";
import { Menu } from "@components/Menu";

/**
 * Props for the MoreOptionsDropdown component.
 * @interface MoreOptionsDropdownProps
 */
interface MoreOptionsDropdownProps {
  items: MenuItem[];
  moreOptionsLabel: string;
}

/**
 * MoreOptionsDropdown component renders a dropdown menu for additional palette options.
 * @component
 * @param {MoreOptionsDropdownProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered MoreOptionsDropdown component.
 */
export const MoreOptionsDropdown: React.FC<MoreOptionsDropdownProps> = memo(
  ({ items, moreOptionsLabel }) => {
    return (
      <Menu
        trigger={
          <Button
            variant="ghost"
            size="icon"
            aria-label={moreOptionsLabel}
            aria-haspopup="menu"
          >
            <FiSettings className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">{moreOptionsLabel}</span>
          </Button>
        }
        items={items}
        ariaLabel={moreOptionsLabel}
        className="min-w-[200px]"
      />
    );
  },
);

MoreOptionsDropdown.displayName = "MoreOptionsDropdown";
