import { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { httpClient } from "../config/AxiosHelper";

const SignupView = ({ onBack }) => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      name: details.name.trim() ? "" : "Enter your name",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())
        ? ""
        : "Enter a valid work email",
      username: /^[a-zA-Z0-9._-]{3,24}$/.test(details.username.trim())
        ? ""
        : "Use 3-24 letters, numbers, dots, dashes, or underscores",
      password: details.password.length >= 8
        ? ""
        : "Use at least 8 characters",
    };

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await httpClient.post("/register", {
        name: details.name.trim(),
        email: details.email.trim(),
        username: details.username.trim(),
        password: details.password,
      });
      const responseMessage = response.data?.message ?? response.data;

      setStatus({
        type: "success",
        message: typeof responseMessage === "string" && responseMessage
          ? responseMessage
          : "Account created successfully. You can now join your team.",
      });
    } catch (error) {
      const responseMessage = error.response?.data?.message ?? error.response?.data;

      setStatus({
        type: "error",
        message: typeof responseMessage === "string" && responseMessage
          ? responseMessage
          : "Unable to create your account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-card">
      <button className="signup-back" type="button" onClick={onBack}>
        <FiArrowLeft aria-hidden="true" />
        Back to team join
      </button>
      <p className="signup-eyebrow">CREATE YOUR ACCOUNT</p>
      <h2 className="signup-title">Make work more connected.</h2>
      <p className="signup-copy">Set up your Meetin profile to get started with your team.</p>

      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <div className="signup-field">
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Alex Morgan"
            value={details.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "signup-name-error" : undefined}
          />
          {errors.name && <span id="signup-name-error" className="signup-error">{errors.name}</span>}
        </div>

        <div className="signup-field">
          <label htmlFor="signup-email">Work email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={details.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
          />
          {errors.email && <span id="signup-email-error" className="signup-error">{errors.email}</span>}
        </div>

        <div className="signup-field">
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            value={details.username}
            onChange={handleChange}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "signup-username-error" : undefined}
          />
          {errors.username && <span id="signup-username-error" className="signup-error">{errors.username}</span>}
        </div>

        <div className="signup-field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={details.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "signup-password-error" : undefined}
          />
          {errors.password && <span id="signup-password-error" className="signup-error">{errors.password}</span>}
        </div>

        {status && (
          <p className={`signup-notice signup-notice--${status.type}`} role={status.type === "error" ? "alert" : "status"}>
            {status.message}
          </p>
        )}

        <button className="signup-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
          <FiArrowRight aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};

export default SignupView;