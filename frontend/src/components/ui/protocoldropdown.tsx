import React, { useState, useRef, useEffect } from "react";

export type ProtocolOption = "all" | "udp" | "tcp" | "ndp" | "mld" | "arp" | "other";

interface DropdownProps {
  value: ProtocolOption;
  onChange: (value: ProtocolOption) => void;
}

const protocols: { label: string; value: ProtocolOption }[] = [
  { label: "All", value: "all" },
  { label: "UDP", value: "udp" },
  { label: "TCP", value: "tcp" },
  { label: "NDP", value: "ndp" },
  { label: "MLD", value: "mld" },
  { label: "ARP", value: "arp" },
  { label: "Other", value: "other" },
];

const ProtocolDropdown: React.FC<DropdownProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = protocols.find((p) => p.value === value)?.label ?? "All";

  return (
    <div className="relative w-[120px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-left text-slate-800 dark:text-slate-100 shadow-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-auto text-sm">
          {protocols.map(({ label, value: val }) => (
            <li
              key={val}
              onClick={() => {
                onChange(val);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 hover:bg-blue-500 hover:text-white rounded-md"
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProtocolDropdown;
