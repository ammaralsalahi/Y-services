import { supabase } from './supabase';
import { User, Provider, Service, ServiceRequest } from '../types';

export const api = {
  auth: {
    login: async (credentials: any) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      if (error) throw error;
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      return { user: profile, session: data.session };
    },
    register: async (data: any) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            role: data.role
          }
        }
      });
      if (authError) throw authError;

      // Profile is created via Supabase Trigger (recommended) or manually here
      // For this demo, we'll assume a trigger exists, but we'll fetch the profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user?.id)
        .single();

      if (profileError) throw profileError;
      return { user: profile, session: authData.session };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },
  services: {
    getAll: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      if (error) throw error;
      return data;
    }
  },
  providers: {
    getAll: async (filters: {
      category?: string;
      availability?: string;
      minPrice?: number;
      maxPrice?: number;
      skills?: string[];
    } = {}): Promise<Provider[]> => {
      let query = supabase
        .from('providers')
        .select(`
          *,
          users:user_id (
            name,
            photo_url,
            location
          )
        `);
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.availability) {
        query = query.eq('availability', filters.availability);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('price_per_hour', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price_per_hour', filters.maxPrice);
      }
      if (filters.skills && filters.skills.length > 0) {
        query = query.contains('skills', filters.skills);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // Map Supabase nested structure to our Provider type
      return data.map((p: any) => ({
        ...p,
        name: p.users.name,
        photo_url: p.users.photo_url,
        location: p.users.location
      }));
    }
  },
  requests: {
    create: async (data: any): Promise<{ id: number }> => {
      const { data: result, error } = await supabase
        .from('requests')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return { id: result.id };
    },
    getAll: async (): Promise<ServiceRequest[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          provider:provider_id (
            users:user_id (name)
          ),
          service:service_id (name_en)
        `)
        .or(`user_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((r: any) => ({
        ...r,
        provider_name: r.provider.users.name,
        service_name: r.service.name_en
      }));
    }
  },
  profile: {
    updateAvatar: async (userId: string, photoUrl: string) => {
      const { error } = await supabase
        .from('users')
        .update({ photo_url: photoUrl })
        .eq('id', userId);
      if (error) throw error;
      return true;
    }
  },
  storage: {
    uploadAvatar: async (userId: string, file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    }
  },
  health: {
    check: async () => {
      const { data, error } = await supabase.from('services').select('id').limit(1);
      if (error) throw error;
      return true;
    },
    seed: async () => {
      // Seed Services
      const services = [
        { name_en: 'Plumbing', name_ar: 'سباكة', category: 'repairs', icon: 'Droplets' },
        { name_en: 'Electricity', name_ar: 'كهرباء', category: 'repairs', icon: 'Zap' },
        { name_en: 'Cleaning', name_ar: 'تنظيف', category: 'cleaning', icon: 'Sparkles' },
        { name_en: 'Delivery', name_ar: 'توصيل', category: 'delivery', icon: 'Truck' },
        { name_en: 'Tutoring', name_ar: 'تدريس', category: 'tutoring', icon: 'BookOpen' },
      ];

      const { error: sError } = await supabase.from('services').upsert(services, { onConflict: 'name_en' });
      if (sError) throw sError;
      return true;
    }
  }
};
