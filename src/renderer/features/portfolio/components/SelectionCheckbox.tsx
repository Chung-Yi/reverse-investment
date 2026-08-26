import { useEffect, useRef } from "react";
import styles from "../PortfolioPage.module.css";

interface SelectionCheckboxProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  className?: string;
  onChange: (checked: boolean) => void;
}

export function SelectionCheckbox({ label, checked, indeterminate = false, className = "", onChange }: SelectionCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={`${styles.selectionCheckbox} ${className}`.trim()}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        aria-label={label}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.checkboxVisual} aria-hidden="true" />
    </label>
  );
}
