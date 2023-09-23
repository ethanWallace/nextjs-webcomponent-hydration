import { Wrapper } from "@/components/Wrapper";
import { useEffect } from 'react'


const loadWebComponent = async () => {
  const SsrComponent = await import("./../webcomponents/ssr.mjs");
  SsrComponent.define();
};

export default function Home() {

  // Define the webcomponent on the client.
  useEffect(() => {
    loadWebComponent().catch(console.error);
  }, [])
  return (
    <>
      <hr />

      {/*
      <p>
      This WebComponent is fully compatible. We create the declarative shadow dom in the server.js so its not part of react.
      When the browser parses the added template shadowroot="open", it is instantly converted to a #shadow-root fragment by the browser before
      react even notices something is up behind its back :).
      </p>
      */}

      <Wrapper>
        <p>Hello from SSR and fully compatible react hydration WITHOUT warnings.</p>
        <button type="button" onClick={() => alert("hi from react/nextjs")}>Click me</button>
      </Wrapper>
    </>
  )
}
