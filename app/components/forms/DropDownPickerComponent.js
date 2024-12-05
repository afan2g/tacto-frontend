import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { colors } from "../../config";

export default function DropDownPickerComponent({
  items,
  defaultValue,
  onChangeItem,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [itemsList, setItemsList] = useState(items);
  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={itemsList}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItemsList}
        defaultValue={defaultValue}
        containerStyle={styles.containerStyle}
        style={styles.pickerStyle}
        onChangeValue={onChangeItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  containerStyle: {
    height: 40,
    width: "55%",
    backgroundColor: colors.black,
  },
  pickerStyle: {
    backgroundColor: colors.lightGray,
  },
});
