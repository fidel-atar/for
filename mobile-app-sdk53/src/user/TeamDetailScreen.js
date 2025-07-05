import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import dataService from '../services/dataService';

export default function TeamDetailScreen({ route }) {
  const { teamId } = route.params;
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [teamData, playersData] = await Promise.all([
          dataService.getTeamById(teamId),
          dataService.getTeamPlayers(teamId)
        ]);
        setTeam(teamData);
        setPlayers(playersData || []);
      } catch (err) {
        console.error('Error loading team details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e3c72" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>الفريق غير موجود</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {team.logo_url && <Image source={{ uri: team.logo_url }} style={styles.teamLogo} />}
        <Text style={styles.teamName}>{team.name || 'فريق غير محدد'}</Text>
        <Text style={styles.teamCity}>{team.city || 'مدينة غير محددة'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات الفريق</Text>
        <Info label="المدرب" value={team.coach || 'غير محدد'} />
        <Info label="الملعب الرئيسي" value={team.home_stadium || 'غير محدد'} />
        <Info label="سنة التأسيس" value={team.founded_year || 'غير محدد'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>اللاعبين ({players.length})</Text>
        {players.length > 0 ? (
          players.map((player) => (
            <View key={player.id} style={styles.playerItem}>
              <Text style={styles.playerName}>{player.name || 'لاعب غير محدد'}</Text>
              <Text style={styles.playerPosition}>{player.position || 'غير محدد'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>لا توجد بيانات للاعبين</Text>
        )}
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
  teamLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  teamCity: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    margin: 10,
    padding: 10,
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
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  infoValue: {
    color: '#333',
  },
  playerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  playerPosition: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
}); 