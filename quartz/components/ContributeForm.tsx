import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

// Isaac: replace this with your deployed Apps Script URL after running the deploy steps in the brief
const APPS_SCRIPT_URL = "REPLACE_WITH_APPS_SCRIPT_URL"

const ContributeForm: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "contribute") return null

  return (
    <div class="ok-form-wrapper">
      <form id="ok-contribute-form" class="ok-form" noValidate>
        <div class="ok-form-group">
          <label for="ok-topic">
            Topic name <span class="ok-required" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="ok-topic"
            name="topic"
            required
            placeholder="e.g. The Kapenguria Trial, Mombasa Old Town, Iten and Athletics"
          />
        </div>

        <div class="ok-form-group">
          <label for="ok-why">
            Why it matters <span class="ok-required" aria-hidden="true">*</span>
          </label>
          <textarea
            id="ok-why"
            name="why"
            required
            rows={4}
            placeholder="What story should Our Kenya tell about this topic? Why does it belong in the graph?"
          />
        </div>

        <div class="ok-form-group">
          <label for="ok-sources">
            Sources or links <span class="ok-optional">(optional)</span>
          </label>
          <textarea
            id="ok-sources"
            name="sources"
            rows={3}
            placeholder="Books, articles, Wikipedia links, newspaper archives..."
          />
        </div>

        <div class="ok-form-group">
          <label for="ok-email">
            Your email <span class="ok-optional">(optional)</span>
          </label>
          <input
            type="email"
            id="ok-email"
            name="email"
            placeholder="Only used to follow up if we have questions"
          />
        </div>

        <button type="submit" class="ok-btn ok-btn-primary">
          Submit suggestion
        </button>

        <p id="ok-form-status" class="ok-form-status" aria-live="polite" aria-atomic="true" />
      </form>

      <p class="ok-form-note">
        Isaac reviews every suggestion. Approved topics are researched and written before being
        added to the vault. This is how the archive grows.
      </p>
    </div>
  )
}

ContributeForm.css = `
.ok-form-wrapper {
  margin-top: 2rem;
}

.ok-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 600px;
}

.ok-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.ok-form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark);
}

.ok-required {
  color: #BB0000;
  margin-left: 2px;
}

.ok-optional {
  font-weight: 400;
  color: var(--gray);
  font-size: 0.825rem;
}

.ok-form input[type="text"],
.ok-form input[type="email"],
.ok-form textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--lightgray);
  border-radius: 4px;
  font-family: var(--bodyFont);
  font-size: 0.9rem;
  color: var(--dark);
  background: var(--light);
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.ok-form input[type="text"]:focus,
.ok-form input[type="email"]:focus,
.ok-form textarea:focus {
  outline: none;
  border-color: #006B3F;
  box-shadow: 0 0 0 2px rgba(0, 107, 63, 0.12);
}

.ok-form textarea {
  resize: vertical;
  min-height: 80px;
}

.ok-btn {
  display: inline-block;
  padding: 0.625rem 1.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: background 0.15s ease, opacity 0.15s ease;
}

.ok-btn-primary {
  background: #006B3F;
  color: #fff;
  align-self: flex-start;
}

.ok-btn-primary:hover {
  background: #005530;
  color: #fff;
  text-decoration: none;
}

.ok-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ok-form-status {
  font-size: 0.875rem;
  min-height: 1.25rem;
  margin-top: 0.25rem;
}

.ok-form-status.ok-form-success {
  color: #006B3F;
  font-weight: 600;
}

.ok-form-status.ok-form-error {
  color: #BB0000;
}

.ok-form-note {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--gray);
  max-width: 600px;
  font-style: italic;
}
`

ContributeForm.afterDOMLoaded = `
;(function() {
  const ENDPOINT = "${APPS_SCRIPT_URL}";

  function initForm() {
    const form = document.getElementById("ok-contribute-form");
    if (!form) return;

    // Remove any previous listener by cloning
    const fresh = form.cloneNode(true);
    form.parentNode.replaceChild(fresh, form);

    fresh.addEventListener("submit", function(e) {
      e.preventDefault();
      const status = document.getElementById("ok-form-status");
      const btn = fresh.querySelector("button[type='submit']");
      const topic = fresh.querySelector("#ok-topic").value.trim();
      const why = fresh.querySelector("#ok-why").value.trim();

      if (!topic || !why) {
        status.textContent = "Please fill in the topic name and why it matters.";
        status.className = "ok-form-status ok-form-error";
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending...";

      const data = {
        topic: topic,
        why: why,
        sources: fresh.querySelector("#ok-sources").value.trim(),
        email: fresh.querySelector("#ok-email").value.trim()
      };

      // Optimistic UX: show success immediately, fire-and-forget
      status.textContent = "Thank you. Your suggestion has been received.";
      status.className = "ok-form-status ok-form-success";
      fresh.reset();
      btn.disabled = false;
      btn.textContent = "Submit suggestion";

      fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }).catch(function() {});
    });
  }

  document.addEventListener("nav", initForm);
  initForm();
})();
`

export default (() => ContributeForm) satisfies QuartzComponentConstructor
