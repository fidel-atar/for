import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Picker,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { dataService } from '../services';

const AdminNewsCrudScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    author: '',
    tags: [],
    cover_image: null,
    gallery_images: [],
    meta_title: '',
    meta_description: '',
    status: 'draft',
    featured: false,
    allow_comments: true,
  });
  
  const [errors, setErrors] = useState({});
  const [currentTag, setCurrentTag] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [newsData, categoriesData] = await Promise.all([
        dataService.getNews(),
        dataService.getCategories()
      ]);
      setNews(newsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const newsData = {
        ...formData,
        tags: JSON.stringify(formData.tags),
        gallery_images: JSON.stringify(formData.gallery_images),
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      };
      
      if (editingId) {
        await dataService.updateNews(editingId, newsData);
        Alert.alert('Success', 'News updated successfully');
      } else {
        await dataService.createNews(newsData);
        Alert.alert('Success', 'News created successfully');
      }
      
      resetForm();
      loadData();
      setActiveTab('list');
    } catch (error) {
      console.error('Error saving news:', error);
      Alert.alert('Error', 'Failed to save news');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      tags: typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : item.tags || [],
      gallery_images: typeof item.gallery_images === 'string' ? JSON.parse(item.gallery_images || '[]') : item.gallery_images || [],
    });
    setEditingId(item.id);
    setActiveTab('create');
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this news item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await dataService.deleteNews(id);
              Alert.alert('Success', 'News deleted successfully');
              loadData();
            } catch (error) {
              console.error('Error deleting news:', error);
              Alert.alert('Error', 'Failed to delete news');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category_id: '',
      author: '',
      tags: [],
      cover_image: null,
      gallery_images: [],
      meta_title: '',
      meta_description: '',
      status: 'draft',
      featured: false,
      allow_comments: true,
    });
    setErrors({});
    setEditingId(null);
    setCurrentTag('');
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        cover_image: result.assets[0].uri
      });
    }
  };

  const addGalleryImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        gallery_images: [...formData.gallery_images, result.assets[0].uri]
      });
    }
  };

  const removeGalleryImage = (index) => {
    const newGalleryImages = [...formData.gallery_images];
    newGalleryImages.splice(index, 1);
    setFormData({
      ...formData,
      gallery_images: newGalleryImages
    });
  };

  const generateExcerpt = () => {
    if (formData.content) {
      const plainText = formData.content.replace(/<[^>]*>/g, '');
      const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
      setFormData({ ...formData, excerpt });
    }
  };

  const generateMetaDescription = () => {
    if (formData.content) {
      const plainText = formData.content.replace(/<[^>]*>/g, '');
      const metaDescription = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
      setFormData({ ...formData, meta_description: metaDescription });
    }
  };

  const renderTabButton = (tabKey, title, icon) => (
    <TouchableOpacity
      key={tabKey}
      style={[styles.tabButton, activeTab === tabKey && styles.activeTabButton]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Icon name={icon} size={16} color={activeTab === tabKey ? '#fff' : '#1e3c72'} />
      <Text style={[styles.tabButtonText, activeTab === tabKey && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderCreateForm = () => (
    <ScrollView style={styles.tabContent}>
      {/* Basic Information */}
      <View style={styles.formCard}>
        <View style={styles.formCardHeader}>
          <Icon name="article" size={24} color="#1e3c72" />
          <Text style={styles.formCardTitle}>Basic Information</Text>
        </View>
        <View style={styles.formCardBody}>
          <Text style={styles.inputLabel}>Title *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Enter news title"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          <Text style={styles.inputLabel}>Author *</Text>
          <TextInput
            style={[styles.input, errors.author && styles.inputError]}
            value={formData.author}
            onChangeText={(text) => setFormData({ ...formData, author: text })}
            placeholder="Enter author name"
          />
          {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}

          <View style={styles.rowContainer}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <Picker.Item label="Select Category" value="" />
                  {categories.map((category) => (
                    <Picker.Item key={category.id} label={category.name} value={category.id} />
                  ))}
                </Picker>
              </View>
              {errors.category_id && <Text style={styles.errorText}>{errors.category_id}</Text>}
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <Picker.Item label="Draft" value="draft" />
                  <Picker.Item label="Published" value="published" />
                  <Picker.Item label="Archived" value="archived" />
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.formCard}>
        <View style={styles.formCardHeader}>
          <Icon name="edit" size={24} color="#1e3c72" />
          <Text style={styles.formCardTitle}>Content</Text>
        </View>
        <View style={styles.formCardBody}>
          <View style={styles.contentPreviewToggle}>
            <TouchableOpacity
              style={[styles.previewToggleButton, !showPreview && styles.previewToggleButtonActive]}
              onPress={() => setShowPreview(false)}
            >
              <Text style={[styles.previewToggleButtonText, !showPreview && styles.previewToggleButtonTextActive]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.previewToggleButton, showPreview && styles.previewToggleButtonActive]}
              onPress={() => setShowPreview(true)}
            >
              <Text style={[styles.previewToggleButtonText, showPreview && styles.previewToggleButtonTextActive]}>
                Preview
              </Text>
            </TouchableOpacity>
          </View>

          {!showPreview ? (
            <>
              <Text style={styles.formattingInstructions}>
                Use markdown formatting: **bold**, *italic*, # Heading, [link](url)
              </Text>
              <Text style={styles.inputLabel}>Content *</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.content && styles.inputError]}
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                placeholder="Enter news content (supports markdown)"
                multiline
                textAlignVertical="top"
              />
              {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
            </>
          ) : (
            <View style={styles.contentPreview}>
              <Text style={styles.formattingPreviewTitle}>Content Preview</Text>
              <Text>{formData.content || 'No content to preview'}</Text>
            </View>
          )}

          <Text style={styles.inputLabel}>Excerpt</Text>
          <TextInput
            style={[styles.input, styles.excerptArea]}
            value={formData.excerpt}
            onChangeText={(text) => setFormData({ ...formData, excerpt: text })}
            placeholder="Enter excerpt or generate from content"
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.generateButton} onPress={generateExcerpt}>
            <Icon name="auto-fix-high" size={16} color="#fff" />
            <Text style={styles.generateButtonText}>Generate from Content</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.formCard}>
        <View style={styles.formCardHeader}>
          <Icon name="local-offer" size={24} color="#1e3c72" />
          <Text style={styles.formCardTitle}>Tags</Text>
        </View>
        <View style={styles.formCardBody}>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              value={currentTag}
              onChangeText={setCurrentTag}
              placeholder="Enter tag"
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
              <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <View key={index} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
                <TouchableOpacity
                  style={styles.removeTagButton}
                  onPress={() => removeTag(tag)}
                >
                  <Icon name="close" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Media */}
      <View style={styles.formCard}>
        <View style={styles.formCardHeader}>
          <Icon name="image" size={24} color="#1e3c72" />
          <Text style={styles.formCardTitle}>Media</Text>
        </View>
        <View style={styles.formCardBody}>
          <Text style={styles.inputLabel}>Cover Image</Text>
          {formData.cover_image ? (
            <View style={styles.coverImageContainer}>
              <Image source={{ uri: formData.cover_image }} style={styles.coverImagePreview} />
              <TouchableOpacity
                style={styles.removeCoverImageButton}
                onPress={() => setFormData({ ...formData, cover_image: null })}
              >
                <Icon name="close" size={16} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCoverImagePlaceholder}>
              <Icon name="image" size={48} color="#ccc" />
              <Text style={styles.emptyCoverImageText}>No cover image selected</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.coverImageActionButton} onPress={pickCoverImage}>
            <Icon name="photo-library" size={16} color="#fff" />
            <Text style={styles.coverImageActionButtonText}>
              {formData.cover_image ? 'Change Cover Image' : 'Select Cover Image'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Gallery Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {formData.gallery_images.map((image, index) => (
              <View key={index} style={styles.galleryItemContainer}>
                <Image source={{ uri: image }} style={styles.galleryImage} />
                <TouchableOpacity
                  style={styles.removeGalleryImageButton}
                  onPress={() => removeGalleryImage(index)}
                >
                  <Icon name="close" size={12} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.insertIntoContentButton} onPress={addGalleryImage}>
            <Icon name="add-photo-alternate" size={16} color="#fff" />
            <Text style={styles.insertIntoContentButtonText}>Add Gallery Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEO */}
      <View style={styles.formCard}>
        <View style={styles.formCardHeader}>
          <Icon name="search" size={24} color="#1e3c72" />
          <Text style={styles.formCardTitle}>SEO Settings</Text>
        </View>
        <View style={styles.formCardBody}>
          <Text style={styles.inputLabel}>Meta Title</Text>
          <TextInput
            style={styles.input}
            value={formData.meta_title}
            onChangeText={(text) => setFormData({ ...formData, meta_title: text })}
            placeholder="Enter meta title (leave empty to use article title)"
          />

          <Text style={styles.inputLabel}>Meta Description</Text>
          <TextInput
            style={[styles.input, styles.metaDescriptionArea]}
            value={formData.meta_description}
            onChangeText={(text) => setFormData({ ...formData, meta_description: text })}
            placeholder="Enter meta description"
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.generateButton} onPress={generateMetaDescription}>
            <Icon name="auto-fix-high" size={16} color="#fff" />
            <Text style={styles.generateButtonText}>Generate from Content</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name={editingId ? "update" : "save"} size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {editingId ? 'Update News' : 'Create News'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
          <Icon name="cancel" size={20} color="#e74c3c" />
          <Text style={styles.cancelButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderNewsList = () => (
    <ScrollView style={styles.tabContent}>
      {news.map((item) => (
        <View key={item.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            {item.cover_image && (
              <Image source={{ uri: item.cover_image }} style={styles.listItemImage} />
            )}
            <View style={styles.listItemInfo}>
              <Text style={styles.listItemTitle}>{item.title}</Text>
              <Text style={styles.listItemAuthor}>By {item.author}</Text>
              <Text style={styles.listItemDate}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
              <View style={styles.listItemStatus}>
                <Text style={[
                  styles.statusBadge,
                  item.status === 'published' && styles.statusPublished,
                  item.status === 'draft' && styles.statusDraft,
                  item.status === 'archived' && styles.statusArchived,
                ]}>
                  {item.status.toUpperCase()}
                </Text>
                {item.featured && (
                  <Text style={styles.featuredBadge}>FEATURED</Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.listItemActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Icon name="edit" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Icon name="delete" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>News Management</Text>
          <Text style={styles.headerSubtitle}>Create and manage news articles</Text>
        </LinearGradient>

        <View style={styles.tabsContainer}>
          {renderTabButton('create', editingId ? 'Edit News' : 'Create News', 'add')}
          {renderTabButton('list', 'News List', 'list')}
        </View>

        {loading && activeTab === 'list' ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e3c72" />
            <Text style={styles.loadingText}>Loading news...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'create' && renderCreateForm()}
            {activeTab === 'list' && renderNewsList()}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    paddingVertical: 20,
  },
  header: {
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1e3c72',
  },
  activeTabButton: {
    backgroundColor: '#1e3c72',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#1e3c72',
    marginLeft: 5,
  },
  activeTabButtonText: {
    color: '#fff',
  },
  tabContent: {
    paddingHorizontal: 15,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  formCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginLeft: 10,
  },
  formCardBody: {
    paddingHorizontal: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },
  textArea: {
    height: 200,
  },
  excerptArea: {
    height: 100,
  },
  metaDescriptionArea: {
    height: 100,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
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
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  column: {
    flex: 1,
  },
  pickerWrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  addTagButton: {
    backgroundColor: '#1e3c72',
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 12,
    borderRadius: 20,
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
  coverImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  coverImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeCoverImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCoverImagePlaceholder: {
    height: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    marginBottom: 15,
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
  formattingToolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  formattingButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formattingButtonActive: {
    backgroundColor: '#1e3c72',
  },
  headingButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  formattingInstructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  formattingPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  formattingPreviewContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  contentPreviewToggle: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  previewToggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewToggleButtonActive: {
    backgroundColor: '#1e3c72',
  },
  previewToggleButtonText: {
    fontSize: 14,
    color: '#333',
  },
  previewToggleButtonTextActive: {
    color: '#fff',
  },
  contentPreview: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    padding: 15,
  },
  galleryItemContainer: {
    marginRight: 15,
    position: 'relative',
  },
  galleryImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  removeGalleryImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  listItemImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  listItemInfo: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  listItemAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  listItemDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  listItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 5,
  },
  statusPublished: {
    backgroundColor: '#2ecc71',
    color: '#fff',
  },
  statusDraft: {
    backgroundColor: '#f39c12',
    color: '#fff',
  },
  statusArchived: {
    backgroundColor: '#95a5a6',
    color: '#fff',
  },
  featuredBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#e74c3c',
    color: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  listItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 8,
  },
});

export default AdminNewsCrudScreen;