import { useState } from "react";

export const useKeypadInput = (
  initialValue = "",
  options = {
    maxDecimalPlaces: 2,
    allowLeadingZero: false,
  }
) => {
  const [value, setValue] = useState(initialValue);

  const handleKeyPress = (key) => {
    const decimalRegex = new RegExp(
      `^(\\d+\\.?\\d{0,${options.maxDecimalPlaces}}|\\.\\d{0,${options.maxDecimalPlaces}})$`
    );
    const currentValue = value || "";

    switch (key) {
      case "<":
        if (currentValue === "") return;
        setValue(currentValue.slice(0, -1) || "");
        break;
      case "0":
        if (currentValue === "0" && !options.allowLeadingZero) return;

        if (decimalRegex.test(currentValue + "0")) {
          setValue(currentValue + "0");
        }
        break;
      case ".":
        if (currentValue === "") {
          setValue("0.");
          return;
        }
        // Prevent multiple decimals
        if (!currentValue.includes(".")) {
          setValue(currentValue + key);
        }
        break;
      default:
        if (/^\d$/.test(key)) {
          if (currentValue === "" || currentValue === "0") {
            setValue(key);
            return;
          }

          // New regex to strictly enforce decimal precision
          const newValue = currentValue + key;
          if (decimalRegex.test(newValue)) {
            setValue(newValue);
          }
        }
    }
  };

  const resetValue = () => setValue("");

  return {
    value,
    setValue,
    handleKeyPress,
    resetValue,
  };
};
