import Head from 'next/head'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
        		<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;800&display=swap" rel="stylesheet" />
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp
