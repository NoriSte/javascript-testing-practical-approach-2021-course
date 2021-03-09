/// <reference types="Cypress" />

import { paths } from "../../../../realworld/frontend/src/components/App";

context("Signup flow", () => {
  it("Should show an error if the back-end report that the email has already been used", () => {
    const body = { errors: { email: "is already taken." } };
    const user = {
      username: "Tester",
      email: "user@realworld.io",
      password: "mysupersecretpassword"
    };

    cy.intercept("POST", "**/api/users", {
      body,
      statusCode: 422,
      headers: { "Access-Control-Allow-Origin": "*" },
    }).as("signup-request");

    cy.visit(paths.register);

    cy.window()
      .its("appActions")
      .invoke("signup", user);

    cy.wait("@signup-request");

    cy.findByText(`email ${body.errors.email}`).should("be.visible");
  });

  it("Should show some errors if the back-end reports that some data has already been used", () => {
    const body = { errors: { username: "is already taken.", email: "is already taken." } };
    const user = {
      username: "Tester",
      email: "user@realworld.io",
      password: "mysupersecretpassword"
    };

    cy.intercept("POST", "**/api/users", {
      body,
      statusCode: 422,
      headers: { "Access-Control-Allow-Origin": "*" }
    }).as("signup-request");

    cy.visit(paths.register);

    cy.window()
      .its("appActions")
      .invoke("signup", user);

    cy.wait("@signup-request");

    Object.entries(body.errors).map(([subject, error]) => {
      cy.findByText(`${subject} ${error}`).should("be.visible");
    });
  });
});
