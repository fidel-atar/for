import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Image,
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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import dataService from '../services/dataService';
import CrudList from '../components/admin/CrudList';
// HTML rendering removed - using Text component instead

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

// News status options
const NEWS_STATUS = [
  { id: 'published', label: 'Published', color: '#2ecc71' },
  { id: 'draft', label: 'Draft', color: '#f39c12' },
  { id: 'scheduled', label: 'Scheduled', color: '#3498db' },
  { id: 'archived', label: 'Archived', color: '#95a5a6' },
];

// News categories
const NEWS_CATEGORIES = [
  'Sports News',
  'Match Reports',
  'Team Updates',
  'Player Interviews',
  'Transfer News',
  'Club Announcements',
  'Fan Zone',
  'Press Releases',
  'Analysis'
];

export default function AdminNewsCrudScreen() {
  // Basic news info
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [localImage, setLocalImage] = useState(null);
  
  // Enhanced news info
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [status, setStatus] = useState('published');
  const [publishDate, setPublishDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreakingNews, setIsBreakingNews] = useState(false);
  
  // SEO settings
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  
  // Social media info
  const [socialMediaTitle, setSocialMediaTitle] = useState('');
  const [socialMediaDescription, setSocialMediaDescription] = useState('');
  
  // Related content
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [availableArticles, setAvailableArticles] = useState([]);
  const [showRelatedModal, setShowRelatedModal] = useState(false);
  
  // Gallery images
  const [gallery, setGallery] = useState([]);
  
  // Editor state
  const [isFormattingBold, setIsFormattingBold] = useState(false);
  const [isFormattingItalic, setIsFormattingItalic] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // basic, format, media, publishing, seo
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Refs
  const listRef = useRef();
  const scrollViewRef = useRef();
  const contentInputRef = useRef();
  
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
  
  // Load available articles for related content
  useEffect(() => {
    loadAvailableArticles();
  }, []);
  
  const loadAvailableArticles = async () => {
    try {
      const news = await dataService.getNews();
      if (news && Array.isArray(news)) {
        setAvailableArticles(news.filter(article => article.status === 'published'));
      }
    } catch (err) {
      console.error('Error loading available articles:', err);
    }
  };
  
  const resetForm = () => {
    // Reset basic info
    setEditingId(null);
    setTitle('');
    setContent('');
    setAuthor('');
    setCoverUrl('');
    setLocalImage(null);
    
    // Reset enhanced info
    setExcerpt('');
    setCategory('');
    setTags([]);
    setCurrentTag('');
    setStatus('published');
    setPublishDate(new Date());
    setIsFeatured(false);
    setIsBreakingNews(false);
    
    // Reset SEO settings
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    
    // Reset social media info
    setSocialMediaTitle('');
    setSocialMediaDescription('');
    
    // Reset related content
    setRelatedArticles([]);
    
    // Reset gallery
    setGallery([]);
    
    // Reset editor state
    setIsFormattingBold(false);
    setIsFormattingItalic(false);
    setIsPreviewMode(false);
    
    // Reset form state
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    
    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalImage(asset);
      setCoverUrl('');
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
  
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  const addRelatedArticle = (article) => {
    if (!relatedArticles.some(a => a.id === article.id)) {
      setRelatedArticles([...relatedArticles, article]);
    }
    setShowRelatedModal(false);
  };
  
  const removeRelatedArticle = (id) => {
    setRelatedArticles(relatedArticles.filter(article => article.id !== id));
  };
  
  const applyTextFormatting = (formatting) => {
    if (!contentInputRef.current) return;
    
    const selection = {
      start: contentInputRef.current._lastNativeSelection.start,
      end: contentInputRef.current._lastNativeSelection.end
    };
    
    if (selection.start === selection.end) {
      // No text selected, just toggle state for next typing
      if (formatting === 'bold') {
        setIsFormattingBold(!isFormattingBold);
      } else if (formatting === 'italic') {
        setIsFormattingItalic(!isFormattingItalic);
      }
      return;
    }
    
    const selectedText = content.substring(selection.start, selection.end);
    let newText;
    
    if (formatting === 'bold') {
      newText = content.substring(0, selection.start) + 
                `<strong>${selectedText}</strong>` + 
                content.substring(selection.end);
    } else if (formatting === 'italic') {
      newText = content.substring(0, selection.start) + 
                `<em>${selectedText}</em>` + 
                content.substring(selection.end);
    } else if (formatting === 'h2') {
      newText = content.substring(0, selection.start) + 
                `<h2>${selectedText}</h2>` + 
                content.substring(selection.end);
    } else if (formatting === 'h3') {
      newText = content.substring(0, selection.start) + 
                `<h3>${selectedText}</h3>` + 
                content.substring(selection.end);
    } else if (formatting === 'quote') {
      newText = content.substring(0, selection.start) + 
                `<blockquote>${selectedText}</blockquote>` + 
                content.substring(selection.end);
    } else if (formatting === 'link') {
      Alert.prompt(
        'Add Link',
        'Enter the URL',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: url => {
              if (url) {
                const linkText = content.substring(0, selection.start) + 
                                `<a href="${url}">${selectedText}</a>` + 
                                content.substring(selection.end);
                setContent(linkText);
              }
            }
          }
        ]
      );
      return;
    }
    
    setContent(newText);
  };
  
  const insertMediaInContent = (imageUrl) => {
    if (!contentInputRef.current) return;
    
    const selection = {
      start: contentInputRef.current._lastNativeSelection.start,
      end: contentInputRef.current._lastNativeSelection.end
    };
    
    const imageTag = `<img src="${imageUrl}" alt="Article image" style="width: 100%; height: auto; margin: 10px 0;" />`;
    
    const newText = content.substring(0, selection.start) + 
                   imageTag + 
                   content.substring(selection.end);
    
    setContent(newText);
  };
  
  const generateExcerpt = () => {
    // Strip HTML tags and create a short excerpt
    const strippedContent = content.replace(/<[^>]*>?/gm, '');
    const shortenedContent = strippedContent.substring(0, 150) + (strippedContent.length > 150 ? '...' : '');
    setExcerpt(shortenedContent);
  };
  
  const generateSeoInfo = () => {
    // Use title for SEO title if empty
    if (!seoTitle) {
      setSeoTitle(title);
    }
    
    // Use excerpt for SEO description if empty
    if (!seoDescription && excerpt) {
      setSeoDescription(excerpt);
    }
    
    // Generate keywords from tags if empty
    if (!seoKeywords && tags.length > 0) {
      setSeoKeywords(tags.join(', '));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!title.trim()) errors.title = 'Title is required';
    if (!content.trim()) errors.content = 'Content is required';
    
    if (status === 'scheduled') {
      const now = new Date();
      if (publishDate <= now) {
        errors.publishDate = 'Scheduled publish date must be in the future';
      }
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
      let finalCoverUrl = coverUrl;
      if (localImage) {
        // Simulating upload - in a real app, replace with actual upload code
        // For now, just use the local URI
        finalCoverUrl = localImage.uri;
      }
      
      // Upload gallery images if needed
      const uploadedGallery = gallery.map(photo => ({
        ...photo,
        uploaded: true,
        url: photo.uri
      }));
      
      // Prepare news data
      const newsData = {
        // Basic info
        title,
        content,
        author,
        image_url: finalCoverUrl,
        
        // Enhanced info
        excerpt: excerpt || (content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'),
        category,
        tags: tags.join(','),
        status,
        publish_date: publishDate.toISOString(),
        is_featured: isFeatured,
        is_breaking_news: isBreakingNews,
        
        // SEO settings
        seo_title: seoTitle || title,
        seo_description: seoDescription || excerpt,
        seo_keywords: seoKeywords,
        
        // Social media info
        social_title: socialMediaTitle || title,
        social_description: socialMediaDescription || excerpt,
        
        // Related content
        related_articles: relatedArticles.length > 0 ? JSON.stringify(relatedArticles.map(a => a.id)) : null,
        
        // Gallery
        gallery: uploadedGallery.length > 0 ? JSON.stringify(uploadedGallery) : null
      };
      
      // Save or update news
      if (editingId) {
        await dataService.updateNews(editingId, newsData);
        Alert.alert('Success', 'News article updated successfully');
      } else {
        await dataService.createNews(newsData);
        Alert.alert('Success', 'News article created successfully');
      }
      
      // Reset form and reload list
      resetForm();
      listRef.current?.reload();
      
    } catch (err) {
      console.error('Error saving news:', err);
      Alert.alert('Error', 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const duplicateNews = async (item) => {
    try {
      // Create a copy of the item without ID
      const { id, created_at, updated_at, ...newsData } = item;
      
      // Modify title to indicate it's a copy
      newsData.title = `${newsData.title} (Copy)`;
      
      // Create new news article
      await dataService.createNews(newsData);
      Alert.alert('Success', 'News article duplicated successfully');
      
      // Reload list
      listRef.current?.reload();
    } catch (err) {
      console.error('Error duplicating news:', err);
      Alert.alert('Error', 'Failed to duplicate news article');
    }
  };
  
  const getStatusColor = (statusId) => {
    const status = NEWS_STATUS.find(s => s.id === statusId);
    return status ? status.color : '#7f8c8d';
  };
  
  const getStatusLabel = (statusId) => {
    const status = NEWS_STATUS.find(s => s.id === statusId);
    return status ? status.label : 'Unknown';
  };
  
  const filterNews = (newsArticles) => {
    if (!newsArticles) return [];
    
    return newsArticles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === '' || 
        article.category === filterCategory;
      
      const matchesStatus = filterStatus === '' || 
        article.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
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
            {editingId ? 'Edit Article' : 'Create New Article'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {editingId ? 'Update article information' : 'Add a new article to the system'}
          </Text>
        </LinearGradient>
        
        {/* Form Tabs */}
        <View style={styles.tabsContainer}>
          {renderTabButton('basic', 'Content', 'document-text-outline')}
          {renderTabButton('format', 'Formatting', 'color-wand-outline')}
          {renderTabButton('media', 'Media', 'images-outline')}
          {renderTabButton('publishing', 'Publishing', 'calendar-outline')}
          {renderTabButton('seo', 'SEO', 'globe-outline')}
        </View>
        
        {/* Basic Content Tab */}
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
                <Ionicons name="newspaper-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Article Information</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <Text style={styles.inputLabel}>Article Title *</Text>
                <TextInput 
                  style={[styles.input, validationErrors.title && styles.inputError]} 
                  placeholder="Enter article title" 
                  value={title} 
                  onChangeText={setTitle} 
                />
                {renderError('title')}
                
                <Text style={styles.inputLabel}>Content *</Text>
                <View style={styles.contentPreviewToggle}>
                  <TouchableOpacity 
                    style={[
                      styles.previewToggleButton, 
                      !isPreviewMode && styles.previewToggleButtonActive
                    ]}
                    onPress={() => setIsPreviewMode(false)}
                  >
                    <Text style={[
                      styles.previewToggleButtonText,
                      !isPreviewMode && styles.previewToggleButtonTextActive
                    ]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.previewToggleButton, 
                      isPreviewMode && styles.previewToggleButtonActive
                    ]}
                    onPress={() => setIsPreviewMode(true)}
                  >
                    <Text style={[
                      styles.previewToggleButtonText,
                      isPreviewMode && styles.previewToggleButtonTextActive
                    ]}>
                      Preview
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {isPreviewMode ? (
                  <View style={styles.contentPreview}>
                    <Text style={styles.previewText}>
                      {content || 'No content to preview'}
                    </Text>
                  </View>
                ) : (
                  <TextInput 
                    ref={contentInputRef}
                    style={[styles.input, styles.textArea, validationErrors.content && styles.inputError]} 
                    placeholder="Enter article content..." 
                    multiline
                    textAlignVertical="top"
                    numberOfLines={10}
                    value={content} 
                    onChangeText={setContent} 
                  />
                )}
                {renderError('content')}
                
                <Text style={styles.inputLabel}>Author</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Article author" 
                  value={author} 
                  onChangeText={setAuthor} 
                />
                
                <Text style={styles.inputLabel}>Excerpt</Text>
                <TextInput 
                  style={[styles.input, styles.excerptArea]} 
                  placeholder="Brief summary of the article..." 
                  multiline
                  textAlignVertical="top"
                  numberOfLines={3}
                  value={excerpt} 
                  onChangeText={setExcerpt} 
                />
                
                <TouchableOpacity 
                  style={styles.generateButton}
                  onPress={generateExcerpt}
                >
                  <Ionicons name="flash-outline" size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Excerpt</Text>
                </TouchableOpacity>
                
                <View style={styles.rowContainer}>
                  <View style={[styles.column, { marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Category</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={category}
                        onValueChange={(value) => setCategory(value)}
                      >
                        <Picker.Item label="Select category" value="" />
                        {NEWS_CATEGORIES.map((cat, index) => (
                          <Picker.Item key={index} label={cat} value={cat} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.inputLabel}>Tags</Text>
                <View style={styles.tagInputContainer}>
                  <TextInput 
                    style={styles.tagInput} 
                    placeholder="Add tag" 
                    value={currentTag} 
                    onChangeText={setCurrentTag} 
                    onSubmitEditing={addTag}
                  />
                  <TouchableOpacity 
                    style={styles.addTagButton}
                    onPress={addTag}
                  >
                    <Ionicons name="add" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                {tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                      <View key={index} style={styles.tagChip}>
                        <Text style={styles.tagChipText}>{tag}</Text>
                        <TouchableOpacity 
                          onPress={() => removeTag(index)}
                          style={styles.removeTagButton}
                        >
                          <Ionicons name="close-circle" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Formatting Tab */}
        {activeTab === 'format' && (
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
                <Ionicons name="color-wand-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Text Formatting</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <Text style={styles.formattingInstructions}>
                  Select text in the content area, then use these buttons to apply formatting.
                </Text>
                
                <View style={styles.formattingToolbar}>
                  <TouchableOpacity 
                    style={[styles.formattingButton, isFormattingBold && styles.formattingButtonActive]} 
                    onPress={() => applyTextFormatting('bold')}
                  >
                    <Ionicons name="bold" size={20} color={isFormattingBold ? "#fff" : "#333"} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.formattingButton, isFormattingItalic && styles.formattingButtonActive]} 
                    onPress={() => applyTextFormatting('italic')}
                  >
                    <Ionicons name="italic" size={20} color={isFormattingItalic ? "#fff" : "#333"} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.formattingButton} 
                    onPress={() => applyTextFormatting('h2')}
                  >
                    <Text style={styles.headingButtonText}>H2</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.formattingButton} 
                    onPress={() => applyTextFormatting('h3')}
                  >
                    <Text style={styles.headingButtonText}>H3</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.formattingButton} 
                    onPress={() => applyTextFormatting('quote')}
                  >
                    <Ionicons name="quote" size={20} color="#333" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.formattingButton} 
                    onPress={() => applyTextFormatting('link')}
                  >
                    <Ionicons name="link" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.inputLabel}>Content</Text>
                <TextInput 
                  ref={contentInputRef}
                  style={[styles.input, styles.textArea]} 
                  placeholder="Enter article content..." 
                  multiline
                  textAlignVertical="top"
                  numberOfLines={20}
                  value={content} 
                  onChangeText={setContent} 
                />
                
                <Text style={styles.formattingPreviewTitle}>Preview</Text>
                <View style={styles.formattingPreviewContainer}>
                  <Text style={styles.previewText}>
                    {content || 'No content to preview'}
                  </Text>
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
                <Ionicons name="image-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Featured Image</Text>
              </View>
              
              <View style={styles.formCardBody}>
                {localImage ? (
                  <View style={styles.coverImageContainer}>
                    <Image source={{ uri: localImage.uri }} style={styles.coverImagePreview} />
                    <TouchableOpacity 
                      style={styles.removeCoverImageButton}
                      onPress={() => {
                        setLocalImage(null);
                        setCoverUrl('');
                      }}
                    >
                      <Ionicons name="close-circle" size={30} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                ) : coverUrl ? (
                  <View style={styles.coverImageContainer}>
                    <Image source={{ uri: coverUrl }} style={styles.coverImagePreview} />
                    <TouchableOpacity 
                      style={styles.removeCoverImageButton}
                      onPress={() => setCoverUrl('')}
                    >
                      <Ionicons name="close-circle" size={30} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.emptyCoverImagePlaceholder}>
                    <Ionicons name="image-outline" size={50} color="#ccc" />
                    <Text style={styles.emptyCoverImageText}>No featured image selected</Text>
                  </View>
                )}
                
                <Text style={styles.inputLabel}>Image URL</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Enter image URL or select below" 
                  value={coverUrl} 
                  onChangeText={setCoverUrl} 
                />
                
                <TouchableOpacity 
                  style={styles.coverImageActionButton}
                  onPress={pickImage}
                >
                  <Ionicons name="image" size={20} color="#fff" />
                  <Text style={styles.coverImageActionButtonText}>
                    {(localImage || coverUrl) ? 'Change Featured Image' : 'Select Featured Image'}
                  </Text>
                </TouchableOpacity>
                
                {(localImage || coverUrl) && (
                  <TouchableOpacity 
                    style={styles.insertIntoContentButton}
                    onPress={() => insertMediaInContent(localImage ? localImage.uri : coverUrl)}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.insertIntoContentButtonText}>Insert into Content</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="images-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Image Gallery</Text>
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
                        <TouchableOpacity 
                          style={styles.insertGalleryImageButton}
                          onPress={() => insertMediaInContent(item.uri)}
                        >
                          <Ionicons name="add-circle" size={24} color="#2ecc71" />
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
                  <Text style={styles.addGalleryButtonText}>Add Images</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="link-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Related Articles</Text>
              </View>
              
              <View style={styles.formCardBody}>
                {relatedArticles.length > 0 ? (
                  <View style={styles.relatedArticlesList}>
                    {relatedArticles.map((article) => (
                      <View key={article.id} style={styles.relatedArticleItem}>
                        {article.image_url && (
                          <Image source={{ uri: article.image_url }} style={styles.relatedArticleImage} />
                        )}
                        <View style={styles.relatedArticleContent}>
                          <Text style={styles.relatedArticleTitle} numberOfLines={2}>
                            {article.title}
                          </Text>
                          <Text style={styles.relatedArticleDate}>
                            {article.publish_date ? new Date(article.publish_date).toLocaleDateString() : 'No date'}
                          </Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.removeRelatedArticleButton}
                          onPress={() => removeRelatedArticle(article.id)}
                        >
                          <Ionicons name="close-circle" size={24} color="#ff3b30" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyRelatedContainer}>
                    <Ionicons name="newspaper" size={40} color="#ccc" />
                    <Text style={styles.emptyRelatedText}>No related articles added yet</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.addRelatedButton}
                  onPress={() => setShowRelatedModal(true)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addRelatedButtonText}>Add Related Article</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Publishing Tab */}
        {activeTab === 'publishing' && (
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
                <Ionicons name="calendar-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Publishing Settings</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <Text style={styles.inputLabel}>Publication Status</Text>
                <View style={styles.statusButtonsContainer}>
                  {NEWS_STATUS.map((statusItem) => (
                    <TouchableOpacity
                      key={statusItem.id}
                      style={[
                        styles.statusButton,
                        status === statusItem.id && {
                          backgroundColor: statusItem.color,
                          borderColor: statusItem.color
                        }
                      ]}
                      onPress={() => setStatus(statusItem.id)}
                    >
                      <Text style={[
                        styles.statusButtonText,
                        status === statusItem.id && styles.statusButtonTextActive
                      ]}>
                        {statusItem.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {status === 'scheduled' && (
                  <View style={styles.schedulingContainer}>
                    <Text style={styles.inputLabel}>Publish Date & Time</Text>
                    <View style={styles.dateTimeContainer}>
                      <TouchableOpacity 
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <Text style={styles.datePickerButtonText}>
                          {publishDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color="#1e3c72" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.timePickerButton}
                        onPress={() => setShowTimePicker(true)}
                      >
                        <Text style={styles.timePickerButtonText}>
                          {publishDate.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                        <Ionicons name="time-outline" size={20} color="#1e3c72" />
                      </TouchableOpacity>
                    </View>
                    
                    {showDatePicker && (
                      <DateTimePicker
                        value={publishDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            const newDate = new Date(selectedDate);
                            // Preserve the time from the existing publishDate
                            newDate.setHours(
                              publishDate.getHours(),
                              publishDate.getMinutes(),
                              publishDate.getSeconds()
                            );
                            setPublishDate(newDate);
                          }
                        }}
                      />
                    )}
                    
                    {showTimePicker && (
                      <DateTimePicker
                        value={publishDate}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          setShowTimePicker(false);
                          if (selectedTime) {
                            const newDate = new Date(publishDate);
                            newDate.setHours(
                              selectedTime.getHours(),
                              selectedTime.getMinutes(),
                              selectedTime.getSeconds()
                            );
                            setPublishDate(newDate);
                          }
                        }}
                      />
                    )}
                    
                    {renderError('publishDate')}
                  </View>
                )}
                
                <View style={styles.featuredSwitchContainer}>
                  <View style={styles.switchContainerLeft}>
                    <Ionicons name="star" size={24} color="#f39c12" />
                    <Text style={styles.switchLabel}>Featured Article</Text>
                  </View>
                  <Switch
                    value={isFeatured}
                    onValueChange={setIsFeatured}
                    thumbColor={isFeatured ? '#1e3c72' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#4e6cb6' }}
                    ios_backgroundColor="#767577"
                  />
                </View>
                
                <View style={styles.featuredSwitchContainer}>
                  <View style={styles.switchContainerLeft}>
                    <Ionicons name="flash" size={24} color="#e74c3c" />
                    <Text style={styles.switchLabel}>Breaking News</Text>
                  </View>
                  <Switch
                    value={isBreakingNews}
                    onValueChange={setIsBreakingNews}
                    thumbColor={isBreakingNews ? '#1e3c72' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#4e6cb6' }}
                    ios_backgroundColor="#767577"
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* SEO Tab */}
        {activeTab === 'seo' && (
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
                <Ionicons name="globe-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>SEO Settings</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <TouchableOpacity 
                  style={styles.generateSeoButton}
                  onPress={generateSeoInfo}
                >
                  <Ionicons name="flash-outline" size={20} color="#fff" />
                  <Text style={styles.generateSeoButtonText}>Auto-Generate SEO Info</Text>
                </TouchableOpacity>
                
                <Text style={styles.inputLabel}>SEO Title</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Title for search engines (defaults to article title)" 
                  value={seoTitle} 
                  onChangeText={setSeoTitle} 
                />
                <Text style={styles.seoCountText}>
                  {seoTitle.length} / 60 characters
                </Text>
                
                <Text style={styles.inputLabel}>Meta Description</Text>
                <TextInput 
                  style={[styles.input, styles.metaDescriptionArea]} 
                  placeholder="Brief description for search results..." 
                  multiline
                  textAlignVertical="top"
                  numberOfLines={3}
                  value={seoDescription} 
                  onChangeText={setSeoDescription} 
                />
                <Text style={styles.seoCountText}>
                  {seoDescription.length} / 160 characters
                </Text>
                
                <Text style={styles.inputLabel}>Meta Keywords</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Keywords, comma separated" 
                  value={seoKeywords} 
                  onChangeText={setSeoKeywords} 
                />
                
                <View style={styles.seoPreview}>
                  <Text style={styles.seoPreviewTitle}>Search Result Preview</Text>
                  <View style={styles.searchResultPreview}>
                    <Text style={styles.searchResultTitle} numberOfLines={1}>
                      {seoTitle || title || 'Article Title'}
                    </Text>
                    <Text style={styles.searchResultUrl} numberOfLines={1}>
                      https://yourdomain.com/news/{(title || 'article-title').toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    </Text>
                    <Text style={styles.searchResultDescription} numberOfLines={2}>
                      {seoDescription || excerpt || 'Article description will appear here...'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Ionicons name="share-social-outline" size={24} color="#1e3c72" />
                <Text style={styles.formCardTitle}>Social Media Settings</Text>
              </View>
              
              <View style={styles.formCardBody}>
                <Text style={styles.inputLabel}>Social Media Title</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Title for social media sharing (defaults to article title)" 
                  value={socialMediaTitle} 
                  onChangeText={setSocialMediaTitle} 
                />
                
                <Text style={styles.inputLabel}>Social Media Description</Text>
                <TextInput 
                  style={[styles.input, styles.metaDescriptionArea]} 
                  placeholder="Description for social media sharing..." 
                  multiline
                  textAlignVertical="top"
                  numberOfLines={3}
                  value={socialMediaDescription} 
                  onChangeText={setSocialMediaDescription} 
                />
                
                <View style={styles.socialPreview}>
                  <Text style={styles.socialPreviewTitle}>Social Media Preview</Text>
                  <View style={styles.socialCardPreview}>
                    {(localImage || coverUrl) && (
                      <Image 
                        source={{ uri: localImage ? localImage.uri : coverUrl }} 
                        style={styles.socialCardImage} 
                      />
                    )}
                    <View style={styles.socialCardContent}>
                      <Text style={styles.socialCardTitle} numberOfLines={2}>
                        {socialMediaTitle || title || 'Article Title'}
                      </Text>
                      <Text style={styles.socialCardDescription} numberOfLines={3}>
                        {socialMediaDescription || excerpt || 'Article description will appear here...'}
                      </Text>
                      <Text style={styles.socialCardUrl}>
                        yourdomain.com
                      </Text>
                    </View>
                  </View>
                </View>
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
                  {editingId ? 'Update Article' : 'Publish Article'}
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
        
        {/* News List Section */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Ionicons name="list-outline" size={24} color="#1e3c72" />
            <Text style={styles.listTitle}>Existing Articles</Text>
            
            <View style={styles.listFilters}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
              </View>
              
              <View style={styles.filtersRow}>
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Category:</Text>
                  <View style={styles.filterPickerContainer}>
                    <Picker
                      selectedValue={filterCategory}
                      onValueChange={(value) => setFilterCategory(value)}
                      style={styles.filterPicker}
                    >
                      <Picker.Item label="All Categories" value="" />
                      {NEWS_CATEGORIES.map((cat, index) => (
                        <Picker.Item key={index} label={cat} value={cat} />
                      ))}
                    </Picker>
                  </View>
                </View>
                
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Status:</Text>
                  <View style={styles.filterPickerContainer}>
                    <Picker
                      selectedValue={filterStatus}
                      onValueChange={(value) => setFilterStatus(value)}
                      style={styles.filterPicker}
                    >
                      <Picker.Item label="All Statuses" value="" />
                      {NEWS_STATUS.map((statusItem) => (
                        <Picker.Item key={statusItem.id} label={statusItem.label} value={statusItem.id} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          <CrudList
            ref={listRef}
            fetchFn={dataService.getNews}
            deleteFn={dataService.deleteNews}
            filterFn={filterNews}
            onEdit={(item) => {
              // Set basic info
              setEditingId(item.id);
              setTitle(item.title || '');
              setContent(item.content || '');
              setAuthor(item.author || '');
              setCoverUrl(item.image_url || '');
              setLocalImage(null);
              
              // Set enhanced info
              setExcerpt(item.excerpt || '');
              setCategory(item.category || '');
              setTags(item.tags ? item.tags.split(',').filter(t => t.trim()) : []);
              setStatus(item.status || 'published');
              if (item.publish_date) {
                setPublishDate(new Date(item.publish_date));
              }
              setIsFeatured(item.is_featured || false);
              setIsBreakingNews(item.is_breaking_news || false);
              
              // Set SEO settings
              setSeoTitle(item.seo_title || '');
              setSeoDescription(item.seo_description || '');
              setSeoKeywords(item.seo_keywords || '');
              
              // Set social media info
              setSocialMediaTitle(item.social_title || '');
              setSocialMediaDescription(item.social_description || '');
              
              // Set related articles
              if (item.related_articles) {
                try {
                  const relatedIds = JSON.parse(item.related_articles);
                  const related = availableArticles.filter(a => relatedIds.includes(a.id));
                  setRelatedArticles(related || []);
                } catch (e) {
                  console.error('Error parsing related articles:', e);
                  setRelatedArticles([]);
                }
              } else {
                setRelatedArticles([]);
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
              <View style={styles.newsListItem}>
                {item.image_url && (
                  <Image source={{ uri: item.image_url }} style={styles.newsListImage} />
                )}
                <View style={styles.newsListContent}>
                  <View style={styles.newsListHeader}>
                    <Text style={styles.newsListTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={[
                      styles.newsListStatus, 
                      { backgroundColor: getStatusColor(item.status || 'published') }
                    ]}>
                      <Text style={styles.newsListStatusText}>
                        {getStatusLabel(item.status || 'published')}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.newsListExcerpt} numberOfLines={2}>
                    {item.excerpt || (item.content && item.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...') || 'No excerpt available'}
                  </Text>
                  
                  <View style={styles.newsListMeta}>
                    <Text style={styles.newsListAuthor}>
                      {item.author ? `By ${item.author}` : 'No author'}
                    </Text>
                    <Text style={styles.newsListDate}>
                      {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : 'No date'}
                    </Text>
                  </View>
                  
                  {item.category && (
                    <View style={styles.newsListCategoryContainer}>
                      <Text style={styles.newsListCategory}>{item.category}</Text>
                    </View>
                  )}
                  
                  {item.is_featured && (
                    <View style={styles.newsListFeaturedBadge}>
                      <Ionicons name="star" size={12} color="#fff" />
                      <Text style={styles.newsListFeaturedText}>Featured</Text>
                    </View>
                  )}
                  
                  {item.is_breaking_news && (
                    <View style={styles.newsListBreakingBadge}>
                      <Ionicons name="flash" size={12} color="#fff" />
                      <Text style={styles.newsListBreakingText}>Breaking</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            extraActions={[
              {
                icon: 'copy-outline',
                color: '#2ecc71',
                action: duplicateNews,
                tooltip: 'Duplicate'
              }
            ]}
          />
        </View>
        
        {/* Related Articles Modal */}
        <Modal
          visible={showRelatedModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRelatedModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Related Article</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowRelatedModal(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalSearchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.modalSearchIcon} />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search articles..."
                  onChangeText={(text) => setSearchTerm(text)}
                />
              </View>
              
              <FlatList
                data={availableArticles.filter(a => 
                  a.id !== editingId && 
                  !relatedArticles.some(r => r.id === a.id) &&
                  (searchTerm === '' || a.title.toLowerCase().includes(searchTerm.toLowerCase()))
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.relatedArticleOption}
                    onPress={() => addRelatedArticle(item)}
                  >
                    {item.image_url && (
                      <Image source={{ uri: item.image_url }} style={styles.relatedArticleOptionImage} />
                    )}
                    <View style={styles.relatedArticleOptionContent}>
                      <Text style={styles.relatedArticleOptionTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.relatedArticleOptionDate}>
                        {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : 'No date'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.relatedArticlesList}
                ListEmptyComponent={
                  <View style={styles.emptyRelatedListContainer}>
                    <Text style={styles.emptyRelatedListText}>No articles available</Text>
                  </View>
                }
              />
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
    height: 200,
    textAlignVertical: 'top',
  },
  excerptArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  metaDescriptionArea: {
    height: 100,
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
  
  // Content Preview Toggle
  contentPreviewToggle: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  previewToggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewToggleButtonActive: {
    backgroundColor: '#1e3c72',
  },
  previewToggleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  previewToggleButtonTextActive: {
    color: '#fff',
  },
  contentPreview: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    minHeight: 200,
  },
  
  // Generate Button
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Tags Styles
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  addTagButton: {
    backgroundColor: '#1e3c72',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Formatting Styles
  formattingInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  formattingToolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  formattingButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formattingButtonActive: {
    backgroundColor: '#1e3c72',
  },
  headingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  formattingPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  formattingPreviewContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
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
    marginBottom: 10,
  },
  coverImageActionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  insertIntoContentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 10,
  },
  insertIntoContentButtonText: {
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
  insertGalleryImageButton: {
    position: 'absolute',
    bottom: -10,
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
  
  // Related Articles Styles
  relatedArticlesList: {
    marginBottom: 15,
  },
  relatedArticleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  relatedArticleImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  relatedArticleContent: {
    flex: 1,
  },
  relatedArticleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  relatedArticleDate: {
    fontSize: 12,
    color: '#666',
  },
  removeRelatedArticleButton: {
    marginLeft: 10,
  },
  emptyRelatedContainer: {
    height: 120,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyRelatedText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  addRelatedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
  },
  addRelatedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Publishing Styles
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
  schedulingContainer: {
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  timePickerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  featuredSwitchContainer: {
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
  switchContainerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  
  // SEO Styles
  generateSeoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  generateSeoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  seoCountText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: -10,
    marginBottom: 15,
  },
  seoPreview: {
    marginTop: 15,
  },
  seoPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  searchResultPreview: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a0dab',
    marginBottom: 5,
  },
  searchResultUrl: {
    fontSize: 14,
    color: '#006621',
    marginBottom: 5,
  },
  searchResultDescription: {
    fontSize: 14,
    color: '#545454',
  },
  socialPreview: {
    marginTop: 15,
  },
  socialPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  socialCardPreview: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialCardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  socialCardContent: {
    padding: 15,
  },
  socialCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  socialCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  socialCardUrl: {
    fontSize: 12,
    color: '#999',
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
  
  // News List Styles
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
  newsListItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  newsListImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  newsListContent: {
    flex: 1,
  },
  newsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  newsListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  newsListStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 5,
  },
  newsListStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  newsListExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  newsListMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  newsListAuthor: {
    fontSize: 12,
    color: '#1e3c72',
  },
  newsListDate: {
    fontSize: 12,
    color: '#999',
  },
  newsListCategoryContainer: {
    alignSelf: 'flex-start',
  },
  newsListCategory: {
    fontSize: 12,
    color: '#1e3c72',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newsListFeaturedBadge: {
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
  newsListFeaturedText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  newsListBreakingBadge: {
    position: 'absolute',
    top: 45,
    right: 15,
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  newsListBreakingText: {
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
    maxWidth: 500,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalSearchIcon: {
    marginRight: 10,
  },
  modalSearchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  relatedArticleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  relatedArticleOptionImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  relatedArticleOptionContent: {
    flex: 1,
  },
  relatedArticleOptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  relatedArticleOptionDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyRelatedListContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRelatedListText: {
    fontSize: 14,
    color: '#999',
  },
  previewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});