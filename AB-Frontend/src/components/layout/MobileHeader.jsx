import { RiShieldUserFill } from 'react-icons/ri';

export default function MobileHeader() {
  return (
    <div className="text-center md:hidden mb-10">
      <RiShieldUserFill className="text-4xl mx-auto mb-2" style={{ color: 'var(--dynamic-secondary-color)' }} />
      <h1 className="text-3xl font-bold">
        <span className="text-white">Auth</span>
        <span style={{ color: 'var(--dynamic-secondary-color)' }}>Bouncer</span>
      </h1>
    </div>
  );
} 