import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import dataService from '../services/dataService';

export default function MatchDetailScreen({ route }) {
  const { matchId } = route.params;
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await dataService.getMatchById(matchId);
        setMatch(response);
      } catch (err) {
        console.error('Error loading match:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e3c72" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>المباراة غير موجودة</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.matchTitle}>
          {match.home_team?.name || 'فريق 1'} vs {match.away_team?.name || 'فريق 2'}
        </Text>
        <Text style={styles.score}>
          {match.home_score !== null ? match.home_score : '-'} - {match.away_score !== null ? match.away_score : '-'}
        </Text>
        <Text style={styles.status}>{match.status || 'غير محدد'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تفاصيل المباراة</Text>
        <Info label="التاريخ" value={match.date ? new Date(match.date).toLocaleDateString() : 'غير محدد'} />
        <Info label="الملعب" value={match.venue || 'غير محدد'} />
        <Info label="الحكم" value={match.referee || 'غير محدد'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الفرق</Text>
        <View style={styles.teamsContainer}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{match.home_team?.name || 'فريق 1'}</Text>
            <Text style={styles.teamScore}>{match.home_score !== null ? match.home_score : '-'}</Text>
          </View>
          <View style={styles.vsContainer}>
            <Text style={styles.vs}>VS</Text>
          </View>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{match.away_team?.name || 'فريق 2'}</Text>
            <Text style={styles.teamScore}>{match.away_score !== null ? match.away_score : '-'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#1e3c72',
    padding: 20,
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
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
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  infoValue: {
    color: '#333',
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
    textAlign: 'center',
  },
  teamScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
  },
  vsContainer: {
    paddingHorizontal: 20,
  },
  vs: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
}); 