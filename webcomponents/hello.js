export default class HelloComponent extends HTMLElement {
	#internals = null;
	constructor() {
		super();		
		this.#internals = this.attachInternals();
		console.log(this.#internals);
    const shadow = this.#internals.shadowRoot;
    this.hours = shadow.querySelector('#hour');
    this.minutes = shadow.querySelector('#min');
    this.seconds = shadow.querySelector('#sec'); 

		const button = shadow.firstElementChild;
		button.addEventListener('click', console.log);

		console.log(shadow);
	}	

	connectedCallback() {
		console.log("HelloComponent connected");
	}

	disconnectedCallback() {
		console.log("HelloComponent disconnected");
	}
}


console.log("Define hello-comp");
customElements.define('hello-comp', HelloComponent);
