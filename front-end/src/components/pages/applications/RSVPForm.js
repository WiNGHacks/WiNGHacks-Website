import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useApi } from "../../auth/SessionProvider";
import MLHCoC from "./../../data/MLHCoC.pdf";

const meals = [
  "Saturday Breakfast",
  "Saturday Lunch",
  "Saturday Dinner",
  "Sunday Breakfast/Brunch",
  "I don't plan to eat at the venue",
];

export default function RSVPForm({ setAlreadyRSVP, setRSVPStatus }) {
  const api = useApi();
  const [step, setStep] = useState(1);
  const [selectedRSVP, setSelectedRSVP] = useState("");
  const [shirtSize, setShirtSize] = useState("");
  const [mealPreference, setMealPreference] = useState([]);
  const [dietRestriction, setDietRestriction] = useState("");
  const [mlhAccept, setMLHAccept] = useState(false);
  const [mlhShareData, setMLHShareData] = useState(false);
  const [mlhSendEmail, setMLHSendEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const preferencesComplete = Boolean(shirtSize && mealPreference.length);
  const agreementsComplete = mlhAccept && mlhShareData;

  const changeMeal = (event) => {
    const { value, checked } = event.target;
    setMealPreference((current) =>
      checked
        ? [...current, value]
        : current.filter((preference) => preference !== value),
    );
  };

  const submitRSVP = async (decision) => {
    if (submitting || !["yes", "no"].includes(decision)) return;
    if (decision === "yes" && (!preferencesComplete || !agreementsComplete))
      return;
    setSubmitError("");
    setSubmitting(true);
    const data = { acceptedRSVP: decision };
    if (decision === "yes") {
      Object.assign(data, {
        mealPreference: mealPreference.join(", "),
        dietRestriction,
        mlhAccept,
        mlhShareData,
        mlhSendEmail,
        shirtSize,
      });
    }
    try {
      await api.post("/rsvp/submit", data);
      setAlreadyRSVP(true);
      setRSVPStatus(decision);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Unable to save your RSVP. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="RSVP">
      {submitError && (
        <p className="rsvp-message rsvp-error" role="alert">
          {submitError}
        </p>
      )}
      {submitting && (
        <p className="rsvp-message" role="status">
          Saving your RSVP…
        </p>
      )}

      <form id="msform" onSubmit={(event) => event.preventDefault()}>
        {step === 1 && (
          <fieldset className="rsvp-welcome">
            <legend>Congratulations! 🥳 🎉</legend>
            <p className="rsvp-intro">
              You’ve been accepted to WiNGHacks! We’re excited to see what
              you’ll create and accomplish. Please confirm your attendance
              below.
            </p>
            <div className="rsvp-choice-group">
              <label className={selectedRSVP === "yes" ? "selected" : ""}>
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={selectedRSVP === "yes"}
                  onChange={(event) => setSelectedRSVP(event.target.value)}
                />
                <span>
                  <strong>Yes, I’m going!</strong>
                </span>
              </label>
              <label className={selectedRSVP === "no" ? "selected" : ""}>
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={selectedRSVP === "no"}
                  onChange={(event) => setSelectedRSVP(event.target.value)}
                />
                <span>
                  <strong>No, I can’t attend</strong>
                </span>
              </label>
            </div>
            <div className="rsvp-actions">
              <button
                type="button"
                className="rsvp-arrow next"
                aria-label={
                  selectedRSVP === "no"
                    ? "Confirm that I cannot attend"
                    : "Continue to preferences"
                }
                disabled={!selectedRSVP || submitting}
                onClick={() =>
                  selectedRSVP === "yes" ? setStep(2) : submitRSVP("no")
                }
              >
                <FiArrowRight aria-hidden="true" />
              </button>
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend>Event preferences</legend>
            <div className="rsvp-field">
              <label htmlFor="rsvp-shirt">
                Shirt size <span aria-hidden="true">*</span>
              </label>
              <select
                id="rsvp-shirt"
                value={shirtSize}
                onChange={(event) => setShirtSize(event.target.value)}
                required
              >
                <option value="">Choose a size</option>
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </div>

            <fieldset className="rsvp-meals">
              <legend>
                Meals you plan to attend <span aria-hidden="true">*</span>
              </legend>
              <div className="rsvp-checkbox-list">
                {meals.map((meal, index) => (
                  <label key={meal}>
                    <input
                      type="checkbox"
                      id={`meal-${index}`}
                      value={meal}
                      checked={mealPreference.includes(meal)}
                      onChange={changeMeal}
                    />
                    <span>{meal}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rsvp-field">
              <label htmlFor="rsvp-diet">
                Dietary restrictions <span>Optional</span>
              </label>
              <input
                id="rsvp-diet"
                value={dietRestriction}
                maxLength={500}
                onChange={(event) => setDietRestriction(event.target.value)}
                placeholder="Leave blank if none"
              />
            </div>

            <div className="rsvp-actions">
              <button
                type="button"
                className="secondary rsvp-arrow"
                aria-label="Back to attendance"
                onClick={() => setStep(1)}
              >
                <FiArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="rsvp-arrow next"
                aria-label="Continue to agreements"
                disabled={!preferencesComplete}
                onClick={() => setStep(3)}
              >
                <FiArrowRight aria-hidden="true" />
              </button>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend>Agreements</legend>
            <div className="rsvp-agreements">
              <label>
                <input
                  type="checkbox"
                  checked={mlhAccept}
                  onChange={(event) => setMLHAccept(event.target.checked)}
                />
                <span>
                  I have read and agree to the{" "}
                  <a href={MLHCoC} download="MLH_Code_of_Conduct.pdf">
                    MLH Code of Conduct
                  </a>
                  . <strong>*</strong>
                </span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={mlhShareData}
                  onChange={(event) => setMLHShareData(event.target.checked)}
                />
                <span>
                  I authorize WiNGHacks to share my registration information
                  with Major League Hacking for event administration and agree
                  to the{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                  >
                    MLH Contest Terms
                  </a>{" "}
                  and{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://mlh.io/privacy"
                  >
                    Privacy Policy
                  </a>
                  . <strong>*</strong>
                </span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={mlhSendEmail}
                  onChange={(event) => setMLHSendEmail(event.target.checked)}
                />
                <span>
                  MLH may send me occasional emails about events, opportunities,
                  and community announcements. <em>Optional</em>
                </span>
              </label>
            </div>

            <div className="rsvp-actions">
              <button
                type="button"
                className="secondary rsvp-arrow"
                aria-label="Back to preferences"
                onClick={() => setStep(2)}
              >
                <FiArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={!agreementsComplete || submitting}
                onClick={() => submitRSVP("yes")}
              >
                {submitting ? (
                  <>
                    <ClipLoader color="currentColor" size={12} /> Saving…
                  </>
                ) : (
                  "Submit RSVP"
                )}
              </button>
            </div>
          </fieldset>
        )}
      </form>
    </div>
  );
}
