import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Yemen Services",
      "tagline": "Connecting you with local experts",
      "search_placeholder": "Search for services...",
      "categories": "Categories",
      "popular_services": "Popular Services",
      "request_service": "Request Service",
      "login": "Login",
      "signup": "Sign Up",
      "profile": "Profile",
      "my_requests": "My Requests",
      "provider_dashboard": "Provider Dashboard",
      "logout": "Logout",
      "arabic": "العربية",
      "english": "English",
      "home": "Home",
      "services": "Services",
      "providers": "Providers",
      "plumbing": "Plumbing",
      "electricity": "Electricity",
      "cleaning": "Cleaning",
      "delivery": "Delivery",
      "repairs": "Repairs",
      "tutoring": "Tutoring",
      "request_details": "Request Details",
      "date_time": "Date & Time",
      "location": "Location",
      "submit_request": "Submit Request",
      "status_pending": "Pending",
      "status_accepted": "Accepted",
      "status_completed": "Completed",
      "status_cancelled": "Cancelled",
      "chat": "Chat",
      "call": "Call",
      "rating": "Rating",
      "reviews": "Reviews",
      "price": "Price",
      "per_hour": "/hr",
      "verified": "Verified",
      "not_verified": "Not Verified",
      "availability": "Availability",
      "available": "Available",
      "busy": "Busy",
      "offline": "Offline"
    }
  },
  ar: {
    translation: {
      "welcome": "مرحباً بكم في خدمات اليمن",
      "tagline": "نصلك بالخبراء المحليين",
      "search_placeholder": "ابحث عن خدمات...",
      "categories": "الفئات",
      "popular_services": "الخدمات الشائعة",
      "request_service": "طلب خدمة",
      "login": "تسجيل الدخول",
      "signup": "إنشاء حساب",
      "profile": "الملف الشخصي",
      "my_requests": "طلباتي",
      "provider_dashboard": "لوحة المزود",
      "logout": "تسجيل الخروج",
      "arabic": "العربية",
      "english": "English",
      "home": "الرئيسية",
      "services": "الخدمات",
      "providers": "المزودون",
      "plumbing": "سباكة",
      "electricity": "كهرباء",
      "cleaning": "تنظيف",
      "delivery": "توصيل",
      "repairs": "إصلاحات",
      "tutoring": "تدريس",
      "request_details": "تفاصيل الطلب",
      "date_time": "التاريخ والوقت",
      "location": "الموقع",
      "submit_request": "إرسال الطلب",
      "status_pending": "قيد الانتظار",
      "status_accepted": "تم القبول",
      "status_completed": "مكتمل",
      "status_cancelled": "ملغي",
      "chat": "دردشة",
      "call": "اتصال",
      "rating": "التقييم",
      "reviews": "المراجعات",
      "price": "السعر",
      "per_hour": "/ساعة",
      "verified": "موثق",
      "not_verified": "غير موثق",
      "availability": "التوفر",
      "available": "متاح",
      "busy": "مشغول",
      "offline": "غير متصل"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
