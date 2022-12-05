import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Router from 'next/router'

const stocks = require('stock-ticker-symbol')

export default function Home() {
  let [ symbol, setSymbol ] = useState("")
  let [ errored, setErrored ] = useState("hidden")

  function goButtonPress() {
    if (stocks.lookup(symbol) == null)
    {
      setErrored("visible")
    }
    else {
      Router.push("/" + symbol.toUpperCase())
    }
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Twock</title>
        <meta name="Twock" content="A tool to view Twitter's opinions on stocks." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Twock</h1>
        <div style={{verticalAlign: "top"}}>
          <input
            className={styles.symbolInput}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                goButtonPress()
              }
            }}
            placeholder="Enter symbol here"
          />
          <button 
            className={styles.goButton}
            onClick={goButtonPress}
          >
            Go!
          </button>
        </div>
        <h1 className={styles.statusMessage} style={{visibility: errored}}>Invalid stock symbol!</h1>
      </main>

      <footer className={styles.footer}>
        <p>Powered by CSE 412</p>
      </footer>
    </div>
  )
}
