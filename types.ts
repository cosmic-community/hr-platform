// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at: string;
  modified_at: string;
}

// File metafield
export interface CosmicFile {
  url: string;
  imgix_url: string;
}

// Team Members
export interface TeamMember extends CosmicObject {
  type: 'team-members';
  metadata: {
    full_name?: string;
    email?: string;
    role?: string;
    department?: string;
    avatar?: CosmicFile;
    phone?: string;
    active?: boolean;
  };
}

// Pipeline Stages
export interface PipelineStage extends CosmicObject {
  type: 'pipeline-stages';
  metadata: {
    stage_name?: string;
    display_order?: number;
    stage_color?: string;
    description?: string;
    is_final_stage?: boolean;
  };
}

// Job Requisitions
export type RequisitionStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Filled' | 'Cancelled';
export type RequisitionPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface JobRequisition extends CosmicObject {
  type: 'job-requisitions';
  metadata: {
    job_title?: string;
    department?: string;
    headcount?: number;
    budget?: number;
    currency?: string;
    hiring_manager?: TeamMember;
    status?: RequisitionStatus;
    priority?: RequisitionPriority;
    description?: string;
    target_start_date?: string;
    approval_history?: string;
  };
}

// Job Postings
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
export type PostingStatus = 'Draft' | 'Active' | 'Paused' | 'Closed' | 'Expired';

export interface JobPosting extends CosmicObject {
  type: 'job-postings';
  metadata: {
    position_title?: string;
    requisition?: JobRequisition;
    job_description?: string;
    requirements?: string;
    location?: string;
    employment_type?: EmploymentType;
    salary_min?: number;
    salary_max?: number;
    posted_boards?: string;
    career_site_embed?: string;
    posting_status?: PostingStatus;
    application_deadline?: string;
  };
}

// Candidates
export interface Candidate extends CosmicObject {
  type: 'candidates';
  metadata: {
    full_name?: string;
    email?: string;
    phone?: string;
    applied_position?: JobPosting;
    current_stage?: PipelineStage;
    resume_file?: CosmicFile;
    parsed_resume_data?: string;
    ai_ranking_score?: number;
    ai_ranking_reasoning?: string;
    source?: string;
    applied_date?: string;
    tags?: string;
    in_talent_pool?: boolean;
  };
}

// Candidate Activities
export type ActivityType = 'Comment' | 'Rating' | 'Status Change' | 'Interview' | 'Email' | 'Note';

export interface CandidateActivity extends CosmicObject {
  type: 'candidate-activities';
  metadata: {
    candidate?: Candidate;
    activity_type?: ActivityType;
    content?: string;
    rating?: number;
    actor?: TeamMember;
    activity_date?: string;
    interview_details?: string;
  };
}

// Offer Letters
export type OfferStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired' | 'Withdrawn';

export interface OfferLetter extends CosmicObject {
  type: 'offer-letters';
  metadata: {
    candidate?: Candidate;
    position?: string;
    offered_salary?: number;
    currency?: string;
    start_date?: string;
    offer_letter_content?: string;
    offer_status?: OfferStatus;
    signature_data?: string;
    signed_date?: string;
    expiry_date?: string;
    benefits_package?: string;
  };
}

// Report Snapshots
export interface ReportSnapshot extends CosmicObject {
  type: 'report-snapshots';
  metadata: {
    report_period?: string;
    time_to_hire_data?: string;
    source_effectiveness?: string;
    cost_per_hire?: string;
    pipeline_dropoff_rates?: string;
    total_applications?: number;
    total_hires?: number;
    snapshot_date?: string;
  };
}

// Audit Logs
export type AuditActionType = 'Create' | 'Update' | 'Delete' | 'View' | 'Export' | 'Login' | 'Approve' | 'Reject';

export interface AuditLog extends CosmicObject {
  type: 'audit-logs';
  metadata: {
    action_type?: AuditActionType;
    actor?: string;
    target_entity_type?: string;
    target_entity_id?: string;
    description?: string;
    ip_address?: string;
    change_details?: string;
    log_timestamp?: string;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Utility: safe metafield value extraction
export function getMetafieldValue(field: unknown): string {
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