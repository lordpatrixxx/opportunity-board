'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [workplacePreference, setWorkplacePreference] = useState('remote');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifyOpportunities, setNotifyOpportunities] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          const p = data.profile;
          setName(data.user.name || '');
          if (p) {
            setBio(p.bio || '');
            setEducation(p.education || '');
            setGraduationYear(p.graduationYear ? p.graduationYear.toString() : '');
            setLocation(p.location || '');
            setSkills(Array.isArray(p.skills) ? p.skills.join(', ') : '');
            setInterests(Array.isArray(p.interests) ? p.interests.join(', ') : '');
            setWorkplacePreference(p.workplacePreference || 'remote');
            setExperienceLevel(p.experienceLevel || 'intermediate');
            setNotifyDeadlines(p.notifyDeadlines ?? true);
            setNotifyOpportunities(p.notifyOpportunities ?? true);
          }
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadProfile();
      }
    }
  }, [user, authLoading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const parsedSkills = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedInterests = interests
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      bio: bio.trim() || undefined,
      education: education.trim() || undefined,
      graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
      location: location.trim() || undefined,
      skills: parsedSkills,
      interests: parsedInterests,
      workplacePreference,
      experienceLevel,
      notifyDeadlines,
      notifyOpportunities,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Profile and preferences updated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('Network error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    showToast('Signed out successfully', 'info');
    router.push('/');
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="max-w-4xl mx-auto px-gutter-mobile py-space-2xl text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-lg">
      {/* Header & User Hero Card */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs mb-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center font-black text-2xl shadow-xs">
            {user?.name?.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-black text-on-surface">
                {user?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary-fixed text-on-primary-fixed">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
              {user?.email}
            </p>
            {education && (
              <p className="text-[11px] text-on-surface-variant/80 mt-0.5">
                🎓 {education} {graduationYear ? `• Class of ${graduationYear}` : ''}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="px-3 py-2 rounded-xl border border-outline-variant/30 text-xs font-bold text-error hover:bg-error-container/30 transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-space-lg">
        {/* Section 1: Academic & Personal Info */}
        <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-md">
          <h2 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
            <span>Personal & Academic Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                Current Location / City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Stanford, CA or Remote"
                className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                University / Institution
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. Stanford University, B.S. Computer Science"
                className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                Expected Graduation Year
              </label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="2026"
                className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Short Bio / Pitch
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Junior CS student passionate about distributed systems, ML infrastructure, and developer tooling..."
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Section 2: Skills & Career Preferences */}
        <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-md">
          <h2 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-space-xs">
            <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
            <span>Target Roles & Preferences</span>
          </h2>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Skills & Technologies (Comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Python, React, TypeScript, PyTorch, Docker"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Interests / Fields
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Machine Learning, Full-Stack, Quantitative Finance, Open Source"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                Preferred Workplace Mode
              </label>
              <select
                value={workplacePreference}
                onChange={(e) => setWorkplacePreference(e.target.value)}
                className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize"
              >
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="in_person">In-Person</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                Current Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize"
              >
                <option value="beginner">Beginner / First-Year</option>
                <option value="intermediate">Intermediate / Sophomore-Junior</option>
                <option value="advanced">Advanced / Senior & Graduate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Settings */}
        <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-md">
          <h2 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-space-xs">
            <span className="material-symbols-outlined text-tertiary text-[20px]">notifications</span>
            <span>Notifications & Deadline Alerts</span>
          </h2>

          <div className="flex flex-col gap-space-xs">
            <label className="flex items-center gap-space-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyDeadlines}
                onChange={(e) => setNotifyDeadlines(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary"
              />
              <div>
                <p className="font-bold text-xs text-on-surface">
                  Deadline Countdown Reminders
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Get notified 7 days and 48 hours before saved opportunity application deadlines close.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-space-xs cursor-pointer select-none mt-2">
              <input
                type="checkbox"
                checked={notifyOpportunities}
                onChange={(e) => setNotifyOpportunities(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary"
              />
              <div>
                <p className="font-bold text-xs text-on-surface">
                  New Matching Opportunities Digest
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Weekly recommendations customized to your specified skills and workplace preferences.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-space-sm">
          <button
            type="submit"
            disabled={saving}
            className="px-space-xl py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
