'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { userSession, formatAddress } from '@/lib/stacks';

export default function Header() {
  const pathname = usePathname();
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsConnected(true);
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.testnet);
    }
  }, []);

  const connectWallet = async () => {
    if (!userSession.isUserSignedIn()) {
      const { authenticate } = await import('@stacks/connect');
      authenticate({
        appDetails: {
          name: 'Strade',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: () => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            setIsConnected(true);
            setUserAddress(userData.profile.stxAddress.testnet);
          }
        },
        userSession,
      });
    }
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setIsConnected(false);
    setUserAddress('');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900">Strade</h1>
            <span className="ml-2 text-sm text-slate-500">Decentralized Marketplace</span>
          </div>

          {/* Center Navigation */}
          <nav className="flex items-center space-x-2">
            <Link href="/">
              <span
                className={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${
                  pathname === '/'
                    ? 'text-slate-900 bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Marketplace
              </span>
            </Link>
            <Link href="/my-listings">
              <span
                className={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${
                  pathname === '/my-listings'
                    ? 'text-slate-900 bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                My Listings
              </span>
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {userAddress.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-slate-600">
                  {formatAddress(userAddress)}
                </span>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
