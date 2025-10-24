"use client";

import { forwardRef } from "react";
import clsx from "clsx";
import RP2 from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./PhoneInput.module.css";

const PhoneInput = forwardRef(function PhoneInput(
  {
    value,
    onChange,
    defaultCountry = "us",
    placeholder = "+1 303 555 0199",
    error,
    className,
    id = "phone",
  },
  ref
) {
  return (
    <div className={clsx(styles.wrapper, className, error && styles.hasError)}>
      <div className={styles.combo}>
        <RP2
          inputProps={{
            id,
            name: id,
            autoComplete: "tel",
            "aria-invalid": !!error || undefined,
          }}
          country={defaultCountry}
          value={value || ""}
          onChange={(val) => onChange?.(val || "")}
          placeholder={placeholder}
          enableSearch={false}
          disableSearchIcon
          countryCodeEditable={false}
          dropdownContainer="body" // ✅ <— переносит поповер в body
          containerClass={styles.rp2Container}
          inputClass={styles.rp2Input}
          buttonClass={styles.rp2Button}
          dropdownClass={styles.rp2Dropdown}
        />
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
});

export default PhoneInput;
