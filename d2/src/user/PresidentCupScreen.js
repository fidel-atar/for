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
import AppHeader from '../components/AppHeader';

export default function PresidentCupScreen({ navigation }) {
  // Leave matches empty so the screen displays no data
  const [matches] = useState([]);
  const [loading] = useState(false);

  // Disable refresh actions
  useEffect(() => {}, []);

  const onRefresh = async () => {};

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return '#dc3545';
      case 'completed': return '#28a745';
      case 'scheduled': return '#007bff';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'live': return 'En Direct';
      case 'completed': return 'Terminé';
      case 'scheduled': return 'Programmé';
      default: return 'Annulé';
    }
  };

  const renderMatch = (match) => (
    <TouchableOpacity
      key={match.id}
      style={styles.matchCard}
      onPress={() => navigation.navigate('MatchDetail', { matchId: match.id })}
    >
      <View style={styles.matchHeader}>
        <Text style={styles.roundText}>{match.round.replace('_', ' ').toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}>
          <Text style={styles.statusText}>{getStatusText(match.status)}</Text>
        </View>
      </View>
      
      <View style={styles.matchInfo}>
        <Text style={styles.venueText}>{match.venue}</Text>
        <Text style={styles.dateText}>
          {new Date(match.date).toLocaleDateString()} - {new Date(match.date).toLocaleTimeString()}
        </Text>
      </View>
      
      <View style={styles.teamsContainer}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{match.home_team?.name}</Text>
          {match.home_score !== null && (
            <Text style={styles.score}>{match.home_score}</Text>
          )}
        </View>
        
        <Text style={styles.vsText}>VS</Text>
        
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{match.away_team?.name}</Text>
          {match.away_score !== null && (
            <Text style={styles.score}>{match.away_score}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.noDataText}>Aucun match disponible</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  matchCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  roundText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  matchInfo: {
    marginBottom: 15,
  },
  venueText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamInfo: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 5,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 20,
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
}); 