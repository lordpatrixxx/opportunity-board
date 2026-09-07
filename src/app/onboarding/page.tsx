'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Education & Experience
  const [education, setEducation] = useState('');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');

  // Step 2: Categories of interest
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'software-engineering',
    'ai-data-science',
  ]);

  // Step 3: Workplace & Location
  const [workplacePreference, setWorkplacePreference] = useState('remote');
  const [location, setLocation] = useState('');
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const categoriesList = [
    { id: 'software-engineering', name: 'Software Engineering', icon: 'code' },
    { id: 'ai-data-science', name: 'AI & Data Science', icon: 'psychology' },
    { id: 'design-ui-ux', name: 'Design & UI/UX', icon: 'palette' },
    { id: 'product-management', name: 'Product Management', icon: 'layers' },
    { id: 'research-fellowships', name: 'Research & Fellowships', icon: 'science' },
    { id: 'hackathons', name: 'Hackathons', icon: 'terminal' },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: 'security' },
    { id: 'finance-business', name: 'Finance & Business', icon: 'trending_up' },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setLoading(true);

    const payload = {
      education: education.trim() || undefined,
      graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
      experienceLevel,
      interests: selectedCategories,
      workplacePreference,
      location: location.trim() || undefined,
      notifyDeadlines,
    };

    try {
      const res = await fetch('/api/profile/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await refreshUser();
        showToast('Preferences configured! Welcome aboard.', 'success');
        router.push('/onboarding/complete');
      } else {
        showToast('Failed to save preferences, continuing to dashboard', 'info');
        router.push('/onboarding/complete');
      }
    } catch (err) {
      router.push('/onboarding/complete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-space-sm sm:p-space-lg relative">
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-primary/5 blur-3xl -z-10" />

      {/* Header */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between py-space-xs">
        <Link href="/" className="flex items-center gap-space-xs group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[20px]">explore</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Opportunity Board
          </span>
        </Link>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-xs font-bold text-on-surface-variant hover:text-on-surface"
        >
          Skip for now
        </button>
      </header>

      {/* Stepper Wizard Body */}
      <main className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center py-space-md">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-space-md">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-primary'
                  : s < step
                  ? 'w-4 bg-primary/40'
                  : 'w-4 bg-surface-container-high'
              }`}
            />
          ))}
        </div>

        <div className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-3xl border border-outline-variant/30 shadow-lg flex flex-col gap-space-md">
          {/* STEP 1: Academic Profile */}
          {step === 1 && (
            <div className="flex flex-col gap-space-md">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                  Step 1 of 3: Background
                </span>
                <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight mt-1">
                  Tell us about your background
                </h1>
                <p className="text-xs text-on-surface-variant mt-1">
                  We use your education level to filter opportunities matching your eligibility.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    University / College & Major
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. Stanford University, Computer Science"
                    className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    Expected Graduation Year
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029 or later</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'beginner', label: 'Beginner', desc: '1st/2nd Year' },
                      { id: 'intermediate', label: 'Intermediate', desc: 'Junior/Senior' },
                      { id: 'advanced', label: 'Advanced', desc: 'Grad/Postgrad' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setExperienceLevel(lvl.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          experienceLevel === lvl.id
                            ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                            : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <p className="text-xs font-bold">{lvl.label}</p>
                        <p className="text-[10px] text-on-surface-variant">{lvl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-space-xs w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center justify-center gap-1.5"
              >
                <span>Continue to Interests</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* STEP 2: Categories of Interest */}
          {step === 2 && (
            <div className="flex flex-col gap-space-md">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                  Step 2 of 3: Target Roles
                </span>
                <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight mt-1">
                  What opportunities are you looking for?
                </h1>
                <p className="text-xs text-on-surface-variant mt-1">
                  Select all categories you wish to track. You can change these anytime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-space-xs ${
                        isSelected
                          ? 'bg-primary-container text-on-primary border-primary shadow-xs'
                          : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] shrink-0">
                        {cat.icon}
                      </span>
                      <span className="text-xs font-bold">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-space-sm mt-space-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-space-md py-3 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center justify-center gap-1.5"
                >
                  <span>Continue to Preferences</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Work Mode & Notifications */}
          {step === 3 && (
            <div className="flex flex-col gap-space-md">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                  Step 3 of 3: Logistics
                </span>
                <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight mt-1">
                  Workplace mode & alerts
                </h1>
                <p className="text-xs text-on-surface-variant mt-1">
                  Customize how you work and how we notify you about upcoming deadlines.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    Preferred Workplace Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'remote', label: 'Remote Only', icon: 'home' },
                      { id: 'hybrid', label: 'Hybrid', icon: 'domain' },
                      { id: 'in_person', label: 'In-Person', icon: 'business' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setWorkplacePreference(m.id)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          workplacePreference === m.id
                            ? 'bg-secondary text-white border-secondary font-bold shadow-xs'
                            : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                        <span className="text-xs">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    Your Location (City / Region)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco Bay Area, CA"
                    className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-space-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notifyDeadlines}
                      onChange={(e) => setNotifyDeadlines(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary"
                    />
                    <div>
                      <p className="font-bold text-xs text-on-surface">
                        Enable Deadline Alert Reminders
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        Receive email alerts 7 days before application deadlines.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-space-sm mt-space-xs">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-space-md py-3 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinish}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Setup & Explore</span>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto w-full text-center py-space-xs text-xs text-on-surface-variant/70">
        <p>&copy; 2026 Opportunity Board. All rights reserved.</p>
      </footer>
    </div>
  );
}
