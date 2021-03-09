/// <reference types="Cypress" />

import { newPost } from "../../../realworld/frontend/src/components/Header";

Cypress.Commands.add("authenticateAndVisitIntegration", path => {
  cy.intercept("GET", "**/api/user", {
    fixture: "users/signup",
    headers: { "Access-Control-Allow-Origin": "*" }
  }).as("get-user");
  cy.fixture("users/signup")
    .its("user")
    .should(
      user =>
        expect(user)
          .to.have.property("token")
          .and.to.be.a("string").and.not.to.be.empty
    )
    .then(user => localStorage.setItem("jwt", user.token));
  cy.visit(path);
  cy.wait("@get-user");
  cy.findByText(newPost).should("be.visible");
});
