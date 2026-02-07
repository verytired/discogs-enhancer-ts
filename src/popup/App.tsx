import { useEffect, useState } from 'react'
import './App.css'
import { getSettings, saveSettings, type UserSettings } from '../utils/storage'

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

  if (!settings) return <div>Loading...</div>

  return (
    <div className="container">
      <div className="header">
        <h1>Discogs Enhancer</h1>
      </div>

      <div className="settings-list">
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={() => toggleSetting('darkMode')}
          />
          <span>Dark Mode</span>
        </label>

        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.marketplaceFilter}
            onChange={() => toggleSetting('marketplaceFilter')}
          />
          <span>Marketplace Filter</span>
        </label>

        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.demandIndex}
            onChange={() => toggleSetting('demandIndex')}
          />
          <span>Demand Index</span>
        </label>

        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.hideAppleMusic}
            onChange={() => toggleSetting('hideAppleMusic')}
          />
          <span>Hide Apple Music</span>
        </label>
      </div>

      <div className="footer">
        <button className="open-options-btn" onClick={() => chrome.runtime.openOptionsPage()}>
          Open Full Settings
        </button>
      </div>
    </div>
  )
}

export default App
