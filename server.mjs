import express from 'express'
import next from 'next'
import { parse } from 'url'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

import ssrComponentTemplate from './webcomponents/ssr.mjs'

const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()


  server.use(function (req, res, next) {
	  req.url = req.originalUrl.replace('/nextjs_custom_server/_next', '/_next');
	  next(); // be sure to let the next middleware handle the modified request.
	});

	server.get('/__nextjs_original-stack-frame', (req, res) => {
		handle(req, res);
	});

	server.get('/_next/*', (req, res) => {
	  handle(req, res);
	});

	server.all('*', async (req, res) => {
		const parsedUrl = parse(req.url, true);
		const { pathname, query } = parsedUrl;

		var html = await app.renderToHTML(req, res, pathname, query);
		// TODO: SSR our ssr-compatible-comp by adding a Declarative Shadow DOM. 
		// This would normally be the job of stencil, lit or other frameworks.
		html = injectDeclarativeDOM(html);
		res.end(html);
	});

	server.listen(port, (err) => {
		if (err) throw err
		console.log(`Server ready on ${port}`)
	});
})


// Find our ssr component, inject declarative shadow dom and add template.
function injectDeclarativeDOM(html) {
	const injection = `<template shadowroot="open">
			${ssrComponentTemplate.template()}
		</template>`;
	
	let componentInnerStart = html.indexOf('<ssr-compatible-comp>') + "<ssr-compatible-comp>".length;

	return html.slice(0, componentInnerStart) + injection + html.slice(componentInnerStart, html.length);
}
