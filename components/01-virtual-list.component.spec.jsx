/// <reference types="Cypress" />
/// <reference types="cypress-wait-until" />

import React from "react";
import { mount } from "@cypress/react";

import { VirtualList } from "./VirtualList/VirtualList";

const createRenderItem = ({ height }) => ({ item }) => {
  return (
    <div
      style={{
        height,
        backgroundColor: parseInt(item.id.toString()) % 2 ? "#FAFAFA" : "#EEE",
      }}
    >
      id: {`${item.id} - ${item.name}`}
    </div>
  );
};

describe("VirtualList", () => {
  it("When the list receives 10000 items, then only the minimum number of them are rendered", () => {
    // Arrange
    const itemsAmount = 10000;
    const itemHeight = 30;
    const listHeight = 300;
    const items = [
      { id: 0, name: "Item 1" },
      { id: 1, name: "Item 2" },
      { id: 2, name: "Item 3" },
      { id: 3, name: "Item 4" },
      { id: 4, name: "Item 5" },
      { id: 5, name: "Item 6" },
      { id: 6, name: "Item 7" },
      { id: 7, name: "Item 8" },
      { id: 8, name: "Item 9" },
      { id: 9, name: "Item 10" },
      { id: 10, name: "Item 11" },
    ];

    // Act
    mount(
      <VirtualList
        items={items}
        getItemHeights={() => itemHeight}
        RenderItem={createRenderItem({ height: itemHeight })}
        listHeight={listHeight}
      />
    );

    // Assert

    // first not-rendered item check
    cy.findByText("Item 11").should("not.exist");
  });
});
