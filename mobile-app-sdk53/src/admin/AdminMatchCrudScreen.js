import React, { useState, useEffect, useRef } from 'react';
import { 
  ScrollView, 
  Text, 
  StyleSheet, 
  TextInput, 
  Alert, 
  Image, 
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  FlatList,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import dataService from '../services/dataService';
import CrudList from '../components/admin/CrudList';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

// Match status options
const MATCH_STATUS = [
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'live', label: 'Live' },
  { id: 'completed', label: 'Completed' },
  { id: 'postponed', label: 'Postponed' },
  { id: 'cancelled', label: 'Cancelled' }
];

export default function AdminMatchCrudScreen() {
  // Basic match info
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [matchDate, setMatchDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [matchTime, setMatchTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [venue, setVenue] = useState('');
  const [matchStatus, setMatchStatus] = useState('scheduled');
  
  // Match details
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [referee, setReferee] = useState('');
  const [attendance, setAttendance] = useState('');
  const [season, setSeason] = useState('');
  const [competition, setCompetition] = useState('');
  const [matchDay, setMatchDay] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [matchDescription, setMatchDescription] = useState('');
  const [highlights, setHighlights] = useState('');
  
  // Match statistics
  const [matchStats, setMatchStats] = useState({
    homePossession: '50',
    awayPossession: '50',
    homeShots: '',
    awayShots: '',
    homeShotsOnTarget: '',
    awayShotsOnTarget: '',
    homeCorners: '',
    awayCorners: '',
    homeFouls: '',
    awayFouls: '',
    homeYellowCards: '',
    awayYellowCards: '',
    homeRedCards: '',
    awayRedCards: '',
    homeOffsides: '',
    awayOffsides: ''
  });
  
  // Match events
  const [events, setEvents] = useState([]);
  const [newEventType, setNewEventType] = useState('goal');
  const [newEventMinute, setNewEventMinute] = useState('');
  const [newEventTeam, setNewEventTeam] = useState('home');
  const [newEventPlayer, setNewEventPlayer] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Match media
  const [coverImage, setCoverImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState('basic'); // basic, details, events, stats, media
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  
  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Refs
  const listRef = useRef();
  const scrollViewRef = useRef();
  
  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);
  
  // Load teams list once
  useEffect(() => {
    loadTeams();
    loadPlayers();
  }, []);
  
  const loadTeams = async () => {
    try {
      const response = await dataService.getTeams();
      setTeams(response || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
      Alert.alert('Error', 'Failed to load teams');
    }
  };
  
  const loadPlayers = async () => {
    try {
      const response = await dataService.getPlayers();
      setPlayers(response || []);
    } catch (err) {
      console.error('Error fetching players:', err);
      Alert.alert('Error', 'Failed to load players');
    }
  };
  
  const resetForm = () => {
    // Basic info
    setEditingId(null);
    setHomeTeamId('');
    setAwayTeamId('');
    setMatchDate(new Date());
    setMatchTime(new Date());
    setVenue('');
    setMatchStatus('scheduled');
    
    // Match details
    setHomeScore('');
    setAwayScore('');
    setReferee('');
    setAttendance('');
    setSeason('');
    setCompetition('');
    setMatchDay('');
    setIsFeatured(false);
    setMatchDescription('');
    setHighlights('');
    
    // Match statistics
    setMatchStats({
      homePossession: '50',
      awayPossession: '50',
      homeShots: '',
      awayShots: '',
      homeShotsOnTarget: '',
      awayShotsOnTarget: '',
      homeCorners: '',
      awayCorners: '',
      homeFouls: '',
      awayFouls: '',
      homeYellowCards: '',
      awayYellowCards: '',
      homeRedCards: '',
      awayRedCards: '',
      homeOffsides: '',
      awayOffsides: ''
    });
    
    // Match events
    setEvents([]);
    
    // Match media
    setCoverImage(null);
    setGallery([]);
    
    // Form state
    setActiveTab('basic');
    setValidationErrors({});
    
    // Reset scrolling
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };
  
  const pickCoverImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access denied');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    
    if (!result.canceled) {
      const asset = result.assets[0];
      setCoverImage(asset);
    }
  };
  
  const addToGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access denied');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    
    if (!result.canceled) {
      const newImages = result.assets.map(asset => ({
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        uri: asset.uri,
        fileName: asset.fileName || `gallery_${Date.now()}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
        uploaded: false
      }));
      
      setGallery([...gallery, ...newImages]);
    }
  };
  
  const removeFromGallery = (id) => {
    setGallery(gallery.filter(img => img.id !== id));
  };
  
  const handleStatsChange = (key, value) => {
    setMatchStats(prev => ({
      ...prev,
      [key]: value
    }));
    
    // If possession is changed, update the opposite team's possession
    if (key === 'homePossession') {
      const otherValue = value === '' ? '50' : (100 - parseInt(value)).toString();
      setMatchStats(prev => ({
        ...prev,
        awayPossession: otherValue
      }));
    } else if (key === 'awayPossession') {
      const otherValue = value === '' ? '50' : (100 - parseInt(value)).toString();
      setMatchStats(prev => ({
        ...prev,
        homePossession: otherValue
      }));
    }
  };
  
  const addEvent = () => {
    if (!newEventMinute || !newEventPlayer) {
      Alert.alert('Validation Error', 'Minute and player are required');
      return;
    }
    
    const minute = parseInt(newEventMinute);
    if (isNaN(minute) || minute < 0 || minute > 120) {
      Alert.alert('Validation Error', 'Minute must be between 0 and 120');
      return;
    }
    
    const newEvent = {
      id: `event_${Date.now()}`,
      type: newEventType,
      minute: minute,
      team: newEventTeam,
      player: newEventPlayer,
      description: newEventDescription
    };
    
    setEvents([...events, newEvent]);
    
    // Reset form fields
    setNewEventMinute('');
    setNewEventPlayer('');
    setNewEventDescription('');
    setShowEventModal(false);
  };
  
  const removeEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };
  
  const getTeamById = (id) => {
    return teams.find(team => team.id.toString() === id?.toString()) || { name: 'Unknown Team' };
  };
  
  const getPlayerById = (id) => {
    return players.find(player => player.id.toString() === id?.toString()) || { name: 'Unknown Player' };
  };
  
  const getPlayersForTeam = (teamId) => {
    if (!teamId) return [];
    return players.filter(player => player.team_id?.toString() === teamId.toString());
  };
  
  const formatDateTime = (date, time) => {
    const combinedDate = new Date(date);
    combinedDate.setHours(time.getHours());
    combinedDate.setMinutes(time.getMinutes());
    
    return combinedDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!homeTeamId) errors.homeTeamId = 'Home team is required';
    if (!awayTeamId) errors.awayTeamId = 'Away team is required';
    if (homeTeamId === awayTeamId) errors.teams = 'Home and away teams must be different';
    if (!venue.trim()) errors.venue = 'Venue is required';
    
    if (matchStatus === 'completed' || matchStatus === 'live') {
      if (homeScore === '') errors.homeScore = 'Home score is required for completed or live matches';
      if (awayScore === '') errors.awayScore = 'Away score is required for completed or live matches';
    }
    
    if (homeScore !== '' && isNaN(parseInt(homeScore))) errors.homeScore = 'Home score must be a number';
    if (awayScore !== '' && isNaN(parseInt(awayScore))) errors.awayScore = 'Away score must be a number';
    
    if (attendance !== '' && isNaN(parseInt(attendance))) errors.attendance = 'Attendance must be a number';
    if (matchDay !== '' && isNaN(parseInt(matchDay))) errors.matchDay = 'Match day must be a number';
    
    // Stats validation
    Object.entries(matchStats).forEach(([key, value]) => {
      if (value !== '' && isNaN(parseInt(value))) {
        errors[key] = `${key.replace(/([A-Z])/g, ' $1').trim()} must be a number`;
      }
    });
    
    if (
      matchStats.homePossession !== '' && 
      (parseInt(matchStats.homePossession) < 0 || parseInt(matchStats.homePossession) > 100)
    ) {
      errors.homePossession = 'Possession must be between 0 and 100';
    }
    
    if (
      matchStats.awayPossession !== '' && 
      (parseInt(matchStats.awayPossession) < 0 || parseInt(matchStats.awayPossession) > 100)
    ) {
      errors.awayPossession = 'Possession must be between 0 and 100';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Upload cover image if needed
      let coverImageUrl = null;
      if (coverImage) {
        // Simulating upload - in a real app, replace with actual upload code
        // For now, just use the local URI
        coverImageUrl = coverImage.uri;
      }
      
      // Upload gallery images if needed
      const uploadedGallery = gallery.map(photo => ({
        ...photo,
        uploaded: true,
        url: photo.uri
      }));
      
      // Combine date and time
      const combinedDateTime = new Date(matchDate);
      combinedDateTime.setHours(matchTime.getHours());
      combinedDateTime.setMinutes(matchTime.getMinutes());
      
      // Prepare match data
      const matchData = {
        // Basic info
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        match_date: combinedDateTime.toISOString(),
        venue,
        status: matchStatus,
        
        // Match details
        home_score: homeScore !== '' ? parseInt(homeScore) : null,
        away_score: awayScore !== '' ? parseInt(awayScore) : null,
        referee,
        attendance: attendance !== '' ? parseInt(attendance) : null,
        season,
        competition,
        match_day: matchDay !== '' ? parseInt(matchDay) : null,
        is_featured: isFeatured,
        description: matchDescription,
        highlights_url: highlights,
        
        // Match statistics
        statistics: JSON.stringify({
          possession: {
            home: matchStats.homePossession !== '' ? parseInt(matchStats.homePossession) : 50,
            away: matchStats.awayPossession !== '' ? parseInt(matchStats.awayPossession) : 50,
          },
          shots: {
            home: matchStats.homeShots !== '' ? parseInt(matchStats.homeShots) : 0,
            away: matchStats.awayShots !== '' ? parseInt(matchStats.awayShots) : 0,
          },
          shots_on_target: {
            home: matchStats.homeShotsOnTarget !== '' ? parseInt(matchStats.homeShotsOnTarget) : 0,
            away: matchStats.awayShotsOnTarget !== '' ? parseInt(matchStats.awayShotsOnTarget) : 0,
          },
          corners: {
            home: matchStats.homeCorners !== '' ? parseInt(matchStats.homeCorners) : 0,
            away: matchStats.awayCorners !== '' ? parseInt(matchStats.awayCorners) : 0,
          },
          fouls: {
            home: matchStats.homeFouls !== '' ? parseInt(matchStats.homeFouls) : 0,
            away: matchStats.awayFouls !== '' ? parseInt(matchStats.awayFouls) : 0,
          },
          yellow_cards: {
            home: matchStats.homeYellowCards !== '' ? parseInt(matchStats.homeYellowCards) : 0,
            away: matchStats.awayYellowCards !== '' ? parseInt(matchStats.awayYellowCards) : 0,
          },
          red_cards: {
            home: matchStats.homeRedCards !== '' ? parseInt(matchStats.homeRedCards) : 0,
            away: matchStats.awayRedCards !== '' ? parseInt(matchStats.awayRedCards) : 0,
          },
          offsides: {
            home: matchStats.homeOffsides !== '' ? parseInt(matchStats.homeOffsides) : 0,
            away: matchStats.awayOffsides !== '' ? parseInt(matchStats.awayOffsides) : 0,
          }
        }),
        
        // Match events
        events: JSON.stringify(events),
        
        // Media
        cover_image: coverImageUrl,
        gallery: uploadedGallery.length > 0 ? JSON.stringify(uploadedGallery) : null
      };
      
      // Save or update match
      if (editingId) {
        await dataService.updateMatch(editingId, matchData);
        Alert.alert('Success', 'Match updated successfully');
      } else {
        await dataService.createMatch(matchData);
        Alert.alert('Success', 'Match created successfully');
      }
      
      // Reset form and reload list
      resetForm();
      listRef.current?.reload();
      
    } catch (err) {
      console.error('Error saving match:', err);
      Alert.alert('Error', 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const duplicateMatch = async (item) => {
    try {
      // Create a copy of the item without ID
      const { id, created_at, updated_at, ...matchData } = item;
      
      // Modify description to indicate it's a copy
      matchData.description = `${matchData.description || ''} (Copy)`;
      
      // Create new match
      await dataService.createMatch(matchData);
      Alert.alert('Success', 'Match duplicated successfully');
      
      // Reload list
      listRef.current?.reload();
    } catch (err) {
      console.error('Error duplicating match:', err);
      Alert.alert('Error', 'Failed to duplicate match');
    }
  };
  
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'goal': return 'football-outline';
      case 'own-goal': return 'git-merge-outline';
      case 'yellow-card': return 'square-outline';
      case 'red-card': return 'square';
      case 'substitution': return 'swap-horizontal-outline';
      case 'penalty': return 'locate-outline';
      case 'penalty-missed': return 'close-circle-outline';
      default: return 'ellipse-outline';
    }
  };
  
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'goal': return '#2ecc71';
      case 'own-goal': return '#9b59b6';
      case 'yellow-card': return '#f39c12';
      case 'red-card': return '#e74c3c';
      case 'substitution': return '#3498db';
      case 'penalty': return '#e67e22';
      case 'penalty-missed': return '#95a5a6';
      default: return '#7f8c8d';
    }
  };
  
  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'goal': return 'Goal';
      case 'own-goal': return 'Own Goal';
      case 'yellow-card': return 'Yellow Card';
      case 'red-card': return 'Red Card';
      case 'substitution': return 'Substitution';
      case 'penalty': return 'Penalty';
      case 'penalty-missed': return 'Missed Penalty';
      default: return 'Other';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#3498db';
      case 'live': return '#e74c3c';
      case 'completed': return '#2ecc71';
      case 'postponed': return '#f39c12';
      case 'cancelled': return '#95a5a6';
      default: return '#7f8c8d';
    }
  };
  
  const filterMatches = (matches) => {
    if (!matches) return [];
    
    return matches.filter(match => {
      const homeTeam = getTeamById(match.home_team_id);
      const awayTeam = getTeamById(match.away_team_id);
      
      const matchesSearch = searchTerm === '' || 
        homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === '' || 
        match.status === filterStatus;
      
      const matchesTeam = filterTeam === '' || 
        match.home_team_id?.toString() === filterTeam ||
        match.away_team_id?.toString() === filterTeam;
      
      return matchesSearch && matchesStatus && matchesTeam;
    });
  };
  
  const renderTabButton = (tabId, label, icon) => (
    <TouchableOpacity 
      style={[styles.tabButton, activeTab === tabId && styles.activeTabButton]} 
      onPress={() => setActiveTab(tabId)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={activeTab === tabId ? '#fff' : '#1e3c72'} 
      />
      <Text style={[styles.tabButtonText, activeTab === tabId && styles.activeTabButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const renderError = (field) => {
    if (validationErrors[field]) {
      return <Text style={styles.errorText}>{validationErrors[field]}</Text>;
    }
    return null;
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        ref={scrollViewRef}
      >
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>
            {editingId ? 'Edit Match' : 'Create New Match'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {editingId ? 'Update match information' : 'Add a new match to the system'}
          </Text>
        </LinearGradient>
        
        {/* Form Tabs */}
        <View style={styles.tabsContainer}>
          {renderTabButton('basic', 'Basic Info', 'information-circle-outline')}
          {renderTabButton('details', 'Details', 'document-text-outline')}
          {renderTabButton('events', 'Events', 'timer-outline')}
          {renderTabButton('stats', 'Statistics', 'stats-chart-outline')}
          {renderTabButton('media', 'Media', 'images-outline')}
        </View>
        
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <Animated.View 
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="football-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Match Information</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <Text style={styles.inputLabel}>Home Team *</Text>
                <View style={[styles.pickerWrapper, validationErrors.homeTeamId && styles.inputError]}>
                  <Picker
                    selectedValue={homeTeamId}
                    onValueChange={(value) => setHomeTeamId(value)}
                  >
                    <Picker.Item label="Select home team" value="" />
                    {teams.map((team) => (
                      <Picker.Item key={`home-${team.id}`} label={team.name} value={team.id.toString()} />
                    ))}
                  </Picker>
                </View>
                {renderError('homeTeamId')}
                
                <Text style={styles.inputLabel}>Away Team *</Text>
                <View style={[styles.pickerWrapper, validationErrors.awayTeamId && styles.inputError]}>
                  <Picker
                    selectedValue={awayTeamId}
                    onValueChange={(value) => setAwayTeamId(value)}
                  >
                    <Picker.Item label="Select away team" value="" />
                    {teams.map((team) => (
                      <Picker.Item key={`away-${team.id}`} label={team.name} value={team.id.toString()} />
                    ))}
                  </Picker>
                </View>
                {renderError('awayTeamId')}
                {renderError('teams')}
                
                <View style={styles.vsContainer}>
                  <View style={styles.teamLogoContainer}>
                    {homeTeamId ? (
                      <Image 
                        source={{ uri: getTeamById(homeTeamId).logo_url }} 
                        style={styles.teamLogo}
                        defaultSource={require('../../assets/logo.jpg')}
                      />
                    ) : (
                      <View style={styles.teamLogoPlaceholder}>
                        <Ionicons name="shield-outline" size={24} color="#1e3c72" />
                      </View>
                    )}
                    <Text style={styles.teamName} numberOfLines={1}>
                      {homeTeamId ? getTeamById(homeTeamId).name : 'Home Team'}
                    </Text>
                  </View>
                  
                  <View style={styles.vsTextContainer}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  
                  <View style={styles.teamLogoContainer}>
                    {awayTeamId ? (
                      <Image 
                        source={{ uri: getTeamById(awayTeamId).logo_url }} 
                        style={styles.teamLogo}
                        defaultSource={require('../../assets/logo.jpg')}
                      />
                    ) : (
                      <View style={styles.teamLogoPlaceholder}>
                        <Ionicons name="shield-outline" size={24} color="#1e3c72" />
                      </View>
                    )}
                    <Text style={styles.teamName} numberOfLines={1}>
                      {awayTeamId ? getTeamById(awayTeamId).name : 'Away Team'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Match Date *</Text>
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {matchDate.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#1e3c72" />
                    </TouchableOpacity>
                    
                    {showDatePicker && (
                      <DateTimePicker
                        value={matchDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setMatchDate(selectedDate);
                          }
                        }}
                      />
                    )}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Match Time *</Text>
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {matchTime.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                      <Ionicons name="time-outline" size={20} color="#1e3c72" />
                    </TouchableOpacity>
                    
                    {showTimePicker && (
                      <DateTimePicker
                        value={matchTime}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          setShowTimePicker(false);
                          if (selectedTime) {
                            setMatchTime(selectedTime);
                          }
                        }}
                      />
                    )}
                  </View>
                </View>
                
                <Text style={styles.inputLabel}>Venue *</Text>
                <TextInput 
                  style={[styles.input, validationErrors.venue && styles.inputError]} 
                  placeholder="Match venue" 
                  value={venue} 
                  onChangeText={setVenue} 
                />
                {renderError('venue')}
                
                <Text style={styles.inputLabel}>Match Status</Text>
                <View style={styles.statusButtonsContainer}>
                  {MATCH_STATUS.map((status) => (
                    <TouchableOpacity
                      key={status.id}
                      style={[
                        styles.statusButton,
                        matchStatus === status.id && {
                          backgroundColor: getStatusColor(status.id),
                          borderColor: getStatusColor(status.id)
                        }
                      ]}
                      onPress={() => setMatchStatus(status.id)}
                    >
                      <Text style={[
                        styles.statusButtonText,
                        matchStatus === status.id && styles.statusButtonTextActive
                      ]}>
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Featured Match</Text>
                  <Switch
                    value={isFeatured}
                    onValueChange={setIsFeatured}
                    thumbColor={isFeatured ? '#1e3c72' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#4e6cb6' }}
                    ios_backgroundColor="#767577"
                  />
                </View>
              </View>
            </View>
            
            {(matchStatus === 'completed' || matchStatus === 'live') && (
              <View style={styles.formCard}>
                <View style={styles.formCardHeader}>
                  <Ionicons name="trophy-outline" size={24} color="#1e3c72" />
                  <Text style={styles.formCardTitle}>Match Result</Text>
                </View>
                
                <View style={styles.formCardBody}>
                  <View style={styles.scoreContainer}>
                    <View style={styles.scoreTeam}>
                      <Text style={styles.scoreTeamName}>
                        {homeTeamId ? getTeamById(homeTeamId).name : 'Home Team'}
                      </Text>
                      <TextInput 
                        style={[styles.scoreInput, validationErrors.homeScore && styles.inputError]} 
                        placeholder="0" 
                        value={homeScore} 
                        onChangeText={setHomeScore} 
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <Text style={styles.scoreVs}>-</Text>
                    
                    <View style={styles.scoreTeam}>
                      <TextInput 
                        style={[styles.scoreInput, validationErrors.awayScore && styles.inputError]} 
                        placeholder="0" 
                        value={awayScore} 
                        onChangeText={setAwayScore} 
                        keyboardType="numeric"
                      />
                      <Text style={styles.scoreTeamName}>
                        {awayTeamId ? getTeamById(awayTeamId).name : 'Away Team'}
                      </Text>
                    </View>
                  </View>
                  {renderError('homeScore')}
                  {renderError('awayScore')}
                </View>
              </View>
            )}
          </Animated.View>
        )}
        
        {/* Details Tab */}
        {activeTab === 'details' && (
          <Animated.View 
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="document-text-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Match Details</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Referee</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Match referee" 
                      value={referee} 
                      onChangeText={setReferee} 
                    />
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Attendance</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.attendance && styles.inputError]} 
                      placeholder="Number of spectators" 
                      value={attendance} 
                      onChangeText={setAttendance} 
                      keyboardType="numeric"
                    />
                    {renderError('attendance')}
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Competition</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="League/Cup name" 
                      value={competition} 
                      onChangeText={setCompetition} 
                    />
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Season</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. 2024-2025" 
                      value={season} 
                      onChangeText={setSeason} 
                    />
                  </View>
                </View>
                
                <Text style={styles.inputLabel}>Match Day</Text>
                <TextInput 
                  style={[styles.input, validationErrors.matchDay && styles.inputError]} 
                  placeholder="Match day number" 
                  value={matchDay} 
                  onChangeText={setMatchDay} 
                  keyboardType="numeric"
                />
                {renderError('matchDay')}
                
                <Text style={styles.inputLabel}>Match Description</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Match description and key moments..." 
                  multiline
                  textAlignVertical="top"
                  numberOfLines={8}
                  value={matchDescription} 
                  onChangeText={setMatchDescription} 
                />
                
                <Text style={styles.inputLabel}>Highlights URL</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="YouTube or video link" 
                  value={highlights} 
                  onChangeText={setHighlights} 
                />
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Events Tab */}
        {activeTab === 'events' && (
          <Animated.View 
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="timer-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Match Events</Text>
              </View>
              
              <View style={styles.formCardBody}>
                {events.length > 0 ? (
                  <View style={styles.eventsList}>
                    {[...events].sort((a, b) => a.minute - b.minute).map((event) => (
                      <View key={event.id} style={styles.eventItem}>
                        <View style={styles.eventMinute}>
                          <Text style={styles.eventMinuteText}>{event.minute}'</Text>
                        </View>
                        
                        <View style={[
                          styles.eventTypeContainer, 
                          { backgroundColor: getEventTypeColor(event.type) }
                        ]}>
                          <Ionicons 
                            name={getEventTypeIcon(event.type)} 
                            size={16} 
                            color="#fff" 
                          />
                        </View>
                        
                        <View style={styles.eventDetails}>
                          <View style={styles.eventHeader}>
                            <Text style={styles.eventType}>{getEventTypeLabel(event.type)}</Text>
                            <Text style={styles.eventTeam}>
                              {event.team === 'home' ? 
                                (homeTeamId ? getTeamById(homeTeamId).name : 'Home Team') : 
                                (awayTeamId ? getTeamById(awayTeamId).name : 'Away Team')}
                            </Text>
                          </View>
                          
                          <Text style={styles.eventPlayer}>
                            {getPlayerById(event.player).name}
                          </Text>
                          
                          {event.description && (
                            <Text style={styles.eventDescription}>{event.description}</Text>
                          )}
                        </View>
                        
                        <TouchableOpacity 
                          style={styles.removeEventButton}
                          onPress={() => removeEvent(event.id)}
                        >
                          <Ionicons name="close-circle" size={24} color="#ff3b30" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="timer" size={40} color="#ccc" />
                    <Text style={styles.emptyStateText}>No events added yet</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowEventModal(true)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add Event</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <Animated.View 
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="stats-chart-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Match Statistics</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.statsHeader}>
                  <Text style={styles.statsTeamName}>
                    {homeTeamId ? getTeamById(homeTeamId).name : 'Home Team'}
                  </Text>
                  <Text style={styles.statsVs}>vs</Text>
                  <Text style={styles.statsTeamName}>
                    {awayTeamId ? getTeamById(awayTeamId).name : 'Away Team'}
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Possession (%)</Text>
                  <View style={styles.statValues}>
                    <TextInput 
                      style={[styles.statInput, validationErrors.homePossession && styles.inputError]} 
                      placeholder="50" 
                      value={matchStats.homePossession} 
                      onChangeText={(value) => handleStatsChange('homePossession', value)} 
                      keyboardType="numeric"
                    />
                    <Text style={styles.statSeparator}>-</Text>
                    <TextInput 
                      style={[styles.statInput, validationErrors.awayPossession && styles.inputError]} 
                      placeholder="50" 
                      value={matchStats.awayPossession} 
                      onChangeText={(value) => handleStatsChange('awayPossession', value)} 
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderError('homePossession') || renderError('awayPossession')}
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Shots</Text>
                  <View style={styles.statValues}>
                    <TextInput 
                      style={[styles.statInput, validationErrors.homeShots && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.homeShots} 
                      onChangeText={(value) => handleStatsChange('homeShots', value)} 
                      keyboardType="numeric"
                    />
                    <Text style={styles.statSeparator}>-</Text>
                    <TextInput 
                      style={[styles.statInput, validationErrors.awayShots && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.awayShots} 
                      onChangeText={(value) => handleStatsChange('awayShots', value)} 
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderError('homeShots') || renderError('awayShots')}
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Shots on Target</Text>
                  <View style={styles.statValues}>
                    <TextInput 
                      style={[styles.statInput, validationErrors.homeShotsOnTarget && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.homeShotsOnTarget} 
                      onChangeText={(value) => handleStatsChange('homeShotsOnTarget', value)} 
                      keyboardType="numeric"
                    />
                    <Text style={styles.statSeparator}>-</Text>
                    <TextInput 
                      style={[styles.statInput, validationErrors.awayShotsOnTarget && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.awayShotsOnTarget} 
                      onChangeText={(value) => handleStatsChange('awayShotsOnTarget', value)} 
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderError('homeShotsOnTarget') || renderError('awayShotsOnTarget')}
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Corners</Text>
                  <View style={styles.statValues}>
                    <TextInput 
                      style={[styles.statInput, validationErrors.homeCorners && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.homeCorners} 
                      onChangeText={(value) => handleStatsChange('homeCorners', value)} 
                      keyboardType="numeric"
                    />
                    <Text style={styles.statSeparator}>-</Text>
                    <TextInput 
                      style={[styles.statInput, validationErrors.awayCorners && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.awayCorners} 
                      onChangeText={(value) => handleStatsChange('awayCorners', value)} 
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderError('homeCorners') || renderError('awayCorners')}
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Fouls</Text>
                  <View style={styles.statValues}>
                    <TextInput 
                      style={[styles.statInput, validationErrors.homeFouls && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.homeFouls} 
                      onChangeText={(value) => handleStatsChange('homeFouls', value)} 
                      keyboardType="numeric"
                    />
                    <Text style={styles.statSeparator}>-</Text>
                    <TextInput 
                      style={[styles.statInput, validationErrors.awayFouls && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.awayFouls} 
                      onChangeText={(value) => handleStatsChange('awayFouls', value)} 
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderError('homeFouls') || renderError('awayFouls')}
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Yellow Cards</Text>
                  <View style={styles.statValues}>
                    <TextInput 
                      style={[styles.statInput, validationErrors.homeYellowCards && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.homeYellowCards} 
                      onChangeText={(value) => handleStatsChange('homeYellowCards', value)} 
                      keyboardType="numeric"
                    />
                    <Text style={styles.statSeparator}>-</Text>
                    <TextInput 
                      style={[styles.statInput, validationErrors.awayYellowCards && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.awayYellowCards} 
                      onChangeText={(value) => handleStatsChange('awayYellowCards', value)} 
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderError('homeYellowCards') || renderError('awayYellowCards')}
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Red Cards</Text>
                  <View style={styles.statValues}>
                    <TextInput 
                      style={[styles.statInput, validationErrors.homeRedCards && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.homeRedCards} 
                      onChangeText={(value) => handleStatsChange('homeRedCards', value)} 
                      keyboardType="numeric"
                    />
                    <Text style={styles.statSeparator}>-</Text>
                    <TextInput 
                      style={[styles.statInput, validationErrors.awayRedCards && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.awayRedCards} 
                      onChangeText={(value) => handleStatsChange('awayRedCards', value)} 
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderError('homeRedCards') || renderError('awayRedCards')}
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Offsides</Text>
                  <View style={styles.statValues}>
                    <TextInput 
                      style={[styles.statInput, validationErrors.homeOffsides && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.homeOffsides} 
                      onChangeText={(value) => handleStatsChange('homeOffsides', value)} 
                      keyboardType="numeric"
                    />
                    <Text style={styles.statSeparator}>-</Text>
                    <TextInput 
                      style={[styles.statInput, validationErrors.awayOffsides && styles.inputError]} 
                      placeholder="0" 
                      value={matchStats.awayOffsides} 
                      onChangeText={(value) => handleStatsChange('awayOffsides', value)} 
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderError('homeOffsides') || renderError('awayOffsides')}
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Media Tab */}
        {activeTab === 'media' && (
          <Animated.View 
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="image-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Match Cover Image</Text>
              </View>
              
              <View style={styles.formCardBody}>
                {coverImage ? (
                  <View style={styles.coverImageContainer}>
                    <Image source={{ uri: coverImage.uri }} style={styles.coverImagePreview} />
                    <TouchableOpacity 
                      style={styles.removeCoverImageButton}
                      onPress={() => setCoverImage(null)}
                    >
                      <Ionicons name="close-circle" size={30} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.emptyCoverImagePlaceholder}>
                    <Ionicons name="image-outline" size={50} color="#ccc" />
                    <Text style={styles.emptyCoverImageText}>No cover image selected</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.coverImageActionButton}
                  onPress={pickCoverImage}
                >
                  <Ionicons name="image" size={20} color="#fff" />
                  <Text style={styles.coverImageActionButtonText}>
                    {coverImage ? 'Change Cover Image' : 'Select Cover Image'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="images-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Match Gallery</Text>
              </View>
              
              <View style={styles.formCardBody}>
                {gallery.length > 0 ? (
                  <FlatList
                    data={gallery}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.galleryItemContainer}>
                        <Image source={{ uri: item.uri }} style={styles.galleryImage} />
                        <TouchableOpacity 
                          style={styles.removeGalleryImageButton}
                          onPress={() => removeFromGallery(item.id)}
                        >
                          <Ionicons name="close-circle" size={24} color="#ff3b30" />
                        </TouchableOpacity>
                      </View>
                    )}
                    contentContainerStyle={styles.galleryList}
                  />
                ) : (
                  <View style={styles.emptyGalleryContainer}>
                    <Ionicons name="images" size={40} color="#ccc" />
                    <Text style={styles.emptyGalleryText}>No gallery images added yet</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.addGalleryButton}
                  onPress={addToGallery}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addGalleryButtonText}>Add Photos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Form Actions */}
        <View style={styles.formActions}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name={editingId ? "save" : "add-circle"} size={20} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update Match' : 'Create Match'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {editingId && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={resetForm}
              disabled={isLoading}
            >
              <Ionicons name="close-circle" size={20} color="#1e3c72" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Matches List Section */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Ionicons name="list-outline" size={24} color="#1e3c72" />
            <Text style={styles.listTitle}>Existing Matches</Text>
            
            <View style={styles.listFilters}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search matches..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
              </View>
              
              <View style={styles.filtersRow}>
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Status:</Text>
                  <View style={styles.filterPickerContainer}>
                    <Picker
                      selectedValue={filterStatus}
                      onValueChange={(value) => setFilterStatus(value)}
                      style={styles.filterPicker}
                    >
                      <Picker.Item label="All Statuses" value="" />
                      {MATCH_STATUS.map((status) => (
                        <Picker.Item key={status.id} label={status.label} value={status.id} />
                      ))}
                    </Picker>
                  </View>
                </View>
                
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Team:</Text>
                  <View style={styles.filterPickerContainer}>
                    <Picker
                      selectedValue={filterTeam}
                      onValueChange={(value) => setFilterTeam(value)}
                      style={styles.filterPicker}
                    >
                      <Picker.Item label="All Teams" value="" />
                      {teams.map((team) => (
                        <Picker.Item key={team.id} label={team.name} value={team.id.toString()} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          <CrudList
            ref={listRef}
            fetchFn={dataService.getMatches}
            deleteFn={dataService.deleteMatch}
            filterFn={filterMatches}
            onEdit={(item) => {
              // Set basic info
              setEditingId(item.id);
              setHomeTeamId(item.home_team_id?.toString() || '');
              setAwayTeamId(item.away_team_id?.toString() || '');
              setVenue(item.venue || '');
              setMatchStatus(item.status || 'scheduled');
              setIsFeatured(item.is_featured || false);
              
              // Set date and time
              if (item.match_date) {
                const matchDateTime = new Date(item.match_date);
                setMatchDate(matchDateTime);
                setMatchTime(matchDateTime);
              }
              
              // Set match details
              setHomeScore(item.home_score?.toString() || '');
              setAwayScore(item.away_score?.toString() || '');
              setReferee(item.referee || '');
              setAttendance(item.attendance?.toString() || '');
              setSeason(item.season || '');
              setCompetition(item.competition || '');
              setMatchDay(item.match_day?.toString() || '');
              setMatchDescription(item.description || '');
              setHighlights(item.highlights_url || '');
              
              // Set match statistics
              if (item.statistics) {
                try {
                  const stats = JSON.parse(item.statistics);
                  setMatchStats({
                    homePossession: stats.possession?.home?.toString() || '50',
                    awayPossession: stats.possession?.away?.toString() || '50',
                    homeShots: stats.shots?.home?.toString() || '',
                    awayShots: stats.shots?.away?.toString() || '',
                    homeShotsOnTarget: stats.shots_on_target?.home?.toString() || '',
                    awayShotsOnTarget: stats.shots_on_target?.away?.toString() || '',
                    homeCorners: stats.corners?.home?.toString() || '',
                    awayCorners: stats.corners?.away?.toString() || '',
                    homeFouls: stats.fouls?.home?.toString() || '',
                    awayFouls: stats.fouls?.away?.toString() || '',
                    homeYellowCards: stats.yellow_cards?.home?.toString() || '',
                    awayYellowCards: stats.yellow_cards?.away?.toString() || '',
                    homeRedCards: stats.red_cards?.home?.toString() || '',
                    awayRedCards: stats.red_cards?.away?.toString() || '',
                    homeOffsides: stats.offsides?.home?.toString() || '',
                    awayOffsides: stats.offsides?.away?.toString() || ''
                  });
                } catch (e) {
                  console.error('Error parsing statistics:', e);
                }
              }
              
              // Set match events
              if (item.events) {
                try {
                  const parsedEvents = JSON.parse(item.events);
                  setEvents(parsedEvents || []);
                } catch (e) {
                  console.error('Error parsing events:', e);
                  setEvents([]);
                }
              } else {
                setEvents([]);
              }
              
              // Set match media
              if (item.cover_image) {
                setCoverImage({ uri: item.cover_image });
              } else {
                setCoverImage(null);
              }
              
              if (item.gallery) {
                try {
                  const parsedGallery = JSON.parse(item.gallery);
                  setGallery(parsedGallery || []);
                } catch (e) {
                  console.error('Error parsing gallery:', e);
                  setGallery([]);
                }
              } else {
                setGallery([]);
              }
              
              // Reset form state
              setActiveTab('basic');
              setValidationErrors({});
              
              // Scroll to top
              scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            }}
            renderItemFields={(item) => (
              <View style={styles.matchListItem}>
                <View style={styles.matchListHeader}>
                  <Text style={styles.matchListDate}>
                    {item.match_date ? new Date(item.match_date).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Date not set'}
                  </Text>
                  <View style={[
                    styles.matchListStatus, 
                    { backgroundColor: getStatusColor(item.status || 'scheduled') }
                  ]}>
                    <Text style={styles.matchListStatusText}>
                      {MATCH_STATUS.find(s => s.id === item.status)?.label || 'Scheduled'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.matchListTeams}>
                  <View style={styles.matchListTeam}>
                    <Text style={styles.matchListTeamName} numberOfLines={1}>
                      {getTeamById(item.home_team_id).name}
                    </Text>
                  </View>
                  
                  <View style={styles.matchListScoreContainer}>
                    {(item.status === 'completed' || item.status === 'live') ? (
                      <Text style={styles.matchListScore}>
                        {item.home_score || 0} - {item.away_score || 0}
                      </Text>
                    ) : (
                      <Text style={styles.matchListVs}>VS</Text>
                    )}
                  </View>
                  
                  <View style={styles.matchListTeam}>
                    <Text style={styles.matchListTeamName} numberOfLines={1}>
                      {getTeamById(item.away_team_id).name}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.matchListVenue}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  {' '}
                  {item.venue}
                </Text>
                
                {item.is_featured && (
                  <View style={styles.matchListFeaturedBadge}>
                    <Ionicons name="star" size={12} color="#fff" />
                    <Text style={styles.matchListFeaturedText}>Featured</Text>
                  </View>
                )}
              </View>
            )}
            extraActions={[
              {
                icon: 'copy-outline',
                color: '#2ecc71',
                action: duplicateMatch,
                tooltip: 'Duplicate'
              }
            ]}
          />
        </View>
        
        {/* Add Event Modal */}
        <Modal
          visible={showEventModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowEventModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Match Event</Text>
              
              <Text style={styles.inputLabel}>Event Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={newEventType}
                  onValueChange={(value) => setNewEventType(value)}
                >
                  <Picker.Item label="Goal" value="goal" />
                  <Picker.Item label="Own Goal" value="own-goal" />
                  <Picker.Item label="Yellow Card" value="yellow-card" />
                  <Picker.Item label="Red Card" value="red-card" />
                  <Picker.Item label="Substitution" value="substitution" />
                  <Picker.Item label="Penalty" value="penalty" />
                  <Picker.Item label="Missed Penalty" value="penalty-missed" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
              
              <Text style={styles.inputLabel}>Minute</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Event minute (e.g. 45)"
                value={newEventMinute}
                onChangeText={setNewEventMinute}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Team</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={newEventTeam}
                  onValueChange={(value) => setNewEventTeam(value)}
                >
                  <Picker.Item 
                    label={homeTeamId ? getTeamById(homeTeamId).name : 'Home Team'} 
                    value="home" 
                  />
                  <Picker.Item 
                    label={awayTeamId ? getTeamById(awayTeamId).name : 'Away Team'} 
                    value="away" 
                  />
                </Picker>
              </View>
              
              <Text style={styles.inputLabel}>Player</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={newEventPlayer}
                  onValueChange={(value) => setNewEventPlayer(value)}
                >
                  <Picker.Item label="Select player" value="" />
                  {getPlayersForTeam(newEventTeam === 'home' ? homeTeamId : awayTeamId).map((player) => (
                    <Picker.Item key={player.id} label={player.name} value={player.id.toString()} />
                  ))}
                </Picker>
              </View>
              
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Additional details"
                value={newEventDescription}
                onChangeText={setNewEventDescription}
                multiline
                textAlignVertical="top"
                numberOfLines={3}
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowEventModal(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalAddButton}
                  onPress={addEvent}
                >
                  <Text style={styles.modalAddButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  content: { 
    paddingBottom: 50 
  },
  header: {
    padding: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  
  // Tab Navigation
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    minWidth: 70,
  },
  activeTabButton: {
    backgroundColor: '#1e3c72',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginLeft: 5,
  },
  activeTabButtonText: {
    color: '#fff',
  },
  tabContent: {
    padding: 15,
  },
  
  // Form Card Styles
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  formCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  formCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginLeft: 10,
  },
  formCardBody: {
    padding: 15,
  },
  
  // Input Styles
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  
  // VS Display
  vsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  teamLogoContainer: {
    alignItems: 'center',
    width: '40%',
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  teamLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  vsTextContainer: {
    width: '20%',
    alignItems: 'center',
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  
  // Status Styles
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#333',
  },
  
  // Score Styles
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  scoreTeam: {
    alignItems: 'center',
    width: '40%',
  },
  scoreTeamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreInput: {
    backgroundColor: '#f9f9f9',
    width: 60,
    height: 60,
    borderRadius: 30,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  scoreVs: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  
  // Stats Styles
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  statsTeamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3c72',
    width: '45%',
    textAlign: 'center',
  },
  statsVs: {
    fontSize: 16,
    color: '#666',
    width: '10%',
    textAlign: 'center',
  },
  statItem: {
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  statValues: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statInput: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '45%',
    textAlign: 'center',
  },
  statSeparator: {
    width: '10%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  
  // Events Styles
  eventsList: {
    marginBottom: 15,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  eventMinute: {
    backgroundColor: '#1e3c72',
    borderRadius: 15,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  eventMinuteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  eventTypeContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  eventType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  eventTeam: {
    fontSize: 12,
    color: '#666',
  },
  eventPlayer: {
    fontSize: 14,
    color: '#1e3c72',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  removeEventButton: {
    marginLeft: 10,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Media Styles
  coverImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  coverImagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  removeCoverImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCoverImagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyCoverImageText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  coverImageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
  },
  coverImageActionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  galleryList: {
    paddingVertical: 10,
  },
  galleryItemContainer: {
    marginRight: 15,
    position: 'relative',
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  removeGalleryImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGalleryContainer: {
    height: 120,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyGalleryText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  addGalleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
  },
  addGalleryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Form Actions
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e3c72',
  },
  cancelButtonText: {
    color: '#1e3c72',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Matches List Styles
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  listHeader: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginLeft: 10,
  },
  listFilters: {
    marginTop: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterItem: {
    flex: 1,
    marginRight: 10,
  },
  filterLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  filterPickerContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  filterPicker: {
    height: 40,
  },
  matchListItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  matchListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchListDate: {
    fontSize: 14,
    color: '#666',
  },
  matchListStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  matchListStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  matchListTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  matchListTeam: {
    flex: 1,
    alignItems: 'center',
  },
  matchListTeamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3c72',
    textAlign: 'center',
  },
  matchListScoreContainer: {
    width: 80,
    alignItems: 'center',
  },
  matchListScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  matchListVs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  matchListVenue: {
    fontSize: 14,
    color: '#666',
  },
  matchListFeaturedBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#f39c12',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  matchListFeaturedText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalAddButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#1e3c72',
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});