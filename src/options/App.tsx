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
    <div className="card">
      <h1>Discogs Enhancer Settings</h1>
      <div className="settings">
        <label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={() => toggleSetting('darkMode')}
          />
          Dark Mode
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={settings.marketplaceFilter}
            onChange={() => toggleSetting('marketplaceFilter')}
          />
          Marketplace Filter
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={settings.demandIndex}
            onChange={() => toggleSetting('demandIndex')}
          />
          Demand Index
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={settings.hideAppleMusic}
            onChange={() => toggleSetting('hideAppleMusic')}
          />
          Hide Apple Music
        </label>
      </div>
    </div>
  )
}

export default App
