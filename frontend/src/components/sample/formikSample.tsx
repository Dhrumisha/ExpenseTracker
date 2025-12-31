import { Formik } from "formik";
import { z } from "zod";

// import { InputWithProps } from "@/components/";
import { ListboxWithProps } from "@/components/Listbox/Listbox";
import { zodToFormikValidation as validate } from "@/utils/validations/zodValidateHelper";

const validationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(1, "Country is required"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  country: "",
};

const listboxOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
];

<Formik
  enableReinitialize={true}
  initialValues={initialValues}
  validate={validate(validationSchema)}
  validateOnBlur={true}
  validateOnChange={true}
  onSubmit={(values, { setSubmitting }) => {
    const result = validationSchema.safeParse(values);
    if (result.success) {
      setTimeout(() => {
        alert("Form submitted successfully!");
        setSubmitting(false);
      }, 1000);
    } else {
      setSubmitting(false);
    }
  }}
>
  {({
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    // setFieldTouched,
    validateField,
  }) => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <InputWithProps
            label="Full Name"
            placeholder="Enter your full name"
            name="name"
            id="name"
            value={values.name}
            onFocus={() => {
              setFieldTouched("name", true, false);
              validateField("name");
            }}
            onChange={(e) => {
              handleChange(e);
              validateField("name");
            }}
            onBlur={(e) => {
              handleBlur(e);
              validateField("name");
            }}
            error={touched.name && !!errors.name}
            errorMessage={errors.name}
            required={true}
            wrapperClassName="w-full space-y-2"
          /> */}

        {/* <InputWithProps
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            name="email"
            id="email"
            value={values.email}
            onFocus={() => {
              setFieldTouched("email", true, false);
              validateField("email");
            }}
            onChange={(e) => {
              handleChange(e);
              validateField("email");
            }}
            onBlur={(e) => {
              handleBlur(e);
              validateField("email");
            }}
            error={touched.email && !!errors.email}
            errorMessage={errors.email}
            required={true}
            wrapperClassName="w-full space-y-2"
          /> */}

        {/* <InputWithProps
            label="Password"
            type="password"
            placeholder="Enter password"
            name="password"
            id="password"
            value={values.password}
            onFocus={() => {
              setFieldTouched("password", true, false);
              validateField("password");
            }}
            onChange={(e) => {
              handleChange(e);
              validateField("password");
            }}
            onBlur={(e) => {
              handleBlur(e);
              validateField("password");
            }}
            error={touched.password && !!errors.password}
            errorMessage={errors.password}
            required={true}
            wrapperClassName="w-full space-y-2"
          /> */}

        <ListboxWithProps
          label="Country"
          placeholder="Select a country"
          name="country"
          id="country"
          options={listboxOptions}
          value={values.country}
          onChange={(e) => {
            handleChange(e);
            validateField("country");
          }}
          onBlur={(e) => {
            handleBlur(e);
            validateField("country");
          }}
          error={touched.country && !!errors.country}
          errorMessage={errors.country}
          required={true}
          wrapperClassName="w-full space-y-2"
          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Form"}
        </button>
      </form>
    );
  }}
</Formik>;
