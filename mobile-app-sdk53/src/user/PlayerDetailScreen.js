import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import dataService from '../services/dataService';

export default function PlayerDetailScreen({ route }) {
  const { playerId } = route.params;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await dataService.getPlayerById(playerId);
        setPlayer(response);
      } catch (err) {
        console.error('Error loading player:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e3c72" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>اللاعب غير موجود</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {player.image_url && <Image source={{ uri: player.image_url }} style={styles.playerImg} />}
        <Text style={styles.playerName}>{player.name || 'لاعب غير محدد'}</Text>
        <Text style={styles.position}>
          {player.position || 'غير محدد'} · #{player.jersey_number || 'غير محدد'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>المعلومات</Text>
        <Info label="العمر" value={`${player.age || 'غير محدد'} سنة`} />
        <Info label="الجنسية" value={player.nationality || 'غير محدد'} />
        <Info label="الطول" value={`${player.height || 'غير محدد'} سم`} />
        <Info label="الوزن" value={`${player.weight || 'غير محدد'} كجم`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإحصائيات</Text>
        <Info label="المباريات" value={player.matches_played || 0} />
        <Info label="الأهداف" value={player.goals_scored || 0} />
        <Info label="التمريرات" value={player.assists || 0} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>السيرة الذاتية</Text>
        <Text style={styles.bio}>{player.bio || 'لا توجد معلومات متاحة'}</Text>
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
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  position: {
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
  bio: {
    marginTop: 4,
    color: '#333',
    lineHeight: 20,
  },
  playerImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
}); 