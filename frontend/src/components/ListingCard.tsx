'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Listing, formatSTX, formatAddress } from '@/lib/stacks';
import { ShoppingCart, Clock, User } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onPurchase?: (listingId: number) => void;
  isOwner?: boolean;
}

export default function ListingCard({ listing, onPurchase, isOwner }: ListingCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (onPurchase) {
      setIsPurchasing(true);
      try {
        await onPurchase(listing.listingId);
      } finally {
        setIsPurchasing(false);
      }
    }
  };

  const isExpired = listing.expiresAt < Date.now() / 1000;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{listing.name}</CardTitle>
          <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
            {listing.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <User className="h-4 w-4" />
          <span>{formatAddress(listing.seller)}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-slate-700 text-sm mb-4 line-clamp-3">
          {listing.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {formatSTX(listing.price)} STX
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>
              Expires: {new Date(listing.expiresAt * 1000).toLocaleDateString()}
            </span>
          </div>

          {isExpired && (
            <Badge variant="destructive" className="text-xs">
              Expired
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        {!isOwner && listing.status === 'active' && !isExpired && (
          <Button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isPurchasing ? 'Purchasing...' : 'Purchase'}
          </Button>
        )}

        {isOwner && (
          <div className="w-full text-center text-sm text-slate-500">
            Your listing
          </div>
        )}

        {(isExpired || listing.status !== 'active') && !isOwner && (
          <div className="w-full text-center text-sm text-slate-500">
            Not available
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
