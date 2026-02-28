import dynamic from 'next/dynamic';

// Dynamically import DebugView to avoid SSR issues
const DebugView = dynamic(() => import('@/components/DebugView').then(mod => ({ default: mod.DebugView })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-deep-sea-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading debug data...</p>
      </div>
    </div>
  ),
});

export default function DebugPage() {
  return <DebugView />;
}


