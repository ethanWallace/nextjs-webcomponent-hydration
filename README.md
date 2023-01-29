## WebComponent with React/NextJS SSR and Hydration

This is a proof of concept on how SSR and WebComponents can work together. This currently requires a custom patch in the `react-dom` package.

The WebComponent uses `Declarative Shadow DOM (DSD)`.

There are two webcomponents in this PoC. 

`hello-comp` is a manually written WebComponent using DSD.
`ssr-compatible-comp` is a WebComponent where the DSD is added after NextJS rendered its html. This allows to declare the WebComponent without any manual DSD.

## Technical problem

Before DSD, providing SSR with WebComponents was and still is a pain. WebComponent frameworks implement their custom SSR solutions and when they are integrated with the SSR capabilities of React
or other frameworks like React, NextJS, Angular or VueJS, problems start to appear.

The biggest problem is that the code most WebComponent frameworks generate is not isomoprhic between server and client. Most of the time layout is changed, classes are removed and even the whole CSS is scoped and rewritten.

One solution to this is shown in this repo with DSD. Especially with the `ssr-compatible-comp` WebComponent. The WebComponent can be used like your regular, "old", WebComponents, as seen in the `pages/index.tsx`:

```js
<ssr-compatible-comp>
  Hello from SSR and fully compatible react hydration WITHOUT warnings.
</ssr-compatible-comp>
```

Instead of having to map between scoped and non scoped css classes, attach shadow root and stuff like that, we can use DSD.
So no special SSR rewrite and rehydration is needed, we can let the browser do its part (as soon as the browser discovers the <template shadowroot="open"> tag). 

In the `server.mjs`, we inject DSD inside our `ssr-compatible-comp`, which results in the following server-side generated html.

```html
<ssr-compatible-comp>
  <template shadowroot="open">
    <strong>
  		<slot></slot>
  	</strong>
	</template>
  Hello from SSR and fully compatible react hydration WITHOUT warnings.
</ssr-compatible-comp>
```

As soon as the browser parses the template shadowroot tag, it is replaced with a #shadow-root fragment and its content placed there automatically. 
If react now starts with its hydration phase, the element tree is now fully compatible to the one we declared in the `pages/index.tsx`.

DOM after parsing and before react hydration:

```html
<ssr-compatible-comp>
  #shadow-root (open)
    ...
  Hello from SSR and fully compatible react hydration WITHOUT warnings.
</ssr-compatible-comp>
```

React does not care about document-fragments and does not complain about any hydration mismatches.

For more information on DSD, see: [Declarative Shadow DOM](https://github.com/mfreed7/declarative-shadow-dom).

## Getting Started

1. First, install packages:

`npm install`


2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You see that the `hello-comp` WebComponent is rendered server-side and fully hydrates without any warning.

### Manual Declarative Shadow DOM

If you want the hello-comp to also work (manually DSD), you need to patch `react-dom`:

Patch `node_modules\react-dom\cjs\react-dom.development.js`. ONLY REQUIRED if you uncomment `hello-comp` in `pages/index.tsx`.
Search for `updateHostComponent` and add after `var isDirectTextChild = shouldSetTextContent(type, nextProps)` (line 19909):

```js
 // PATCH! Remove template.
  if(nextChildren != null) {
    for(var i = 0; i < nextChildren.length; i++) {
      const child = nextChildren[i];
      if(child.type === 'template' && 'shadowroot' in child.props) {
        nextChildren = [...nextChildren].splice(i + 1, 1); // Why i+1? Splicing at 0 does remove the second item...
      }
    }
  }
```

Delete `.next` folder if one exists, because node_modules are cached by NextJs.
