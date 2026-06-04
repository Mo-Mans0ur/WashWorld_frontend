// setReactInput: sets a controlled React input's value and fires the input
// event using the AUT's own window — cross-frame events are silently dropped.
Cypress.Commands.add("setReactInput", { prevSubject: "element" }, (subject, value: string) => {
  cy.window().then((win) => {
    const input = subject[0] as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      (win as typeof window).HTMLInputElement.prototype,
      "value"
    )!.set!;
    setter.call(input, value);
    input.dispatchEvent(
      new (win as typeof window).InputEvent("input", { bubbles: true, cancelable: true })
    );
  });
});

// nativeClick: dispatches a real MouseEvent in the AUT's window context so
// React's event delegation on the root container catches it.
Cypress.Commands.add("nativeClick", { prevSubject: "element" }, (subject) => {
  cy.window().then((win) => {
    const el = subject[0] as HTMLElement;
    el.dispatchEvent(
      new (win as typeof window).MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: win as typeof window,
      })
    );
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      setReactInput(value: string): Chainable<Element>;
      nativeClick(): Chainable<Element>;
    }
  }
}

export {};
