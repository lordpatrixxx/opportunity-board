import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Opportunity Board database with 2026 data...');

  // 1. Clean existing records in cascade
  await prisma.moderationRecord.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.opportunityTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.category.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash default passwords
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const adminPasswordHash = await bcrypt.hash('AdminSecure2026!', 10);

  // 3. Create Users
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@stanford.edu',
      fullName: 'Maya Lin',
      passwordHash: passwordHash,
      role: 'USER',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida/AEtjO1VarjAWepmyJwNKy0i-25BhzT5iCd2kKRPP_E-D9dXZmwf0f9l6bcxCC826lNIG_AFFodp59djWCVrde4tncxizCfzIUmkeG9PWE7p9KVQDLrj3Q-qgbhjrYfpI2GOOi385BOCeDbHRk5O3gfW0XuIupUEwezgNSh1XFZhyoe3fZRJEgzBlZjXhSxGftDW43LzB0d7UR_SGQc__V3m4QNLDxqv8fsEBjNw5aT3Pvl9iD3un8CsJCSIpEPc',
      profile: {
        create: {
          university: 'Stanford University',
          degree: 'B.S. Computer Science',
          fieldOfStudy: 'Artificial Intelligence & Systems',
          graduationYear: 2027,
          bio: 'Passionate undergraduate researcher focusing on multimodal alignment benchmarks, reinforcement learning, and distributed AI training systems.',
          location: 'San Francisco Bay Area, CA',
          phone: '+1 (415) 890-2412',
          preferredWorkMode: 'remote,hybrid',
          preferredCategories: 'internships,fellowships,hackathons',
          skills: 'Python,PyTorch,TypeScript,React,Next.js,C++',
          onboardingCompleted: true,
        },
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@opportunityboard.org',
      fullName: 'Alex Mercer',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida/AEtjO1VarjAWepmyJwNKy0i-25BhzT5iCd2kKRPP_E-D9dXZmwf0f9l6bcxCC826lNIG_AFFodp59djWCVrde4tncxizCfzIUmkeG9PWE7p9KVQDLrj3Q-qgbhjrYfpI2GOOi385BOCeDbHRk5O3gfW0XuIupUEwezgNSh1XFZhyoe3fZRJEgzBlZjXhSxGftDW43LzB0d7UR_SGQc__V3m4QNLDxqv8fsEBjNw5aT3Pvl9iD3un8CsJCSIpEPc',
      profile: {
        create: {
          university: 'MIT',
          degree: 'M.S. EECS',
          fieldOfStudy: 'Platform Trust & Safety',
          graduationYear: 2024,
          bio: 'Lead content auditor and platform operations manager at Opportunity Board.',
          location: 'Cambridge, MA',
          onboardingCompleted: true,
        },
      },
    },
  });

  const posterUser = await prisma.user.create({
    data: {
      email: 'dr.chen@ibm.com',
      fullName: 'Dr. Chen Zhao',
      passwordHash: passwordHash,
      role: 'USER',
      avatarUrl: null,
      profile: {
        create: {
          university: 'IBM Research Labs',
          degree: 'Ph.D. Physics',
          fieldOfStudy: 'Superconducting Qubits',
          graduationYear: 2018,
          bio: 'Director of University Programs & Fellowship Director at IBM Quantum.',
          location: 'Yorktown Heights, NY',
          onboardingCompleted: true,
        },
      },
    },
  });

  // 4. Create Categories
  const categoriesData = [
    { name: 'Internships', slug: 'internships', icon: 'work', description: 'Undergraduate & graduate industry placements', sortOrder: 1 },
    { name: 'Hackathons', slug: 'hackathons', icon: 'code_blocks', description: 'Competitive builds & sprint challenges', sortOrder: 2 },
    { name: 'Fellowships', slug: 'fellowships', icon: 'biotech', description: 'Funded academic and research residencies', sortOrder: 3 },
    { name: 'Workshops', slug: 'workshops', icon: 'handyman', description: 'Skill intensives and technical seminars', sortOrder: 4 },
    { name: 'Competitions', slug: 'competitions', icon: 'emoji_events', description: 'Global prize pools & open innovation', sortOrder: 5 },
    { name: 'Scholarships', slug: 'scholarships', icon: 'school', description: 'Tuition grants and academic awards', sortOrder: 6 },
    { name: 'Early Jobs', slug: 'early-jobs', icon: 'rocket_launch', description: 'New grad & junior engineering roles', sortOrder: 7 },
    { name: 'Conferences', slug: 'conferences', icon: 'groups', description: 'Academic symposiums & student travel grants', sortOrder: 8 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }

  // 5. Create Organizations
  const organizationsData = [
    {
      name: 'OpenAI',
      slug: 'openai',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7fwHALtkIXufbw0hIY0WJoecaa66f1MM8q5ryo3-ZDayBilCwTzossPE5ujtIm6ykBz6Kd6jXYHc3n1tHXlUToCztzeNM7IK6-2_HjP8MSj8vcZpVfXyqGatz1pe1m1FENqeqRO8B5msELbFsSra_dMwmNGg2QxWTzl6JO8mlu-IPVTeppyVBuO_YgO6YlvMpsD6YBzg3wtLbiqrDWQpOm5PGw6fUJTU1YZYjFIse-vknjTCqADbo',
      websiteUrl: 'https://openai.com',
      industry: 'Artificial Intelligence',
      headquarter: 'San Francisco, CA',
      isVerified: true,
    },
    {
      name: 'Google DeepMind',
      slug: 'google-deepmind',
      logoUrl: null,
      websiteUrl: 'https://deepmind.google',
      industry: 'Frontier AI Research',
      headquarter: 'London & Mountain View',
      isVerified: true,
    },
    {
      name: 'IBM Research Labs',
      slug: 'ibm-research',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw1bsoi4Ldkpqp5coDVvwkxJBSx1CP-mE25Su3roENBdMpbmQZhk10ReiyMEhVRZGnSPc9yocBJhDTxDlm3Q7QPtTrlpnJ4Fmg6znZD-H-Nto4gHAJrZqqqgvHnkzcoZKX-r-J1hm8uUXx8LArt9ynginoCvL1eKXHMYVpFlBZOmGoituf3z2zn4jQVaPRLtElKBmL_WP_CPz2ohkaU3H2MivRtGmeNPLIHPdoFb8vf7ptLuIyHA7p',
      websiteUrl: 'https://research.ibm.com',
      industry: 'Quantum Computing & Semiconductor',
      headquarter: 'Yorktown Heights, NY',
      isVerified: true,
    },
    {
      name: 'Figma',
      slug: 'figma',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOKUiX7fPWQq4lRCVg75hE9DgTy9g1Y6DqLENtVqV03oUSHDDevGF45oVI6UCYnZ2Ru0kfd68UMKD3RtUBQoOHcgayX2eBxjTNYd_1EfbUUJhEM6ciXyVNAvCaiqNiCp5gy7wRg_XJ4q4uu9QxmhRKUeeEZFvtjKGrLkWFBbVTf5M5zciffU5GZ06MRP-tLgqanjquQX3YOF7ukhl61GMuYG1_n_pwdGa63t7b5UkVsUhgkHEihx4d',
      websiteUrl: 'https://figma.com',
      industry: 'Design & Collaborative Software',
      headquarter: 'San Francisco, CA',
      isVerified: true,
    },
    {
      name: 'Stripe',
      slug: 'stripe',
      logoUrl: null,
      websiteUrl: 'https://stripe.com',
      industry: 'Financial Infrastructure',
      headquarter: 'San Francisco, CA',
      isVerified: true,
    },
    {
      name: 'Boston Dynamics AI Institute',
      slug: 'bdai',
      logoUrl: null,
      websiteUrl: 'https://theaiinstitute.com',
      industry: 'Embodied AI & Robotics',
      headquarter: 'Cambridge, MA',
      isVerified: true,
    },
    {
      name: 'Climate Foundation Labs',
      slug: 'climate-foundation',
      logoUrl: null,
      websiteUrl: 'https://climatefoundation.org',
      industry: 'ClimateTech & Geospatial',
      headquarter: 'Seattle, WA',
      isVerified: true,
    },
    {
      name: 'Unknown Web3 DAO',
      slug: 'unknown-dao',
      logoUrl: null,
      websiteUrl: 'https://unknown-dao.xyz',
      industry: 'Crypto & Web3',
      headquarter: 'Decentralized',
      isVerified: false,
    },
  ];

  const orgs: Record<string, any> = {};
  for (const org of organizationsData) {
    orgs[org.slug] = await prisma.organization.create({ data: org });
  }

  // 6. Create Tags
  const tagsData = [
    'AI & Machine Learning',
    'Reinforcement Learning',
    'Robotics',
    'Fullstack Engineering',
    'Quantum Computing',
    'ClimateTech',
    'UI/UX Design',
    'Distributed Systems',
    'PyTorch',
    'TypeScript',
    'Qiskit',
  ];

  const tags: Record<string, any> = {};
  for (const tagName of tagsData) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    tags[slug] = await prisma.tag.create({
      data: { name: tagName, slug },
    });
  }

  // 7. Create Opportunities with consistent 2026 dates
  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Opp 1: OpenAI Collegiate AI Residency (URGENT - 48h)
  const opp1 = await prisma.opportunity.create({
    data: {
      userId: studentUser.id,
      organizationId: orgs['openai'].id,
      categoryId: categories['internships'].id,
      title: 'Collegiate AI Residency & Research Fellow 2026',
      opportunityType: 'Internship',
      workplaceMode: 'hybrid',
      location: 'San Francisco, CA (Hybrid)',
      compensationType: 'stipend',
      compensationAmount: '$9,500/mo + Housing Stipend',
      applicationDeadline: twoDaysFromNow,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-12-15'),
      duration: '14 Weeks',
      shortSummary: 'Direct mentorship with Frontier Models alignment researchers. Work on scalable RLHF pipelines and reasoning benchmarks.',
      description: `### Program Overview\nThe Collegiate AI Residency & Research Fellow program is a flagship intensive residency at OpenAI for undergraduate seniors and graduate students. You will collaborate directly alongside frontier alignment scientists and reasoning research groups.\n\n### Key Responsibilities\n- Conduct directed experiments in automated reinforcement learning from human and model feedback (RLAIF).\n- Develop scalable evaluation benchmarks for mathematical reasoning, code synthesis, and multi-step tool verification.\n- Train and evaluate transformer-based multimodal checkpoints across large distributed clusters.\n\n### Qualifications\n- Current undergraduate senior or enrolled Master's/Ph.D. student in Computer Science, Statistics, Mathematics, or a related field.\n- Demonstrated proficiency in PyTorch and distributed training concepts.\n- Track record of independent projects, top competitive programming results, or conference contributions.`,
      eligibility: 'Undergrad seniors & graduate students worldwide (J-1/F-1 visa sponsorship provided).',
      applicationUrl: 'https://jobs.lever.co/openai/fellowship-2026',
      contactEmail: 'university-recruiting@openai.com',
      status: 'approved',
      isFeatured: true,
      isUrgent: true,
      viewCount: 1420,
      bookmarkCount: 384,
      tags: {
        create: [
          { tag: { connect: { id: tags['ai-machine-learning'].id } } },
          { tag: { connect: { id: tags['reinforcement-learning'].id } } },
          { tag: { connect: { id: tags['pytorch'].id } } },
        ],
      },
    },
  });

  // Opp 2: DeepMind Autonomous Agents Sprint (URGENT - 48h)
  const opp2 = await prisma.opportunity.create({
    data: {
      userId: adminUser.id,
      organizationId: orgs['google-deepmind'].id,
      categoryId: categories['hackathons'].id,
      title: 'Build with Autonomous Agents: Global Virtual Sprint 2026',
      opportunityType: 'Hackathon',
      workplaceMode: 'remote',
      location: 'Virtual / Global',
      compensationType: 'prize',
      compensationAmount: '$75,000 Total Prize Pool',
      applicationDeadline: twoDaysFromNow,
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-20'),
      duration: '5 Days',
      shortSummary: 'Build autonomous agent workflows with Gemini Pro SDK. Top winning teams receive direct interview fast-tracks and cloud credits.',
      description: `### Challenge Objective\nCompete globally to design, build, and deploy multi-agent cognitive systems utilizing Google Gemini 1.5 Pro and Gemini Live API. Teams will tackle open-ended problem domains including scientific literature discovery, automated accessibility auditing, and adaptive software debugging.\n\n### Track Prizes\n- **1st Place:** $35,000 + Google DeepMind Interview Fast-Track\n- **2nd Place:** $20,000 + $10,000 GCP Cloud Credits\n- **3rd Place:** $10,000 + Cloud TPU access grant\n- **Special Diversity & Education Award:** $10,000`,
      eligibility: 'Open to all students and early-career developers globally. Solo builders or teams up to 4.',
      applicationUrl: 'https://deepmind.google/sprint-2026',
      contactEmail: 'sprint@deepmind.google',
      status: 'approved',
      isFeatured: true,
      isUrgent: true,
      viewCount: 3420,
      bookmarkCount: 812,
      tags: {
        create: [
          { tag: { connect: { id: tags['ai-machine-learning'].id } } },
          { tag: { connect: { id: tags['typescript'].id } } },
        ],
      },
    },
  });

  // Opp 3: IBM Quantum Computing Summer Fellowship (PENDING REVIEW - For Admin Demo)
  const opp3 = await prisma.opportunity.create({
    data: {
      userId: posterUser.id,
      organizationId: orgs['ibm-research'].id,
      categoryId: categories['fellowships'].id,
      title: 'Quantum Computing Summer Fellowship 2026',
      opportunityType: 'Fellowship',
      workplaceMode: 'onsite',
      location: 'Yorktown Heights, NY (On-site)',
      compensationType: 'stipend',
      compensationAmount: '$8,400/mo + Corporate Housing',
      applicationDeadline: sixtyDaysFromNow,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-08-25'),
      duration: '12 Weeks',
      shortSummary: 'Residential research fellowship in superconducting qubit control, Qiskit algorithm development, and fault-tolerant error correction.',
      description: `### Fellowship Description\nAn immersive 12-week residential research fellowship at the Yorktown Heights facility. Selected graduate and undergraduate seniors conduct directed investigations in superconducting qubit control, Qiskit algorithm development, and fault-tolerant quantum error correction under senior staff mentorship.`,
      eligibility: 'Undergrad seniors & graduate students in Physics, Computer Science, EE, or Applied Math.',
      applicationUrl: 'https://research.ibm.com/fellowships/quantum-summer-2026',
      contactEmail: 'dr.chen@ibm.com',
      status: 'pending', // PENDING for Admin Moderation Center demo!
      isFeatured: false,
      isUrgent: false,
      viewCount: 88,
      bookmarkCount: 19,
      tags: {
        create: [
          { tag: { connect: { id: tags['quantum-computing'].id } } },
          { tag: { connect: { id: tags['qiskit'].id } } },
        ],
      },
    },
  });

  // Opp 4: Figma NextGen Fullstack Engineer Intern (APPROVED)
  const opp4 = await prisma.opportunity.create({
    data: {
      userId: adminUser.id,
      organizationId: orgs['figma'].id,
      categoryId: categories['internships'].id,
      title: 'NextGen Fullstack Engineer Intern 2026',
      opportunityType: 'Internship',
      workplaceMode: 'hybrid',
      location: 'San Francisco, CA / Hybrid',
      compensationType: 'paid',
      compensationAmount: '$58/hr + Relocation Support',
      applicationDeadline: fiveDaysFromNow,
      startDate: new Date('2026-05-18'),
      endDate: new Date('2026-08-14'),
      duration: '12 Weeks',
      shortSummary: 'Ship user-facing multiplayer features, WebGL canvas performance optimizations, and collaborative plugins across web and desktop.',
      description: `### About the Role\nJoin Figma's core product teams in San Francisco or New York. You will work alongside senior engineers to design and implement collaborative multiplayer canvas capabilities, WebAssembly rendering improvements, and design system authoring tools.`,
      eligibility: 'Returning students enrolled in an accredited undergraduate or master’s program with expected graduation between Dec 2026 and June 2027.',
      applicationUrl: 'https://figma.com/careers/university',
      contactEmail: 'university-recruiting@figma.com',
      status: 'approved',
      isFeatured: false,
      isUrgent: false,
      viewCount: 2190,
      bookmarkCount: 520,
      tags: {
        create: [
          { tag: { connect: { id: tags['fullstack-engineering'].id } } },
          { tag: { connect: { id: tags['typescript'].id } } },
          { tag: { connect: { id: tags['ui-ux-design'].id } } },
        ],
      },
    },
  });

  // Opp 5: Stripe Distributed Systems Fellow (APPROVED)
  const opp5 = await prisma.opportunity.create({
    data: {
      userId: adminUser.id,
      organizationId: orgs['stripe'].id,
      categoryId: categories['internships'].id,
      title: 'Infrastructure & Distributed Systems Engineering Fellow 2026',
      opportunityType: 'Internship',
      workplaceMode: 'hybrid',
      location: 'Seattle, WA / Hybrid',
      compensationType: 'paid',
      compensationAmount: '$60/hr + $10k Relocation',
      applicationDeadline: thirtyDaysFromNow,
      startDate: new Date('2026-06-08'),
      endDate: new Date('2026-08-28'),
      duration: '12 Weeks',
      shortSummary: 'Architect ultra-reliable payment processing pipelines and high-throughput consensus systems processing millions of events per second.',
      description: `### Opportunity Overview\nStripe's Infrastructure teams build the foundational platform powering hundreds of billions of dollars in global commerce. Interns solve real operational scaling problems across globally replicated databases, telemetry fabrics, and low-latency API gateways.`,
      eligibility: 'Undergraduate and graduate students pursuing degrees in Computer Science or Software Engineering.',
      applicationUrl: 'https://stripe.com/jobs/internships',
      contactEmail: 'recruiting@stripe.com',
      status: 'approved',
      isFeatured: true,
      isUrgent: false,
      viewCount: 1850,
      bookmarkCount: 410,
      tags: {
        create: [
          { tag: { connect: { id: tags['distributed-systems'].id } } },
          { tag: { connect: { id: tags['fullstack-engineering'].id } } },
        ],
      },
    },
  });

  // Opp 6: Boston Dynamics Robotics Fellowship (APPROVED)
  const opp6 = await prisma.opportunity.create({
    data: {
      userId: adminUser.id,
      organizationId: orgs['bdai'].id,
      categoryId: categories['fellowships'].id,
      title: 'Frontier Robotics & Embodied AI Research Fellow 2026',
      opportunityType: 'Fellowship',
      workplaceMode: 'onsite',
      location: 'Cambridge, MA (On-site)',
      compensationType: 'stipend',
      compensationAmount: '$8,500/mo + Lab Housing',
      applicationDeadline: thirtyDaysFromNow,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-08-31'),
      duration: '3 Months',
      shortSummary: 'Investigate humanoid manipulation benchmarks, zero-shot grasp generation, and multimodal visual feedback policies.',
      description: `### Research Focus\nThe Boston Dynamics AI Institute is dedicated to solving fundamental technical barriers in dexterous robotic manipulation and whole-body locomotion. Fellows have direct access to cutting-edge physical hardware and high-performance GPU simulation clusters.`,
      eligibility: 'Graduate students or senior undergrads with demonstrated experience in ROS2, PyTorch, and classical kinematics/dynamics.',
      applicationUrl: 'https://theaiinstitute.com/fellows',
      contactEmail: 'fellowships@theaiinstitute.com',
      status: 'approved',
      isFeatured: false,
      isUrgent: false,
      viewCount: 940,
      bookmarkCount: 275,
      tags: {
        create: [
          { tag: { connect: { id: tags['robotics'].id } } },
          { tag: { connect: { id: tags['ai-machine-learning'].id } } },
        ],
      },
    },
  });

  // Opp 7: Climate Foundation Labs Residency (APPROVED - REMOTE)
  const opp7 = await prisma.opportunity.create({
    data: {
      userId: studentUser.id,
      organizationId: orgs['climate-foundation'].id,
      categoryId: categories['fellowships'].id,
      title: 'Climate Intelligence & Geospatial ML Residency 2026',
      opportunityType: 'Fellowship',
      workplaceMode: 'remote',
      location: 'Remote (Worldwide)',
      compensationType: 'stipend',
      compensationAmount: '$7,800/mo Stipend',
      applicationDeadline: sixtyDaysFromNow,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-09-30'),
      duration: '3 Months',
      shortSummary: 'Apply computer vision to satellite imagery and ocean sensor buoys to model ocean carbon sequestration.',
      description: `### Mission\nHelp address planetary climate disruption through advanced geospatial data modeling and computer vision on satellite radar, multispectral data, and oceanographic sensor telemetry.`,
      eligibility: 'All students and early career researchers passionate about climate science and deep learning.',
      applicationUrl: 'https://climatefoundation.org/residency',
      contactEmail: 'research@climatefoundation.org',
      status: 'approved',
      isFeatured: false,
      isUrgent: false,
      viewCount: 710,
      bookmarkCount: 190,
      tags: {
        create: [
          { tag: { connect: { id: tags['climatetech'].id } } },
          { tag: { connect: { id: tags['ai-machine-learning'].id } } },
        ],
      },
    },
  });

  // Opp 8: Flagged Web3 Hackathon (FLAGGED - For Admin Moderation Demo)
  const opp8 = await prisma.opportunity.create({
    data: {
      userId: posterUser.id,
      organizationId: orgs['unknown-dao'].id,
      categoryId: categories['hackathons'].id,
      title: 'Autonomous Crypto Trading Bot Hackathon',
      opportunityType: 'Hackathon',
      workplaceMode: 'remote',
      location: 'Remote / Virtual',
      compensationType: 'prize',
      compensationAmount: '10,000 USDT',
      applicationDeadline: fiveDaysFromNow,
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-05'),
      duration: '4 Days',
      shortSummary: 'Build automated high-frequency trading bots for decentralized liquidity pools.',
      description: `Build automated smart contract bots that trade decentralized tokens. Winners will receive tokens upon contract execution.`,
      eligibility: 'Unstated.',
      applicationUrl: 'https://t.me/cryptohackathon2026',
      contactEmail: 'anonymous@proton.me',
      status: 'flagged', // FLAGGED for Admin Center demo!
      isFeatured: false,
      isUrgent: false,
      viewCount: 45,
      bookmarkCount: 2,
    },
  });

  // 8. Create Reports
  await prisma.report.create({
    data: {
      reporterId: studentUser.id,
      opportunityId: opp8.id,
      reason: 'Unclear payout escrow and student eligibility criteria unstated',
      details: 'This listing asks students to connect private wallets without clear prize pool custody or academic eligibility.',
      status: 'pending',
    },
  });

  // 9. Create Bookmarks for Student User
  await prisma.bookmark.create({
    data: {
      userId: studentUser.id,
      opportunityId: opp1.id,
    },
  });
  await prisma.bookmark.create({
    data: {
      userId: studentUser.id,
      opportunityId: opp2.id,
    },
  });

  // 10. Create Notifications for Student User
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'DEADLINE',
      title: 'Application Closing in 48 Hours: Collegiate AI Residency',
      message: 'OpenAI will close applications for the Fall 2026 cohort on October 28, 2026. Your profile is a 99% match based on publications and skills.',
      actionUrl: `/opportunities/${opp1.id}`,
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'MATCH',
      title: 'New High-Match Opportunity: Quantum Computing Summer Fellowship 2026',
      message: 'IBM Research Labs just posted a fully funded fellowship matching your AI & Machine Learning preferences. $8,400/mo + housing stipend provided.',
      actionUrl: `/opportunities/${opp3.id}`,
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'STATUS',
      title: 'Post Approved & Live: Climate Intelligence & Geospatial ML Residency',
      message: 'Your submitted opportunity has been audited and approved by our moderation team. It is now visible to all students.',
      actionUrl: `/opportunities/${opp7.id}`,
      isRead: true,
    },
  });

  console.log('✅ Seed completed successfully with realistic 2026 data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
