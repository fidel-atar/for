import { supabase } from './supabaseClient';

// Enhanced Supabase data service for Mauritania Football App
export const dataService = {
  // News operations
  getNews: async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  getFeaturedNews: async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured news:', error);
      return [];
    }
  },

  getNewsById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      return null;
    }
  },

  getNewsByCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('category', category)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching news by category:', error);
      return [];
    }
  },

  createNews: async (newsData) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([newsData])
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم إضافة الخبر بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error creating news:', error);
      return { success: false, message: 'خطأ في إضافة الخبر' };
    }
  },

  updateNews: async (id, newsData) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم تحديث الخبر بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error updating news:', error);
      return { success: false, message: 'خطأ في تحديث الخبر' };
    }
  },

  deleteNews: async (id) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, message: 'تم حذف الخبر بنجاح' };
    } catch (error) {
      console.error('Error deleting news:', error);
      return { success: false, message: 'خطأ في حذف الخبر' };
    }
  },

  // Teams operations
  getTeams: async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  },

  getTeamById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching team by ID:', error);
      return null;
    }
  },

  getTeamPlayers: async (teamId) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching team players:', error);
      return [];
    }
  },

  getTeamsByDivision: async (division) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('division', division)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teams by division:', error);
      return [];
    }
  },

  createTeam: async (teamData) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([teamData])
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم إضافة الفريق بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error creating team:', error);
      return { success: false, message: 'خطأ في إضافة الفريق' };
    }
  },

  updateTeam: async (id, teamData) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم تحديث الفريق بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error updating team:', error);
      return { success: false, message: 'خطأ في تحديث الفريق' };
    }
  },

  deleteTeam: async (id) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, message: 'تم حذف الفريق بنجاح' };
    } catch (error) {
      console.error('Error deleting team:', error);
      return { success: false, message: 'خطأ في حذف الفريق' };
    }
  },

  // Players operations
  getPlayers: async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (
            id,
            name,
            logo_url
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  },

  getPlayerById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (
            id,
            name,
            logo_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching player by ID:', error);
      return null;
    }
  },

  getPlayersByPosition: async (position) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (
            id,
            name,
            logo_url
          )
        `)
        .eq('position', position)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching players by position:', error);
      return [];
    }
  },

  getPlayersByStatus: async (status) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (
            id,
            name,
            logo_url
          )
        `)
        .eq('player_status', status)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching players by status:', error);
      return [];
    }
  },

  createPlayer: async (playerData) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([playerData])
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم إضافة اللاعب بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error creating player:', error);
      return { success: false, message: 'خطأ في إضافة اللاعب' };
    }
  },

  updatePlayer: async (id, playerData) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم تحديث اللاعب بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error updating player:', error);
      return { success: false, message: 'خطأ في تحديث اللاعب' };
    }
  },

  deletePlayer: async (id) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, message: 'تم حذف اللاعب بنجاح' };
    } catch (error) {
      console.error('Error deleting player:', error);
      return { success: false, message: 'خطأ في حذف اللاعب' };
    }
  },

  // Matches operations
  getMatches: async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey (
            id,
            name,
            logo_url
          ),
          away_team:teams!matches_away_team_id_fkey (
            id,
            name,
            logo_url
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  },

  getMatchById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey (
            id,
            name,
            logo_url
          ),
          away_team:teams!matches_away_team_id_fkey (
            id,
            name,
            logo_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching match by ID:', error);
      return null;
    }
  },

  getMatchesByTeam: async (teamId) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey (
            id,
            name,
            logo_url
          ),
          away_team:teams!matches_away_team_id_fkey (
            id,
            name,
            logo_url
          )
        `)
        .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching matches by team:', error);
      return [];
    }
  },

  getMatchesByStatus: async (status) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey (
            id,
            name,
            logo_url
          ),
          away_team:teams!matches_away_team_id_fkey (
            id,
            name,
            logo_url
          )
        `)
        .eq('status', status)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching matches by status:', error);
      return [];
    }
  },

  createMatch: async (matchData) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([matchData])
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم إضافة المباراة بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error creating match:', error);
      return { success: false, message: 'خطأ في إضافة المباراة' };
    }
  },

  updateMatch: async (id, matchData) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update(matchData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم تحديث المباراة بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error updating match:', error);
      return { success: false, message: 'خطأ في تحديث المباراة' };
    }
  },

  deleteMatch: async (id) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, message: 'تم حذف المباراة بنجاح' };
    } catch (error) {
      console.error('Error deleting match:', error);
      return { success: false, message: 'خطأ في حذف المباراة' };
    }
  },

  // Shop operations
  getShopItems: async () => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop_categories (
            id,
            name
          )
        `)
        .eq('is_available', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  },

  getShopCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('shop_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shop categories:', error);
      return [];
    }
  },

  getShopItemById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop_categories (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching shop item by ID:', error);
      return null;
    }
  },

  getShopItemsByCategory: async (categoryId) => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop_categories (
            id,
            name
          )
        `)
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shop items by category:', error);
      return [];
    }
  },

  getFeaturedShopItems: async () => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop_categories (
            id,
            name
          )
        `)
        .eq('is_featured', true)
        .eq('is_available', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured shop items:', error);
      return [];
    }
  },

  createShopItem: async (itemData) => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert([itemData])
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم إضافة المنتج بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error creating shop item:', error);
      return { success: false, message: 'خطأ في إضافة المنتج' };
    }
  },

  updateShopItem: async (id, itemData) => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update(itemData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم تحديث المنتج بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error updating shop item:', error);
      return { success: false, message: 'خطأ في تحديث المنتج' };
    }
  },

  deleteShopItem: async (id) => {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, message: 'تم حذف المنتج بنجاح' };
    } catch (error) {
      console.error('Error deleting shop item:', error);
      return { success: false, message: 'خطأ في حذف المنتج' };
    }
  },

  // Shop categories operations
  createShopCategory: async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('shop_categories')
        .insert([categoryData])
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم إضافة الفئة بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error creating shop category:', error);
      return { success: false, message: 'خطأ في إضافة الفئة' };
    }
  },

  updateShopCategory: async (id, categoryData) => {
    try {
      const { data, error } = await supabase
        .from('shop_categories')
        .update(categoryData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, message: 'تم تحديث الفئة بنجاح', data: data[0] };
    } catch (error) {
      console.error('Error updating shop category:', error);
      return { success: false, message: 'خطأ في تحديث الفئة' };
    }
  },

  deleteShopCategory: async (id) => {
    try {
      const { error } = await supabase
        .from('shop_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, message: 'تم حذف الفئة بنجاح' };
    } catch (error) {
      console.error('Error deleting shop category:', error);
      return { success: false, message: 'خطأ في حذف الفئة' };
    }
  },

  // Stats operations
  getStats: async () => {
    try {
      const [teamsRes, playersRes, matchesRes, itemsRes, newsRes] = await Promise.all([
        supabase.from('teams').select('id', { count: 'exact' }),
        supabase.from('players').select('id', { count: 'exact' }),
        supabase.from('matches').select('id', { count: 'exact' }),
        supabase.from('shop_items').select('id', { count: 'exact' }),
        supabase.from('news').select('id', { count: 'exact' })
      ]);

      return {
        totalTeams: teamsRes.count || 0,
        totalPlayers: playersRes.count || 0,
        totalMatches: matchesRes.count || 0,
        totalItems: itemsRes.count || 0,
        totalNews: newsRes.count || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalTeams: 0,
        totalPlayers: 0,
        totalMatches: 0,
        totalItems: 0,
        totalNews: 0
      };
    }
  },

  // Search operations
  searchAll: async (query) => {
    try {
      const searchQuery = `%${query}%`;
      const [newsRes, teamsRes, playersRes, matchesRes] = await Promise.all([
        supabase.from('news').select('*').ilike('title', searchQuery).limit(5),
        supabase.from('teams').select('*').ilike('name', searchQuery).limit(5),
        supabase.from('players').select('*, teams(name)').ilike('name', searchQuery).limit(5),
        supabase.from('matches').select('*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name)').limit(5)
      ]);

      return {
        news: newsRes.data || [],
        teams: teamsRes.data || [],
        players: playersRes.data || [],
        matches: matchesRes.data || []
      };
    } catch (error) {
      console.error('Error searching:', error);
      return {
        news: [],
        teams: [],
        players: [],
        matches: []
      };
    }
  },

  // Utility functions
  testConnection: async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('count', { count: 'exact' });
      
      if (error) throw error;
      return { success: true, message: 'تم الاتصال بقاعدة البيانات بنجاح' };
    } catch (error) {
      console.error('Error testing connection:', error);
      return { success: false, message: 'خطأ في الاتصال بقاعدة البيانات' };
    }
  },

  // File upload helper (for future use)
  uploadFile: async (file, bucket = 'images') => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, message: 'خطأ في رفع الملف' };
    }
  }
};

export default dataService; 