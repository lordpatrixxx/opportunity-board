export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  headquarter?: string | null;
  location?: string | null;
  description?: string | null;
  isVerified: boolean;
  verified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string | null;
  sortOrder: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Opportunity {
  id: string;
  userId: string;
  createdById?: string;
  organizationId: string;
  categoryId: string;
  title: string;
  opportunityType: string;
  type?: string;
  workplaceMode: 'remote' | 'onsite' | 'hybrid' | string;
  experienceLevel?: string | null;
  location?: string | null;
  compensationType?: string | null;
  compensationAmount?: string | null;
  compensation?: string | null;
  applicationDeadline?: Date | string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  duration?: string | null;
  term?: string | null;
  shortSummary?: string | null;
  description: string;
  eligibility?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  applicationUrl?: string | null;
  contactEmail?: string | null;
  status: 'pending' | 'approved' | 'flagged' | 'rejected' | 'closed' | string;
  isFeatured: boolean;
  isUrgent: boolean;
  viewCount: number;
  viewsCount?: number;
  bookmarkCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;

  organization: Organization;
  category: Category;
  tags?: { tag: Tag }[];
  isBookmarked?: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  university?: string | null;
  degree?: string | null;
  fieldOfStudy?: string | null;
  graduationYear?: number | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  preferredWorkMode?: string | null;
  preferredLocations?: string | null;
  preferredCategories?: string | null;
  skills?: string | null;
  onboardingCompleted: boolean;
}

export interface SafeUser {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  role: string;
  avatarUrl?: string | null;
  profile?: UserProfile | null;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'DEADLINE' | 'MATCH' | 'STATUS' | 'SYSTEM';
  title: string;
  message: string;
  actionUrl?: string | null;
  isRead: boolean;
  createdAt: Date | string;
}

export interface FilterParams {
  q?: string;
  category?: string;
  type?: string;
  workplaceMode?: string;
  location?: string;
  deadline?: string;
  compensation?: string;
  skills?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}
