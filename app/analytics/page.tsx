import { getReportSnapshots, getCandidates, getJobRequisitions, getOfferLetters } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatsCard from '@/components/StatsCard';
import AnalyticsCharts from '@/components/AnalyticsCharts';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [snapshots, candidates, requisitions, offers] = await Promise.all([
    getReportSnapshots(),
    getCandidates(),
    getJobRequisitions(),
    getOfferLetters(),
  ]);

  // Calculate metrics from available data
  const totalApplications = candidates.length;
  const hiredCandidates = offers.filter(
    (o) => getMetafieldValue(o.metadata?.offer_status) === 'Accepted'
  ).length;
  const openReqs = requisitions.filter(
    (r) => getMetafieldValue(r.metadata?.status) === 'Approved'
  ).length;
  const pendingOffers = offers.filter(
    (o) => getMetafieldValue(o.metadata?.offer_status) === 'Sent'
  ).length;

  // Calculate source distribution
  const sourceMap: Record<string, number> = {};
  candidates.forEach((c) => {
    const source = getMetafieldValue(c.metadata?.source) || 'Unknown';
    sourceMap[source] = (sourceMap[source] || 0) + 1;
  });

  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

  // Calculate score distribution
  const scoreRanges = [
    { name: '0-20', count: 0 },
    { name: '21-40', count: 0 },
    { name: '41-60', count: 0 },
    { name: '61-80', count: 0 },
    { name: '81-100', count: 0 },
  ];

  candidates.forEach((c) => {
    const score = c.metadata?.ai_ranking_score;
    if (typeof score === 'number') {
      if (score <= 20) scoreRanges[0]!.count++;
      else if (score <= 40) scoreRanges[1]!.count++;
      else if (score <= 60) scoreRanges[2]!.count++;
      else if (score <= 80) scoreRanges[3]!.count++;
      else scoreRanges[4]!.count++;
    }
  });

  // Use snapshot data if available
  const latestSnapshot = snapshots.length > 0
    ? snapshots.sort((a, b) => {
        const dateA = new Date(a.metadata?.snapshot_date || a.created_at).getTime();
        const dateB = new Date(b.metadata?.snapshot_date || b.created_at).getTime();
        return dateB - dateA;
      })[0]
    : undefined;

  let timeToHireData: Array<{ name: string; days: number }> = [];
  let costPerHireData: Array<{ name: string; cost: number }> = [];

  if (latestSnapshot) {
    const tthRaw = getMetafieldValue(latestSnapshot.metadata?.time_to_hire_data);
    const cphRaw = getMetafieldValue(latestSnapshot.metadata?.cost_per_hire);
    try {
      if (tthRaw) timeToHireData = JSON.parse(tthRaw) as Array<{ name: string; days: number }>;
    } catch {
      // Use mock data if parsing fails
    }
    try {
      if (cphRaw) costPerHireData = JSON.parse(cphRaw) as Array<{ name: string; cost: number }>;
    } catch {
      // Use mock data if parsing fails
    }
  }

  // Provide mock data if no real data
  if (timeToHireData.length === 0) {
    timeToHireData = [
      { name: 'Jan', days: 32 },
      { name: 'Feb', days: 28 },
      { name: 'Mar', days: 35 },
      { name: 'Apr', days: 25 },
      { name: 'May', days: 30 },
      { name: 'Jun', days: 22 },
    ];
  }

  if (costPerHireData.length === 0) {
    costPerHireData = [
      { name: 'Engineering', cost: 4500 },
      { name: 'Marketing', cost: 3200 },
      { name: 'Sales', cost: 2800 },
      { name: 'Design', cost: 3800 },
      { name: 'Operations', cost: 2100 },
    ];
  }

  if (sourceData.length === 0) {
    sourceData.push(
      { name: 'LinkedIn', value: 45 },
      { name: 'Indeed', value: 30 },
      { name: 'Referral', value: 15 },
      { name: 'Career Site', value: 10 },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Recruitment metrics and hiring insights"
        icon="📈"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Applications" value={totalApplications} icon="📥" color="blue" tooltip="Total candidates who applied" />
        <StatsCard title="Hires" value={hiredCandidates} icon="✅" color="green" tooltip="Candidates with accepted offers" />
        <StatsCard title="Open Positions" value={openReqs} icon="📋" color="purple" tooltip="Approved requisitions" />
        <StatsCard title="Pending Offers" value={pendingOffers} icon="⏳" color="orange" tooltip="Offers awaiting response" />
      </div>

      <AnalyticsCharts
        timeToHireData={timeToHireData}
        sourceData={sourceData}
        scoreRanges={scoreRanges}
        costPerHireData={costPerHireData}
      />
    </div>
  );
}