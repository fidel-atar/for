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
import CountryPicker from 'react-native-country-picker-modal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

// Player positions by category
const PLAYER_POSITIONS = {
  Goalkeeper: ['Goalkeeper (GK)'],
  Defense: ['Center Back (CB)', 'Right Back (RB)', 'Left Back (LB)', 'Sweeper', 'Wing Back'],
  Midfield: ['Central Midfielder (CM)', 'Defensive Midfielder (DM)', 'Attacking Midfielder (AM)', 'Right Midfielder (RM)', 'Left Midfielder (LM)'],
  Forward: ['Center Forward (CF)', 'Striker (ST)', 'Right Winger (RW)', 'Left Winger (LW)']
};

export default function AdminPlayerCrudScreen() {
  // Basic player info
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [teamId, setTeamId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [localImage, setLocalImage] = useState(null);
  
  // Enhanced player info
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [nationality, setNationality] = useState('MR');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [preferredFoot, setPreferredFoot] = useState('right');
  const [contractStart, setContractStart] = useState(new Date());
  const [showContractStartPicker, setShowContractStartPicker] = useState(false);
  const [contractEnd, setContractEnd] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 3)));
  const [showContractEndPicker, setShowContractEndPicker] = useState(false);
  const [marketValue, setMarketValue] = useState('');
  const [biography, setBiography] = useState('');
  const [playerStatus, setPlayerStatus] = useState('active'); // active, injured, suspended, loaned, transferred

  // Player statistics
  const [appearances, setAppearances] = useState('');
  const [goals, setGoals] = useState('');
  const [assists, setAssists] = useState('');
  const [yellowCards, setYellowCards] = useState('');
  const [redCards, setRedCards] = useState('');
  const [cleanSheets, setCleanSheets] = useState('');
  const [minutesPlayed, setMinutesPlayed] = useState('');
  
  // Player attributes (rating from 1-10)
  const [attributes, setAttributes] = useState({
    pace: 5,
    shooting: 5,
    passing: 5,
    dribbling: 5,
    defending: 5,
    physical: 5,
    technique: 5,
    tactical: 5,
    mental: 5
  });
  
  // Player social media
  const [socialMedia, setSocialMedia] = useState({
    instagram: '',
    twitter: '',
    facebook: ''
  });
  
  // Player media
  const [gallery, setGallery] = useState([]);
  const [isCaptain, setIsCaptain] = useState(false);
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('basic'); // basic, details, stats, attributes, media
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  
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
  
  const resetForm = () => {
    // Basic info
    setEditingId(null);
    setName('');
    setPosition('');
    setTeamId('');
    setImgUrl('');
    setLocalImage(null);
    
    // Enhanced info
    setJerseyNumber('');
    setDateOfBirth(new Date(2000, 0, 1));
    setHeight('');
    setWeight('');
    setNationality('MR');
    setPreferredFoot('right');
    setContractStart(new Date());
    setContractEnd(new Date(new Date().setFullYear(new Date().getFullYear() + 3)));
    setMarketValue('');
    setBiography('');
    setPlayerStatus('active');
    setIsCaptain(false);
    
    // Stats
    setAppearances('');
    setGoals('');
    setAssists('');
    setYellowCards('');
    setRedCards('');
    setCleanSheets('');
    setMinutesPlayed('');
    
    // Attributes
    setAttributes({
      pace: 5,
      shooting: 5,
      passing: 5,
      dribbling: 5,
      defending: 5,
      physical: 5,
      technique: 5,
      tactical: 5,
      mental: 5
    });
    
    // Social media
    setSocialMedia({
      instagram: '',
      twitter: '',
      facebook: ''
    });
    
    // Media
    setGallery([]);
    
    // Form state
    setActiveTab('basic');
    setValidationErrors({});
    
    // Reset scrolling
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access denied');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    
    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalImage(asset);
      setImgUrl('');
    }
  };
  
  const addToGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access denied');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
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
  
  const handleAttributeChange = (attribute, value) => {
    setAttributes(prev => ({
      ...prev,
      [attribute]: value
    }));
  };
  
  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };
  
  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = 'Player name is required';
    if (!position.trim()) errors.position = 'Position is required';
    if (!teamId) errors.teamId = 'Team is required';
    
    if (jerseyNumber && (isNaN(parseInt(jerseyNumber)) || parseInt(jerseyNumber) < 1 || parseInt(jerseyNumber) > 99)) {
      errors.jerseyNumber = 'Jersey number must be between 1 and 99';
    }
    
    if (height && (isNaN(parseInt(height)) || parseInt(height) < 100 || parseInt(height) > 250)) {
      errors.height = 'Height must be between 100 and 250 cm';
    }
    
    if (weight && (isNaN(parseInt(weight)) || parseInt(weight) < 40 || parseInt(weight) > 150)) {
      errors.weight = 'Weight must be between 40 and 150 kg';
    }
    
    if (contractEnd <= contractStart) {
      errors.contractDates = 'Contract end date must be after start date';
    }
    
    if (marketValue && isNaN(parseFloat(marketValue))) {
      errors.marketValue = 'Market value must be a number';
    }
    
    // Stats validation
    if (appearances && isNaN(parseInt(appearances))) errors.appearances = 'Appearances must be a number';
    if (goals && isNaN(parseInt(goals))) errors.goals = 'Goals must be a number';
    if (assists && isNaN(parseInt(assists))) errors.assists = 'Assists must be a number';
    if (yellowCards && isNaN(parseInt(yellowCards))) errors.yellowCards = 'Yellow cards must be a number';
    if (redCards && isNaN(parseInt(redCards))) errors.redCards = 'Red cards must be a number';
    if (cleanSheets && isNaN(parseInt(cleanSheets))) errors.cleanSheets = 'Clean sheets must be a number';
    if (minutesPlayed && isNaN(parseInt(minutesPlayed))) errors.minutesPlayed = 'Minutes played must be a number';
    
    // Social media validation
    if (socialMedia.instagram && !socialMedia.instagram.startsWith('@')) {
      errors.instagram = 'Instagram handle should start with @';
    }
    if (socialMedia.twitter && !socialMedia.twitter.startsWith('@')) {
      errors.twitter = 'Twitter handle should start with @';
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
      
      // Upload player image if needed
      let finalImgUrl = imgUrl;
      if (localImage) {
        // Simulating upload - in a real app, replace with actual upload code
        // const fileObj = {
        //   uri: localImage.uri,
        //   name: localImage.fileName || `player_${Date.now()}.jpg`,
        //   type: localImage.mimeType || 'image/jpeg',
        // };
        // const uploadRes = await dataService.uploadImage(fileObj);
        // finalImgUrl = uploadRes.url;
        
        // For now, just use the local URI
        finalImgUrl = localImage.uri;
      }
      
      // Upload gallery images if needed
      const uploadedGallery = gallery.map(photo => ({
        ...photo,
        uploaded: true,
        url: photo.uri
      }));
      
      // Prepare player data
      const playerData = {
        // Basic info
        name,
        position,
        team_id: teamId,
        photo_url: finalImgUrl,
        
        // Enhanced info
        jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
        date_of_birth: dateOfBirth.toISOString(),
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        nationality,
        preferred_foot: preferredFoot,
        contract_start: contractStart.toISOString(),
        contract_end: contractEnd.toISOString(),
        market_value: marketValue ? parseFloat(marketValue) : null,
        biography,
        player_status: playerStatus,
        is_captain: isCaptain,
        
        // Stats
        appearances: appearances ? parseInt(appearances) : 0,
        goals: goals ? parseInt(goals) : 0,
        assists: assists ? parseInt(assists) : 0,
        yellow_cards: yellowCards ? parseInt(yellowCards) : 0,
        red_cards: redCards ? parseInt(redCards) : 0,
        clean_sheets: cleanSheets ? parseInt(cleanSheets) : 0,
        minutes_played: minutesPlayed ? parseInt(minutesPlayed) : 0,
        
        // Attributes and social media
        attributes: JSON.stringify(attributes),
        social_media: JSON.stringify(socialMedia),
        gallery: uploadedGallery.length > 0 ? JSON.stringify(uploadedGallery) : null
      };
      
      // Save or update player
      let result;
      if (editingId) {
        result = await dataService.updatePlayer(editingId, playerData);
      } else {
        result = await dataService.createPlayer(playerData);
      }
      
      if (result.success) {
        Alert.alert('Success', result.message || 'Operation completed successfully');
        // Reset form and reload list
        resetForm();
        listRef.current?.reload();
      } else {
        Alert.alert('Error', result.message || 'Operation failed');
      }
      
    } catch (err) {
      console.error('Error saving player:', err);
      Alert.alert('Error', 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const duplicatePlayer = async (item) => {
    try {
      // Create a copy of the item without ID
      const { id, created_at, updated_at, ...playerData } = item;
      
      // Modify name to indicate it's a copy
      playerData.name = `${playerData.name} (Copy)`;
      
      // Create new player
      const result = await dataService.createPlayer(playerData);
      if (result.success) {
        Alert.alert('Success', result.message || 'Player duplicated successfully');
        // Reload list
        listRef.current?.reload();
      } else {
        Alert.alert('Error', result.message || 'Failed to duplicate player');
      }
    } catch (err) {
      console.error('Error duplicating player:', err);
      Alert.alert('Error', 'Failed to duplicate player');
    }
  };
  
  const getTeamById = (id) => {
    return teams.find(team => team.id.toString() === id.toString()) || { name: 'Unknown Team' };
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
  
  const renderAttributeSlider = (label, value, attribute) => (
    <View style={styles.attributeContainer}>
      <View style={styles.attributeHeader}>
        <Text style={styles.attributeLabel}>{label}</Text>
        <Text style={styles.attributeValue}>{value}/10</Text>
      </View>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${value * 10}%`, backgroundColor: getAttributeColor(value) }]} />
        </View>
        <View style={styles.sliderButtons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <TouchableOpacity
              key={num}
              style={[
                styles.sliderButton,
                value >= num && { backgroundColor: getAttributeColor(value) }
              ]}
              onPress={() => handleAttributeChange(attribute, num)}
            />
          ))}
        </View>
      </View>
    </View>
  );
  
  const getAttributeColor = (value) => {
    if (value <= 3) return '#e74c3c';
    if (value <= 6) return '#f39c12';
    if (value <= 8) return '#2ecc71';
    return '#3498db';
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#2ecc71';
      case 'injured': return '#e74c3c';
      case 'suspended': return '#f39c12';
      case 'loaned': return '#3498db';
      case 'transferred': return '#9b59b6';
      default: return '#7f8c8d';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'injured': return 'Injured';
      case 'suspended': return 'Suspended';
      case 'loaned': return 'On Loan';
      case 'transferred': return 'Transferred';
      default: return 'Unknown';
    }
  };
  
  const filterPlayers = (players) => {
    if (!players) return [];
    
    return players.filter(player => {
      const matchesSearch = searchTerm === '' || 
        player.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTeam = filterTeam === '' || 
        player.team_id?.toString() === filterTeam;
      
      const matchesPosition = filterPosition === '' || 
        player.position?.includes(filterPosition);
      
      return matchesSearch && matchesTeam && matchesPosition;
    });
  };
  
  const getAllPositions = () => {
    const positions = [];
    Object.values(PLAYER_POSITIONS).forEach(posArr => {
      posArr.forEach(pos => positions.push(pos));
    });
    return positions;
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
            {editingId ? 'Edit Player' : 'Create New Player'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {editingId ? 'Update player information' : 'Add a new player to the system'}
          </Text>
        </LinearGradient>
        
        {/* Form Tabs */}
        <View style={styles.tabsContainer}>
          {renderTabButton('basic', 'Basic Info', 'person-outline')}
          {renderTabButton('details', 'Details', 'document-text-outline')}
          {renderTabButton('stats', 'Statistics', 'stats-chart-outline')}
          {renderTabButton('attributes', 'Attributes', 'star-outline')}
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
                <Ionicons name="person-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Player Information</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <Text style={styles.inputLabel}>Player Name *</Text>
                <TextInput 
                  style={[styles.input, validationErrors.name && styles.inputError]} 
                  placeholder="Full name" 
                  value={name} 
                  onChangeText={setName} 
                />
                {renderError('name')}
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Position *</Text>
                    <View style={[styles.pickerWrapper, validationErrors.position && styles.inputError]}>
                      <Picker
                        selectedValue={position}
                        onValueChange={(value) => setPosition(value)}
                      >
                        <Picker.Item label="Select position" value="" />
                        {Object.entries(PLAYER_POSITIONS).map(([category, positions]) => (
                          positions.map((pos) => (
                            <Picker.Item key={pos} label={pos} value={pos} />
                          ))
                        ))}
                      </Picker>
                    </View>
                    {renderError('position')}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Jersey Number</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.jerseyNumber && styles.inputError]} 
                      placeholder="Number" 
                      value={jerseyNumber} 
                      onChangeText={setJerseyNumber} 
                      keyboardType="numeric"
                    />
                    {renderError('jerseyNumber')}
                  </View>
                </View>
                
                <Text style={styles.inputLabel}>Team *</Text>
                <View style={[styles.pickerWrapper, validationErrors.teamId && styles.inputError]}>
                  <Picker
                    selectedValue={teamId}
                    onValueChange={(value) => setTeamId(value)}
                  >
                    <Picker.Item label="Select team" value="" />
                    {teams.map((team) => (
                      <Picker.Item key={team.id} label={team.name} value={team.id.toString()} />
                    ))}
                  </Picker>
                </View>
                {renderError('teamId')}
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Date of Birth</Text>
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {formatDate(dateOfBirth)} ({calculateAge(dateOfBirth)} years)
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#1e3c72" />
                    </TouchableOpacity>
                    
                    {showDatePicker && (
                      <DateTimePicker
                        value={dateOfBirth}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setDateOfBirth(selectedDate);
                          }
                        }}
                      />
                    )}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Nationality</Text>
                    <TouchableOpacity 
                      style={styles.countryPickerButton}
                      onPress={() => setShowCountryPicker(true)}
                    >
                      <Text style={styles.countryPickerButtonText}>
                        {nationality}
                      </Text>
                      <Ionicons name="globe-outline" size={20} color="#1e3c72" />
                    </TouchableOpacity>
                    
                    {showCountryPicker && (
                      <CountryPicker
                        visible={showCountryPicker}
                        onClose={() => setShowCountryPicker(false)}
                        onSelect={(country) => {
                          setNationality(country.cca2);
                          setShowCountryPicker(false);
                        }}
                        countryCode={nationality}
                        withFlag
                        withFilter
                        withAlphaFilter
                      />
                    )}
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Height (cm)</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.height && styles.inputError]} 
                      placeholder="Height in cm" 
                      value={height} 
                      onChangeText={setHeight} 
                      keyboardType="numeric"
                    />
                    {renderError('height')}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Weight (kg)</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.weight && styles.inputError]} 
                      placeholder="Weight in kg" 
                      value={weight} 
                      onChangeText={setWeight} 
                      keyboardType="numeric"
                    />
                    {renderError('weight')}
                  </View>
                </View>
                
                <Text style={styles.inputLabel}>Preferred Foot</Text>
                <View style={styles.footButtonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.footButton,
                      preferredFoot === 'right' && styles.footButtonActive
                    ]}
                    onPress={() => setPreferredFoot('right')}
                  >
                    <Text style={[
                      styles.footButtonText,
                      preferredFoot === 'right' && styles.footButtonTextActive
                    ]}>
                      Right
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.footButton,
                      preferredFoot === 'left' && styles.footButtonActive
                    ]}
                    onPress={() => setPreferredFoot('left')}
                  >
                    <Text style={[
                      styles.footButtonText,
                      preferredFoot === 'left' && styles.footButtonTextActive
                    ]}>
                      Left
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.footButton,
                      preferredFoot === 'both' && styles.footButtonActive
                    ]}
                    onPress={() => setPreferredFoot('both')}
                  >
                    <Text style={[
                      styles.footButtonText,
                      preferredFoot === 'both' && styles.footButtonTextActive
                    ]}>
                      Both
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Team Captain</Text>
                  <Switch
                    value={isCaptain}
                    onValueChange={setIsCaptain}
                    thumbColor={isCaptain ? '#1e3c72' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#4e6cb6' }}
                    ios_backgroundColor="#767577"
                  />
                </View>
                
                <Text style={styles.inputLabel}>Player Status</Text>
                <View style={styles.statusButtonsContainer}>
                  {['active', 'injured', 'suspended', 'loaned', 'transferred'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        playerStatus === status && {
                          backgroundColor: getStatusColor(status),
                          borderColor: getStatusColor(status)
                        }
                      ]}
                      onPress={() => setPlayerStatus(status)}
                    >
                      <Text style={[
                        styles.statusButtonText,
                        playerStatus === status && styles.statusButtonTextActive
                      ]}>
                        {getStatusLabel(status)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="image-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Player Photo</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.photoContainer}>
                  {localImage ? (
                    <Image source={{ uri: localImage.uri }} style={styles.photoPreview} />
                  ) : imgUrl ? (
                    <Image source={{ uri: imgUrl }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.emptyPhotoPlaceholder}>
                      <Ionicons name="person" size={50} color="#ccc" />
                      <Text style={styles.emptyPhotoText}>No photo selected</Text>
                    </View>
                  )}
                  
                  <View style={styles.photoActions}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Photo URL (or select image)" 
                      value={imgUrl} 
                      onChangeText={setImgUrl} 
                    />
                    
                    <TouchableOpacity 
                      style={styles.photoActionButton}
                      onPress={pickImage}
                    >
                      <Ionicons name="image" size={20} color="#fff" />
                      <Text style={styles.photoActionButtonText}>Select Photo</Text>
                    </TouchableOpacity>
                    
                    {(localImage || imgUrl) && (
                      <TouchableOpacity 
                        style={[styles.photoActionButton, styles.removePhotoButton]}
                        onPress={() => {
                          setLocalImage(null);
                          setImgUrl('');
                        }}
                      >
                        <Ionicons name="trash" size={20} color="#fff" />
                        <Text style={styles.photoActionButtonText}>Remove Photo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
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
                <Ionicons name="clipboard-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Contract Information</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Contract Start</Text>
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={() => setShowContractStartPicker(true)}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {formatDate(contractStart)}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#1e3c72" />
                    </TouchableOpacity>
                    
                    {showContractStartPicker && (
                      <DateTimePicker
                        value={contractStart}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowContractStartPicker(false);
                          if (selectedDate) {
                            setContractStart(selectedDate);
                          }
                        }}
                      />
                    )}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Contract End</Text>
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={() => setShowContractEndPicker(true)}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {formatDate(contractEnd)}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#1e3c72" />
                    </TouchableOpacity>
                    
                    {showContractEndPicker && (
                      <DateTimePicker
                        value={contractEnd}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowContractEndPicker(false);
                          if (selectedDate) {
                            setContractEnd(selectedDate);
                          }
                        }}
                      />
                    )}
                  </View>
                </View>
                {renderError('contractDates')}
                
                <Text style={styles.inputLabel}>Market Value (in thousands)</Text>
                <View style={styles.marketValueContainer}>
                  <TextInput 
                    style={[styles.input, styles.marketValueInput, validationErrors.marketValue && styles.inputError]} 
                    placeholder="Market value" 
                    value={marketValue} 
                    onChangeText={setMarketValue} 
                    keyboardType="numeric"
                  />
                  <View style={styles.currencyContainer}>
                    <Text style={styles.currencyText}>MRU</Text>
                  </View>
                </View>
                {renderError('marketValue')}
                
                <Text style={styles.inputLabel}>Contract Duration</Text>
                <View style={styles.contractDurationContainer}>
                  <Text style={styles.contractDurationText}>
                    {Math.ceil((contractEnd - contractStart) / (1000 * 60 * 60 * 24 * 365))} years
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="text-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Player Biography</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Player biography and career history..." 
                  multiline
                  textAlignVertical="top"
                  numberOfLines={8}
                  value={biography} 
                  onChangeText={setBiography} 
                />
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="share-social-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Social Media</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.socialMediaContainer}>
                  <View style={styles.socialMediaItem}>
                    <Ionicons name="logo-instagram" size={24} color="#e4405f" />
                    <TextInput 
                      style={[styles.input, styles.socialMediaInput, validationErrors.instagram && styles.inputError]} 
                      placeholder="Instagram handle (@username)" 
                      value={socialMedia.instagram} 
                      onChangeText={(value) => handleSocialMediaChange('instagram', value)} 
                    />
                  </View>
                  {renderError('instagram')}
                  
                  <View style={styles.socialMediaItem}>
                    <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
                    <TextInput 
                      style={[styles.input, styles.socialMediaInput, validationErrors.twitter && styles.inputError]} 
                      placeholder="Twitter handle (@username)" 
                      value={socialMedia.twitter} 
                      onChangeText={(value) => handleSocialMediaChange('twitter', value)} 
                    />
                  </View>
                  {renderError('twitter')}
                  
                  <View style={styles.socialMediaItem}>
                    <Ionicons name="logo-facebook" size={24} color="#1877f2" />
                    <TextInput 
                      style={[styles.input, styles.socialMediaInput]} 
                      placeholder="Facebook profile URL" 
                      value={socialMedia.facebook} 
                      onChangeText={(value) => handleSocialMediaChange('facebook', value)} 
                    />
                  </View>
                </View>
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
                <Text style={styles.formCardTitle}>Performance Statistics</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Appearances</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.appearances && styles.inputError]} 
                      placeholder="Total appearances" 
                      value={appearances} 
                      onChangeText={setAppearances} 
                      keyboardType="numeric"
                    />
                    {renderError('appearances')}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Minutes Played</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.minutesPlayed && styles.inputError]} 
                      placeholder="Total minutes" 
                      value={minutesPlayed} 
                      onChangeText={setMinutesPlayed} 
                      keyboardType="numeric"
                    />
                    {renderError('minutesPlayed')}
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Goals</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.goals && styles.inputError]} 
                      placeholder="Total goals" 
                      value={goals} 
                      onChangeText={setGoals} 
                      keyboardType="numeric"
                    />
                    {renderError('goals')}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Assists</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.assists && styles.inputError]} 
                      placeholder="Total assists" 
                      value={assists} 
                      onChangeText={setAssists} 
                      keyboardType="numeric"
                    />
                    {renderError('assists')}
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Yellow Cards</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.yellowCards && styles.inputError]} 
                      placeholder="Yellow cards" 
                      value={yellowCards} 
                      onChangeText={setYellowCards} 
                      keyboardType="numeric"
                    />
                    {renderError('yellowCards')}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Red Cards</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.redCards && styles.inputError]} 
                      placeholder="Red cards" 
                      value={redCards} 
                      onChangeText={setRedCards} 
                      keyboardType="numeric"
                    />
                    {renderError('redCards')}
                  </View>
                </View>
                
                {position.toLowerCase().includes('goalkeeper') && (
                  <View style={styles.rowContainer}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Clean Sheets</Text>
                      <TextInput 
                        style={[styles.input, validationErrors.cleanSheets && styles.inputError]} 
                        placeholder="Clean sheets" 
                        value={cleanSheets} 
                        onChangeText={setCleanSheets} 
                        keyboardType="numeric"
                      />
                      {renderError('cleanSheets')}
                    </View>
                  </View>
                )}
                
                <View style={styles.statsCalculations}>
                  {goals && appearances && parseInt(appearances) > 0 && (
                    <View style={styles.statCalculation}>
                      <Text style={styles.statCalculationLabel}>Goals per Game:</Text>
                      <Text style={styles.statCalculationValue}>
                        {(parseInt(goals) / parseInt(appearances)).toFixed(2)}
                      </Text>
                    </View>
                  )}
                  
                  {assists && appearances && parseInt(appearances) > 0 && (
                    <View style={styles.statCalculation}>
                      <Text style={styles.statCalculationLabel}>Assists per Game:</Text>
                      <Text style={styles.statCalculationValue}>
                        {(parseInt(assists) / parseInt(appearances)).toFixed(2)}
                      </Text>
                    </View>
                  )}
                  
                  {goals && assists && (
                    <View style={styles.statCalculation}>
                      <Text style={styles.statCalculationLabel}>Goal Contributions:</Text>
                      <Text style={styles.statCalculationValue}>
                        {parseInt(goals) + parseInt(assists)}
                      </Text>
                    </View>
                  )}
                  
                  {minutesPlayed && appearances && parseInt(appearances) > 0 && (
                    <View style={styles.statCalculation}>
                      <Text style={styles.statCalculationLabel}>Avg. Minutes per Game:</Text>
                      <Text style={styles.statCalculationValue}>
                        {Math.round(parseInt(minutesPlayed) / parseInt(appearances))}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Attributes Tab */}
        {activeTab === 'attributes' && (
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
                <Ionicons name="star-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Player Attributes</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <Text style={styles.attributesDescription}>
                  Rate the player's attributes on a scale from 1 to 10
                </Text>
                
                <View style={styles.attributesSection}>
                  <Text style={styles.attributesSectionTitle}>Physical Attributes</Text>
                  {renderAttributeSlider('Pace', attributes.pace, 'pace')}
                  {renderAttributeSlider('Physical', attributes.physical, 'physical')}
                </View>
                
                <View style={styles.attributesSection}>
                  <Text style={styles.attributesSectionTitle}>Technical Attributes</Text>
                  {renderAttributeSlider('Shooting', attributes.shooting, 'shooting')}
                  {renderAttributeSlider('Passing', attributes.passing, 'passing')}
                  {renderAttributeSlider('Dribbling', attributes.dribbling, 'dribbling')}
                  {renderAttributeSlider('Defending', attributes.defending, 'defending')}
                  {renderAttributeSlider('Technique', attributes.technique, 'technique')}
                </View>
                
                <View style={styles.attributesSection}>
                  <Text style={styles.attributesSectionTitle}>Mental Attributes</Text>
                  {renderAttributeSlider('Tactical', attributes.tactical, 'tactical')}
                  {renderAttributeSlider('Mental', attributes.mental, 'mental')}
                </View>
                
                <View style={styles.overallRatingContainer}>
                  <Text style={styles.overallRatingLabel}>Overall Rating</Text>
                  <View style={styles.overallRatingValueContainer}>
                    <Text style={styles.overallRatingValue}>
                      {Math.round(
                        (attributes.pace +
                        attributes.shooting +
                        attributes.passing +
                        attributes.dribbling +
                        attributes.defending +
                        attributes.physical +
                        attributes.technique +
                        attributes.tactical +
                        attributes.mental) / 9
                      )}
                    </Text>
                  </View>
                </View>
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
                <Ionicons name="images-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Player Gallery</Text>
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
                  {editingId ? 'Update Player' : 'Create Player'}
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
        
        {/* Players List Section */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Ionicons name="list-outline" size={24} color="#1e3c72" />
            <Text style={styles.listTitle}>Existing Players</Text>
            
            <View style={styles.listFilters}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search players..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
              </View>
              
              <View style={styles.filtersRow}>
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
                
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Position:</Text>
                  <View style={styles.filterPickerContainer}>
                    <Picker
                      selectedValue={filterPosition}
                      onValueChange={(value) => setFilterPosition(value)}
                      style={styles.filterPicker}
                    >
                      <Picker.Item label="All Positions" value="" />
                      {Object.entries(PLAYER_POSITIONS).map(([category, positions]) => (
                        <Picker.Item key={category} label={category} value={category} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          <CrudList
            ref={listRef}
            fetchFn={dataService.getPlayers}
            deleteFn={dataService.deletePlayer}
            filterFn={filterPlayers}
            onEdit={(item) => {
              // Set basic info
              setEditingId(item.id);
              setName(item.name || '');
              setPosition(item.position || '');
              setTeamId(item.team_id?.toString() || '');
              setImgUrl(item.photo_url || '');
              setLocalImage(null);
              
              // Set enhanced info
              setJerseyNumber(item.jersey_number?.toString() || '');
              if (item.date_of_birth) {
                setDateOfBirth(new Date(item.date_of_birth));
              }
              setHeight(item.height?.toString() || '');
              setWeight(item.weight?.toString() || '');
              setNationality(item.nationality || 'MR');
              setPreferredFoot(item.preferred_foot || 'right');
              if (item.contract_start) {
                setContractStart(new Date(item.contract_start));
              }
              if (item.contract_end) {
                setContractEnd(new Date(item.contract_end));
              }
              setMarketValue(item.market_value?.toString() || '');
              setBiography(item.biography || '');
              setPlayerStatus(item.status || 'active');
              setIsCaptain(item.is_captain || false);
              
              // Set stats
              setAppearances(item.appearances?.toString() || '');
              setGoals(item.goals?.toString() || '');
              setAssists(item.assists?.toString() || '');
              setYellowCards(item.yellow_cards?.toString() || '');
              setRedCards(item.red_cards?.toString() || '');
              setCleanSheets(item.clean_sheets?.toString() || '');
              setMinutesPlayed(item.minutes_played?.toString() || '');
              
              // Set attributes
              if (item.attributes) {
                try {
                  const parsedAttributes = JSON.parse(item.attributes);
                  setAttributes({
                    pace: parsedAttributes.pace || 5,
                    shooting: parsedAttributes.shooting || 5,
                    passing: parsedAttributes.passing || 5,
                    dribbling: parsedAttributes.dribbling || 5,
                    defending: parsedAttributes.defending || 5,
                    physical: parsedAttributes.physical || 5,
                    technique: parsedAttributes.technique || 5,
                    tactical: parsedAttributes.tactical || 5,
                    mental: parsedAttributes.mental || 5
                  });
                } catch (e) {
                  console.error('Error parsing attributes:', e);
                  setAttributes({
                    pace: 5,
                    shooting: 5,
                    passing: 5,
                    dribbling: 5,
                    defending: 5,
                    physical: 5,
                    technique: 5,
                    tactical: 5,
                    mental: 5
                  });
                }
              }
              
              // Set social media
              if (item.social_media) {
                try {
                  const parsedSocialMedia = JSON.parse(item.social_media);
                  setSocialMedia({
                    instagram: parsedSocialMedia.instagram || '',
                    twitter: parsedSocialMedia.twitter || '',
                    facebook: parsedSocialMedia.facebook || ''
                  });
                } catch (e) {
                  console.error('Error parsing social media:', e);
                  setSocialMedia({
                    instagram: '',
                    twitter: '',
                    facebook: ''
                  });
                }
              }
              
              // Set gallery
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
              <View style={styles.playerListItem}>
                {item.photo_url ? (
                  <Image source={{ uri: item.photo_url }} style={styles.playerListImage} />
                ) : (
                  <View style={styles.playerListImagePlaceholder}>
                    <Ionicons name="person" size={24} color="#1e3c72" />
                  </View>
                )}
                
                <View style={styles.playerListContent}>
                  <Text style={styles.playerListName}>{item.name}</Text>
                  <Text style={styles.playerListDetails}>
                    {item.position}
                    {item.jersey_number && ` • #${item.jersey_number}`}
                  </Text>
                  <View style={styles.playerListTeam}>
                    <Text style={styles.playerListTeamName}>
                      {getTeamById(item.team_id).name}
                    </Text>
                  </View>
                </View>
                
                <View style={[styles.playerListStatus, { backgroundColor: getStatusColor(item.status || 'active') }]}>
                  <Text style={styles.playerListStatusText}>
                    {getStatusLabel(item.status || 'active')}
                  </Text>
                </View>
              </View>
            )}
            extraActions={[
              {
                icon: 'copy-outline',
                color: '#2ecc71',
                action: duplicatePlayer,
                tooltip: 'Duplicate'
              }
            ]}
          />
        </View>
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
  countryPickerButton: {
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
  countryPickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  footButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  footButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  footButtonActive: {
    backgroundColor: '#1e3c72',
    borderColor: '#1e3c72',
  },
  footButtonText: {
    fontSize: 16,
    color: '#333',
  },
  footButtonTextActive: {
    color: '#fff',
  },
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
  marketValueContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  marketValueInput: {
    flex: 1,
    marginBottom: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  currencyContainer: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#e0e0e0',
  },
  currencyText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  contractDurationContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    alignItems: 'center',
  },
  contractDurationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  
  // Social Media Styles
  socialMediaContainer: {
    marginBottom: 15,
  },
  socialMediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  socialMediaInput: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 0,
  },
  
  // Stats Styles
  statsCalculations: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statCalculation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCalculationLabel: {
    fontSize: 14,
    color: '#555',
  },
  statCalculationValue: {
    fontSize: 14,
    color: '#1e3c72',
    fontWeight: 'bold',
  },
  
  // Attributes Styles
  attributesDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  attributesSection: {
    marginBottom: 20,
  },
  attributesSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  attributeContainer: {
    marginBottom: 15,
  },
  attributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  attributeLabel: {
    fontSize: 14,
    color: '#555',
  },
  attributeValue: {
    fontSize: 14,
    color: '#1e3c72',
    fontWeight: 'bold',
  },
  sliderContainer: {
    position: 'relative',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginTop: 5,
  },
  overallRatingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  overallRatingLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  overallRatingValueContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e3c72',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overallRatingValue: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Photo Styles
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emptyPhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPhotoText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  photoActions: {
    flex: 1,
  },
  photoActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  removePhotoButton: {
    backgroundColor: '#ff3b30',
  },
  photoActionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Gallery Styles
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
  
  // Player List Styles
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
  playerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playerListImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  playerListImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playerListContent: {
    flex: 1,
  },
  playerListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  playerListDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  playerListTeam: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  playerListTeamName: {
    fontSize: 12,
    color: '#1e3c72',
  },
  playerListStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
  },
  playerListStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});