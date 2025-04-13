import dynamic from 'next/dynamic'

const App = dynamic(() => import('../client/src/App'), {
  ssr: false
})

function MyApp({ Component, pageProps }) {
  return <App />
}

export default MyApp 