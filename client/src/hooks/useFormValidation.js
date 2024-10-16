import { useState, useEffect } from "react";

const useFormValidation = (username, password) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [formError, setFormError] = useState("");

  const validateFormInput = () => {
    // Check if either username or password is empty
    if (!username || !password) {
      setFormIsValid(false);
      return setFormError("All input fields are required.");
    }

    // Clear any error and mark form as valid
    setFormError("");
    setFormIsValid(true);
  };

  useEffect(() => {
    validateFormInput(); // Validate whenever username or password changes
  }, [username, password]);

  return [formIsValid, formError];
};

export default useFormValidation;
