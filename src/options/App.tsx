import { useEffect, useState } from 'react'
import './App.css'
import { getSettings, saveSettings, type UserSettings } from '../utils/storage'
import { ToggleSwitch } from './components/ToggleSwitch'

function App() {
  const [settings, setSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  const toggleSetting = (key: keyof UserSettings) => {
    if (!settings) return
    const newValue = !settings[key]
    const newSettings = { ...settings, [key]: newValue }
    setSettings(newSettings)
    saveSettings({ [key]: newValue })
  }

  if (!settings) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <div className="card">
        <h1>Discogs Enhancer</h1>

        <div className="section">
          <div className="section-title">Appearance</div>
          <ToggleSwitch
            label="Dark Mode"
            description="Enable dark theme for Discogs interface"
            checked={settings.darkMode}
            onChange={() => toggleSetting('darkMode')}
          />
        </div>

        <div className="section">
          <div className="section-title">Marketplace</div>
          <ToggleSwitch
            label="Demand Index"
            description="Show Want/Have ratio on release pages"
            checked={settings.demandIndex}
            onChange={() => toggleSetting('demandIndex')}
          />
          <ToggleSwitch
            label="Marketplace Filter"
            description="Enable advanced filtering options"
            checked={settings.marketplaceFilter}
            onChange={() => toggleSetting('marketplaceFilter')}
          />
          <ToggleSwitch
            label="Infinite Scroll"
            description="Automatically load next page on marketplace"
            checked={settings.infiniteScroll}
            onChange={() => toggleSetting('infiniteScroll')}
          />
        </div>

        <div className="section">
          <div className="section-title">General</div>
          <ToggleSwitch
            label="Hide Apple Music"
            description="Remove Apple Music links from pages"
            checked={settings.hideAppleMusic}
            onChange={() => toggleSetting('hideAppleMusic')}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginBottom: '10px' }}>
        v{chrome.runtime?.getManifest ? chrome.runtime.getManifest().version : '0.0.0'}
      </div>
    </div>
  )
}

export default App
