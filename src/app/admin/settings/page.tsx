'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Save } from 'lucide-react'
import type { Settings } from '@/lib/types'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.settings) setSettings(data.settings)
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: settings.id,
        room_name: settings.room_name,
        room_description: settings.room_description,
        nda_text: settings.nda_text,
        watermark_opacity: settings.watermark_opacity,
        require_nda: settings.require_nda,
        allow_downloads: settings.allow_downloads,
        calendly_url: settings.calendly_url,
        cake_equity_url: settings.cake_equity_url,
      }),
    })

    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      setError(data.error || 'Failed to save')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="py-12 text-center text-inf-muted text-sm">Loading...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-8">
        <div className="py-12 text-center text-inf-muted text-sm">Settings not found</div>
      </div>
    )
  }

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-inf-green">Settings</h1>
          <p className="text-sm text-inf-muted mt-1">Configure your data room</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save size={16} className="mr-2" />
          {saved ? 'Saved!' : 'Save changes'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-inf-green mb-4">General</h2>
          <div className="space-y-4">
            <Input
              label="Room name"
              value={settings.room_name}
              onChange={(e) => setSettings({ ...settings, room_name: e.target.value })}
            />
            <Input
              label="Room description"
              value={settings.room_description}
              onChange={(e) => setSettings({ ...settings, room_description: e.target.value })}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-inf-green mb-4">NDA</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="inf-label block">NDA text</label>
              <textarea
                value={settings.nda_text}
                onChange={(e) => setSettings({ ...settings, nda_text: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 bg-white border border-inf-line-strong rounded-inf text-sm text-inf-body placeholder:text-inf-subtle outline-none hover:border-inf-gold/40 focus:border-inf-gold/60 focus:ring-1 focus:ring-inf-gold/30 transition-all duration-200 resize-y"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.require_nda}
                onChange={(e) => setSettings({ ...settings, require_nda: e.target.checked })}
                className="w-4 h-4 rounded border-inf-line-strong bg-white accent-inf-gold"
              />
              <span className="text-sm text-inf-body">Require NDA before accessing documents</span>
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-inf-green mb-4">Integrations</h2>
          <div className="space-y-4">
            <Input
              label="Calendly Booking URL"
              value={settings.calendly_url || ''}
              onChange={(e) => setSettings({ ...settings, calendly_url: e.target.value })}
              placeholder="https://calendly.com/your-link"
            />
            <div>
              <Input
                label="Cake Equity URL"
                value={settings.cake_equity_url || ''}
                onChange={(e) => setSettings({ ...settings, cake_equity_url: e.target.value })}
                placeholder="https://app.cakeequity.com"
              />
              <p className="text-xs text-inf-muted mt-1">The URL investors are redirected to when clicking &ldquo;Proceed to Invest&rdquo;. Update this once your Cake Equity raise is configured.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-inf-green mb-4">Security</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="inf-label block">
                Watermark opacity ({settings.watermark_opacity}%)
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.watermark_opacity}
                onChange={(e) => setSettings({ ...settings, watermark_opacity: parseInt(e.target.value) })}
                className="w-full accent-inf-gold"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allow_downloads}
                onChange={(e) => setSettings({ ...settings, allow_downloads: e.target.checked })}
                className="w-4 h-4 rounded border-inf-line-strong bg-white accent-inf-gold"
              />
              <span className="text-sm text-inf-body">Allow document downloads</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  )
}
