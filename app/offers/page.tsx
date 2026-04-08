import { getOfferLetters } from '@/lib/cosmic';
import PageHeader from '@/components/PageHeader';
import OfferCard from '@/components/OfferCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export default async function OffersPage() {
  const offers = await getOfferLetters();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offer Letters"
        subtitle="Manage offer letters, signatures, and onboarding"
        icon="📨"
      />

      {offers.length === 0 ? (
        <EmptyState
          icon="📨"
          title="No Offer Letters Yet"
          description="Offer letters will appear here once created in your Cosmic dashboard."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}