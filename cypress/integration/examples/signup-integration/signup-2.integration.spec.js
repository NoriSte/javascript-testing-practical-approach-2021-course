/// <reference types="Cypress" />

import { paths } from "../../../../realworld/frontend/src/components/App";
import { noArticles } from "../../../../realworld/frontend/src/components/ArticleList";
import { strings } from "../../../../realworld/frontend/src/components/Register";

const headers = { "Access-Control-Allow-Origin": "*" }

context("Signup flow", () => {
  it("The happy path should work", () => {
    const user = {
      username: "Tester",
      email: "user@realworld.io",
      password: "mysupersecretpassword"
    };

    // set up AJAX call interception
    cy.intercept("POST", "**/api/users", { fixture: "users/signup", headers }).as("signup-request");
    cy.intercept("GET", "**/api/tags", { fixture: "tags/empty-tags", headers }).as("tags");
    cy.intercept("GET", "**/api/articles/feed**", { fixture: "articles/empty-articles", headers }).as("feed");

    cy.visit(paths.register);

    // form filling
    cy.findByPlaceholderText(strings.username)
      .type(user.username)
    cy.findByPlaceholderText(strings.email)
      .type(user.email)
    cy.findByPlaceholderText(strings.password)
      .type(user.password);

    // form submit...
    cy.get("form")
      .within(() => cy.findByText(strings.signUp).click());

    // ... and AJAX call waiting
    cy.wait("@signup-request")
      .should(interception =>
        expect(interception.request.body).deep.equal({
          user: {
            username: user.username,
            email: user.email,
            password: user.password
          }
        })
      )
      .wait(["@tags", "@feed"]);

    // end of the flow
    cy.findByText(noArticles).should("be.visible");
  });
});
