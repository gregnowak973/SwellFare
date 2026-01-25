'use client';

import { useState } from 'react';
import { Bell, Mail, X } from 'lucide-react';

export interface StrikeAlertFormData {
  email: string;
  destination: string;
  originCode: string;
  maxPrice: number;
  minSwellHeight: number;
  minPeriod: number;
}

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
      // TODO: Get destinationId from destination name
      // For now, using a placeholder - in production, you'd look this up
      const response = await fetch('/api/strike-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          destinationId: 'placeholder-id', // Replace with actual lookup
          originCode: originCode.toUpperCase(),
          maxPrice,
          minSwellHeight: 0.91, // 3ft
          minPeriod: 10,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create alert');
      }

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setEmail('');
        setDestination('');
        setOriginCode('');
        setMaxPrice(500);
      }, 2000);
    } catch (error) {
      console.error('Error creating strike alert:', error);
      alert('Failed to create alert. Please try again.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-deep-sea-accent/20 text-deep-sea-accent border border-deep-sea-accent/30 rounded-lg hover:bg-deep-sea-accent/30 transition-all"
      >
        <Bell className="w-5 h-5" />
        <span className="font-medium">Set Strike Alert</span>
      </button>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-deep-sea-accent" />
          <h3 className="text-lg font-bold text-white">Strike Alerts</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-deep-sea-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-deep-sea-accent-green" />
          </div>
          <p className="text-white font-semibold mb-2">Alert Set!</p>
          <p className="text-slate-400 text-sm">
            We'll notify you when a Prime Strike matches your criteria.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
              placeholder="e.g., Pipeline, Oahu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Origin Airport Code
            </label>
            <input
              type="text"
              value={originCode}
              onChange={(e) => setOriginCode(e.target.value.toUpperCase())}
              required
              maxLength={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
              placeholder="LAX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Flight Price (USD)
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              required
              min={0}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-deep-sea-accent"
            />
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 text-xs text-slate-400">
            <p className="mb-1">Alert triggers when:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Swell &gt; 3ft AND Period &gt; 10s</li>
              <li>Flight price drops below ${maxPrice}</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-deep-sea-accent hover:bg-deep-sea-accent/90 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Set Alert
          </button>
        </form>
      )}
    </div>
  );
}

