import type { AppProps } from 'next/app'

import '@cdssnc/gcds-components/dist/gcds/gcds.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
