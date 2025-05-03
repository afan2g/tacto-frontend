// FormContext.js
import React, { createContext, useContext, useState } from "react";
import routes from "../navigation/routes";

const FormContext = createContext();

// Map routes to progress steps
const PROGRESS_MAP = {
  [routes.SIGNUPUSERNAME]: 1,
  [routes.SIGNUPFULLNAME]: 2,
  [routes.SIGNUPIDENTIFIER]: 3,
  [routes.SIGNUPPASSWORD]: 4,
  [routes.SIGNUPVERIFY]: 5,
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    progress: 0,
    prevProgress: 0,
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const updateFormData = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const updateProgress = (routeName) => {
    const newProgress = PROGRESS_MAP[routeName] || 0;
    updateFormData({
      prevProgress: formData.progress,
      progress: newProgress,
    });
  };

  const clearFormData = () => {
    setFormData({
      progress: 0,
      prevProgress: 0,
      username: "",
      fullName: "",
      email: "",
      password: "",
    });
  };

  return (
    <FormContext.Provider
      value={{ formData, updateFormData, updateProgress, clearFormData }}
    >
      {children}
    </FormContext.Provider>
  );
};

/**
 * @param {Object} children - The children components to be rendered inside the provider.
 * @returns {UseData} - The DataProvider component.
 * /
/**
 * @typedef {Object} UseData
 * @property {Object} formData - The form data state.
 * @property {Function} updateFormData - Function to update the form data state.
 * @property {Function} updateProgress - Function to update the progress state based on the current route.
 * @property {Function} clearFormData - Function to clear the form data state.
 */
export const useFormData = () => useContext(FormContext);
