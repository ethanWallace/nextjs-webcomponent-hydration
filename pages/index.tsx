import Head from "next/head";
import { useEffect } from 'react'


const loadWebComponent = async () => {
  // const HelloComponent = await import("./../webcomponents/hello.js");
  const SsrComponent = await import("./../webcomponents/ssr.mjs");
};

export default function Home() {
  useEffect(() => {
    setTimeout(() => {
      loadWebComponent().catch(console.error);
    })
  }, [])
  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{
      __html: `
          window.addEventListener('load', () => {
            console.log("polyfill");
            (function attachShadowRoots(root) {
              root.querySelectorAll("template[shadowroot]").forEach(template => {
                const mode = template.getAttribute("shadowroot");
                const shadowRoot = template.parentNode.attachShadow({ mode });
                shadowRoot.appendChild(template.content);
                template.remove();
                attachShadowRoots(shadowRoot);
              });
            })(document);
          }); `
        }}/>
      </Head>
      { /* 
      <p>
      This WebComponent requires a patch from react-dom to ignore Declarative Shadow DOM template shadowroot="open" tags.
      Currently they are still handles as normal HostElementss from react and the reconciler creates a fiber from them.

      Click on this component and see console log. Two events should appear, one from reacts onClick (SyntheticBaseEvent) and one from a internally registered onclick handler (PointerEvent).
      </p>

      <hello-comp>
        <template shadowroot="open">
          <button type="button">
            <slot></slot>
          </button>
        </template>
        <span onClick={console.log}>Hello</span>
      </hello-comp>
      */ }

      <hr />

      {/*
      <p>
      This WebComponent is fully compatible. We create the declarative shadow dom in the server.js so its not part of react.
      When the browser parses the added template shadowroot="open", it is instantly converted to a #shadow-root fragment by the browser before
      react even notices something is up behind its back :).
      </p>
      */}

      <ssr-compatible-comp>
        Hello from SSR and fully compatible react hydration WITHOUT warnings.
        <button type="button" onClick={console.log}>Btn</button>
      </ssr-compatible-comp>
    </>
  )
}
