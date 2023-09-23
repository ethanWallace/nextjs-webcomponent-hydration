import { my_component } from "stencil-components/dist/esm/my-component.entry";
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
function convertToPreact(node: any, curr: any) : any {
    if(!node) {
        return null;
    }

    if(Array.isArray(node)) {
        for(let child of node) {
            if(child.$tag$) {
                let newNode: any = {
                    type: child.$tag$,
                    key: null,
                    props: {
                        children: undefined,
                    },
                    constructor: undefined,
                };

                curr.props.children.push(newNode)

                if(child.$children$) {
                    newNode.props.children = [];
                    convertToPreact(child.$children$, newNode);
                }
            } else if(node.length == 1) {
                curr.props.children = child.$text$;
            } else {
                curr.props.children.push(child.$text$);
            }
        }

        return;
    }

    let newNode: any = {};
    newNode.type = node.$tag$;
    newNode.props = {};
    newNode.key = null;
    newNode.constructor = undefined;

    if(node.$children$) {
        newNode.props.children = [];
        convertToPreact(node.$children$, newNode);
    }

    return newNode;
}

/**
 * This wrapper wraps the StencilJS WebComponent.
 */
export function StencilWrapper(props: any) {
    let content;
    
    if (typeof window === 'undefined') {
        let {children, ...p} = props;

        // Pass properties through to the Stencil component.
        const instance = new my_component(new WeakMap()) as any;
        Object.assign(instance, p);

        // Convert the Stencil VNodes to Preact VNodes and append the component styles.
        // Stencil will remove the custom <style> tag upon hydration, but we have the correct styles this way from the get go.
        const renderResult = convertToPreact(instance.render(), null);
        let renderedHtml = render(renderResult);
        renderedHtml += `<style>${my_component.style}</style>`;
        
        /**
         * We use preacts render-to-string to render the StencilJS component, which uses preacts hyperscript (h) function internally.
         */
        content = (
            <my-component {...props}>
                <template {...{ shadowRootMode: "open" }} dangerouslySetInnerHTML={{__html: renderedHtml}}/>
                {props.children}
            </my-component>
        );
    } else {
        // For the client (and for React to not cause hydration errors), this is the DOM react should see and work with.
        content = (
            <my-component {...props}>
                {props.children}
            </my-component>
        );
    }

    return content;
}