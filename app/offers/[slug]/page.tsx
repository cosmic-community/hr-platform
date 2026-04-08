// app/offers/[slug]/page.tsx
import { getOfferLetter } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = await getOfferLetter(slug);

  if (!offer) {
    notFound();
  }

  const position = getMetafieldValue(offer.metadata?.position) || offer.title;
  const offeredSalary = offer.metadata?.offered_salary;
  const currency = getMetafieldValue(offer.metadata?.currency) || 'USD';
  const startDate = getMetafieldValue(offer.metadata?.start_date);
  const offerStatus = getMetafieldValue(offer.metadata?.offer_status);
  const content = getMetafieldValue(offer.metadata?.offer_letter_content);
  const signatureData = getMetafieldValue(offer.metadata?.signature_data);
  const signedDate = getMetafieldValue(offer.metadata?.signed_date);
  const expiryDate = getMetafieldValue(offer.metadata?.expiry_date);
  const benefits = getMetafieldValue(offer.metadata?.benefits_package);

  const candidateObj = offer.metadata?.candidate;
  const candidateName = candidateObj && typeof candidateObj === 'object' && 'title' in candidateObj
    ? String(candidateObj.title) : '';
  const candidateSlug = candidateObj && typeof candidateObj === 'object' && 'slug' in candidateObj
    ? String(candidateObj.slug) : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/offers" className="hover:text-brand-600">Offers</Link>
        <span>/</span>
        <span className="text-gray-900">{position}</span>
      </div>

      <PageHeader
        title={`Offer: ${position}`}
        subtitle={candidateName ? `For ${candidateName}` : undefined}
        icon="📨"
        actions={offerStatus ? <StatusBadge status={offerStatus} type="offer" /> : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {content && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Offer Letter Content</h2>
              </div>
              <div className="card-body prose prose-sm max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          )}

          {benefits && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Benefits Package</h2>
              </div>
              <div className="card-body prose prose-sm max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: benefits }} />
              </div>
            </div>
          )}

          {signatureData && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">✍️ Signature</h2>
              </div>
              <div className="card-body">
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-700">{signatureData}</p>
                  {signedDate && (
                    <p className="text-xs text-gray-500 mt-2">Signed on {new Date(signedDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            </div>
            <div className="card-body space-y-4">
              {candidateName && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Candidate</p>
                  {candidateSlug ? (
                    <Link href={`/candidates/${candidateSlug}`} className="text-sm text-brand-600 hover:text-brand-700 mt-1 block">
                      {candidateName}
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-900 mt-1">{candidateName}</p>
                  )}
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Offered Salary</p>
                <p className="text-sm text-gray-900 mt-1">
                  {typeof offeredSalary === 'number' ? `${currency} ${offeredSalary.toLocaleString()}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Start Date</p>
                <p className="text-sm text-gray-900 mt-1">
                  {startDate ? new Date(startDate).toLocaleDateString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Expiry Date</p>
                <p className="text-sm text-gray-900 mt-1">
                  {expiryDate ? new Date(expiryDate).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}