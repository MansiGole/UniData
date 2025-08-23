import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { DatasetsPage } from './pages/DatasetsPage'
import { ModelsPage } from './pages/ModelsPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { DatasetDetailPage } from './pages/DatasetDetailPage'
import { ModelDetailPage } from './pages/ModelDetailPage'
import UploadDatasetPage from './pages/UploadDatasetPage'
import { UploadModelPage } from './pages/UploadModelPage'
import WalletTestPage from './pages/WalletTestPage'
import { WalletProvider } from './hooks/useWallet'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from './components/ui/toaster'
import { Toaster as HotToaster } from 'react-hot-toast'

function App() {
  const location = useLocation();
  
  return (
    <ThemeProvider>
      <WalletProvider>
        <div className="min-h-screen" style={{ backgroundColor: '#0B0E11', fontFamily: 'Space Grotesk, sans-serif' }}>
          <Layout>
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/datasets" element={<DatasetsPage />} />
                <Route path="/models" element={<ModelsPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/datasets/:id" element={<DatasetDetailPage />} />
                <Route path="/models/:id" element={<ModelDetailPage />} />
                <Route path="/upload-dataset" element={<UploadDatasetPage />} />
                <Route path="/upload-model" element={<UploadModelPage />} />
                <Route path="/wallet-test" element={<WalletTestPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        </div>
        <Toaster />
        <HotToaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
            },
          }}
        />
      </WalletProvider>
    </ThemeProvider>
  )
}

export default App
