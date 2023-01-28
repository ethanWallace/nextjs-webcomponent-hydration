
import { useEffect } from 'react'


const loadWebComponent = async () => {
  const HelloComponent = await import("./../webcomponents/hello.js");
};

export default function Home() {
  useEffect(() => {
    setTimeout(() => {
      loadWebComponent().catch(console.error);
    })
  }, [])
  return (
    <>
      <hello-comp>
        <template shadowroot="open">
          <button type="button">
            <slot></slot>
          </button>
        </template>
        <span onClick={console.log}>Hello</span>
      </hello-comp>
    </>
  )
}
