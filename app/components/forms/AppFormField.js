import React, { forwardRef } from "react";
import { useFormikContext } from "formik";
import AppTextInput from "./AppTextInput";
import ErrorMessage from "./ErrorMessage";

// Define the component using proper forwardRef syntax
const AppFormField = forwardRef(({ name, ...otherProps }, ref) => {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  return (
    <>
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        ref={ref}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
});

// Add a display name for better debugging
AppFormField.displayName = "AppFormField";

export default AppFormField;
