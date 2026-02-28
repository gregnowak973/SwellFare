'use client';

import { useState } from 'react';
import { Bell, Mail, X, Check } from 'lucide-react';

export function StrikeAlerts() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/strike-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          destinationId: 'placeholder-id',
          originCode: originCode.toUpperCase(),
          maxPrice,
          minSwellHeight: 0.91,
          minPeriod: 10,
        }),
      });
      if (!response.ok) throw new Error('Failed to create alert');
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setEmail('');
        setDestination('');
        setOriginCode('');
        setMaxPrice(500);
      }, 2000);
    } catch {
      alert('Failed to create alert. Please try again.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-surf-accent/10 border border-surf-accent/30 hover:bg-surf-accent/15 hover:border-surf-accent/40 text-surf-accent font-medium transition-all duration-200"
      >
        <Bell className="w-5 h-5" />
        Set Strike Alert
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-surf-border bg-surf-surface/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-surf-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-surf-accent/15">
            <Bell className="w-4 h-4 text-surf-accent" />
          </div>
          <h3 className="font-semibold text-white">Strike Alerts</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-surf-surface-elevated transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {submitted ? (
        <div className="p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-surf-emerald/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-surf-emerald" />
          </div>
          <p className="font-semibold text-white mb-1">Alert set</p>
          <p className="text-sm text-slate-500">We&apos;ll email you when a Prime Strike matches.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-surf-bg border border-surf-border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-surf-accent/50 focus:border-surf-accent/50 transition-all"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-surf-bg border border-surf-border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-surf-accent/50 focus:border-surf-accent/50 transition-all"
              placeholder="e.g. Pipeline, Oahu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Origin airport</label>
            <input
              type="text"
              value={originCode}
              onChange={(e) => setOriginCode(e.target.value.toUpperCase())}
              required
              maxLength={3}
              className="w-full px-4 py-2.5 rounded-xl bg-surf-bg border border-surf-border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-surf-accent/50 focus:border-surf-accent/50 transition-all"
              placeholder="LAX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Max price (USD)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              required
              min={0}
              className="w-full px-4 py-2.5 rounded-xl bg-surf-bg border border-surf-border text-white focus:outline-none focus:ring-2 focus:ring-surf-accent/50 focus:border-surf-accent/50 transition-all"
            />
          </div>
          <div className="rounded-xl bg-surf-bg/60 border border-surf-border/50 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-400 mb-1">Triggers when:</p>
            <ul className="space-y-0.5">
              <li>• Swell &gt; 3ft and period &gt; 10s</li>
              <li>• Flight drops below ${maxPrice}</li>
            </ul>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-surf-accent hover:bg-surf-accent/90 text-surf-bg font-semibold transition-colors"
          >
            Set alert
          </button>
        </form>
      )}
    </div>
  );
}
