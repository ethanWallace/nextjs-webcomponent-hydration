// Hacky check if nodejs or browser. We just want access to the template() static function for ssr.
if (typeof process !== 'undefined' && process.version != "") {
  console.log("Rewrite HTMLElement");
  global.HTMLElement = class { constructor() { } };
}

import { createRoot } from 'react-dom/client';
import { render } from "preact-render-to-string";

export default class SsrWebComponent extends HTMLElement {
  constructor() {
    super();

    let shadow = this.shadowRoot;

    // TODO: Maybe a react root should always be created even if an DSD shadowroot already exists, 
    // because there may be code in the component which is only invoked on the client, which changes the component.
    // But for this example this works and shows that we are not recreating the shadowRoot, but reuse the one from DSD.
    if (!shadow) {
      console.log("Attach shadow");
      shadow = this.attachShadow({ mode: 'open' });
      const root = createRoot(shadow);
      root.render(SsrWebComponent.template());
    } else {
      console.log("Reuse ShadowRoot from DSD");
    }
  }

  connectedCallback() {
    console.log("ssr-compatible-comp connected");
  }

  // We use this as SSR base as well as fallback, if only client side initialization is used.
  // On SSR, we need to add the declarative shadow dom template.
  static template() {
    return (
      <>
        <style>
          {`
          strong {
              color: red;
          }
          ::slotted(button) {
            background-color: black;
            color: white;
            padding: 10px 15px;
            border: 0;
            text-transform: uppercase;
            cursor: pointer;
          }

          ::slotted(button:hover) {
            background-color: #555;
          }
          `}
        </style>
        <strong>
          <slot></slot>
        </strong>
      </>
      )
  }
}

// Defines the WebComponent at the CustomElementRegistry.
export function define() {
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    // TODO: Check if component is already registered, to work with HMR.
    if(!customElements.get('ssr-compatible-comp')) {
      console.log("Define ssr-compatible-comp");
      customElements.define('ssr-compatible-comp', SsrWebComponent);
    }
  }
}
