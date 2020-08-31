import { useState, useEffect, useCallback } from "react";
import { get_prop_values, is_object, is_required, VALUE, ERROR } from "./Utils";

function useForm(
  stateSchema = {},
  stateValidatorSchema = {},
  submitFormCallback
) {
  const [state, setStateSchema] = useState(stateSchema);
  const [validatorSchema, setValidatorSchema] = useState(stateValidatorSchema);

  const [values, setValues] = useState(get_prop_values(state, VALUE));
  const [errors, setErrors] = useState(get_prop_values(state, ERROR));
  const [dirty, setDirty] = useState(get_prop_values(state, false));

  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setStateSchema(stateSchema);

    setInitialErrorState();
  }, []); // eslint-disable-line

  // Set a brand new field values and errors
  // If stateSchema changes
  useEffect(() => {
    const values = get_prop_values(state, VALUE);
    const errors = Object.keys(values).reduce((accu, curr) => {
      accu[curr] = validateField(curr, values[curr]);
      return accu;
    }, {});

    // Marked form as dirty if state was changed.
    setIsDirty(true);

    setValues(values);
    setErrors(errors);
  }, [state]); // eslint-disable-line

  useEffect(() => {
    const errors = Object.keys(values).reduce((accu, curr) => {
      accu[curr] = validateField(curr, values[curr]);
      return accu;
    }, {});

    setErrors(errors);
  }, [validatorSchema]); // eslint-disable-line

  useEffect(() => {
    if (isDirty) {
      setDisable(validateErrorState());
    }
  }, [errors, isDirty]); // eslint-disable-line

  // Set field value to specific field.
  const setFieldValue = ({ name, value }) => {
    setValues((prevState) => ({ ...prevState, [name]: value }));
    setDirty((prevState) => ({ ...prevState, [name]: true }));
  };

  // Set to specific field.
  const setFieldError = ({ name, error }) => {
    setErrors((prevState) => ({ ...prevState, [name]: error }));
  };

  // Function used to validate form fields
  const validateField = useCallback(
    (name, value) => {
      const fieldValidator = validatorSchema[name];
      // Making sure that stateValidatorSchema name is same in
      // stateSchema
      if (!fieldValidator) {
        return;
      }

      let error = "";
      error = is_required(value, fieldValidator["required"]);
      if (error) {
        return error;
      }

      if (!fieldValidator["required"] && !value) {
        return error;
      }

      // Run custom validator function
      if (!error && is_object(fieldValidator["validator"])) {
        // Test the function callback if the value is meet the criteria
        if (!fieldValidator["validator"]["func"](value, values)) {
          error = fieldValidator["validator"]["error"];
        }
      }

      if (!error && is_object(fieldValidator["compare"])) {
        const { to, error: errorMessage } = fieldValidator.compare;
        if (to && errorMessage && values[to] !== "") {
          if (value !== values[to]) {
            error = errorMessage;
          } else {
            setFieldError({ name: to, error: "" });
          }
        }
      }

      return error;
    },
    [validatorSchema, values]
  );

  const setInitialErrorState = useCallback(() => {
    Object.keys(errors).map((name) =>
      setFieldError({ name, error: validateField(name, values[name]) })
    );
  }, [errors, values, validateField]);

  const validateErrorState = useCallback(
    () => Object.values(errors).some((error) => error),
    [errors]
  );

  const handleOnSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!validateErrorState()) {
        submitFormCallback(values);
      }
    },
    [validateErrorState, submitFormCallback, values]
  );

  // Event handler for handling changes in input.
  const handleOnChange = useCallback(
    (event) => {
      const name = event.target.name;
      const value = event.target.value;

      const error = validateField(name, value);

      setFieldValue({ name, value });
      setFieldError({ name, error });
    },
    [validateField]
  );

  return {
    dirty,
    values,
    errors,
    disable,
    setStateSchema,
    setValidatorSchema,
    setFieldValue,
    setFieldError,
    handleOnChange,
    handleOnSubmit,
    validateErrorState,
  };
}

export default useForm;
