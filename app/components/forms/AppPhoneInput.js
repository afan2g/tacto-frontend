import React, { useRef, useState, useCallback, useEffect } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { View, StyleSheet, Keyboard } from "react-native";
import {
  AsYouType,
  isValidPhoneNumber,
  parsePhoneNumber,
  getExampleNumber,
} from "libphonenumber-js/mobile";
import examples from "libphonenumber-js/mobile/examples";
import { colors, fonts } from "../../config";
import CountryPickerModal from "../modals/CountryPickerModal";
import { ChevronDown } from "lucide-react-native";
import { countryLookup } from "../../../lib/countryData";

export default function AppPhoneInput({
  onChangeNumber,
  onChangeCountry,
  initialCountry,
}) {
  const pickerRef = useRef(null);
  const [rawValue, setRawValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    initialCountry || countryLookup["US"]
  );
  const [template, setTemplate] = useState("");

  useEffect(() => {
    const newTemplate = getExampleNumber(
      selectedCountry.code,
      examples
    ).formatNational();
    setTemplate(newTemplate);
  }, [selectedCountry.code]);

  const handleModal = useCallback(() => {
    Keyboard.dismiss();
    pickerRef.current?.present();
  }, []);

  const handleSelectCountry = useCallback(
    (country) => {
      setSelectedCountry(country);
      onChangeCountry?.(country);
      setRawValue("");
      setFormattedValue("");
      pickerRef.current?.dismiss();
      const template = getExampleNumber(
        country.code,
        examples
      ).formatNational();
      console.log("Template:", template);
      setTemplate(template);
    },
    [onChangeCountry]
  );

  const handlePhoneNumber = useCallback(
    (text) => {
      if (isValidPhoneNumber(text)) {
        const validNumber = parsePhoneNumber(text);
        console.log("Valid Phone Number:", validNumber);
        setRawValue(validNumber.nationalNumber);
        const formatted = validNumber.formatNational();
        setFormattedValue(formatted);
        onChangeNumber?.(formatted);
        if (validNumber.country) {
          const newCountry = countryLookup[validNumber.country];
          if (newCountry) {
            setSelectedCountry(newCountry);
            onChangeCountry?.(newCountry);
          }
        }
        return;
      }
      const newDigits = text.replace(/\D/g, "");

      if (
        text.length < formattedValue.length &&
        newDigits.length === rawValue.length &&
        rawValue.length > 0
      ) {
        const updatedDigits = rawValue.slice(0, -1);
        setRawValue(updatedDigits);
        const formatted = new AsYouType(selectedCountry.code).input(
          updatedDigits
        );
        setFormattedValue(formatted);
        onChangeNumber?.(formatted);
        console.log(
          "Forced deletion -> Raw:",
          updatedDigits,
          "Formatted:",
          formatted
        );
      } else if (newDigits.length !== rawValue.length) {
        setRawValue(newDigits);
        const formatted = new AsYouType(selectedCountry.code).input(newDigits);
        setFormattedValue(formatted);
        onChangeNumber?.(formatted);
        console.log("Updated -> Raw:", newDigits, "Formatted:", formatted);
      }
    },
    [formattedValue, onChangeNumber, rawValue, selectedCountry.code]
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.pickerButton} onPress={handleModal}>
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <ChevronDown
            size={24}
            color={colors.lightGray}
            style={styles.chevronDown}
          />
        </TouchableOpacity>

        <TextInput
          value={formattedValue}
          placeholder={template}
          placeholderTextColor={colors.softGray}
          style={[
            styles.phoneInput,
            {
              fontFamily: rawValue ? fonts.black : fonts.italic,
            },
          ]}
          autoComplete="tel"
          keyboardType="phone-pad"
          onChangeText={handlePhoneNumber}
          autoFocus={true}
        />
      </View>

      <CountryPickerModal
        ref={pickerRef}
        onSelectCountry={handleSelectCountry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.blueShade10,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.fadedGray,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5, // Reduced from 15
    borderRightWidth: 1,
    borderRightColor: colors.fadedGray,
  },
  flag: {
    fontSize: 24,
  },
  chevronDown: {
    marginHorizontal: 5,
  },
  phoneInput: {
    flex: 1,
    height: 50, // Reduced from 50
    fontSize: 20,
    paddingHorizontal: 10,
    color: colors.lightGray,
  },
});
