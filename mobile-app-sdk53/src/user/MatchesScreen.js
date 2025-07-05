import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dataService from '../services/dataService';
import AppHeader from '../components/AppHeader';

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await dataService.getMatches();
      setMatches(response || []);
    } catch (err) {
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return '#dc3545';
      case 'completed':
        return '#28a745';
      case 'scheduled':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'live':
        return 'مباشر';
      case 'completed':
        return 'منتهي';
      case 'scheduled':
        return 'مجدول';
      default:
        return 'ملغي';
    }
  };

  const renderMatch = (match) => (
    <TouchableOpacity
      key={match.id}
      style={styles.matchCard}
      onPress={() => navigation.navigate('MatchDetail', { matchId: match.id })}
    >
      <View style={styles.matchHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}> 
          <Text style={styles.statusText}>{getStatusText(match.status)}</Text>
        </View>
        <Text style={styles.dateText}>
          {match.match_date ? new Date(match.match_date).toLocaleString() : 'غير محدد'}
        </Text>
      </View>

      <View style={styles.teamsRow}>
        <Text style={styles.teamName}>{match.home_team_name || 'فريق 1'}</Text>
        <Text style={styles.score}>{match.home_score !== null ? match.home_score : '-'}</Text>
        <Text style={styles.vs}>-</Text>
        <Text style={styles.score}>{match.away_score !== null ? match.away_score : '-'}</Text>
        <Text style={styles.teamName}>{match.away_team_name || 'فريق 2'}</Text>
      </View>

      <Text style={styles.venueText}>{match.venue || 'ملعب غير محدد'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
    padding: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontSize: 16,
  },
  matchCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    fontSize: 14,
    color: '#1e3c72',
    fontWeight: '500',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  vs: {
    fontSize: 16,
    color: '#666',
  },
  venueText: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
  },
  listContainer: {
    padding: 10,
  },
}); 