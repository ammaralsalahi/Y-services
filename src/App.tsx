import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Search, 
  User as UserIcon, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  X,
  Bell,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Zap,
  Sparkles,
  Truck,
  Wrench,
  BookOpen,
  Camera,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import './i18n';
import { User, Provider, Service, ServiceRequest } from './types';
import { api } from './lib/api';

// --- Components ---

const Navbar = ({ user, logout }: { user: User | null, logout: () => void }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Briefcase size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              {t('welcome').split(' ')[0]}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">{t('home')}</Link>
            {user && <Link to="/requests" className="text-gray-600 hover:text-indigo-600 transition-colors">{t('my_requests')}</Link>}
            <button onClick={toggleLanguage} className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
              <Globe size={18} />
              <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <UserIcon size={18} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 font-medium px-4 py-2">{t('login')}</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-indigo-700 transition-all">
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLanguage} className="text-gray-600">
              <Globe size={20} />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 font-medium">{t('home')}</Link>
              {user && <Link to="/requests" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 font-medium">{t('my_requests')}</Link>}
              <div className="pt-4 border-t border-gray-50">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 font-medium">{t('profile')}</Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-red-500 font-medium">{t('logout')}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 font-medium">{t('login')}</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-indigo-600 font-bold">{t('signup')}</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const { i18n } = useTranslation();
  const name = i18n.language === 'en' ? service.name_en : service.name_ar;
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="text-blue-500" />;
      case 'Zap': return <Zap className="text-yellow-500" />;
      case 'Sparkles': return <Sparkles className="text-purple-500" />;
      case 'Truck': return <Truck className="text-orange-500" />;
      case 'Wrench': return <Wrench className="text-gray-500" />;
      case 'BookOpen': return <BookOpen className="text-green-500" />;
      default: return <Briefcase />;
    }
  };

  return (
    <Link to={`/providers?category=${service.name_en}`} className="group">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-4 group-hover:-translate-y-1">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors">
          {getIcon(service.icon)}
        </div>
        <h3 className="font-bold text-gray-800">{name}</h3>
      </div>
    </Link>
  );
};

// --- Pages ---

const HomePage = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const data = await api.services.getAll();
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSeed = async () => {
    try {
      await api.health.seed();
      toast.success('Initial data seeded successfully!');
      fetchServices();
    } catch (err) {
      toast.error('Error seeding data. Please check your database tables.');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight"
          >
            {t('welcome')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            {t('tagline')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto pt-4"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={t('search_placeholder')}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
            />
          </motion.div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('categories')}</h2>
            <p className="text-gray-500">Explore services by category</p>
          </div>
          {services.length === 0 && !loading && (
            <button 
              onClick={handleSeed}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm bg-indigo-50 px-4 py-2 rounded-xl transition-all"
            >
              <Sparkles size={16} />
              Seed Initial Data
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl font-bold">Become a Service Provider</h2>
            <p className="text-indigo-100 max-w-md">Join thousands of Yemeni experts and grow your business today. Easy registration and fast payments.</p>
            <Link to="/signup?role=provider" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-colors">
              Get Started
            </Link>
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="font-bold">Verified Experts</div>
                  <div className="text-xs text-indigo-100">Trusted by 10k+ users</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="font-bold">24/7 Support</div>
                  <div className="text-xs text-indigo-100">Always here to help</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.login({ email, password });
      toast.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200 w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Briefcase size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('login')}</h1>
          <p className="text-gray-500 mt-2">Access your account to book services</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : t('login')}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold">{t('signup')}</Link>
        </div>
      </motion.div>
    </div>
  );
};

const ProvidersPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useLocation().search ? [new URLSearchParams(useLocation().search)] : [new URLSearchParams()];
  const category = searchParams.get('category');
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [availability, setAvailability] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await api.providers.getAll({
        category: category || undefined,
        availability: availability || undefined,
        minPrice,
        maxPrice,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined
      });
      setProviders(data);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [category, availability, minPrice, maxPrice, selectedSkills]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings size={18} />
              Filters
            </h3>
            
            <div className="space-y-6">
              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select 
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  <option value="available">Available Now</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (${minPrice} - ${maxPrice})
                </label>
                <div className="space-y-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="200" 
                    step="5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>$0</span>
                    <span>$200+</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="space-y-2">
                  {['Emergency', 'Maintenance', 'Installation', 'Repair'].map(skill => (
                    <label key={skill} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSkills([...selectedSkills, skill]);
                          else setSelectedSkills(selectedSkills.filter(s => s !== skill));
                        }}
                      />
                      <span className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{category || t('providers')}</h1>
            <p className="text-gray-500">Found {providers.length} experts matching your criteria</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No experts found matching these filters.</p>
              <button 
                onClick={() => {
                  setAvailability('');
                  setMaxPrice(200);
                  setSelectedSkills([]);
                }}
                className="text-indigo-600 font-bold mt-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {providers.map(provider => (
                <motion.div 
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-bold overflow-hidden">
                          {provider.photo_url ? (
                            <img src={provider.photo_url} alt={provider.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            provider.name[0]
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{provider.name}</h3>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm font-bold">{provider.rating}</span>
                            <span className="text-xs text-gray-400 font-normal">(42 reviews)</span>
                          </div>
                        </div>
                      </div>
                      {provider.is_verified && (
                        <div className="bg-green-50 text-green-600 p-1.5 rounded-full" title={t('verified')}>
                          <CheckCircle2 size={18} />
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                      {provider.description || "Expert service provider in Yemen with years of experience."}
                    </p>

                    {provider.skills && provider.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {provider.skills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider font-bold rounded-lg border border-gray-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>Sana'a, Yemen</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span className={provider.availability === 'available' ? 'text-green-600 font-medium' : 'text-red-500'}>
                          {t(provider.availability)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div>
                        <span className="text-2xl font-bold text-indigo-600">${provider.price_per_hour}</span>
                        <span className="text-sm text-gray-400">{t('per_hour')}</span>
                      </div>
                      <Link 
                        to={`/request/${provider.id}`}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all"
                      >
                        {t('request_service')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RequestsPage = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    api.requests.getAll().then(setRequests);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'accepted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('my_requests')}</h1>
      
      <div className="space-y-6">
        {requests.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No requests yet. Start exploring services!</p>
            <Link to="/" className="text-indigo-600 font-bold mt-2 inline-block">Browse Services</Link>
          </div>
        ) : (
          requests.map(request => (
            <div key={request.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{request.service_name}</h3>
                  <p className="text-sm text-gray-500">Provider: {request.provider_name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-4 py-1.5 rounded-full border text-sm font-bold ${getStatusColor(request.status)}`}>
                  {t(`status_${request.status}`)}
                </div>
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useLocation().search ? [new URLSearchParams(useLocation().search)] : [new URLSearchParams()];
  const role = searchParams.get('role') || 'user';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: role
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.register(formData);
      toast.success('Account created successfully! Please check your email for verification.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200 w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('signup')}</h1>
          <p className="text-gray-500 mt-2">Join the Yemen Services community</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Ammar Al-Salahi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="777XXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : t('signup')}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold">{t('login')}</Link>
        </div>
      </motion.div>
    </div>
  );
};

const RequestForm = ({ user }: { user: User | null }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { providerId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    service_id: '',
    details: '',
    scheduled_at: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to request a service');
      navigate('/login');
    }
    api.services.getAll().then(setServices);
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.requests.create({
        ...formData,
        provider_id: providerId,
        service_id: formData.service_id,
        user_id: user.id
      });
      toast.success('Request sent successfully!');
      navigate('/requests');
    } catch (err) {
      toast.error('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('request_service')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('services')}</label>
            <select 
              required
              value={formData.service_id}
              onChange={e => setFormData({...formData, service_id: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select a service</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name_en}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('request_details')}</label>
            <textarea 
              required
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
              placeholder="Describe what you need..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('date_time')}</label>
              <input 
                type="datetime-local" 
                required
                value={formData.scheduled_at}
                onChange={e => setFormData({...formData, scheduled_at: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
              <input 
                type="text" 
                required
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Sana'a, Hadda St."
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : t('submit_request')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const ProfilePage = ({ user, onUpdate }: { user: User | null, onUpdate: (id: string) => void }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <div className="p-12 text-center">Please login</div>;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const publicUrl = await api.storage.uploadAvatar(user.id, file);
      await api.profile.updateAvatar(user.id, publicUrl);
      
      toast.success('Profile picture updated!');
      onUpdate(user.id);
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative group">
            <div className="w-32 h-32 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 text-5xl font-bold overflow-hidden border-4 border-white shadow-lg">
              {user.photo_url ? (
                <img src={user.photo_url} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                user.name[0]
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <Loader2 className="animate-spin" />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg hover:bg-indigo-700 transition-all group-hover:scale-110"
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 text-indigo-600 font-medium">
              <div className="px-3 py-1 bg-indigo-50 rounded-full text-xs uppercase tracking-wider">{user.role}</div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-medium">{user.location || 'Not set'}</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Requests</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Completed</span>
                <span className="font-medium">10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Verify connection and tables
    api.health.check().catch(err => {
      console.error('Supabase connection failed:', err);
      toast.error('Could not connect to Supabase. Please check if your tables are created.');
    });

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setUser(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.signOut();
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Error signing out');
    }
  };

  if (loading) return null;

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-indigo-100">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Required</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Please set the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-sm">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-sm">VITE_SUPABASE_ANON_KEY</code> environment variables in the AI Studio Secrets panel to connect to your Supabase project.
          </p>
          <div className="space-y-4">
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              Go to Supabase
            </a>
            <p className="text-xs text-gray-400">
              After setting the variables, the app will refresh automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar user={user} logout={logout} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/profile" element={<ProfilePage user={user} onUpdate={fetchProfile} />} />
            <Route path="/request/:providerId" element={<RequestForm user={user} />} />
          </Routes>
        </main>
        <Toaster position="top-center" richColors />
        
        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
          <Link to="/" className="flex flex-col items-center gap-1 text-indigo-600">
            <Home size={24} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link to="/providers" className="flex flex-col items-center gap-1 text-gray-400">
            <Search size={24} />
            <span className="text-[10px] font-bold">Search</span>
          </Link>
          <Link to="/requests" className="flex flex-col items-center gap-1 text-gray-400">
            <Briefcase size={24} />
            <span className="text-[10px] font-bold">Requests</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-400">
            <UserIcon size={24} />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </div>
      </div>
    </Router>
  );
}
