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
  Switch,
  Modal,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import dataService from '../services/dataService';
import CrudList from '../components/admin/CrudList';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';

const { width } = Dimensions.get('window');

export default function AdminTeamCrudScreen() {
  // Basic team info
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [coach, setCoach] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [localImage, setLocalImage] = useState(null);
  
  // Enhanced team info
  const [foundingDate, setFoundingDate] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#1e3c72');
  const [secondaryColor, setSecondaryColor] = useState('#2a5298');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorToEdit, setColorToEdit] = useState('primary');
  const [stadium, setStadium] = useState('');
  const [division, setDivision] = useState('');
  const [teamStatus, setTeamStatus] = useState('active'); // active, inactive, disbanded
  const [website, setWebsite] = useState('');
  const [captain, setCaptain] = useState('');
  
  // Team statistics
  const [wins, setWins] = useState('');
  const [draws, setDraws] = useState('');
  const [losses, setLosses] = useState('');
  const [goalsScored, setGoalsScored] = useState('');
  const [goalsConceded, setGoalsConceded] = useState('');
  
  // Team description and achievements
  const [description, setDescription] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState('');
  const [newAchievementYear, setNewAchievementYear] = useState('');
  
  // Team staff
  const [staff, setStaff] = useState([]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  
  // Team media

  const [teamPhotos, setTeamPhotos] = useState([]);
  
  // Form state
  const [activeTab, setActiveTab] = useState('basic'); // basic, details, stats, media, staff
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [teamDivisions, setTeamDivisions] = useState([
    'Premier League', 'First Division', 'Second Division', 'Third Division', 'Youth League'
  ]);
  
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
  
  // Reset form state
  const resetForm = () => {
    // Basic info
    setEditingId(null);
    setName('');
    setCity('');
    setCoach('');
    setLogoUrl('');
    setLocalImage(null);
    
    // Enhanced info
    setFoundingDate(new Date(2000, 0, 1));
    setPrimaryColor('#1e3c72');
    setSecondaryColor('#2a5298');
    setStadium('');
    setDivision('');
    setTeamStatus('active');
    setWebsite('');
    setCaptain('');
    
    // Stats
    setWins('');
    setDraws('');
    setLosses('');
    setGoalsScored('');
    setGoalsConceded('');
    
    // Description and achievements
    setDescription('');
    setAchievements([]);
    
    // Staff
    setStaff([]);
    
    // Media
    setTeamPhotos([]);
    
    // Form state
    setActiveTab('basic');
    setValidationErrors({});
    
    // Reset scrolling
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };
  
  // Select team logo
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', "Gallery access denied");
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
      setLogoUrl('');
    }
  };
  

  
  // Add team photos
  const addTeamPhotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', "Gallery access denied");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    
    if (!result.canceled) {
      const newPhotos = result.assets.map(asset => ({
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        uri: asset.uri,
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
        uploaded: false
      }));
      
      setTeamPhotos([...teamPhotos, ...newPhotos]);
    }
  };
  
  // Remove photo from gallery
  const removePhoto = (id) => {
    setTeamPhotos(teamPhotos.filter(photo => photo.id !== id));
  };
  
  // Add new achievement
  const addAchievement = () => {
    if (newAchievement.trim() && newAchievementYear.trim()) {
      const achievement = {
        id: `achievement_${Date.now()}`,
        title: newAchievement.trim(),
        year: newAchievementYear.trim()
      };
      
      setAchievements([...achievements, achievement]);
      setNewAchievement('');
      setNewAchievementYear('');
      setShowAchievementModal(false);
    } else {
      Alert.alert('Validation Error', 'Title and year are required');
    }
  };
  
  // Remove achievement
  const removeAchievement = (id) => {
    setAchievements(achievements.filter(achievement => achievement.id !== id));
  };
  
  // Add new staff member
  const addStaffMember = () => {
    if (newStaffName.trim() && newStaffRole.trim()) {
      const staffMember = {
        id: `staff_${Date.now()}`,
        name: newStaffName.trim(),
        role: newStaffRole.trim()
      };
      
      setStaff([...staff, staffMember]);
      setNewStaffName('');
      setNewStaffRole('');
      setShowStaffModal(false);
    } else {
      Alert.alert('Validation Error', 'Name and role are required');
    }
  };
  
  // Remove staff member
  const removeStaffMember = (id) => {
    setStaff(staff.filter(member => member.id !== id));
  };
  
  // Import team data from file
  const importTeamData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });
      
      if (result.canceled) {
        return;
      }
      
      // Read file content
      const fileContent = await fetch(result.assets[0].uri).then(res => res.text());
      const teamData = JSON.parse(fileContent);
      
      // Populate form with imported data
      if (teamData) {
        setName(teamData.name || '');
        setCity(teamData.city || '');
        setCoach(teamData.coach || '');
        setLogoUrl(teamData.logo_url || '');
        setLocalImage(null);
        
        // Populate enhanced data if available
        if (teamData.founding_date) {
          setFoundingDate(new Date(teamData.founding_date));
        }
        setPrimaryColor(teamData.primary_color || '#1e3c72');
        setSecondaryColor(teamData.secondary_color || '#2a5298');
        setStadium(teamData.stadium || '');
        setDivision(teamData.division || '');
        setTeamStatus(teamData.status || 'active');
        setWebsite(teamData.website || '');
        setCaptain(teamData.captain || '');
        
        // Populate stats if available
        setWins(teamData.wins?.toString() || '');
        setDraws(teamData.draws?.toString() || '');
        setLosses(teamData.losses?.toString() || '');
        setGoalsScored(teamData.goals_scored?.toString() || '');
        setGoalsConceded(teamData.goals_conceded?.toString() || '');
        
        // Populate description and achievements if available
        setDescription(teamData.description || '');
        setAchievements(teamData.achievements || []);
        
        // Populate staff if available
        setStaff(teamData.staff || []);
        
        Alert.alert('Success', 'Team data imported successfully');
      }
    } catch (error) {
      console.error('Error importing team data:', error);
      Alert.alert('Error', 'Failed to import team data');
    }
  };
  
  // Export team data to file
  const exportTeamData = () => {
    if (!name) {
      Alert.alert('Error', 'Cannot export empty team data');
      return;
    }
    
    const teamData = {
      name,
      city,
      coach,
      logo_url: logoUrl,
      founding_date: foundingDate.toISOString(),
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      stadium,
      division,
      status: teamStatus,
      website,
      captain,
      wins: parseInt(wins) || 0,
      draws: parseInt(draws) || 0,
      losses: parseInt(losses) || 0,
      goals_scored: parseInt(goalsScored) || 0,
      goals_conceded: parseInt(goalsConceded) || 0,
      description,
      achievements,
      staff
    };
    
    // In a real app, we would generate a file and offer it for download
    Alert.alert(
      'Export Data',
      'In a production app, this would save the team data to a JSON file.',
      [
        { text: 'OK', onPress: () => console.log(JSON.stringify(teamData, null, 2)) }
      ]
    );
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = 'Team name is required';
    
    if (wins && isNaN(parseInt(wins))) errors.wins = 'Wins must be a number';
    if (draws && isNaN(parseInt(draws))) errors.draws = 'Draws must be a number';
    if (losses && isNaN(parseInt(losses))) errors.losses = 'Losses must be a number';
    if (goalsScored && isNaN(parseInt(goalsScored))) errors.goalsScored = 'Goals scored must be a number';
    if (goalsConceded && isNaN(parseInt(goalsConceded))) errors.goalsConceded = 'Goals conceded must be a number';
    
    if (website && !website.startsWith('http')) errors.website = 'Website must start with http:// or https://';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Upload logo if needed
      let finalLogoUrl = logoUrl;
      if (localImage) {
        setIsUploading(true);
        // Simulating upload - in a real app, replace with actual upload code
        // const fileObj = {
        //   uri: localImage.uri,
        //   name: localImage.fileName || `logo_${Date.now()}.jpg`,
        //   type: localImage.mimeType || 'image/jpeg',
        // };
        // const uploadRes = await dataService.uploadImage(fileObj);
        // finalLogoUrl = uploadRes.url;
        
        // For now, just use the local URI
        finalLogoUrl = localImage.uri;
        setIsUploading(false);
      }
      

      
      // Upload team photos if needed
      const uploadedPhotos = teamPhotos.map(photo => ({
        ...photo,
        uploaded: true,
        url: photo.uri
      }));
      
      // Prepare team data
      const teamData = {
        name,
        city,
        coach,
        logo_url: finalLogoUrl,
        founding_date: foundingDate.toISOString(),
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        stadium,
        division,
        team_status: teamStatus,
        website,
        captain,
        wins: parseInt(wins) || 0,
        draws: parseInt(draws) || 0,
        losses: parseInt(losses) || 0,
        goals_scored: parseInt(goalsScored) || 0,
        goals_conceded: parseInt(goalsConceded) || 0,
        description,
        achievements: JSON.stringify(achievements),
        staff: JSON.stringify(staff),
        team_photos: uploadedPhotos.length > 0 ? JSON.stringify(uploadedPhotos) : null
      };
      
      // Save or update team
      let result;
      if (editingId) {
        result = await dataService.updateTeam(editingId, teamData);
      } else {
        result = await dataService.createTeam(teamData);
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
      console.error('Error saving team:', err);
      Alert.alert('Error', 'Operation failed');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };
  
  // Duplicate team
  const duplicateTeam = async (item) => {
    try {
      // Create a copy of the item without ID
      const { id, created_at, updated_at, ...teamData } = item;
      
      // Modify name to indicate it's a copy
      teamData.name = `${teamData.name} (Copy)`;
      
      // Create new team
      const result = await dataService.createTeam(teamData);
      if (result.success) {
        Alert.alert('Success', result.message || 'Team duplicated successfully');
        // Reload list
        listRef.current?.reload();
      } else {
        Alert.alert('Error', result.message || 'Failed to duplicate team');
      }
    } catch (err) {
      console.error('Error duplicating team:', err);
      Alert.alert('Error', 'Failed to duplicate team');
    }
  };
  
  // Render tab button
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
  
  // Render error message
  const renderError = (field) => {
    if (validationErrors[field]) {
      return <Text style={styles.errorText}>{validationErrors[field]}</Text>;
    }
    return null;
  };
  
  return (
    <View style={{ flex: 1 }}>
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
          colors={[primaryColor, secondaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>
            {editingId ? 'تعديل الفريق' : 'إنشاء فريق جديد'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {editingId ? 'تعديل معلومات الفريق الحالي' : 'إضافة فريق جديد إلى النظام'}
          </Text>
        </LinearGradient>
        
        {/* Form Tabs */}
        <View style={styles.tabsContainer}>
          {renderTabButton('basic', 'Basic Info', 'information-circle-outline')}
          {renderTabButton('details', 'Details', 'document-text-outline')}
          {renderTabButton('stats', 'Statistics', 'stats-chart-outline')}
          {renderTabButton('media', 'Media', 'images-outline')}
          {renderTabButton('staff', 'Staff', 'people-outline')}
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
                <Text style={styles.formCardTitle}>Team Information</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <Text style={styles.inputLabel}>Team Name *</Text>
                <TextInput 
                  style={[styles.input, validationErrors.name && styles.inputError]} 
                  placeholder="Team name" 
                  value={name} 
                  onChangeText={setName} 
                />
                {renderError('name')}
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Team city" 
                      value={city} 
                      onChangeText={setCity} 
                    />
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Division/League</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={division}
                        onValueChange={(value) => setDivision(value)}
                      >
                        <Picker.Item label="Select division" value="" />
                        {teamDivisions.map((div, index) => (
                          <Picker.Item key={index} label={div} value={div} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Coach</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Team coach" 
                      value={coach} 
                      onChangeText={setCoach} 
                    />
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Team Captain</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Team captain" 
                      value={captain} 
                      onChangeText={setCaptain} 
                    />
                  </View>
                </View>
                
                <Text style={styles.inputLabel}>Founding Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {foundingDate.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#1e3c72" />
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={foundingDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setFoundingDate(selectedDate);
                      }
                    }}
                  />
                )}
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Stadium</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Home stadium" 
                      value={stadium} 
                      onChangeText={setStadium} 
                    />
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Website</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.website && styles.inputError]} 
                      placeholder="Team website" 
                      value={website} 
                      onChangeText={setWebsite} 
                    />
                    {renderError('website')}
                  </View>
                </View>
                
                <Text style={styles.inputLabel}>Team Status</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={teamStatus}
                    onValueChange={(value) => setTeamStatus(value)}
                  >
                    <Picker.Item label="Active" value="active" />
                    <Picker.Item label="Inactive" value="inactive" />
                    <Picker.Item label="Disbanded" value="disbanded" />
                  </Picker>
                </View>
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="color-palette-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Team Colors</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.colorPickerRow}>
                  <View style={styles.colorContainer}>
                    <Text style={styles.colorLabel}>Primary Color</Text>
                    <TouchableOpacity 
                      style={[styles.colorPreview, { backgroundColor: primaryColor }]}
                      onPress={() => {
                        setColorToEdit('primary');
                        setShowColorPicker(true);
                      }}
                    />
                  </View>
                  
                  <View style={styles.colorContainer}>
                    <Text style={styles.colorLabel}>Secondary Color</Text>
                    <TouchableOpacity 
                      style={[styles.colorPreview, { backgroundColor: secondaryColor }]}
                      onPress={() => {
                        setColorToEdit('secondary');
                        setShowColorPicker(true);
                      }}
                    />
                  </View>
                </View>
                
                <View style={styles.colorSample}>
                  <LinearGradient
                    colors={[primaryColor, secondaryColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.colorSampleGradient}
                  >
                    <Text style={styles.colorSampleText}>Team Colors Preview</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="image-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Team Logo</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.logoContainer}>
                  {localImage ? (
                    <Image source={{ uri: localImage.uri }} style={styles.logoPreview} />
                  ) : logoUrl ? (
                    <Image source={{ uri: logoUrl }} style={styles.logoPreview} />
                  ) : (
                    <View style={styles.emptyLogoPlaceholder}>
                      <Ionicons name="shield-outline" size={50} color="#ccc" />
                      <Text style={styles.emptyLogoText}>No logo selected</Text>
                    </View>
                  )}
                  
                  <View style={styles.logoActions}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Logo URL (or select image)" 
                      value={logoUrl} 
                      onChangeText={setLogoUrl} 
                    />
                    
                    <TouchableOpacity 
                      style={styles.logoActionButton}
                      onPress={pickImage}
                    >
                      <Ionicons name="image" size={20} color="#fff" />
                      <Text style={styles.logoActionButtonText}>Select Logo</Text>
                    </TouchableOpacity>
                    
                    {(localImage || logoUrl) && (
                      <TouchableOpacity 
                        style={[styles.logoActionButton, styles.removeLogoButton]}
                        onPress={() => {
                          setLocalImage(null);
                          setLogoUrl('');
                        }}
                      >
                        <Ionicons name="trash" size={20} color="#fff" />
                        <Text style={styles.logoActionButtonText}>Remove Logo</Text>
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
                <Ionicons name="document-text-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Team Description</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Team history and description..." 
                  multiline
                  textAlignVertical="top"
                  numberOfLines={8}
                  value={description} 
                  onChangeText={setDescription} 
                />
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="trophy-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Team Achievements</Text>
              </View>
              
              <View style={styles.formCardBody}>
                {achievements.length > 0 ? (
                  <View style={styles.achievementsList}>
                    {achievements.map((achievement) => (
                      <View key={achievement.id} style={styles.achievementItem}>
                        <View style={styles.achievementContent}>
                          <Text style={styles.achievementYear}>{achievement.year}</Text>
                          <Text style={styles.achievementTitle}>{achievement.title}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.removeAchievementButton}
                          onPress={() => removeAchievement(achievement.id)}
                        >
                          <Ionicons name="close-circle" size={24} color="#ff3b30" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="trophy" size={40} color="#ccc" />
                    <Text style={styles.emptyStateText}>No achievements added yet</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowAchievementModal(true)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add Achievement</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.importExportContainer}>
              <TouchableOpacity 
                style={styles.importButton}
                onPress={importTeamData}
              >
                <Ionicons name="download-outline" size={20} color="#1e3c72" />
                <Text style={styles.importButtonText}>Import Team Data</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.exportButton}
                onPress={exportTeamData}
              >
                <Ionicons name="share-outline" size={20} color="#fff" />
                <Text style={styles.exportButtonText}>Export Team Data</Text>
              </TouchableOpacity>
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
                <Text style={styles.formCardTitle}>Team Statistics</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Wins</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.wins && styles.inputError]} 
                      placeholder="Total wins" 
                      value={wins} 
                      onChangeText={setWins} 
                      keyboardType="numeric" 
                    />
                    {renderError('wins')}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Draws</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.draws && styles.inputError]} 
                      placeholder="Total draws" 
                      value={draws} 
                      onChangeText={setDraws} 
                      keyboardType="numeric" 
                    />
                    {renderError('draws')}
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Losses</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.losses && styles.inputError]} 
                      placeholder="Total losses" 
                      value={losses} 
                      onChangeText={setLosses} 
                      keyboardType="numeric" 
                    />
                    {renderError('losses')}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Points</Text>
                    <TextInput 
                      style={styles.input}
                      placeholder="Total points" 
                      value={wins && draws ? String(parseInt(wins) * 3 + parseInt(draws)) : ''}
                      editable={false}
                    />
                  </View>
                </View>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Goals Scored</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.goalsScored && styles.inputError]} 
                      placeholder="Goals scored" 
                      value={goalsScored} 
                      onChangeText={setGoalsScored} 
                      keyboardType="numeric" 
                    />
                    {renderError('goalsScored')}
                  </View>
                  
                  <View style={styles.column}>
                    <Text style={styles.inputLabel}>Goals Conceded</Text>
                    <TextInput 
                      style={[styles.input, validationErrors.goalsConceded && styles.inputError]} 
                      placeholder="Goals conceded" 
                      value={goalsConceded} 
                      onChangeText={setGoalsConceded} 
                      keyboardType="numeric" 
                    />
                    {renderError('goalsConceded')}
                  </View>
                </View>
                
                <View style={styles.statsSummary}>
                  <View style={styles.statSummaryItem}>
                    <Text style={styles.statSummaryLabel}>Total Matches</Text>
                    <Text style={styles.statSummaryValue}>
                      {wins && draws && losses 
                        ? String(parseInt(wins) + parseInt(draws) + parseInt(losses)) 
                        : '0'}
                    </Text>
                  </View>
                  
                  <View style={styles.statSummaryItem}>
                    <Text style={styles.statSummaryLabel}>Win Rate</Text>
                    <Text style={styles.statSummaryValue}>
                      {wins && (parseInt(wins) + parseInt(draws || 0) + parseInt(losses || 0)) > 0
                        ? `${Math.round((parseInt(wins) / (parseInt(wins) + parseInt(draws || 0) + parseInt(losses || 0))) * 100)}%`
                        : '0%'}
                    </Text>
                  </View>
                  
                  <View style={styles.statSummaryItem}>
                    <Text style={styles.statSummaryLabel}>Goal Difference</Text>
                    <Text style={styles.statSummaryValue}>
                      {goalsScored && goalsConceded
                        ? String(parseInt(goalsScored) - parseInt(goalsConceded))
                        : '0'}
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
                <Text style={styles.formCardTitle}>Team Photos</Text>
              </View>
              
              <View style={styles.formCardBody}>
                {teamPhotos.length > 0 ? (
                  <FlatList
                    data={teamPhotos}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.photoContainer}>
                        <Image source={{ uri: item.uri }} style={styles.photoPreview} />
                        <TouchableOpacity 
                          style={styles.removePhotoButton}
                          onPress={() => removePhoto(item.id)}
                        >
                          <Ionicons name="close-circle" size={24} color="#ff3b30" />
                        </TouchableOpacity>
                      </View>
                    )}
                    contentContainerStyle={styles.photosList}
                  />
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="images" size={40} color="#ccc" />
                    <Text style={styles.emptyStateText}>No team photos added yet</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={addTeamPhotos}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add Team Photos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Staff Tab */}
        {activeTab === 'staff' && (
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
                <Ionicons name="people-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Team Staff</Text>
              </View>
              
              <View style={styles.formCardBody}>
                {staff.length > 0 ? (
                  <View style={styles.staffList}>
                    {staff.map((member) => (
                      <View key={member.id} style={styles.staffItem}>
                        <View style={styles.staffContent}>
                          <Ionicons name="person" size={24} color="#1e3c72" />
                          <View style={styles.staffInfo}>
                            <Text style={styles.staffName}>{member.name}</Text>
                            <Text style={styles.staffRole}>{member.role}</Text>
                          </View>
                        </View>
                        <TouchableOpacity 
                          style={styles.removeStaffButton}
                          onPress={() => removeStaffMember(member.id)}
                        >
                          <Ionicons name="close-circle" size={24} color="#ff3b30" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="people" size={40} color="#ccc" />
                    <Text style={styles.emptyStateText}>No staff members added yet</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowStaffModal(true)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add Staff Member</Text>
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
            disabled={isLoading || isUploading}
          >
            {(isLoading || isUploading) ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name={editingId ? "save" : "add-circle"} size={20} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update Team' : 'Create Team'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {editingId && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={resetForm}
              disabled={isLoading || isUploading}
            >
              <Ionicons name="close-circle" size={20} color="#1e3c72" />
              <Text style={styles.cancelButtonText}>Cancel Editing</Text>
            </TouchableOpacity>
          )}
        </View>
        

        
        {/* Add Achievement Modal */}
        <Modal
          visible={showAchievementModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAchievementModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Achievement</Text>
              
              <Text style={styles.inputLabel}>Achievement Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Championship, Cup, Award..."
                value={newAchievement}
                onChangeText={setNewAchievement}
              />
              
              <Text style={styles.inputLabel}>Year</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="2023"
                value={newAchievementYear}
                onChangeText={setNewAchievementYear}
                keyboardType="numeric"
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowAchievementModal(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalAddButton}
                  onPress={addAchievement}
                >
                  <Text style={styles.modalAddButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Add Staff Modal */}
        <Modal
          visible={showStaffModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowStaffModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Staff Member</Text>
              
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Staff member name"
                value={newStaffName}
                onChangeText={setNewStaffName}
              />
              
              <Text style={styles.inputLabel}>Role</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Coach, Assistant, Physiotherapist..."
                value={newStaffRole}
                onChangeText={setNewStaffRole}
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowStaffModal(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalAddButton}
                  onPress={addStaffMember}
                >
                  <Text style={styles.modalAddButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Color Picker Modal */}
        <Modal
          visible={showColorPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowColorPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {colorToEdit === 'primary' ? 'Select Primary Color' : 'Select Secondary Color'}
              </Text>
              
              <ColorPicker
                color={colorToEdit === 'primary' ? primaryColor : secondaryColor}
                onColorChange={(color) => {
                  if (colorToEdit === 'primary') {
                    setPrimaryColor(color);
                  } else {
                    setSecondaryColor(color);
                  }
                }}
              />
              
              <TouchableOpacity
                style={styles.colorPickerDoneButton}
                onPress={() => setShowColorPicker(false)}
              >
                <Text style={styles.colorPickerDoneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      
      {/* Team List Section - Outside ScrollView to avoid VirtualizedList nesting */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Ionicons name="list-outline" size={24} color="#1e3c72" />
          <Text style={styles.listTitle}>Existing Teams</Text>
        </View>
        
        <CrudList
          ref={listRef}
          fetchFn={dataService.getTeams}
          deleteFn={dataService.deleteTeam}
          onEdit={(item) => {
            // Set basic info
            setEditingId(item.id);
            setName(item.name || '');
            setCity(item.city || '');
            setCoach(item.coach || '');
            setLogoUrl(item.logo_url || '');
            setLocalImage(null);
            
            // Set enhanced info if available
            if (item.founding_date) {
              setFoundingDate(new Date(item.founding_date));
            }
            setPrimaryColor(item.primary_color || '#1e3c72');
            setSecondaryColor(item.secondary_color || '#2a5298');
            setStadium(item.stadium || '');
            setDivision(item.division || '');
                          setTeamStatus(item.team_status || 'active');
            setWebsite(item.website || '');
            setCaptain(item.captain || '');
            
            // Set stats if available
            setWins(item.wins?.toString() || '');
            setDraws(item.draws?.toString() || '');
            setLosses(item.losses?.toString() || '');
            setGoalsScored(item.goals_scored?.toString() || '');
            setGoalsConceded(item.goals_conceded?.toString() || '');
            
            // Set description if available
            setDescription(item.description || '');
            
            // Set achievements if available
            if (item.achievements) {
              try {
                const parsedAchievements = JSON.parse(item.achievements);
                setAchievements(parsedAchievements || []);
              } catch (e) {
                console.error('Error parsing achievements:', e);
                setAchievements([]);
              }
            } else {
              setAchievements([]);
            }
            
            // Set staff if available
            if (item.staff) {
              try {
                const parsedStaff = JSON.parse(item.staff);
                setStaff(parsedStaff || []);
              } catch (e) {
                console.error('Error parsing staff:', e);
                setStaff([]);
              }
            } else {
              setStaff([]);
            }
            
            // Set media if available
            if (item.team_photos) {
              try {
                const parsedPhotos = JSON.parse(item.team_photos);
                setTeamPhotos(parsedPhotos || []);
              } catch (e) {
                console.error('Error parsing photos:', e);
                setTeamPhotos([]);
              }
            } else {
              setTeamPhotos([]);
            }
            
            // Reset form state
            setActiveTab('basic');
            setValidationErrors({});
            
            // Scroll to top
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
          }}
          renderItemFields={(item) => (
            <View style={styles.listItem}>
              {item.logo_url && (
                <Image source={{ uri: item.logo_url }} style={styles.listItemImage} />
              )}
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
                <Text style={styles.listItemSubtitle}>
                  {item.city && `${item.city}`}
                  {item.coach && ` • ${item.coach}`}
                </Text>
                {item.division && (
                  <View style={styles.listItemBadge}>
                    <Text style={styles.listItemBadgeText}>{item.division}</Text>
                  </View>
                )}
              </View>
              
                              <View style={[styles.statusIndicator, styles[`status_${item.team_status || 'active'}`]]} />
            </View>
          )}
          extraActions={[
            {
              icon: 'copy-outline',
              color: '#2ecc71',
              action: duplicateTeam,
              tooltip: 'Duplicate'
            }
          ]}
        />
      </View>
    </KeyboardAvoidingView>
  </View>
  );
}

// Note: This is a placeholder component since we don't have the actual ColorPicker implementation
const ColorPicker = ({ color, onColorChange }) => {
  const colors = [
    '#1e3c72', '#2a5298', '#e74c3c', '#2ecc71', '#f39c12', 
    '#9b59b6', '#16a085', '#c0392b', '#2980b9', '#f1c40f'
  ];
  
  return (
    <View style={colorPickerStyles.container}>
      <View style={colorPickerStyles.preview}>
        <View style={[colorPickerStyles.colorPreview, { backgroundColor: color }]} />
        <Text style={colorPickerStyles.colorHex}>{color}</Text>
      </View>
      
      <View style={colorPickerStyles.paletteContainer}>
        <Text style={colorPickerStyles.paletteTitle}>Suggested Colors:</Text>
        <View style={colorPickerStyles.palette}>
          {colors.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[colorPickerStyles.colorOption, { backgroundColor: c }]}
              onPress={() => onColorChange(c)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const colorPickerStyles = StyleSheet.create({
  container: {
    padding: 15,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorHex: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paletteContainer: {
    marginBottom: 20,
  },
  paletteTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  colorOption: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  content: { 
    paddingBottom: 20 
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
  
  // Logo Styles
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emptyLogoPlaceholder: {
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
  emptyLogoText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  logoActions: {
    flex: 1,
  },
  logoActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  removeLogoButton: {
    backgroundColor: '#ff3b30',
  },
  logoActionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Color Picker Styles
  colorPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colorContainer: {
    alignItems: 'center',
  },
  colorLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  colorSample: {
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
  },
  colorSampleGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSampleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  colorPickerDoneButton: {
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  colorPickerDoneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  

  
  // Photos Gallery Styles
  photosList: {
    paddingVertical: 10,
  },
  photoContainer: {
    marginRight: 15,
    position: 'relative',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  removePhotoButton: {
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
  
  // Stats Styles
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  statSummaryItem: {
    alignItems: 'center',
  },
  statSummaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statSummaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  
  // Achievement Styles
  achievementsList: {
    marginBottom: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  achievementContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementYear: {
    backgroundColor: '#1e3c72',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  achievementTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  removeAchievementButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Staff Styles
  staffList: {
    marginBottom: 15,
  },
  staffItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  staffContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffInfo: {
    marginLeft: 10,
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  staffRole: {
    fontSize: 14,
    color: '#666',
  },
  removeStaffButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Empty State Styles
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
  
  // Action Buttons
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
  importExportContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  importButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1e3c72',
  },
  importButtonText: {
    color: '#1e3c72',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
  },
  exportButtonText: {
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
  
  // Team List Styles
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  listItemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  listItemBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  listItemBadgeText: {
    fontSize: 12,
    color: '#1e3c72',
    fontWeight: '500',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  status_active: {
    backgroundColor: '#2ecc71',
  },
  status_inactive: {
    backgroundColor: '#f39c12',
  },
  status_disbanded: {
    backgroundColor: '#e74c3c',
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