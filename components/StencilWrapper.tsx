import { my_component } from "stencil-components/dist/esm/my-component.entry";
import { gcds_button, gcds_alert, gcds_header, gcds_footer } from "@cdssnc/gcds-components/dist/esm/gcds-alert_40.entry";
import render from 'preact-render-to-string';

// To shut up TS.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'my-component': any;
        }
    }
}

// Converts Stencil VNodes to Preact VNodes.
function convertToPreact(node: any, curr: any): any {
    if (!node) {
        return null;
    }

    if (Array.isArray(node)) {
        for (let child of node) {
            if (child.$tag$) {
                let newNode: any = {
                    type: child.$tag$,
                    key: null,
                    props: {
                        children: undefined,
                    },
                    constructor: undefined,
                };

                curr.props.children.push(newNode)

                if (child.$children$) {
                    newNode.props.children = [];
                    convertToPreact(child.$children$, newNode);
                }
            } else if (node.length == 1) {
                curr.props.children = child.$text$;
            } else {
                curr.props.children.push(child.$text$);
            }
        }

        return;
    }

    let newNode: any = {};
    newNode.type = typeof node.$tag$ !== 'object' ? node.$tag$ : 'host';
    newNode.props = {};
    newNode.key = null;
    newNode.constructor = undefined;

    if (node.$children$) {
        newNode.props.children = [];
        convertToPreact(node.$children$, newNode);
    }

    return newNode;
}

// Component creation
export const MyComponent = (props: any) => StencilWrapper(props, my_component, "my-component");
export const GcdsButton = (props: any) => StencilWrapper(props, gcds_button, "gcds-button");
export const GcdsAlert = (props: any) => StencilWrapper(props, gcds_alert, "gcds-alert");
export const GcdsHeader = (props: any) => StencilWrapper(props, gcds_header, "gcds-header");
export const GcdsFooter = (props: any) => StencilWrapper(props, gcds_footer, "gcds-footer");

/**
 * This wrapper wraps the StencilJS WebComponent. Can render a StencilJS component using Declarative Shadow DOM (DSD).
 */
export function StencilWrapper(props: any, ctor: new(hostRef?: any) => HTMLElement, tagName: string) {
    let content;
    const Tag = tagName;

    // SSR rendering of component using DSD.
    if (!props.disableSSR && typeof window === 'undefined') {
        let { children, ...p } = props;

        // Pass properties through to the Stencil component.
        const instance = new ctor(new WeakMap()) as any;
        Object.assign(instance, p);

        // Convert the Stencil VNodes to Preact VNodes and append the component styles.
        // Stencil will remove the custom <style> tag upon hydration, but we have the correct styles this way from the get go.
        const renderResult = convertToPreact(instance.render(), null);
        let renderedHtml = render(renderResult);
        renderedHtml += `<style>${ctor.style}</style>`;

        /**
         * We use preacts render-to-string to render the StencilJS component, which uses preacts hyperscript (h) function internally.
         */
        content = (
            <Tag {...props}>
                <template {...{ shadowrootmode: "open" }} shadowrootdelegatesfocus dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                {props.children}
            </Tag>
        );
    } else {
        // For the client (and for React to not cause hydration errors), this is the DOM react should see and work with.
        content = (
            <Tag {...props}>
                {props.children}
            </Tag>
        );
    }

    return content;
}