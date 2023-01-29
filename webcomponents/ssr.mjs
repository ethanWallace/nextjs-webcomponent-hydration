

// Hacky check if nodejs or browser. We just want access to the template() static function for ssr.
if (typeof process !== 'undefined' && process.version != "") {
	console.log("Rewrite HTMLElement");
	global.HTMLElement = class { constructor() { } };
}

export default class SsrWebComponent extends HTMLElement {
	#internals = null;
	constructor() {
		super();

		this.#internals = this.attachInternals();

		let shadow = this.#internals.shadowRoot;
		if (!shadow) {
			shadow = this.attachShadow({ mode: 'open' });
			shadow.innerHTML = SsrWebComponent.template();
		}

		// <style> and <strong>
		console.log(shadow.children);
	}

	// We use this as SSR base as well as fallback, if only client side initialization is used.
	// On SSR, we need to add the declarative shadow dom template.
	static template() {
		return `<style>
				strong {
					color: red;
				}
			</style>
			<strong>
				<slot></slot>
			</strong>`
	}
}

if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
	// TODO: Check if component is already registered, to work with HMR.
	console.log("Define ssr-compatible-comp");
	customElements.define('ssr-compatible-comp', SsrWebComponent);
}
