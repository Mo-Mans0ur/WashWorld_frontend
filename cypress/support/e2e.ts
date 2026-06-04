import "./commands";
import "cypress-real-events";

beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
