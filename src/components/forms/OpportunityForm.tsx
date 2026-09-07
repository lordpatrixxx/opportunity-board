'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { Category } from '@/components/opportunities/CategoryStrip';
import { Opportunity } from '@/types';

interface OpportunityFormProps {
  initialData?: Partial<Opportunity>;
  isEditing?: boolean;
}

export default function OpportunityForm({
  initialData,
  isEditing = false,
}: OpportunityFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [organizationName, setOrganizationName] = useState(
    initialData?.organization?.name || ''
  );
  const [organizationWebsite, setOrganizationWebsite] = useState(
    initialData?.organization?.website || ''
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [type, setType] = useState(initialData?.type || 'internship');
  const [workplaceMode, setWorkplaceMode] = useState(
    initialData?.workplaceMode || 'remote'
  );
  const [experienceLevel, setExperienceLevel] = useState(
    initialData?.experienceLevel || 'all'
  );
  const [location, setLocation] = useState(initialData?.location || '');
  const [applicationDeadline, setApplicationDeadline] = useState(
    initialData?.applicationDeadline
      ? new Date(initialData.applicationDeadline).toISOString().split('T')[0]
      : '2026-06-30'
  );
  const [term, setTerm] = useState(initialData?.term || 'Summer 2026');
  const [compensation, setCompensation] = useState(
    initialData?.compensation || ''
  );
  const [applicationUrl, setApplicationUrl] = useState(
    initialData?.applicationUrl || ''
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [requirements, setRequirements] = useState(
    initialData?.requirements || ''
  );
  const [benefits, setBenefits] = useState(initialData?.benefits || '');
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.map((t) => t.tag.name).join(', ') || ''
  );

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
          if (!categoryId && data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !organizationName.trim() || !applicationUrl.trim() || !description.trim()) {
      setErrorMsg('Please complete all required fields (Title, Organization, Application URL, and Description).');
      return;
    }

    if (description.trim().length < 30) {
      setErrorMsg('Description must be at least 30 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const selectedCat = categories.find((c) => c.id === categoryId) || categories[0];
    const normalizedWorkplace = workplaceMode === 'in_person' ? 'onsite' : (workplaceMode || 'remote');

    const payload = {
      title: title.trim(),
      organizationName: organizationName.trim(),
      organizationUrl: organizationWebsite.trim() || undefined,
      categorySlug: selectedCat?.slug || 'software-engineering',
      categoryId: selectedCat?.id || categoryId,
      opportunityType: type,
      type,
      workplaceMode: normalizedWorkplace,
      location: location.trim() || undefined,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline).toISOString() : undefined,
      duration: term.trim() || 'Summer 2026',
      term: term.trim() || 'Summer 2026',
      compensationAmount: compensation.trim() || undefined,
      compensation: compensation.trim() || undefined,
      compensationType: 'stipend',
      applicationUrl: applicationUrl.trim(),
      shortSummary: description.trim().substring(0, 160),
      description: description.trim(),
      eligibility: requirements.trim() || undefined,
      requirements: requirements.trim() || undefined,
      benefits: benefits.trim() || undefined,
      skills: parsedTags,
    };

    try {
      const endpoint = isEditing && initialData?.id
        ? `/api/opportunities/${initialData.id}`
        : '/api/opportunities';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          isEditing ? 'Opportunity updated successfully!' : 'Opportunity posted successfully!',
          'success'
        );
        router.push('/my-posts');
      } else {
        setErrorMsg(data.error || 'Failed to save opportunity.');
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
      showToast('Network error while saving', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
      {errorMsg && (
        <div className="p-space-sm rounded-2xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-md">
        <h2 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-space-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
          <span>1. Basic Opportunity Information</span>
        </h2>

        {/* Opportunity Title */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Opportunity Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI Research Fellow — Summer 2026"
            className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Organization Name & Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Host Organization / Company <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g. OpenAI, MIT Media Lab"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Organization Website
            </label>
            <input
              type="url"
              value={organizationWebsite}
              onChange={(e) => setOrganizationWebsite(e.target.value)}
              placeholder="https://example.org"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Category & Opportunity Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Category <span className="text-error">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Opportunity Type <span className="text-error">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary capitalize"
            >
              <option value="internship">Internship</option>
              <option value="hackathon">Hackathon</option>
              <option value="fellowship">Fellowship</option>
              <option value="scholarship">Scholarship</option>
              <option value="grant">Grant</option>
              <option value="full_time">Full-Time / New Grad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Logistics & Requirements */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-md">
        <h2 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-space-xs">
          <span className="material-symbols-outlined text-secondary text-[20px]">tune</span>
          <span>2. Logistics & Application Details</span>
        </h2>

        {/* Workplace Mode & Experience Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Workplace Mode <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'remote', label: 'Remote' },
                { id: 'hybrid', label: 'Hybrid' },
                { id: 'in_person', label: 'In-Person' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setWorkplaceMode(m.id)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    workplaceMode === m.id
                      ? 'bg-secondary text-white shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary capitalize"
            >
              <option value="all">All Experience Levels</option>
              <option value="beginner">Beginner / First-Year</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced / Graduate</option>
            </select>
          </div>
        </div>

        {/* Location & Compensation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA or Remote"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Compensation / Stipend
            </label>
            <input
              type="text"
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              placeholder="e.g. $50/hr + $10k housing, $10,000 prize pool"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Application Deadline & Term */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Application Deadline <span className="text-error">*</span>
            </label>
            <input
              type="date"
              required
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <span className="text-[11px] text-on-surface-variant">
              Applications will be highlighted as &ldquo;Closing Soon&rdquo; in the 14 days prior.
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Target Term / Cohort
            </label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. Summer 2026, Fall 2026"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Application URL */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Official Application URL <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              type="url"
              required
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="https://company.com/apply/job-id-123"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pl-9"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px]">
              link
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant">
            Applicants will be routed here directly via the direct partner hand-off interstitial modal.
          </span>
        </div>

        {/* Required Skills / Tags */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Required Skills & Tags (Comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. Python, Machine Learning, PyTorch, React"
            className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Section 3: Deep Description & Details */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-md">
        <h2 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-space-xs">
          <span className="material-symbols-outlined text-tertiary text-[20px]">edit_document</span>
          <span>3. Detailed Role & Program Content</span>
        </h2>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Role Overview / Description <span className="text-error">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a comprehensive summary of this program, responsibilities, team dynamics, and learning outcomes..."
            className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Eligibility & Candidate Requirements
          </label>
          <textarea
            rows={3}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="e.g. Currently enrolled in a Bachelor's or Master's program in CS or related field; experience with distributed systems..."
            className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Mentorship, Perks & Housing Benefits
          </label>
          <textarea
            rows={3}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="e.g. 1-on-1 mentorship with senior staff researchers, weekly speaker series, full housing stipend provided..."
            className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-space-sm pt-space-xs">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-space-md py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-xs hover:bg-surface-container-high transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-space-xl py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-space-2xs"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{isEditing ? 'Save Changes' : 'Publish Opportunity'}</span>
              <span className="material-symbols-outlined text-[18px]">
                {isEditing ? 'check' : 'publish'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
