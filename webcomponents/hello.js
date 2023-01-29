export default class HelloComponent extends HTMLElement {
	#internals = null;
	constructor() {
		super();		

		this.#internals = this.attachInternals();
    const shadow = this.#internals.shadowRoot;

		const button = shadow.firstElementChild;
		button.addEventListener('click', console.log);
	}	

	connectedCallback() {
		console.log("HelloComponent connected");
	}

	disconnectedCallback() {
		console.log("HelloComponent disconnected");
	}
}


if(window) {
	console.log("Define hello-comp");
	customElements.define('hello-comp', HelloComponent);
}
