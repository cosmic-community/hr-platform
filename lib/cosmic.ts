import { createBucketClient } from '@cosmicjs/sdk';
import type {
  TeamMember,
  PipelineStage,
  JobRequisition,
  JobPosting,
  Candidate,
  CandidateActivity,
  OfferLetter,
  ReportSnapshot,
  AuditLog,
  CosmicObject,
} from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Generic fetch function
async function fetchObjects<T extends CosmicObject>(
  type: string,
  props?: string[]
): Promise<T[]> {
  try {
    const query = cosmic.objects
      .find({ type })
      .props(props || ['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    const response = await query;
    return response.objects as T[];
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
}

async function fetchOneObject<T extends CosmicObject>(
  type: string,
  slug: string
): Promise<T | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type, slug })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(2);
    return response.object as T;
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error(`Error fetching ${type}/${slug}:`, error);
    return null;
  }
}

// Team Members
export async function getTeamMembers(): Promise<TeamMember[]> {
  return fetchObjects<TeamMember>('team-members');
}

export async function getTeamMember(slug: string): Promise<TeamMember | null> {
  return fetchOneObject<TeamMember>('team-members', slug);
}

// Pipeline Stages
export async function getPipelineStages(): Promise<PipelineStage[]> {
  const stages = await fetchObjects<PipelineStage>('pipeline-stages');
  return stages.sort((a, b) => {
    const orderA = a.metadata?.display_order ?? 999;
    const orderB = b.metadata?.display_order ?? 999;
    return orderA - orderB;
  });
}

// Job Requisitions
export async function getJobRequisitions(): Promise<JobRequisition[]> {
  return fetchObjects<JobRequisition>('job-requisitions');
}

export async function getJobRequisition(slug: string): Promise<JobRequisition | null> {
  return fetchOneObject<JobRequisition>('job-requisitions', slug);
}

// Job Postings
export async function getJobPostings(): Promise<JobPosting[]> {
  return fetchObjects<JobPosting>('job-postings');
}

export async function getJobPosting(slug: string): Promise<JobPosting | null> {
  return fetchOneObject<JobPosting>('job-postings', slug);
}

// Candidates
export async function getCandidates(): Promise<Candidate[]> {
  return fetchObjects<Candidate>('candidates');
}

export async function getCandidate(slug: string): Promise<Candidate | null> {
  return fetchOneObject<Candidate>('candidates', slug);
}

// Candidate Activities
export async function getCandidateActivities(): Promise<CandidateActivity[]> {
  return fetchObjects<CandidateActivity>('candidate-activities');
}

export async function getActivitiesForCandidate(candidateId: string): Promise<CandidateActivity[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'candidate-activities',
        'metadata.candidate': candidateId,
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    return response.objects as CandidateActivity[];
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching candidate activities:', error);
    return [];
  }
}

// Offer Letters
export async function getOfferLetters(): Promise<OfferLetter[]> {
  return fetchObjects<OfferLetter>('offer-letters');
}

export async function getOfferLetter(slug: string): Promise<OfferLetter | null> {
  return fetchOneObject<OfferLetter>('offer-letters', slug);
}

// Report Snapshots
export async function getReportSnapshots(): Promise<ReportSnapshot[]> {
  return fetchObjects<ReportSnapshot>('report-snapshots');
}

// Audit Logs
export async function getAuditLogs(): Promise<AuditLog[]> {
  const logs = await fetchObjects<AuditLog>('audit-logs');
  return logs.sort((a, b) => {
    const dateA = new Date(a.metadata?.log_timestamp || a.created_at).getTime();
    const dateB = new Date(b.metadata?.log_timestamp || b.created_at).getTime();
    return dateB - dateA;
  });
}

// Search candidates
export async function searchCandidates(query: string): Promise<Candidate[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'candidates',
        title: { $regex: query, $options: 'i' },
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    return response.objects as Candidate[];
  } catch (error: unknown) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error searching candidates:', error);
    return [];
  }
}

// Dashboard Stats
export async function getDashboardStats() {
  const [requisitions, postings, candidates, offers] = await Promise.all([
    getJobRequisitions(),
    getJobPostings(),
    getCandidates(),
    getOfferLetters(),
  ]);

  const openRequisitions = requisitions.filter(
    (r) => getMetafieldValueLocal(r.metadata?.status) === 'Approved'
  ).length;
  const activePostings = postings.filter(
    (p) => getMetafieldValueLocal(p.metadata?.posting_status) === 'Active'
  ).length;
  const totalCandidates = candidates.length;
  const pendingOffers = offers.filter(
    (o) => getMetafieldValueLocal(o.metadata?.offer_status) === 'Sent'
  ).length;

  return {
    openRequisitions,
    activePostings,
    totalCandidates,
    pendingOffers,
    requisitions,
    postings,
    candidates,
    offers,
  };
}

function getMetafieldValueLocal(field: unknown): string {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'number' || typeof field === 'boolean') return String(field);
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value);
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key);
  }
  return '';
}