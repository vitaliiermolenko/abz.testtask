import React, { useState, useCallback, useMemo } from "react";
import "./registrationform.scss";
import { ReactComponent as Success } from "../../assets/success-image.svg";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

const positions = [
  { id: 1, name: "Lawyer" },
  { id: 2, name: "Content manager" },
  { id: 3, name: "Security" },
  { id: 4, name: "Designer" }
];

const RegistrationForm = React.memo(({ onUserRegistered }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = useCallback((values) => {
    const errs = {};
    if (!values.name.trim() || values.name.trim().length < 2)
      errs.name = "Name is required";
    if (!emailRegex.test(values.email))
      errs.email = "Invalid email";
    if (!phoneRegex.test(values.phone))
      errs.phone = "Invalid phone number, should start with +380 and have 9 digits";
    if (!values.position)
      errs.position = "Position is required";
    if (!values.photo)
      errs.photo = "Photo is required";
    return errs;
  }, []);

  const isFormValid = useMemo(
    () => Object.keys(validate(formData)).length === 0,
    [formData, validate]
  );

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    const val = files ? files[0] : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: val };
      setErrors(validate(updated));
      return updated;
    });

    setTouched(prev => ({ ...prev, [name]: true }));
  }, [validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  }, [formData, validate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const formErrors = validate(formData);

    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    const data = new FormData();
    Object.entries({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      position_id: formData.position,
      photo: formData.photo
    }).forEach(([key, value]) => data.append(key, value));

    try {
      const tokenRes = await fetch(
        "https://frontend-test-assignment-api.abz.agency/api/v1/token",
        { method: "POST" }
      );
      const tokenData = await tokenRes.json();
      if (!tokenData.success) throw new Error("Failed to get token");

      const registerRes = await fetch(
        "https://frontend-test-assignment-api.abz.agency/api/v1/users",
        {
          method: "POST",
          headers: { Token: tokenData.token },
          body: data,
        }
      );
      const result = await registerRes.json();

      if (result.success) {
        setIsSubmitted(true);
        onUserRegistered?.();
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration error");
    }
  }, [formData, validate, onUserRegistered]);

  return (
    <section id="registration-form" className="registration-form">
      <div className="headtitle">
        <h1>
          {isSubmitted
            ? "User successfully registered!"
            : "Working with POST request"}
        </h1>
      </div>

      {isSubmitted ? (
        <div className="submission-placeholder">
          <Success className="success-icon" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="textform">
            <input
              type="text"
              name="name"
              placeholder="Ім’я"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? "invalid" : ""}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? "invalid" : ""}
              required
            />

            <div className="phone-group">
              <input
                className={`number ${touched.phone && errors.phone ? "invalid" : ""}`}
                type="tel"
                name="phone"
                placeholder="Номер телефону"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <small>Формат: +38 (XXX) XXX - XX - XX</small>
            </div>
          </div>

          <div className={`radiogroup ${touched.position && errors.position ? "invalid" : ""}`}>
            <p>Select your position</p>
            <div className="radiobuttons">
              {positions.map(({ id, name }) => (
                <label key={id}>
                  <input
                    type="radio"
                    name="position"
                    value={id}
                    checked={formData.position === String(id)}
                    onChange={handleChange}
                    required
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>

          <div className="fileform">
            <input
              type="file"
              name="photo"
              accept="image/jpeg, image/jpg"
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.photo && errors.photo ? "invalid" : ""}
              required
            />
          </div>

          <div className="formbutton">
            <button type="submit" disabled={!isFormValid}>
              Sign up
            </button>
          </div>
        </form>
      )}
    </section>
  );
});

export default RegistrationForm;
