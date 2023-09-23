// Hacky check if nodejs or browser. We just want access to the template() static function for ssr.
if (typeof process !== 'undefined' && process.version != "") {
  console.log("Rewrite HTMLElement");
  global.HTMLElement = class { constructor() { } };
}

import { createRoot } from 'react-dom/client';

export default class SsrWebComponent extends HTMLElement {
  constructor() {
    super();

    let shadow = this.shadowRoot;
    if (!shadow) {
      console.log("Attach shadow");
      shadow = this.attachShadow({ mode: 'open' });
      const root = createRoot(shadow);
      root.render(SsrWebComponent.template());
    } else {
      console.log("Reuse ShadowRoot from DSD");
    }
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
