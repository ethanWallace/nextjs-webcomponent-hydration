import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />

        <script dangerouslySetInnerHTML={{
          __html: `
              (function attachShadowRoots(root) {
                root.querySelectorAll("template[shadowrootmode]").forEach(template => {
                  console.log("shadowroot found");
                  const mode = template.getAttribute("shadowrootmode");
                  const shadowRoot = template.parentNode.attachShadow({ mode });
                  shadowRoot.appendChild(template.content);
                  template.remove();
                  attachShadowRoots(shadowRoot);
                });
              })(document);
            `}} />
        <NextScript />
      </body>
    </Html>
  )
}
