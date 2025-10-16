'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import CreateListingForm from '@/components/CreateListingForm';
import { getListings, userSession, Listing, contractAddress, contractName } from '@/lib/stacks';
import { openContractCall } from '@stacks/connect';
import { uintCV, stringUtf8CV } from '@stacks/transactions';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    loadListings();
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.testnet);
    }
  }, []);

  const loadListings = async () => {
    try {
      const fetchedListings = await getListings();
      setListings(fetchedListings);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (data: {
    name: string;
    description: string;
    price: number;
    duration: number;
  }) => {
    if (!userSession.isUserSignedIn()) {
      alert('Please connect your wallet first');
      return;
    }

    const functionArgs = [
      stringUtf8CV(data.name),
      stringUtf8CV(data.description),
      uintCV(data.price),
      uintCV(data.duration),
    ];

    const options = {
      contractAddress,
      contractName,
      functionName: 'create-listing',
      functionArgs,
      appDetails: {
        name: 'Strade',
        icon: window.location.origin + '/favicon.ico',
      },
      onFinish: (data: { txId: string; stacksTransaction: unknown }) => {
        console.log('Transaction finished:', data);
        // Reload listings after successful creation
        setTimeout(loadListings, 3000);
      },
    };

    await openContractCall(options);
  };

  const handlePurchaseListing = async (listingId: number) => {
    if (!userSession.isUserSignedIn()) {
      alert('Please connect your wallet first');
      return;
    }

    const functionArgs = [uintCV(listingId)];

    const options = {
      contractAddress,
      contractName,
      functionName: 'purchase-listing',
      functionArgs,
      appDetails: {
        name: 'Strade',
        icon: window.location.origin + '/favicon.ico',
      },
      onFinish: (data: { txId: string; stacksTransaction: unknown }) => {
        console.log('Purchase transaction finished:', data);
        // Reload listings after successful purchase
        setTimeout(loadListings, 3000);
      },
    };

    await openContractCall(options);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Decentralized Marketplace
          </h1>
          <p className="text-slate-600">
            Buy and sell goods securely using smart contracts on the Stacks blockchain
          </p>
        </div>

        <CreateListingForm onCreateListing={handleCreateListing} />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No active listings found.</p>
            <p className="text-sm text-slate-500 mt-2">
              Be the first to create a listing!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.listingId}
                listing={listing}
                onPurchase={handlePurchaseListing}
                isOwner={listing.seller === userAddress}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
