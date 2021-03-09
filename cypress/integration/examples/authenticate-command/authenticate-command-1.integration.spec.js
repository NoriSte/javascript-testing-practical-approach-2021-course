/// <reference types="Cypress" />

import { newPost } from "../../../../realworld/frontend/src/components/Header";

const headers = { "Access-Control-Allow-Origin": "*" }

context("The custom command could be run before the test code", () => {
  it("Should leverage the custom authentication command", () => {
    cy.authenticateIntegration().should((user) => {
      expect(user).to.have.property("username").and.not.to.be.empty;
      expect(user).to.have.property("email").and.not.to.be.empty;
    });

    cy.intercept("GET", "/api/user", { fixture: "users/signup.json", headers }).as("get-user");
    cy.intercept("GET", "**/api/tags", { fixture: "tags/empty-tags.json", headers }).as("get-tags");
    cy.intercept("GET", "**/api/articles/feed**", {fixture: "articles/empty-articles", headers }).as("get-feed");

    cy.visit("/");

    cy.wait(["@get-user", "@get-tags", "@get-feed"]);

    cy.findByText(newPost).should("be.visible");
  });
});
