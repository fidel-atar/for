import React, { useState, useRef } from 'react';
import { 
  ScrollView, 
  Text, 
  StyleSheet, 
  TextInput, 
  Alert, 
  View, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CrudList from '../components/admin/CrudList';
import * as ImagePicker from 'expo-image-picker';
import dataService from '../services/dataService';

export default function AdminCategoryCrudScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [localImage, setLocalImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const listRef = useRef();

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setLocalImage(null);
    setValidationErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'اسم الفئة مطلوب';
    }
    
    if (!description.trim()) {
      errors.description = 'وصف الفئة مطلوب';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('إذن مطلوب', 'تم رفض الوصول إلى الصور');
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
      setImageUrl('');
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      let finalImageUrl = imageUrl;
      
      // Note: In a real app, you would upload the image to Supabase Storage
      // For now, we'll use the local image URI or provided URL
      if (localImage) {
        finalImageUrl = localImage.uri;
      }

      const categoryData = {
        name: name.trim(),
        description: description.trim(),
        image_url: finalImageUrl
      };

      let result;
      if (editingId) {
        result = await dataService.updateShopCategory(editingId, categoryData);
      } else {
        result = await dataService.createShopCategory(categoryData);
      }

      if (result.success) {
        Alert.alert('نجح', result.message);
        resetForm();
        listRef.current?.reload();
      } else {
        Alert.alert('خطأ', result.message || 'فشل في حفظ الفئة');
      }
    } catch (error) {
      console.error('خطأ في حفظ الفئة:', error);
      Alert.alert('خطأ', 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || '');
    setImageUrl(item.image_url || '');
    setLocalImage(null);
    setValidationErrors({});
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذه الفئة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: async () => {
            const result = await dataService.deleteShopCategory(id);
            if (result.success) {
              Alert.alert('نجح', result.message);
              listRef.current?.reload();
            } else {
              Alert.alert('خطأ', result.message || 'فشل في حذف الفئة');
            }
          }
        }
      ]
    );
  };

  const renderError = (field) => {
    if (validationErrors[field]) {
      return (
        <Text style={styles.errorText}>
          {validationErrors[field]}
        </Text>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={styles.header}
        >
          <Ionicons name="folder-outline" size={24} color="white" />
          <Text style={styles.headerTitle}>إدارة فئات المتجر</Text>
          <Text style={styles.headerSubtitle}>إضافة وتعديل فئات المنتجات</Text>
        </LinearGradient>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>
            {editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </Text>
          
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>اسم الفئة *</Text>
            <TextInput 
              style={[styles.input, validationErrors.name && styles.inputError]} 
              placeholder="أدخل اسم الفئة" 
              value={name} 
              onChangeText={setName}
              maxLength={50}
            />
            {renderError('name')}
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>وصف الفئة *</Text>
            <TextInput 
              style={[styles.input, styles.textArea, validationErrors.description && styles.inputError]} 
              placeholder="أدخل وصف الفئة"
              multiline
              numberOfLines={3}
              value={description} 
              onChangeText={setDescription}
              maxLength={200}
            />
            {renderError('description')}
          </View>

          {/* Image Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>صورة الفئة</Text>
            <TextInput 
              style={styles.input} 
              placeholder="رابط الصورة (اختياري)" 
              value={imageUrl} 
              onChangeText={setImageUrl}
            />
            
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="image" size={20} color="#1e3c72" />
              <Text style={styles.imageButtonText}>اختر صورة</Text>
            </TouchableOpacity>
            
            {(localImage || imageUrl) && (
              <View style={styles.imagePreview}>
                <Image 
                  source={{ uri: localImage?.uri || imageUrl }} 
                  style={styles.previewImage}
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => {
                    setLocalImage(null);
                    setImageUrl('');
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons 
                    name={editingId ? "checkmark" : "add"} 
                    size={20} 
                    color="white" 
                  />
                  <Text style={styles.saveButtonText}>
                    {editingId ? 'تحديث' : 'إضافة'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            {editingId && (
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={resetForm}
              >
                <Ionicons name="close" size={20} color="#95a5a6" />
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>الفئات الموجودة</Text>
          <CrudList
            ref={listRef}
            fetchFn={dataService.getShopCategories}
            deleteFn={handleDelete}
            onEdit={handleEdit}
            renderItemFields={(item) => (
              <View style={styles.listItem}>
                <View style={styles.listItemContent}>
                  {item.image_url && (
                    <Image 
                      source={{ uri: item.image_url }} 
                      style={styles.listItemImage}
                    />
                  )}
                  <View style={styles.listItemText}>
                    <Text style={styles.listItemTitle}>{item.name}</Text>
                    <Text style={styles.listItemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              </View>
            )}
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
    paddingBottom: 20 
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formSection: {
    margin: 15,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listSection: {
    margin: 15,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  imageButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1e3c72',
  },
  imagePreview: {
    marginTop: 10,
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#95a5a6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  listItemText: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  listItemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 