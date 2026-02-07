import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from '../package.json'

// Convert from major.minor.patch to major.minor.patch.build if needed,
// but for now just use the version from package.json
const { version } = packageJson

// Manifest V3 definition
const manifest = defineManifest(async (_env) => ({
    manifest_version: 3,
    name: "Discogs Enhancer (TypeSript Re-implementation)",
    description: "Adds useful features and functionality to Discogs.com",
    version,
    version_name: version,
    action: {
        default_popup: 'index.html',
        default_icon: {
            16: 'icon.png',
            48: 'icon.png',
            128: 'icon.png',
        }
    },
    options_ui: {
        page: 'src/options/index.html',
        open_in_tab: true
    },
    icons: {
        16: 'icon.png',
        48: 'icon.png',
        128: 'icon.png',
    },
    content_scripts: [
        {
            matches: ['https://www.discogs.com/*', 'https://discogs.com/*'],
            js: ['src/content/index.ts'],
        },
    ],
    background: {
        service_worker: 'src/background/index.ts',
        type: 'module',
    },
    permissions: [
        'storage',
        'activeTab',
        'scripting'
    ],
    web_accessible_resources: [
        {
            resources: ['src/assets/*'],
            matches: ['https://www.discogs.com/*'],
        },
    ],
}))

export default manifest
