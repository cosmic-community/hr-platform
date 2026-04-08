import type { OfferLetter } from '@/types';
import { getMetafieldValue } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import Tooltip from '@/components/Tooltip';

interface OfferCardProps {
  offer: OfferLetter;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const position = getMetafieldValue(offer.metadata?.position) || offer.title;
  const offeredSalary = offer.metadata?.offered_salary;
  const currency = getMetafieldValue(offer.metadata?.currency) || 'USD';
  const startDate = getMetafieldValue(offer.metadata?.start_date);
  const offerStatus = getMetafieldValue(offer.metadata?.offer_status);
  const expiryDate = getMetafieldValue(offer.metadata?.expiry_date);

  const candidateObj = offer.metadata?.candidate;
  const candidateName = candidateObj && typeof candidateObj === 'object' && 'title' in candidateObj
    ? String(candidateObj.title) : 'Unknown candidate';

  return (
    <Tooltip content={`View offer details for ${candidateName}`}>
      <Link href={`/offers/${offer.slug}`} className="card hover:shadow-cardHover transition-all block">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{position}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{candidateName}</p>
            </div>
            {offerStatus && <StatusBadge status={offerStatus} type="offer" />}
          </div>

          <div className="space-y-2">
            {typeof offeredSalary === 'number' && (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <span>💰</span> {currency} {offeredSalary.toLocaleString()}
              </p>
            )}
            {startDate && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <span>📅</span> Start: {new Date(startDate).toLocaleDateString()}
              </p>
            )}
            {expiryDate && (
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>⏰</span> Expires: {new Date(expiryDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </Link>
    </Tooltip>
  );
}