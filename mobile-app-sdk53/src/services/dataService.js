import staticData from '../data/staticData';

// Simple data service that returns empty data
export const dataService = {
  // News
  getNews: () => Promise.resolve(staticData.news),
  getFeaturedNews: () => Promise.resolve(staticData.news.filter(item => item.is_featured)),
  getNewsById: (id) => Promise.resolve(staticData.news.find(item => item.id === id)),

  // Teams
  getTeams: () => Promise.resolve(staticData.teams),
  getTeamById: (id) => Promise.resolve(staticData.teams.find(team => team.id === id)),
  getTeamPlayers: (teamId) => Promise.resolve(staticData.players.filter(player => player.team_id === teamId)),

  // Players
  getPlayers: () => Promise.resolve(staticData.players),
  getPlayerById: (id) => Promise.resolve(staticData.players.find(player => player.id === id)),

  // Matches
  getMatches: () => Promise.resolve(staticData.matches),
  getMatchById: (id) => Promise.resolve(staticData.matches.find(match => match.id === id)),

  // Shop
  getShopItems: () => Promise.resolve(staticData.shop.items),
  getShopCategories: () => Promise.resolve(staticData.shop.categories),
  getShopItemById: (id) => Promise.resolve(staticData.shop.items.find(item => item.id === id)),

  // Stats
  getStats: () => Promise.resolve(staticData.stats),

  // Admin functions (empty)
  createNews: () => Promise.resolve({ success: true, message: 'تم الإضافة بنجاح' }),
  updateNews: () => Promise.resolve({ success: true, message: 'تم التحديث بنجاح' }),
  deleteNews: () => Promise.resolve({ success: true, message: 'تم الحذف بنجاح' }),
  
  createTeam: () => Promise.resolve({ success: true, message: 'تم الإضافة بنجاح' }),
  updateTeam: () => Promise.resolve({ success: true, message: 'تم التحديث بنجاح' }),
  deleteTeam: () => Promise.resolve({ success: true, message: 'تم الحذف بنجاح' }),
  
  createPlayer: () => Promise.resolve({ success: true, message: 'تم الإضافة بنجاح' }),
  updatePlayer: () => Promise.resolve({ success: true, message: 'تم التحديث بنجاح' }),
  deletePlayer: () => Promise.resolve({ success: true, message: 'تم الحذف بنجاح' }),
  
  createMatch: () => Promise.resolve({ success: true, message: 'تم الإضافة بنجاح' }),
  updateMatch: () => Promise.resolve({ success: true, message: 'تم التحديث بنجاح' }),
  deleteMatch: () => Promise.resolve({ success: true, message: 'تم الحذف بنجاح' }),
  
  createShopItem: () => Promise.resolve({ success: true, message: 'تم الإضافة بنجاح' }),
  updateShopItem: () => Promise.resolve({ success: true, message: 'تم التحديث بنجاح' }),
  deleteShopItem: () => Promise.resolve({ success: true, message: 'تم الحذف بنجاح' }),
};

export default dataService; 