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

const INITIAL_CATEGORIES = [];
const INITIAL_BLOGS = [];

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
        
        // Preserve local blogs with uploaded images if they exist in localStorage
        const localBlogs = localStorage.getItem('sfm_admin_blogs');
        if (!localBlogs && blogRes.status === 'fulfilled' && blogRes.value?.data !== undefined) {
          setBlogs(blogRes.value.data);
        }
        
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

  // Blog Actions - Persists to Backend API and updates State
  const saveBlog = async (blogData) => {
    if (blogData.id) {
      try {
        const res = await updateBlogAPI(blogData.id, blogData);
        if (res?.data) {
          const updatedDoc = { ...res.data, id: res.data.id || res.data._id };
          setBlogs(prev => prev.map(b => b.id === blogData.id ? updatedDoc : b));
          return updatedDoc;
        }
      } catch (e) {
        console.warn('API error updating blog:', e.message);
      }
      setBlogs(prev => prev.map(b => b.id === blogData.id ? { ...b, ...blogData } : b));
    } else {
      try {
        const res = await createBlogAPI(blogData);
        if (res?.data) {
          const newDoc = { ...res.data, id: res.data.id || res.data._id };
          setBlogs(prev => [newDoc, ...prev]);
          return newDoc;
        }
      } catch (e) {
        console.warn('API error creating blog:', e.message);
      }
      const fallbackBlog = {
        ...blogData,
        id: `blog-${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      };
      setBlogs(prev => [fallbackBlog, ...prev]);
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
