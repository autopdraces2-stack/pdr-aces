"use client";

import Select from "react-select";
import clsx from "clsx";
import { getCountryCallingCode } from "react-phone-number-input";

/** Safely turn "US" -> 🇺🇸 ; returns "" if not a 2-letter code */
function flagEmoji(code) {
  if (typeof code !== "string") return "";
  const cc = code.toUpperCase().trim();
  if (!/^[A-Z]{2}$/.test(cc)) return "";
  return cc
    .split("")
    .map((ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)))
    .join("");
}

export default function CountrySelect(props) {
  const {
    value,
    onChange,
    options = [],
    disabled,
    name,
    tabIndex,
    onFocus,
    onBlur,
    labels = {},
    className,
  } = props;

  // Normalize options
  const codes = options
    .map((o) => (typeof o === "string" ? o : (o && o.value) || ""))
    .filter(Boolean);

  const selectOptions = codes.map((code) => {
    let dial = "";
    try {
      dial = `+${getCountryCallingCode(code)}`;
    } catch {}
    const label = labels?.[code] || code;
    return {
      value: code,
      label,
      code,
      dial,
      _flag: flagEmoji(code),
    };
  });

  const selected = selectOptions.find((o) => o.value === value) || null;

  // Custom renders: flag + name + dial code
  const components = {
    Option: ({ innerProps, innerRef, data, isFocused }) => (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: isFocused
            ? "var(--color-blue-light)"
            : "var(--bg-primary)",
          color: "var(--text-primary)",
          cursor: "pointer",
        }}
      >
        <span style={{ width: 20 }}>{data._flag}</span>
        <span style={{ flex: 1 }}>{data.label}</span>
        {data.dial && <span style={{ opacity: 0.7 }}>{data.dial}</span>}
      </div>
    ),
    SingleValue: ({ innerProps, data }) => (
      <div
        {...innerProps}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <span style={{ width: 20 }}>{data._flag}</span>
        <span>{data.label}</span>
        {data.dial && (
          <span style={{ opacity: 0.7, marginLeft: 6 }}>{data.dial}</span>
        )}
      </div>
    ),
    IndicatorSeparator: () => null,
    ClearIndicator: () => null,
  };

  return (
    <Select
      className={clsx("rs-country", className)}
      classNamePrefix="rs"
      name={name}
      inputId={name}
      value={selected}
      onChange={(opt) => onChange(opt?.value || undefined)}
      onFocus={onFocus}
      onBlur={onBlur}
      options={selectOptions}
      isDisabled={disabled}
      isSearchable={false} /* ← remove search */
      tabIndex={tabIndex}
      components={components}
      styles={{
        /* IMPORTANT: the wrapper owns border/radius; the select is borderless */
        control: (base) => ({
          ...base,
          minHeight: 44 /* exact height */,
          height: 44,
          border: "none",
          borderRadius: 0,
          background: "transparent",
          boxShadow: "none",
          cursor: "pointer",
        }),
        valueContainer: (b) => ({ ...b, padding: "0 10px" }),
        indicatorsContainer: (b) => ({ ...b, paddingRight: 6 }),
        dropdownIndicator: (b) => ({ ...b, padding: 4 }),
        menu: (b) => ({
          ...b,
          zIndex: 20,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          boxShadow: "var(--shadow-strong)",
          background: "var(--bg-primary)",
        }),
        menuList: (b) => ({
          ...b,
          padding: 0,
          maxHeight: 260,
        }),
        option: (b, s) => ({
          ...b,
          background: s.isFocused
            ? "var(--color-blue-light)"
            : "var(--bg-primary)",
          color: "var(--text-primary)",
        }),
        singleValue: (b) => ({ ...b, color: "var(--text-primary)" }),
        placeholder: (b) => ({ ...b, color: "var(--text-secondary)" }),
        input: (b) => ({ ...b, color: "var(--text-primary)" }),
      }}
      menuPlacement="auto"
      tabSelectsValue
    />
  );
}
