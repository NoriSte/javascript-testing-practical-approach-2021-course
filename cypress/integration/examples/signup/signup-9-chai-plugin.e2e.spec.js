/// <reference types="Cypress" />

import { paths } from "../../../../realworld/frontend/src/components/App";
import { noArticles } from "../../../../realworld/frontend/src/components/ArticleList";
import { strings } from "../../../../realworld/frontend/src/components/Register";

context("Signup flow", () => {
  it("The happy path should work", () => {
    const random = Math.floor(Math.random() * 100000);
    const user = {
      username: `Tester${random}`,
      email: `user+${random}@realworld.io`,
      password: "mysupersecretpassword"
    };
    // set up AJAX call interception
    cy.intercept("POST", "**/api/users").as("signup-request");

    cy.visit(paths.register);

    // form filling
    cy.findByPlaceholderText(strings.username).type(user.username);
    cy.findByPlaceholderText(strings.email).type(user.email);
    cy.findByPlaceholderText(strings.password).type(user.password);

    // form submit...
    cy.get("form")
      .within(() => cy.findByText(strings.signUp).click());

    // ... and AJAX call waiting
    cy.wait("@signup-request").should(interception => {
      expect(interception).to.containSubset({
        request: {
          body: {
            user: {
              username: user.username,
              email: user.email,
              password: user.password
            }
          }
        },
        response: {
          statusCode: 200,
          body: {
            user: {
              username: user.username.toLowerCase(),
              email: user.email
            }
          }
        }
      });

      expect(interception.response.body.user)
        .to.have.property("token")
        .and.to.be.a("string").and.not.to.be.empty;
    });

    // end of the flow
    cy.findByText(noArticles).should("be.visible");
  });
});
