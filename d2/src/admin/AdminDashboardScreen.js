import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dataService from '../services/dataService';

export default function AdminDashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    news: 0,
    teams: 0,
    players: 0,
    matches: 0,
    shopItems: 0,
    shopCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [news, teams, players, matches, shopItems, shopCategories] = await Promise.all([
        dataService.getNews(),
        dataService.getTeams(),
        dataService.getPlayers(),
        dataService.getMatches(),
        dataService.getShopItems(),
        dataService.getShopCategories(),
      ]);

      setStats({
        news: news?.length || 0,
        teams: teams?.length || 0,
        players: players?.length || 0,
        matches: matches?.length || 0,
        shopItems: shopItems?.length || 0,
        shopCategories: shopCategories?.length || 0,
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const adminActions = [
    {
      title: 'إدارة الأخبار',
      icon: 'newspaper',
      count: stats.news,
      onPress: () => navigation.navigate('AdminNewsCrud'),
    },
    {
      title: 'إدارة الفرق',
      icon: 'people',
      count: stats.teams,
      onPress: () => navigation.navigate('AdminTeamCrud'),
    },
    {
      title: 'إدارة اللاعبين',
      icon: 'person',
      count: stats.players,
      onPress: () => navigation.navigate('AdminPlayerCrud'),
    },
    {
      title: 'إدارة المباريات',
      icon: 'football',
      count: stats.matches,
      onPress: () => navigation.navigate('AdminMatchCrud'),
    },
    {
      title: 'إدارة المتجر',
      icon: 'bag',
      count: stats.shopItems,
      onPress: () => navigation.navigate('AdminShopCrud'),
    },
    {
      title: 'إدارة فئات المتجر',
      icon: 'folder',
      count: stats.shopCategories,
      onPress: () => navigation.navigate('AdminCategoryCrud'),
    },

  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Ionicons name="settings" size={24} color="white" />
        <Text style={styles.headerTitle}>لوحة الإدارة</Text>
        <Text style={styles.headerSubtitle}>إدارة محتوى التطبيق</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>جاري تحميل الإحصائيات...</Text>
        </View>
      ) : (
        <>
          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 الإحصائيات</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.news}</Text>
                <Text style={styles.statLabel}>الأخبار</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.teams}</Text>
                <Text style={styles.statLabel}>الفرق</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.players}</Text>
                <Text style={styles.statLabel}>اللاعبين</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.matches}</Text>
                <Text style={styles.statLabel}>المباريات</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.shopItems}</Text>
                <Text style={styles.statLabel}>المنتجات</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.shopCategories}</Text>
                <Text style={styles.statLabel}>فئات المتجر</Text>
              </View>
            </View>
          </View>

          {/* Admin Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ إجراءات الإدارة</Text>
            {adminActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View style={styles.actionInfo}>
                  <Ionicons name={action.icon} size={24} color="#1e3c72" />
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </View>
                <View style={styles.actionMeta}>
                  <Text style={styles.actionCount}>{action.count}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#1e3c72" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#1e3c72',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e3c72',
    marginLeft: 10,
  },
  actionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginRight: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

});
