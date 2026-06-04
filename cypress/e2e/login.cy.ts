const API = "http://localhost:8080";

const MOCK_USER = {
  user_id: "test-user-id-123",
  user_email: "washworldtest2026@gmail.com",
  user_firstname: "Test",
  user_lastname: "Bruger",
  user_phone: "12345678",
  user_created_at: "2024-01-01T00:00:00Z",
  user_updated_at: "2024-01-01T00:00:00Z",
  user_deleted_at: null,
  user_verified_at: "2024-01-01T00:00:00Z",
};

const EMAIL = "simonmelbyeandersen@gmail.com";
const PASSWORD = "12345678";

describe("Login flow", () => {
  const stubUserValidation = () =>
    cy.intercept("GET", `${API}/api/users/**`, {
      statusCode: 200,
      body: MOCK_USER,
    });

  // ------------------------------------------------------------------ happy path
  it("redirects to /dashboard after successful login", () => {
    cy.intercept("POST", `${API}/api/auth/login`, {
      statusCode: 200,
      body: { token: "fake-jwt-token", user: MOCK_USER },
    }).as("loginRequest");

    stubUserValidation();

    cy.visit("/login");
    cy.get('[placeholder="Email"]').type(EMAIL);
    cy.get('[placeholder="Kodeord"]').type(PASSWORD);
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.url().should("include", "/dashboard");
  });

  // ------------------------------------------------------------------ error state
  it("shows error message on invalid credentials", () => {
    cy.intercept("POST", `${API}/api/auth/login`, {
      statusCode: 401,
      body: { message: "Ugyldigt brugernavn eller kodeord" },
    }).as("loginRequest");

    cy.visit("/login");
    cy.get('[placeholder="Email"]').type("wrong@example.com");
    cy.get('[placeholder="Kodeord"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.contains("Ugyldigt brugernavn eller kodeord").should("be.visible");
    cy.url().should("include", "/login");
  });

  // ------------------------------------------------------------------ input validation
  it("shows red border and validation hint when email is too short", () => {
    cy.visit("/login");

    cy.get('[placeholder="Email"]').setReactInput("ab");
    cy.get('[placeholder="Email"]').should("have.value", "ab");
    cy.contains("Min. 5 tegn").should("be.visible");
    cy.get('[placeholder="Email"]')
      .invoke("attr", "class")
      .should("include", "border-red-400");
  });

  it("shows green border when email meets minimum length", () => {
    cy.visit("/login");

    cy.get('[placeholder="Email"]').setReactInput("test@test.com");
    cy.get('[placeholder="Email"]').should("have.value", "test@test.com");
    cy.get('[placeholder="Email"]')
      .invoke("attr", "class")
      .should("include", "border-green-400");
  });

  it("shows red border and validation hint when password is too short", () => {
    cy.visit("/login");

    cy.get('[placeholder="Kodeord"]').setReactInput("short");
    cy.get('[placeholder="Kodeord"]').should("have.value", "short");
    cy.contains("Min. 8 tegn").should("be.visible");
    cy.get('[placeholder="Kodeord"]')
      .invoke("attr", "class")
      .should("include", "border-red-400");
  });

  // ------------------------------------------------------------------ password visibility toggle
  it("toggles password visibility when the eye button is clicked", () => {
    cy.visit("/login");

    cy.get('[placeholder="Kodeord"]').should("have.attr", "type", "password");

    cy.get('[aria-label="Vis kodeord"]').nativeClick();
    cy.get('[placeholder="Kodeord"]').should("have.attr", "type", "text");

    cy.get('[aria-label="Skjul kodeord"]').nativeClick();
    cy.get('[placeholder="Kodeord"]').should("have.attr", "type", "password");
  });

  // ------------------------------------------------------------------ loading state
  it("disables the submit button and shows loading text while submitting", () => {
    cy.intercept("POST", `${API}/api/auth/login`, (req) => {
      req.reply({
        delay: 1500,
        statusCode: 200,
        body: { token: "fake-jwt-token", user: MOCK_USER },
      });
    }).as("slowLogin");

    stubUserValidation();

    cy.visit("/login");
    cy.get('[placeholder="Email"]').type(EMAIL);
    cy.get('[placeholder="Kodeord"]').type(PASSWORD);
    cy.get('button[type="submit"]').click();

    cy.contains("Logger ind...").should("be.visible");
    cy.get('button[type="submit"]').should("be.disabled");

    cy.wait("@slowLogin");
  });

  // ------------------------------------------------------------------ navigation
  it("navigates to /signup when 'Ny bruger' is clicked", () => {
    cy.visit("/login");
    cy.contains("Ny bruger").click();
    cy.url().should("include", "/signup");
  });

  it("navigates to /reset-password when 'Nulstil det her' is clicked", () => {
    cy.visit("/login");
    cy.contains("Nulstil det her").click();
    cy.url().should("include", "/reset-password");
  });
});
