import '../styles/globals.css'
import Navbar from "../components/navbar";

function App({Component, pageProps}) {
    return (
        <>
            <Navbar/>
            <Component {...pageProps} />
        </>
    )
}

export default App