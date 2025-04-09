import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { colors, fonts } from "../../config";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react-native";

export default function DropDownPickerComponent({
  items,
  defaultValue,
  onChangeItem,
  open,
  setOpen,
}) {
  const [value, setValue] = useState(defaultValue || items[0]?.value); // Set default to first item's value
  const [itemsList, setItemsList] = useState(items);

  useEffect(() => {
    setValue(defaultValue || items[0]?.value); // Update when defaultValue changes
  }, [defaultValue, items]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={itemsList}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItemsList}
      style={styles.pickerStyle}
      containerStyle={styles.dropDownPickerContainerStyle}
      textStyle={styles.textStyle}
      labelStyle={styles.labelStyle}
      onChangeValue={onChangeItem}
      arrowIconStyle={styles.arrowIconStyle}
      tickIconStyle={styles.tickIconStyle}
      dropDownContainerStyle={styles.dropDownContainerStyle}
      selectedItemContainerStyle={styles.selectedItemContainerStyle}
      selectedItemLabelStyle={styles.selectedItemLabelStyle}
    />
  );
}

const styles = StyleSheet.create({
  dropDownPickerContainerStyle: {
    maxWidth: "54%",
  },
  pickerStyle: {
    backgroundColor: "transparent",
    borderColor: colors.fadedGray,
    borderRadius: 5,
    minHeight: 32,
    paddingVertical: 5,
  },
  textStyle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 20,
    color: colors.lightGray,
  },
  labelStyle: {
    fontFamily: fonts.black,
  },
  arrowIconStyle: {
    tintColor: colors.lightGray,
  },
  tickIconStyle: {
    tintColor: colors.lightGray,
  },
  dropDownContainerStyle: {
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: colors.fadedGray,
    borderRadius: 5,
  },

  selectedItemContainerStyle: {
    backgroundColor: colors.blueGray.shade50,
  },
  selectedItemLabelStyle: {
    fontFamily: fonts.black,
  },
});
