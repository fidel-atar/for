import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import dataService from '../services/dataService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export default function HomeScreen({ navigation }) {
  // State management
  const [featuredNews, setFeaturedNews] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [adminMode, setAdminMode] = useState(false);

  // Statistics state
  const [teamsCount, setTeamsCount] = useState(0);
  const [playersCount, setPlayersCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  // Animation refs for news cards
  const newsCardAnimations = React.useRef({}).current;
  const statCardAnimations = React.useRef({}).current;
  const matchCardAnimations = React.useRef({}).current;

  // Load data on component mount
  useEffect(() => {
    loadFeaturedNews();
    loadRecentMatches();
    loadStats();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  };

  const loadFeaturedNews = async () => {
    try {
      setLoading(true);
      // Get recent published news (not just featured) to show new content
      const response = await dataService.getNews();
      // Take the 3 most recent news articles
      const recentNews = (response || []).slice(0, 3);
      setFeaturedNews(recentNews);
    } catch (error) {
      console.error('Error loading featured news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const [teamsRes, playersRes, matchesRes, itemsRes] = await Promise.all([
        dataService.getTeams(),
        dataService.getPlayers(),
        dataService.getMatches(),
        dataService.getShopItems(),
      ]);

      setTeamsCount((teamsRes || []).length);
      setPlayersCount((playersRes || []).length);
      setMatchesCount((matchesRes || []).length);
      setItemsCount((itemsRes || []).length);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadRecentMatches = async () => {
    try {
      setMatchesLoading(true);
      const response = await dataService.getMatches();
      // Sort matches by date (most recent first)
      const sortedMatches = (response || [])
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5); // Get only the 5 most recent matches
      setRecentMatches(sortedMatches);
    } catch (error) {
      console.error('Error loading recent matches:', error);
    } finally {
      setMatchesLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadFeaturedNews(), loadRecentMatches(), loadStats()]);
    setRefreshing(false);
  };

  const handleLogoPress = () => {
    const newCount = logoTapCount + 1;
    setLogoTapCount(newCount);
    
    if (newCount === 7) {
      setLogoTapCount(0);
      setAdminMode(true);
      navigation.navigate('AdminDashboard');
    }
    
    // Reset count after 3 seconds if not completed
    setTimeout(() => {
      if (logoTapCount > 0 && logoTapCount < 7) {
        setLogoTapCount(0);
      }
    }, 3000);
  };

  const renderNewsCard = (news, index) => {
    // Get or create animation values for this card
    if (!newsCardAnimations[news.id]) {
      newsCardAnimations[news.id] = {
        fadeAnim: new Animated.Value(0),
        slideAnim: new Animated.Value(20)
      };
      
      // Start animation
      Animated.parallel([
        Animated.timing(newsCardAnimations[news.id].fadeAnim, {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(newsCardAnimations[news.id].slideAnim, {
          toValue: 0,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        })
      ]).start();
    }

    return (
      <Animated.View
        key={news.id}
        style={[
          styles.newsCardContainer,
          { 
            opacity: newsCardAnimations[news.id].fadeAnim, 
            transform: [{ translateY: newsCardAnimations[news.id].slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.newsCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('NewsDetail', { newsId: news.id })}
        >
          <View style={styles.newsHeader}>
            <View style={styles.newsDateBadge}>
              <Text style={styles.newsDateText}>
                {news.created_at ? new Date(news.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }) : 'تاريخ غير محدد'}
              </Text>
            </View>
          </View>
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle} numberOfLines={2}>
              {news.title || 'عنوان غير محدد'}
            </Text>
            <Text style={styles.newsExcerpt} numberOfLines={3}>
              {news.content ? news.content.substring(0, 100) + '...' : 'لا توجد محتوى متاح'}
            </Text>
            <View style={styles.newsMeta}>
              <View style={styles.authorContainer}>
                <Ionicons name="person-circle" size={16} color="#1e3c72" style={styles.authorIcon} />
                <Text style={styles.newsAuthor}>{news.author || 'غير محدد'}</Text>
              </View>
              <View style={styles.readMoreContainer}>
                <Text style={styles.readMoreText}>اقرأ المزيد</Text>
                <Ionicons name="arrow-forward" size={14} color="#1e3c72" style={styles.readMoreIcon} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render stats card with animation
  const renderStatCard = (icon, number, label, onPress, index) => {
    const cardKey = `${icon}-${index}`;
    
    // Get or create animation values for this card
    if (!statCardAnimations[cardKey]) {
      statCardAnimations[cardKey] = {
        fadeAnim: new Animated.Value(0),
        scaleAnim: new Animated.Value(0.9)
      };
      
      // Start animation
      Animated.parallel([
        Animated.timing(statCardAnimations[cardKey].fadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 300 + index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(statCardAnimations[cardKey].scaleAnim, {
          toValue: 1,
          duration: 600,
          delay: 300 + index * 100,
          useNativeDriver: true,
        })
      ]).start();
    }

    return (
      <Animated.View
        style={[
          styles.statCardContainer,
          { 
            opacity: statCardAnimations[cardKey].fadeAnim, 
            transform: [{ scale: statCardAnimations[cardKey].scaleAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.statCard}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <View style={styles.statIconContainer}>
            <Ionicons name={icon} size={22} color="#fff" />
          </View>
          <Text style={styles.statNumber}>{statsLoading ? '...' : number}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render a match card with animation
  const renderMatchCard = (match, index) => {
    const matchKey = match.id || `match-${index}`;
    
    // Get or create animation values for this card
    if (!matchCardAnimations[matchKey]) {
      matchCardAnimations[matchKey] = {
        fadeAnim: new Animated.Value(0),
        slideAnim: new Animated.Value(20)
      };
      
      // Start animation
      Animated.parallel([
        Animated.timing(matchCardAnimations[matchKey].fadeAnim, {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(matchCardAnimations[matchKey].slideAnim, {
          toValue: 0,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        })
      ]).start();
    }

    // Parse date and time
    const matchDate = match.date ? new Date(match.date) : null;
    const formattedDate = matchDate ? 
      matchDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' }) : 
      'تاريخ غير محدد';
    const formattedTime = matchDate ? 
      matchDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : 
      'وقت غير محدد';

    // Determine match status
    const now = new Date();
    let matchStatus = '';
    let statusStyle = {};
    
    if (!matchDate) {
      matchStatus = 'غير محدد';
      statusStyle = { backgroundColor: '#999' };
    } else if (matchDate > now) {
      matchStatus = 'قادمة';
      statusStyle = { backgroundColor: '#2ecc71' };
    } else {
      matchStatus = 'انتهت';
      statusStyle = { backgroundColor: '#e74c3c' };
    }

    return (
      <Animated.View
        key={match.id || index}
        style={[
          styles.matchCardContainer,
          { 
            opacity: matchCardAnimations[matchKey].fadeAnim, 
            transform: [{ translateY: matchCardAnimations[matchKey].slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.matchCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('MatchDetail', { matchId: match.id })}
        >
          <View style={[styles.matchStatusBadge, statusStyle]}>
            <Text style={styles.matchStatusText}>{matchStatus}</Text>
          </View>
          
          <View style={styles.teamsContainer}>
            <View style={styles.teamSection}>
              <Text style={styles.teamName}>{match.home_team?.name || 'فريق أ'}</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{match.home_score || '0'}</Text>
              </View>
            </View>
            
            <View style={styles.matchInfoCenter}>
              <Text style={styles.vsText}>VS</Text>
              <Text style={styles.matchDateText}>{formattedDate}</Text>
              <Text style={styles.matchTimeText}>{formattedTime}</Text>
            </View>
            
            <View style={styles.teamSection}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{match.away_score || '0'}</Text>
              </View>
              <Text style={styles.teamName}>{match.away_team?.name || 'فريق ب'}</Text>
            </View>
          </View>
          
          <View style={styles.matchVenueContainer}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.matchVenueText}>{match.venue || 'ملعب غير محدد'}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1e3c72" barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1e3c72']}
            tintColor="#1e3c72"
          />
        }
      >
        {/* Header with Gradient Background */}
        <LinearGradient 
          colors={['#1e3c72', '#2a5298']} 
          start={{x: 0, y: 0}} 
          end={{x: 0, y: 1}} 
          style={styles.headerGradient}
        >
          <Animated.View 
            style={[
              styles.header,
              { 
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.logoContainer} 
              onPress={handleLogoPress}
              activeOpacity={0.9}
            >
              <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.appTitle}>نادي الرياضة</Text>
            <Text style={styles.appSubtitle}>الموقع الرسمي للنادي</Text>
          </Animated.View>
        </LinearGradient>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Featured News */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="newspaper" size={22} color="#1e3c72" />
              <Text style={styles.sectionTitle}>الأخبار المميزة</Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>جاري تحميل الأخبار...</Text>
              </View>
            ) : featuredNews.length > 0 ? (
              featuredNews.map(renderNewsCard)
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
                <Text style={styles.noDataText}>لا توجد أخبار مميزة متاحة</Text>
              </View>
            )}
          </View>

          {/* Recent Matches */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="football" size={22} color="#1e3c72" />
              <Text style={styles.sectionTitle}>المباريات الأخيرة</Text>
            </View>
            
            {matchesLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>جاري تحميل المباريات...</Text>
              </View>
            ) : recentMatches.length > 0 ? (
              recentMatches.map(renderMatchCard)
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
                <Text style={styles.noDataText}>لا توجد مباريات متاحة</Text>
              </View>
            )}
          </View>

          {/* Statistics */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="stats-chart" size={22} color="#1e3c72" />
              <Text style={styles.sectionTitle}>الإحصائيات</Text>
            </View>
            
            <View style={styles.statsGrid}>
              {renderStatCard(
                "people", 
                teamsCount, 
                "الفرق", 
                () => navigation.navigate('Team'),
                0
              )}
              
              {renderStatCard(
                "person", 
                playersCount, 
                "اللاعبين", 
                () => navigation.navigate('Team'),
                1
              )}
              
              {renderStatCard(
                "football", 
                matchesCount, 
                "المباريات", 
                () => navigation.navigate('Matches'),
                2
              )}
              
              {renderStatCard(
                "bag", 
                itemsCount, 
                "المنتجات", 
                () => navigation.navigate('Shop'),
                3
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  tapIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff3b30',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tapIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginLeft: 8,
    textAlign: 'right',
  },
  loadingContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  noDataContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  noDataText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  newsCardContainer: {
    marginBottom: 15,
    width: '100%',
    alignSelf: 'center',
  },
  newsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsHeader: {
    height: 12,
    backgroundColor: '#1e3c72',
    position: 'relative',
  },
  newsDateBadge: {
    position: 'absolute',
    right: 15,
    top: 0,
    backgroundColor: '#1e3c72',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  newsDateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newsContent: {
    padding: 18,
    paddingTop: 22,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 10,
  },
  newsExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorIcon: {
    marginRight: 5,
  },
  newsAuthor: {
    fontSize: 13,
    color: '#1e3c72',
    fontWeight: '500',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 13,
    color: '#1e3c72',
    fontWeight: '500',
  },
  readMoreIcon: {
    marginLeft: 3,
  },
  matchCardContainer: {
    marginBottom: 15,
    width: '100%',
    alignSelf: 'center',
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 15,
    position: 'relative',
  },
  matchStatusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  matchStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3c72',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreContainer: {
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e3c72',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  matchInfoCenter: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  matchDateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  matchTimeText: {
    fontSize: 12,
    color: '#666',
  },
  matchVenueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  matchVenueText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  statCardContainer: {
    width: '48%',
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    backgroundColor: '#1e3c72',
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});