export type InvestorType =
  | 'individual'
  | 'family_office'
  | 'vc_fund'
  | 'syndicate'
  | 'sovereign'
  | 'corporate'
  | 'other'

export type InvestorStatus = 'invited' | 'active' | 'suspended' | 'expired'

export interface Investor {
  id: string
  email: string
  name: string
  organisation: string | null
  investor_type: InvestorType
  status: InvestorStatus
  nda_signed: boolean
  nda_signed_at: string | null
  auth_user_id: string | null
  access_expires_at: string | null
  notes: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface DocumentFolder {
  id: string
  name: string
  description: string | null
  sort_order: number
  is_collapsed_default: boolean
  icon: string
  parent_id: string | null
  created_at: string
}

export interface Document {
  id: string
  folder_id: string
  title: string
  description: string | null
  file_path: string
  file_type: string
  file_size: number | null
  version: number
  is_viewable: boolean
  is_downloadable: boolean
  is_watermarked: boolean
  sort_order: number
  uploaded_by: string | null
  created_at: string
  updated_at: string
}

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'view_document'
  | 'download_document'
  | 'sign_nda'
  | 'request_access'
  | 'submit_question'

export interface ActivityLog {
  id: string
  investor_id: string
  action: ActivityAction
  document_id: string | null
  duration_seconds: number | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface Question {
  id: string
  investor_id: string
  question: string
  answer: string | null
  answered_by: string | null
  answered_at: string | null
  status: 'pending' | 'answered'
  created_at: string
}

export interface Settings {
  id: string
  room_name: string
  room_description: string
  nda_text: string
  watermark_opacity: number
  require_nda: boolean
  allow_downloads: boolean
  brand_primary_color: string
  brand_accent_color: string
  calendly_url: string
  cake_equity_url: string
  created_at: string
  updated_at: string
}

export type CapTableEntityType = 'founder' | 'investor' | 'advisor' | 'esop' | 'reserved' | 'gifted'

export interface CapTableEntry {
  id: string
  shareholder_name: string
  entity_type: CapTableEntityType
  share_class: string
  shares_held: number
  ownership_percentage: number
  investment_amount: number
  sort_order: number
  created_at: string
}

export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface FolderWithDocuments extends DocumentFolder {
  documents: Document[]
  subfolders?: FolderWithDocuments[]
}

export interface ActivityLogWithRelations extends ActivityLog {
  investor?: Investor
  document?: Document
}
