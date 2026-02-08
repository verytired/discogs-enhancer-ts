import React from 'react'
import './ToggleSwitch.css'

interface ToggleSwitchProps {
    label: string
    description?: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    label,
    description,
    checked,
    onChange,
}) => {
    return (
        <label className="toggle-switch-container">
            <div className="text-container">
                <span className="toggle-label">{label}</span>
                {description && <span className="toggle-description">{description}</span>}
            </div>
            <div className="switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="slider round"></span>
            </div>
        </label>
    )
}
