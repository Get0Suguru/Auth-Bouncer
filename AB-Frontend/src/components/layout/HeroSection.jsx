import { RiShieldUserFill } from 'react-icons/ri';

export default function HeroSection() {
  return (
    <div className="hidden md:flex flex-col w-1/2 p-12 justify-between items-stretch min-h-screen h-full bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2232&auto=format&fit=crop')] bg-cover bg-center fixed left-0 top-0 bottom-0 z-10">
      <div className="flex items-center">
        <RiShieldUserFill className="text-4xl" style={{ color: 'var(--dynamic-secondary-color)' }} />
        <h1 className="text-3xl font-bold">
          <span className="text-white">Auth</span>
          <span style={{ color: 'var(--dynamic-secondary-color)' }}>Bouncer</span>
        </h1>
      </div>

      <div className="space-y-6">
        <h2 className="text-5xl font-bold leading-tight">
          Your Ultimate <br />
          <span style={{ color: 'var(--dynamic-secondary-color)' }}>Security</span> Gateway
        </h2>
        <p className="text-gray-300 text-lg max-w-md">
          Industry-leading authentication with military-grade encryption and 
          zero-trust architecture. Sleep well knowing your data is protected.
        </p>
      </div>

      <div className="flex space-x-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--dynamic-secondary-color) 20%, transparent)' }}>
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--dynamic-secondary-color)' }}></div>
        </div>
        <div>
          <p className="text-sm text-gray-400">Active Protection</p>
          <p className="font-medium">24/7 Threat Monitoring</p>
        </div>
      </div>
    </div>
  );
} 