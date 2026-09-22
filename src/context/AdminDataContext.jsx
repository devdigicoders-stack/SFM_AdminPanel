import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getEnquiriesAPI,
  updateEnquiryStatusAPI,
  deleteEnquiryAPI,
  getAdminBlogsAPI,
  createBlogAPI,
  updateBlogAPI,
  deleteBlogAPI,
  getCategoriesAPI,
  createCategoryAPI,
  deleteCategoryAPI,
  getBannersAPI,
  createBannerAPI,
  updateBannerAPI,
  deleteBannerAPI,
  getHomepageSettingsAPI,
  updateHomepageSettingsAPI,
  getSocialsAPI,
  updateSocialsAPI
} from '../services/api';

const AdminDataContext = createContext();

// Initial Mock Data populated directly from Spartans Presentations
const INITIAL_ENQUIRIES = [
  {
    id: 'ENQ-1001',
    companyName: 'Taj Palace Lucknow',
    contactPerson: 'Sanjay Verma (Director of Engineering)',
    phone: '+91-9839011223',
    email: 'sanjay.verma@tajhotels.com',
    city: 'Lucknow',
    facilityType: 'Hospitality / 5-Star Hotel',
    sqFootage: '150,000 - 500,000 sq ft',
    servicesNeeded: ['HVAC & Chiller Plants', 'Electrical & Power Systems', 'Fire & Life Safety Overhauls'],
    status: 'Scheduled',
    date: '2026-06-20',
    notes: 'Annual chiller descaling & thermography audit required before high summer occupancy.'
  },
  {
    id: 'ENQ-1002',
    companyName: 'Phoenix Palassio Mall',
    contactPerson: 'Aditi Sharma (Operations Head)',
    phone: '+91-9721455667',
    email: 'aditi.sharma@phoenixpalassio.com',
    city: 'Lucknow',
    facilityType: 'Commercial Shopping Mall',
    sqFootage: '500,000+ sq ft',
    servicesNeeded: ['Plumbing & Hydro-Pneumatics', 'Civil & Architectural Fit-outs', 'ELV & BMS Diagnostics'],
    status: 'Reviewed',
    date: '2026-06-19',
    notes: 'High footfall atrium glazing check and food court grease-trap motorized desilting scope.'
  },
  {
    id: 'ENQ-1003',
    companyName: 'Hyatt Regency Hub',
    contactPerson: 'Vikram Rajput (Chief Engineer)',
    phone: '+91-8899223344',
    email: 'vikram.rajput@hyatt.com',
    city: 'Lucknow',
    facilityType: 'Hospitality / 5-Star Hotel',
    sqFootage: '150,000 - 500,000 sq ft',
    servicesNeeded: ['HVAC & Chiller Plants', 'Vigyani.ai IoT Predictive Hub'],
    status: 'Pending',
    date: '2026-06-21',
    notes: 'Requesting pilot deployment of Vigyani.ai IoT vibration sensors on main chiller pumps.'
  },
  {
    id: 'ENQ-1004',
    companyName: 'Teleperformance Tech Campus',
    contactPerson: 'Rohan Mehra (Facilities Manager)',
    phone: '+91-9123456789',
    email: 'rohan.m@teleperformance.com',
    city: 'Lucknow',
    facilityType: 'Corporate Tech Park',
    sqFootage: '50,000 - 150,000 sq ft',
    servicesNeeded: ['Electrical & Power Systems', 'ELV & BMS Diagnostics'],
    status: 'Completed',
    date: '2026-06-15',
    notes: 'Server room Precision AC audit and DB thermography completed with zero downtime.'
  }
];

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'AI & Predictive FM', slug: 'ai-predictive', count: 2, color: 'bg-sky-100 text-sky-800' },
  { id: 'cat-2', name: 'Hard Engineering', slug: 'hard-engineering', count: 2, color: 'bg-amber-100 text-amber-800' },
  { id: 'cat-3', name: 'Safety & Compliance', slug: 'safety-compliance', count: 1, color: 'bg-emerald-100 text-emerald-800' },
  { id: 'cat-4', name: 'Case Studies', slug: 'case-studies', count: 1, color: 'bg-purple-100 text-purple-800' }
];

const INITIAL_BLOGS = [
  {
    id: 'blog-1',
    title: 'How AI Predictive Telemetry Prevents HVAC Chiller Failures in Luxury Hotels',
    category: 'AI & Predictive FM',
    categoryId: 'cat-1',
    author: 'Pranjal Gupta',
    date: '2026-06-18',
    readTime: '4 min read',
    published: true,
    excerpt: 'Traditional maintenance is reactive. Learn how Vigyani.ai IoT vibration and thermal sensors predict motor bearing degradation 72 hours before catastrophic breakdown.',
    content: '<h2>The Shift from Reactive to Predictive Asset Oversight</h2><p>Commercial chiller plants in five-star hotels operate under continuous thermal strain. When a bearing fails unexpectedly during a banquet event, the financial and reputational cost is enormous.</p><p>By deploying <strong>Vigyani.ai IoT sensor arrays</strong>, engineering heads receive real-time alerts 72 hours in advance of mechanical failure.</p>'
  },
  {
    id: 'blog-2',
    title: 'Zero Liability Transfer: Why 100% ESIC, PF & LOTO Protocols Protect Property Owners',
    category: 'Safety & Compliance',
    categoryId: 'cat-3',
    author: 'SFM Safety Cell',
    date: '2026-06-12',
    readTime: '5 min read',
    published: true,
    excerpt: 'Uncertified third-party contractors expose corporate facilities to severe legal liabilities. Discover how Spartans FM enforces strict Lock-Out, Tag-Out and statutory insurance backing.',
    content: '<h2>Corporate Protection through Strict Statutory Compliance</h2><p>Facility owners often face severe liabilities if uncertified third-party contractors suffer accidents on site. Spartans FM guarantees 100% ESIC and Workmen Compensation backing.</p>'
  }
];

const INITIAL_BANNERS = [
  {
    id: 'ban-1',
    title: 'Strategic Repairs & Maintenance Partner',
    subtitle: 'Pan-India B2B Hard Services & Engineering Excellence',
    tagline: 'June 2026 Corporate Profile',
    active: true,
    ctaText: 'Request Facility Health Audit',
    ctaLink: '/contact'
  },
  {
    id: 'ban-2',
    title: 'Redefining Excellence in Integrated FM',
    subtitle: 'A single accountable partner for premium technical and soft services, powered by AI.',
    tagline: 'SFM | SMS | VIGYANI.AI',
    active: true,
    ctaText: 'Explore Vigyani.ai Hub',
    ctaLink: '/ifm-services'
  }
];

const INITIAL_HOMEPAGE = {
  heroTagline: 'Spartans Facility Management • June 2026 Corporate Profile',
  heroHeading: 'Strategic Repairs & Maintenance Partner',
  heroSubheading: 'Pan-India B2B Hard Services & Engineering Excellence',
  heroDescription: 'Transforming infrastructure upkeep into seamless operational uptime. A single accountable partner for premium technical, engineering, and soft services — powered by Vigyani.ai.',
  milestone1: '100% ITI / Diploma Verified Manpower',
  milestone2: 'Lead Technical Partner: Taj Palace Lucknow',
  milestone3: 'Central Command Hub: Lucknow',
  retentionRate: '85%+',
  costReduction: '15-20%',
  uptimeGuarantee: '99.8%',
  uptimeCompliance: 'ISO / NBC 2016'
};

const INITIAL_SOCIALS = {
  phone: '+91-8299726346',
  whatsapp: '+91-8299726346',
  email: 'Sales@spartansfacility.com',
  address: 'Headquarters & Command Hub: Lucknow, Uttar Pradesh (Pan-India Presence)',
  contactPerson: 'Pranjal Gupta',
  website: 'https://digicoders.in',
  linkedin: 'https://linkedin.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com'
};

export function AdminDataProvider({ children }) {
  // Enquiries State
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem('sfm_admin_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  // Blogs State
  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem('sfm_admin_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  // Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sfm_admin_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Banners State
  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('sfm_admin_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  // Homepage Content State
  const [homepageContent, setHomepageContent] = useState(() => {
    const saved = localStorage.getItem('sfm_admin_homepage');
    return saved ? JSON.parse(saved) : INITIAL_HOMEPAGE;
  });

  // Socials State
  const [socials, setSocials] = useState(() => {
    const saved = localStorage.getItem('sfm_admin_socials');
    return saved ? JSON.parse(saved) : INITIAL_SOCIALS;
  });

  // Fetch from backend API on initial mount
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const [enqRes, blogRes, catRes, banRes, homeRes, socRes] = await Promise.allSettled([
          getEnquiriesAPI(),
          getAdminBlogsAPI(),
          getCategoriesAPI(),
          getBannersAPI(),
          getHomepageSettingsAPI(),
          getSocialsAPI()
        ]);

        if (enqRes.status === 'fulfilled' && enqRes.value?.data !== undefined) setEnquiries(enqRes.value.data);
        if (blogRes.status === 'fulfilled' && blogRes.value?.data !== undefined) setBlogs(blogRes.value.data);
        if (catRes.status === 'fulfilled' && catRes.value?.data !== undefined) setCategories(catRes.value.data);
        if (banRes.status === 'fulfilled' && banRes.value?.data !== undefined) setBanners(banRes.value.data);
        if (homeRes.status === 'fulfilled' && homeRes.value?.data) setHomepageContent(homeRes.value.data);
        if (socRes.status === 'fulfilled' && socRes.value?.data) setSocials(socRes.value.data);
      } catch (err) {
        console.warn('Backend sync warning:', err.message);
      }
    };

    syncWithBackend();
  }, []);

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('sfm_admin_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('sfm_admin_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('sfm_admin_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sfm_admin_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('sfm_admin_homepage', JSON.stringify(homepageContent));
  }, [homepageContent]);

  useEffect(() => {
    localStorage.setItem('sfm_admin_socials', JSON.stringify(socials));
  }, [socials]);

  // Enquiry Actions
  const updateEnquiryStatus = async (id, newStatus) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    try {
      await updateEnquiryStatusAPI(id, newStatus);
    } catch (e) {
      console.warn('API error updating enquiry status:', e.message);
    }
  };

  const deleteEnquiry = async (id) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    try {
      await deleteEnquiryAPI(id);
    } catch (e) {
      console.warn('API error deleting enquiry:', e.message);
    }
  };

  // Blog Actions
  const saveBlog = async (blogData) => {
    if (blogData.id) {
      // Optimistic update
      setBlogs(prev => prev.map(b => b.id === blogData.id ? { ...b, ...blogData } : b));
      try {
        const res = await updateBlogAPI(blogData.id, blogData);
        // Sync with real DB document if available
        if (res?.data) {
          const realDoc = { ...res.data, id: res.data.id || res.data._id };
          setBlogs(prev => prev.map(b => b.id === blogData.id ? realDoc : b));
        }
      } catch (e) {
        console.warn('API error updating blog:', e.message);
        throw new Error(e?.response?.data?.message || e.message || 'Failed to update article on server');
      }
    } else {
      const tempId = `blog-${Date.now()}`;
      const newBlog = {
        ...blogData,
        id: tempId,
        date: new Date().toISOString().split('T')[0]
      };
      setBlogs(prev => [newBlog, ...prev]);
      try {
        const res = await createBlogAPI(newBlog);
        // Replace temp local blog with real DB document (real _id from MongoDB)
        if (res?.data) {
          const realDoc = { ...res.data, id: res.data.id || res.data._id };
          setBlogs(prev => prev.map(b => b.id === tempId ? realDoc : b));
        }
      } catch (e) {
        // Rollback optimistic add on failure
        setBlogs(prev => prev.filter(b => b.id !== tempId));
        throw new Error(e?.response?.data?.message || e.message || 'Failed to save article to server');
      }
    }
  };

  const deleteBlog = async (id) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    try {
      await deleteBlogAPI(id);
    } catch (e) {
      console.warn('API error deleting blog:', e.message);
    }
  };

  // Category Actions
  const saveCategory = async (catData) => {
    if (catData.id) {
      setCategories(prev => prev.map(c => c.id === catData.id ? { ...c, ...catData } : c));
    } else {
      const newCat = {
        ...catData,
        id: `cat-${Date.now()}`,
        count: 0,
        color: 'bg-slate-100 text-slate-800'
      };
      setCategories(prev => [...prev, newCat]);
      try {
        await createCategoryAPI(newCat);
      } catch (e) {
        console.warn('API error creating category:', e.message);
      }
    }
  };

  const deleteCategory = async (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await deleteCategoryAPI(id);
    } catch (e) {
      console.warn('API error deleting category:', e.message);
    }
  };

  // Banner Actions
  const saveBanner = async (bannerData) => {
    if (bannerData.id) {
      setBanners(prev => prev.map(b => b.id === bannerData.id ? { ...b, ...bannerData } : b));
      try {
        await updateBannerAPI(bannerData.id, bannerData);
      } catch (e) {
        console.warn('API error updating banner:', e.message);
      }
    } else {
      const newBanner = { ...bannerData, id: `ban-${Date.now()}` };
      setBanners(prev => [...prev, newBanner]);
      try {
        await createBannerAPI(newBanner);
      } catch (e) {
        console.warn('API error creating banner:', e.message);
      }
    }
  };

  const deleteBanner = async (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    try {
      await deleteBannerAPI(id);
    } catch (e) {
      console.warn('API error deleting banner:', e.message);
    }
  };

  // Homepage Content Actions
  const updateHomepageContent = async (newContent) => {
    setHomepageContent(prev => ({ ...prev, ...newContent }));
    try {
      await updateHomepageSettingsAPI(newContent);
    } catch (e) {
      console.warn('API error updating homepage settings:', e.message);
    }
  };

  // Social Links Actions
  const updateSocials = async (newSocials) => {
    setSocials(prev => ({ ...prev, ...newSocials }));
    try {
      await updateSocialsAPI(newSocials);
    } catch (e) {
      console.warn('API error updating socials:', e.message);
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        enquiries,
        updateEnquiryStatus,
        deleteEnquiry,
        blogs,
        saveBlog,
        deleteBlog,
        categories,
        saveCategory,
        deleteCategory,
        banners,
        saveBanner,
        deleteBanner,
        homepageContent,
        updateHomepageContent,
        socials,
        updateSocials
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  return useContext(AdminDataContext);
}
