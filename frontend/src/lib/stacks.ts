import { STACKS_TESTNET } from '@stacks/network';
import { AppConfig, UserSession } from '@stacks/connect';
import { fetchCallReadOnlyFunction, cvToValue, ClarityType } from '@stacks/transactions';

export const network = STACKS_TESTNET;
export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const contractAddress = 'ST2WFP8G2CTAZWQBRQT2BWBPTH3NB341NMQJGD0KM';

// Contract addresses for deployed contracts
export const CONTRACTS = {
  CoreMarketPlace: `${contractAddress}.CoreMarketPlace`,
  EscrowService: `${contractAddress}.EscrowService`,
  UserProfile: `${contractAddress}.UserProfile`,
  DisputeResolution: `${contractAddress}.DisputeResolution_clar`,
  Token: `${contractAddress}.token`,
};

// Default contract for marketplace operations
export const contractName = 'CoreMarketPlace';

export interface Listing {
  listingId: number;
  seller: string;
  name: string;
  description: string;
  price: number;
  status: string;
  createdAt: number;
  expiresAt: number;
}

export const getListings = async (includeAll: boolean = false): Promise<Listing[]> => {
  try {
    const lastIdResult = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-last-listing-id',
      functionArgs: [],
      network,
      senderAddress: contractAddress,
    });

    const lastId = cvToValue(lastIdResult).value as number;
    const listings: Listing[] = [];

    for (let i = 1; i <= lastId; i++) {
      const listingResult = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-listing',
        functionArgs: [cvToValue({ type: ClarityType.UInt, value: i })],
        network,
        senderAddress: contractAddress,
      });

      if (listingResult.type !== ClarityType.OptionalNone) {
        const listingData = cvToValue(listingResult).value;
        listings.push({
          listingId: i,
          seller: listingData.seller.value,
          name: listingData.name.value,
          description: listingData.description.value,
          price: Number(listingData.price.value),
          status: listingData.status.value,
          createdAt: Number(listingData['created-at'].value),
          expiresAt: Number(listingData['expires-at'].value),
        });
      }
    }

    // If includeAll is true, return all listings; otherwise filter for active only
    return includeAll ? listings : listings.filter(listing => listing.status === 'active');
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};

export const formatSTX = (microSTX: number): string => {
  return (microSTX / 1000000).toFixed(6);
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
