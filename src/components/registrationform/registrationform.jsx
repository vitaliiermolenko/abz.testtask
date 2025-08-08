import React, { useState, useCallback } from "react";
import "./registrationform.scss";
import { ReactComponent as Success } from "../../assets/success-image.svg";

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

  const checkFormValid = useCallback((values) => {
    let temp = {};

    temp.name = values.name.trim().length >= 2 ? "" : "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    temp.email = emailRegex.test(values.email) ? "" : "Invalid email";
    const phoneRegex = /^\+380\d{9}$/;
    temp.phone = phoneRegex.test(values.phone)
      ? ""
      : "Invalid phone number, should start with +380 and have 9 digits";
    temp.position = values.position ? "" : "Position is required";
    temp.photo = values.photo ? "" : "Photo is required";

    return Object.values(temp).every((x) => x === "");
  }, []);

  const validate = useCallback(
    (fieldValues = formData) => {
      let temp = { ...errors };

      if ("name" in fieldValues)
        temp.name =
          fieldValues.name.trim().length >= 2 ? "" : "Name is required";

      if ("email" in fieldValues) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        temp.email = emailRegex.test(fieldValues.email) ? "" : "Invalid email";
      }

      if ("phone" in fieldValues) {
        const phoneRegex = /^\+380\d{9}$/;
        temp.phone = phoneRegex.test(fieldValues.phone)
          ? ""
          : "Invalid phone number, should start with +380 and have 9 digits";
      }

      if ("position" in fieldValues)
        temp.position = fieldValues.position ? "" : "Position is required";

      if ("photo" in fieldValues)
        temp.photo = fieldValues.photo ? "" : "Photo is required";

      setErrors(temp);

      if (fieldValues === formData)
        return Object.values(temp).every((x) => x === "");
    },
    [formData, errors]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;
      const val = files ? files[0] : value;

      setFormData((prev) => ({ ...prev, [name]: val }));
      setTouched((prev) => ({ ...prev, [name]: true }));
      validate({ [name]: val });
    },
    [validate]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      validate({ [name]: formData[name] });
    },
    [formData, validate]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (checkFormValid(formData)) {
        const data = new FormData();
        data.append("name", formData.name.trim());
        data.append("email", formData.email.trim());
        data.append("phone", formData.phone.trim());
        data.append("position_id", formData.position);
        data.append("photo", formData.photo);

        try {
          const tokenRes = await fetch(
            "https://frontend-test-assignment-api.abz.agency/api/v1/token",
            { method: "POST" }
          );
          const tokenData = await tokenRes.json();
          if (tokenData.success) {
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
              if (onUserRegistered) onUserRegistered();
            } else {
              alert(result.message || "Registration failed");
            }
          } else {
            alert("Failed to get token");
          }
        } catch (error) {
          console.error("Registration error:", error);
          alert("Registration error");
        }
      } else {
        setTouched({
          name: true,
          email: true,
          phone: true,
          position: true,
          photo: true,
        });
        validate();
      }
    },
    [formData, checkFormValid, validate, onUserRegistered]
  );

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
        <div
          className="submission-placeholder"
          style={{ maxWidth: "328px", margin: "0 auto" }}
        >
          <Success style={{ width: "100%", height: "auto" }} />
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
                className={`number ${
                  touched.phone && errors.phone ? "invalid" : ""
                }`}
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

          <div
            className={`radiogroup ${
              touched.position && errors.position ? "invalid" : ""
            }`}
          >
            <p>Select your position</p>
            <div className="radiobuttons">
              {[1, 2, 3, 4].map((id) => (
                <label key={id}>
                  <input
                    type="radio"
                    name="position"
                    value={id}
                    checked={formData.position === String(id)}
                    onChange={handleChange}
                    required
                  />
                  {id === 1 && "Lawyer"}
                  {id === 2 && "Content manager"}
                  {id === 3 && "Security"}
                  {id === 4 && "Designer"}
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
            <button type="submit" disabled={!checkFormValid(formData)}>
              Sign up
            </button>
          </div>
        </form>
      )}
    </section>
  );
});

export default RegistrationForm;
