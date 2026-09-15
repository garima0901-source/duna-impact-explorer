import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ImpactCalculator from './components/ImpactCalculator'
import CustomerExplorer from './components/CustomerExplorer'
import RegulatoryMap from './components/RegulatoryMap'
import Glossary from './components/Glossary'
import DataPipeline from './components/DataPipeline'

function App() {
  const [tab, setTab] = useState('calculator')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/duna-data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (${res.status})`)
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header active={tab} onChange={setTab} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:px-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Couldn't load live data: {error}
          </div>
        )}
        {!data && !error && (
          <div className="text-sm text-muted">Loading sourced data…</div>
        )}
        {data && (
          <>
            {tab === 'calculator' && <ImpactCalculator stats={data.stats} />}
            {tab === 'customers' && <CustomerExplorer customers={data.customers} />}
            {tab === 'map' && <RegulatoryMap regulatory={data.regulatory} />}
          </>
        )}
      </main>

      <DataPipeline />
      <Glossary />
      <Footer />
    </div>
  )
}

export default App
