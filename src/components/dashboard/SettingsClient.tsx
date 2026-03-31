'use client'

import { useState } from 'react'
import { User as DBUser } from '@/types'

interface SettingsClientProps {
  profile: DBUser | null
  prefs: unknown
}

export default function SettingsClient({ profile }: SettingsClientProps) {
  const [webhookUrl, setWebhookUrl] = useState(profile?.discord_webhook_url ?? '')
  const [savingWebhook, setSavingWebhook] = useState(false)
  const [webhookSaved, setWebhookSaved] = useState(false)
  const [webhookError, setWebhookError] = useState('')

  const isPremium = profile?.is_premium ?? false

  async function handleUpgrade() {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  async function handlePortal() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  async function handleSaveWebhook() {
    setSavingWebhook(true)
    setWebhookError('')
    const res = await fetch('/api/discord/webhook', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook_url: webhookUrl }),
    })
    const data = await res.json()
    setSavingWebhook(false)
    if (data.ok) {
      setWebhookSaved(true)
      setTimeout(() => setWebhookSaved(false), 2000)
    } else {
      setWebhookError(data.error ?? 'Failed to save')
    }
  }

  async function handleRemoveWebhook() {
    await fetch('/api/discord/webhook', { method: 'DELETE' })
    setWebhookUrl('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Subscription */}
      <section className="bg-[#111114] border border-[#2a2a32] rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6b6b80]">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{isPremium ? 'SharpBet Pro' : 'Free'}</p>
            <p className="text-sm text-[#6b6b80] mt-0.5">
              {isPremium
                ? 'Real-time whale signals, Discord alerts, follow wallets'
                : 'Delayed signals, no Discord alerts, no wallet following'}
            </p>
          </div>
          {isPremium ? (
            <button
              onClick={handlePortal}
              className="text-sm px-3 py-1.5 border border-[#2a2a32] rounded-md hover:bg-[#1a1a1f] transition-colors"
            >
              Manage
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              className="text-sm px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-md font-medium text-white transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </section>

      {/* Discord */}
      <section className="bg-[#111114] border border-[#2a2a32] rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6b6b80]">Discord Alerts</h2>
        {!isPremium && (
          <p className="text-sm text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/20 rounded px-3 py-2">
            Discord alerts are available on SharpBet Pro.
          </p>
        )}
        <div className="space-y-3">
          <p className="text-sm text-[#9999aa]">
            Paste a Discord webhook URL to receive whale signal alerts in any channel. You will be alerted for every $10K+ trade, and separately for any wallets you follow.
          </p>
          <ol className="text-sm text-[#9999aa] list-decimal list-inside space-y-1">
            <li>Open Discord and go to your server</li>
            <li>Server Settings → Integrations → Webhooks → New Webhook</li>
            <li>Choose a channel, copy the webhook URL, and paste it below</li>
          </ol>
          <input
            type="url"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            disabled={!isPremium}
            className="w-full px-3 py-2 bg-[#1a1a1f] border border-[#2a2a32] rounded-md text-sm font-mono text-[#e8e8f0] placeholder-[#4a4a55] focus:outline-none focus:border-[#5865F2]/50 disabled:opacity-40"
          />
          {webhookError && (
            <p className="text-xs text-red-400">{webhookError}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSaveWebhook}
              disabled={savingWebhook || !isPremium || !webhookUrl}
              className="text-sm px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] disabled:opacity-40 rounded-md font-medium text-white transition-colors"
            >
              {webhookSaved ? 'Saved!' : savingWebhook ? 'Saving...' : 'Save webhook'}
            </button>
            {webhookUrl && (
              <button
                onClick={handleRemoveWebhook}
                className="text-sm px-3 py-1.5 border border-[#2a2a32] rounded-md text-[#6b6b80] hover:text-red-400 hover:border-red-500/30 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          {profile?.discord_webhook_url && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              Discord webhook connected
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
