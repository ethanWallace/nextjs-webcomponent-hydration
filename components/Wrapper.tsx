import SsrWebComponent from "@/webcomponents/ssr.mjs";

import * as React from 'react'

// To shut up TS.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ssr-compatible-comp': any;
    }
  }
}

export function Wrapper({children}: {children: any}) {
    let content;
    if(typeof window === 'undefined') {
        /**
         * Here we create a DSD wrapper on the server and set the components code as innerHTML.
         * This could be for example StencilJS render() result.
         */
        content = (
            <ssr-compatible-comp>
                <template {...{shadowRootMode: "open"}}>
                    {SsrWebComponent.template()}
                </template>
                {children}
            </ssr-compatible-comp>
        );
    } else {
        content = (
            <ssr-compatible-comp>
                {children}
            </ssr-compatible-comp>
        );
    }

    return content;
}