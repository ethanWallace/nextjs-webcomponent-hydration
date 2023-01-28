## WebComponent with React/NextJS SSR and Hydration

This is a proof of concept on how SSR and WebComponents can work together. This currently requires a custom patch in the `react-dom` package.

The WebComponent uses `Declarative Shadow DOM`.

## Getting Started

1. First, install packages:

`npm install`

2. Patch `node_modules\react-dom\cjs\react-dom.development.js`

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

3. Delete `.next` folder.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You see that the `hello-comp` WebComponent is rendered server-side and fully hydrates without any warning.


## Technical problem description