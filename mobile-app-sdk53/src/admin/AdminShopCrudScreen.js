import React, { useState, useEffect, useRef } from 'react';
import { 
  ScrollView, 
  Text, 
  StyleSheet, 
  TextInput, 
  Button, 
  Alert, 
  View, 
  Image, 
  TouchableOpacity, 
  Switch,
  ActivityIndicator,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CrudList from '../components/admin/CrudList';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import dataService from '../services/dataService';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export default function AdminShopCrudScreen() {
  // Basic product info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  
  // Enhanced product info
  const [productStatus, setProductStatus] = useState('active'); // active, draft, out_of_stock
  const [isFeatured, setIsFeatured] = useState(false);
  const [discountPrice, setDiscountPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [sku, setSku] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [barcode, setBarcode] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  // Promotion settings
  const [hasPromotion, setHasPromotion] = useState(false);
  const [promotionStartDate, setPromotionStartDate] = useState(new Date());
  const [promotionEndDate, setPromotionEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Product variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [variantTypes, setVariantTypes] = useState(['size', 'color']); 
  const [selectedVariantType, setSelectedVariantType] = useState('size');
  const [variantOptions, setVariantOptions] = useState({
    size: [],
    color: []
  });
  const [currentVariantOption, setCurrentVariantOption] = useState('');
  
  // Image handling
  const [imageUrl, setImageUrl] = useState('');
  const [localImage, setLocalImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('basic'); // basic, variants, images, seo
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const listRef = useRef();
  const scrollViewRef = useRef();

  // Load categories once
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await dataService.getShopCategories();
      setCategories(res || []);
    } catch (err) {
      console.log('Error fetching categories', err.message);
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  const resetForm = () => {
    // Reset basic info
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('');
    setStockQuantity('');
    
    // Reset enhanced info
    setProductStatus('active');
    setIsFeatured(false);
    setDiscountPrice('');
    setWeight('');
    setSku('');
    setTags([]);
    setCurrentTag('');
    setBarcode('');
    setMetaTitle('');
    setMetaDescription('');
    
    // Reset promotion settings
    setHasPromotion(false);
    setPromotionStartDate(new Date());
    setPromotionEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    
    // Reset variants
    setHasVariants(false);
    setVariants([]);
    setVariantOptions({
      size: [],
      color: []
    });
    
    // Reset images
    setImageUrl('');
    setLocalImage(null);
    setProductImages([]);
    
    // Reset form state
    setActiveTab('basic');
    setValidationErrors({});
    
    // Return to top
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
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

  const addVariantOption = () => {
    if (currentVariantOption.trim() && !variantOptions[selectedVariantType].includes(currentVariantOption.trim())) {
      const updatedOptions = {
        ...variantOptions,
        [selectedVariantType]: [...variantOptions[selectedVariantType], currentVariantOption.trim()]
      };
      setVariantOptions(updatedOptions);
      setCurrentVariantOption('');
      
      // Generate variants based on options
      generateVariants(updatedOptions);
    }
  };

  const removeVariantOption = (type, index) => {
    const newOptions = {...variantOptions};
    newOptions[type].splice(index, 1);
    setVariantOptions(newOptions);
    
    // Regenerate variants
    generateVariants(newOptions);
  };

  const generateVariants = (options) => {
    // Only generate if we have options for at least one type
    if (Object.values(options).some(arr => arr.length > 0)) {
      // Start with sizes if available, otherwise colors
      const baseOptions = options.size.length > 0 ? options.size : options.color;
      const secondaryOptions = options.size.length > 0 ? options.color : options.size;
      const isBaseSize = options.size.length > 0;
      
      let newVariants = [];
      
      // If we have only one type of options
      if (baseOptions.length > 0 && secondaryOptions.length === 0) {
        newVariants = baseOptions.map(option => ({
          id: `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          [isBaseSize ? 'size' : 'color']: option,
          price: price || '0',
          stock: '0',
          sku: ''
        }));
      } 
      // If we have both types
      else if (baseOptions.length > 0 && secondaryOptions.length > 0) {
        baseOptions.forEach(baseOption => {
          secondaryOptions.forEach(secondOption => {
            newVariants.push({
              id: `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              size: isBaseSize ? baseOption : secondOption,
              color: isBaseSize ? secondOption : baseOption,
              price: price || '0',
              stock: '0',
              sku: ''
            });
          });
        });
      }
      
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  };

  const updateVariant = (id, field, value) => {
    const updatedVariants = variants.map(variant => 
      variant.id === id ? {...variant, [field]: value} : variant
    );
    setVariants(updatedVariants);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', "Gallery access denied");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    
    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalImage(asset);
      setImageUrl('');
    }
  };

  const addToGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', "Gallery access denied");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    
    if (!result.canceled) {
      // Add selected images to gallery
      const newImages = result.assets.map(asset => ({
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        uri: asset.uri,
        fileName: asset.fileName || `gallery_${Date.now()}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
        uploaded: false
      }));
      
      setProductImages([...productImages, ...newImages]);
    }
  };

  const removeFromGallery = (id) => {
    setProductImages(productImages.filter(img => img.id !== id));
  };

  const createNewCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await dataService.createShopCategory({
        name: newCategoryName.trim()
      });
      
      if (result && result.id) {
        await loadCategories();
        setCategoryId(result.id.toString());
        setNewCategoryName('');
        setShowNewCategoryModal(false);
        Alert.alert('Success', 'Category created successfully');
      } else {
        throw new Error('Failed to create category');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      Alert.alert('Error', 'Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = 'Product name is required';
    if (!price.trim()) errors.price = 'Price is required';
    if (price && isNaN(parseFloat(price))) errors.price = 'Price must be a number';
    if (discountPrice && isNaN(parseFloat(discountPrice))) errors.discountPrice = 'Discount price must be a number';
    if (stockQuantity && isNaN(parseInt(stockQuantity))) errors.stockQuantity = 'Stock quantity must be a number';
    if (weight && isNaN(parseFloat(weight))) errors.weight = 'Weight must be a number';
    
    if (hasPromotion) {
      if (promotionEndDate <= promotionStartDate) {
        errors.promotionDate = 'End date must be after start date';
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
      
      // Upload main image if needed
      let finalImageUrl = imageUrl;
      if (localImage) {
        setUploading(true);
        const fileObj = {
          uri: localImage.uri,
          name: localImage.fileName || `product_${Date.now()}.jpg`,
          type: localImage.mimeType || 'image/jpeg',
        };
        const uploadRes = await dataService.uploadImage(fileObj);
        finalImageUrl = uploadRes.url;
        setUploading(false);
      }
      
      // Upload gallery images if needed
      const uploadedGallery = [];
      for (const img of productImages) {
        if (!img.uploaded) {
          setUploading(true);
          const fileObj = {
            uri: img.uri,
            name: img.fileName || `gallery_${Date.now()}.jpg`,
            type: img.mimeType || 'image/jpeg',
          };
          const uploadRes = await dataService.uploadImage(fileObj);
          uploadedGallery.push({
            ...img,
            uploaded: true,
            url: uploadRes.url
          });
          setUploading(false);
        } else {
          uploadedGallery.push(img);
        }
      }
      
      // Prepare product data object
      const productData = {
        name,
        description,
        price: parseFloat(price),
        category_id: parseInt(categoryId) || null,
        image_url: finalImageUrl,
        stock_quantity: parseInt(stockQuantity) || 0,
        
        // Enhanced fields
        status: productStatus,
        is_featured: isFeatured,
        discount_price: discountPrice ? parseFloat(discountPrice) : null,
        weight: weight ? parseFloat(weight) : null,
        sku,
        barcode,
        tags: tags.join(','),
        meta_title: metaTitle,
        meta_description: metaDescription,
        
        // Promotion settings
        has_promotion: hasPromotion,
        promotion_start_date: hasPromotion ? promotionStartDate.toISOString() : null,
        promotion_end_date: hasPromotion ? promotionEndDate.toISOString() : null,
        
        // Variants and gallery
        has_variants: hasVariants,
        variants: hasVariants ? JSON.stringify(variants) : null,
        variant_options: hasVariants ? JSON.stringify(variantOptions) : null,
        gallery: uploadedGallery.length > 0 ? JSON.stringify(uploadedGallery) : null
      };

      // Save or update product
      if (editingId) {
        await dataService.updateShopItem(editingId, productData);
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await dataService.createShopItem(productData);
        Alert.alert('Success', 'Product created successfully');
      }
      
      // Reset form and reload list
      resetForm();
      listRef.current?.reload();
      
    } catch (err) {
      console.error('Error saving product:', err);
      Alert.alert('Error', 'Operation failed');
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  const duplicateProduct = async (item) => {
    try {
      // Create a copy of the item without ID
      const { id, created_at, updated_at, ...productData } = item;
      
      // Modify name to indicate it's a copy
      productData.name = `${productData.name} (Copy)`;
      
      // Create new product
      await dataService.createShopItem(productData);
      Alert.alert('Success', 'Product duplicated successfully');
      
      // Reload list
      listRef.current?.reload();
    } catch (err) {
      console.error('Error duplicating product:', err);
      Alert.alert('Error', 'Failed to duplicate product');
    }
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
          <Text style={styles.headerTitle}>{editingId ? 'Edit Product' : 'Create New Product'}</Text>
        </LinearGradient>
        
        {/* Form Tabs */}
        <View style={styles.tabsContainer}>
          {renderTabButton('basic', 'Basic Info', 'information-circle-outline')}
          {renderTabButton('variants', 'Variants', 'options-outline')}
          {renderTabButton('images', 'Images', 'images-outline')}
          {renderTabButton('seo', 'SEO & Extras', 'globe-outline')}
        </View>
        
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Product Information</Text>
            
            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput 
              style={[styles.input, validationErrors.name && styles.inputError]} 
              placeholder="Product name" 
              value={name} 
              onChangeText={setName} 
            />
            {renderError('name')}
            
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Product description" 
              multiline
              textAlignVertical="top"
              numberOfLines={6}
              value={description} 
              onChangeText={setDescription} 
            />
            
            <View style={styles.rowContainer}>
              <View style={[styles.column, { marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Price *</Text>
                <TextInput 
                  style={[styles.input, validationErrors.price && styles.inputError]} 
                  placeholder="Price" 
                  value={price} 
                  onChangeText={setPrice} 
                  keyboardType="decimal-pad" 
                />
                {renderError('price')}
              </View>
              
              <View style={styles.column}>
                <Text style={styles.inputLabel}>Discount Price</Text>
                <TextInput 
                  style={[styles.input, validationErrors.discountPrice && styles.inputError]} 
                  placeholder="Discount price" 
                  value={discountPrice} 
                  onChangeText={setDiscountPrice} 
                  keyboardType="decimal-pad" 
                />
                {renderError('discountPrice')}
              </View>
            </View>
            
            <View style={styles.rowContainer}>
              <View style={[styles.column, { marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Stock Quantity</Text>
                <TextInput 
                  style={[styles.input, validationErrors.stockQuantity && styles.inputError]} 
                  placeholder="Stock quantity" 
                  value={stockQuantity} 
                  onChangeText={setStockQuantity} 
                  keyboardType="numeric" 
                />
                {renderError('stockQuantity')}
              </View>
              
              <View style={styles.column}>
                <Text style={styles.inputLabel}>Product Status</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={productStatus}
                    onValueChange={(value) => setProductStatus(value)}
                  >
                    <Picker.Item label="Active" value="active" />
                    <Picker.Item label="Draft" value="draft" />
                    <Picker.Item label="Out of Stock" value="out_of_stock" />
                  </Picker>
                </View>
              </View>
            </View>
            
            <View style={styles.rowContainer}>
              <View style={[styles.column, { marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={categoryId}
                    onValueChange={(value) => setCategoryId(value)}
                  >
                    <Picker.Item label="Select category" value="" />
                    {categories.map((cat) => (
                      <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.column}>
                <Text style={styles.inputLabel}>&nbsp;</Text>
                <TouchableOpacity 
                  style={styles.createCategoryButton}
                  onPress={() => setShowNewCategoryModal(true)}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.createCategoryButtonText}>New Category</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Featured Product</Text>
              <Switch
                value={isFeatured}
                onValueChange={setIsFeatured}
                thumbColor={isFeatured ? '#1e3c72' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#4e6cb6' }}
                ios_backgroundColor="#767577"
              />
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Special Promotion</Text>
              <Switch
                value={hasPromotion}
                onValueChange={setHasPromotion}
                thumbColor={hasPromotion ? '#1e3c72' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#4e6cb6' }}
                ios_backgroundColor="#767577"
              />
            </View>
            
            {hasPromotion && (
              <View style={styles.promotionDatesContainer}>
                <View style={styles.datePickerContainer}>
                  <Text style={styles.inputLabel}>Start Date</Text>
                  <TouchableOpacity 
                    style={styles.datePickerButton}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Text style={styles.datePickerButtonText}>
                      {promotionStartDate.toLocaleDateString()}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#1e3c72" />
                  </TouchableOpacity>
                  
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={promotionStartDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowStartDatePicker(false);
                        if (selectedDate) {
                          setPromotionStartDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </View>
                
                <View style={styles.datePickerContainer}>
                  <Text style={styles.inputLabel}>End Date</Text>
                  <TouchableOpacity 
                    style={styles.datePickerButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={styles.datePickerButtonText}>
                      {promotionEndDate.toLocaleDateString()}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#1e3c72" />
                  </TouchableOpacity>
                  
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={promotionEndDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowEndDatePicker(false);
                        if (selectedDate) {
                          setPromotionEndDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </View>
                {renderError('promotionDate')}
              </View>
            )}
          </View>
        )}
        
        {/* Variants Tab */}
        {activeTab === 'variants' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Product Variants</Text>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Enable Product Variants</Text>
              <Switch
                value={hasVariants}
                onValueChange={setHasVariants}
                thumbColor={hasVariants ? '#1e3c72' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#4e6cb6' }}
                ios_backgroundColor="#767577"
              />
            </View>
            
            {hasVariants && (
              <>
                <Text style={styles.variantHelpText}>
                  Add options for size, color or other variant types, then configure each variant combination.
                </Text>
                
                <View style={styles.variantInputContainer}>
                  <Picker
                    selectedValue={selectedVariantType}
                    onValueChange={(value) => setSelectedVariantType(value)}
                    style={styles.variantTypePicker}
                  >
                    {variantTypes.map((type) => (
                      <Picker.Item key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
                    ))}
                  </Picker>
                  
                  <TextInput
                    style={styles.variantOptionInput}
                    placeholder={`Add ${selectedVariantType} option`}
                    value={currentVariantOption}
                    onChangeText={setCurrentVariantOption}
                  />
                  
                  <TouchableOpacity 
                    style={styles.addVariantButton}
                    onPress={addVariantOption}
                  >
                    <Ionicons name="add" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                {/* Display existing variant options */}
                {Object.entries(variantOptions).map(([type, options]) => 
                  options.length > 0 && (
                    <View key={type} style={styles.variantOptionsContainer}>
                      <Text style={styles.variantTypeTitle}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Options:
                      </Text>
                      <View style={styles.variantOptionsList}>
                        {options.map((option, index) => (
                          <View key={index} style={styles.variantOptionChip}>
                            <Text style={styles.variantOptionChipText}>{option}</Text>
                            <TouchableOpacity 
                              onPress={() => removeVariantOption(type, index)}
                              style={styles.removeVariantOptionButton}
                            >
                              <Ionicons name="close-circle" size={20} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  )
                )}
                
                {/* Generated variants */}
                {variants.length > 0 && (
                  <View style={styles.generatedVariantsContainer}>
                    <Text style={styles.sectionSubtitle}>Configure Variants</Text>
                    
                    {variants.map((variant, index) => (
                      <View key={variant.id} style={styles.variantConfigCard}>
                        <View style={styles.variantConfigHeader}>
                          <Text style={styles.variantConfigTitle}>
                            Variant #{index + 1}: 
                            {variant.size && ` Size: ${variant.size}`} 
                            {variant.color && ` Color: ${variant.color}`}
                          </Text>
                        </View>
                        
                        <View style={styles.variantConfigBody}>
                          <View style={styles.variantConfigRow}>
                            <Text style={styles.variantConfigLabel}>Price:</Text>
                            <TextInput
                              style={styles.variantConfigInput}
                              placeholder="Price"
                              value={variant.price}
                              onChangeText={(value) => updateVariant(variant.id, 'price', value)}
                              keyboardType="decimal-pad"
                            />
                          </View>
                          
                          <View style={styles.variantConfigRow}>
                            <Text style={styles.variantConfigLabel}>Stock:</Text>
                            <TextInput
                              style={styles.variantConfigInput}
                              placeholder="Stock"
                              value={variant.stock}
                              onChangeText={(value) => updateVariant(variant.id, 'stock', value)}
                              keyboardType="numeric"
                            />
                          </View>
                          
                          <View style={styles.variantConfigRow}>
                            <Text style={styles.variantConfigLabel}>SKU:</Text>
                            <TextInput
                              style={styles.variantConfigInput}
                              placeholder="SKU code"
                              value={variant.sku}
                              onChangeText={(value) => updateVariant(variant.id, 'sku', value)}
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}
        
        {/* Images Tab */}
        {activeTab === 'images' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Product Images</Text>
            
            <View style={styles.mainImageContainer}>
              <Text style={styles.inputLabel}>Main Product Image</Text>
              
              <View style={styles.imagePreviewContainer}>
                {localImage ? (
                  <Image source={{ uri: localImage.uri }} style={styles.mainImagePreview} />
                ) : imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.mainImagePreview} />
                ) : (
                  <View style={styles.emptyImagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color="#ccc" />
                    <Text style={styles.emptyImageText}>No image selected</Text>
                  </View>
                )}
                
                <View style={styles.mainImageActions}>
                  <TouchableOpacity 
                    style={styles.mainImageActionButton}
                    onPress={pickImage}
                  >
                    <Ionicons name="image" size={20} color="#fff" />
                    <Text style={styles.mainImageActionButtonText}>Select Image</Text>
                  </TouchableOpacity>
                  
                  {(localImage || imageUrl) && (
                    <TouchableOpacity 
                      style={[styles.mainImageActionButton, styles.removeImageButton]}
                      onPress={() => {
                        setLocalImage(null);
                        setImageUrl('');
                      }}
                    >
                      <Ionicons name="trash" size={20} color="#fff" />
                      <Text style={styles.mainImageActionButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <Text style={styles.inputLabel}>Image URL (optional)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Image URL" 
                value={imageUrl} 
                onChangeText={setImageUrl} 
              />
            </View>
            
            <View style={styles.galleryContainer}>
              <View style={styles.galleryHeader}>
                <Text style={styles.sectionSubtitle}>Product Gallery</Text>
                <TouchableOpacity 
                  style={styles.addToGalleryButton}
                  onPress={addToGallery}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addToGalleryButtonText}>Add Images</Text>
                </TouchableOpacity>
              </View>
              
              {productImages.length > 0 ? (
                <FlatList
                  data={productImages}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.galleryImageContainer}>
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
                  <Ionicons name="images-outline" size={40} color="#ccc" />
                  <Text style={styles.emptyGalleryText}>No gallery images added</Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        {/* SEO & Extras Tab */}
        {activeTab === 'seo' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Product Details & SEO</Text>
            
            <View style={styles.rowContainer}>
              <View style={[styles.column, { marginRight: 8 }]}>
                <Text style={styles.inputLabel}>SKU Code</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="SKU code" 
                  value={sku} 
                  onChangeText={setSku} 
                />
              </View>
              
              <View style={styles.column}>
                <Text style={styles.inputLabel}>Barcode</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Barcode" 
                  value={barcode} 
                  onChangeText={setBarcode} 
                />
              </View>
            </View>
            
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput 
              style={[styles.input, validationErrors.weight && styles.inputError]} 
              placeholder="Product weight" 
              value={weight} 
              onChangeText={setWeight} 
              keyboardType="decimal-pad" 
            />
            {renderError('weight')}
            
            <Text style={styles.inputLabel}>Product Tags</Text>
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
            
            <Text style={styles.sectionSubtitle}>SEO Settings</Text>
            
            <Text style={styles.inputLabel}>Meta Title</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Meta title (for SEO)" 
              value={metaTitle} 
              onChangeText={setMetaTitle} 
            />
            
            <Text style={styles.inputLabel}>Meta Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Meta description (for SEO)" 
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              value={metaDescription} 
              onChangeText={setMetaDescription} 
            />
          </View>
        )}
        
        <View style={styles.formActions}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading || uploading}
          >
            {(isLoading || uploading) ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name={editingId ? "save" : "add-circle"} size={20} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update Product' : 'Create Product'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {editingId && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={resetForm}
              disabled={isLoading || uploading}
            >
              <Ionicons name="close-circle" size={20} color="#1e3c72" />
              <Text style={styles.cancelButtonText}>Cancel Editing</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.existingProductsTitle}>Existing Products</Text>
        
        <CrudList
          ref={listRef}
          fetchFn={dataService.getShopItems}
          deleteFn={dataService.deleteShopItem}
          onEdit={(item) => {
            // Set basic info
            setEditingId(item.id);
            setName(item.name || '');
            setDescription(item.description || '');
            setPrice(item.price?.toString() || '');
            setCategoryId(item.category_id?.toString() || '');
            setStockQuantity(item.stock_quantity?.toString() || '0');
            setImageUrl(item.image_url || '');
            
            // Set enhanced info
            setProductStatus(item.status || 'active');
            setIsFeatured(item.is_featured || false);
            setDiscountPrice(item.discount_price?.toString() || '');
            setWeight(item.weight?.toString() || '');
            setSku(item.sku || '');
            setBarcode(item.barcode || '');
            setMetaTitle(item.meta_title || '');
            setMetaDescription(item.meta_description || '');
            
            // Set tags
            setTags(item.tags ? item.tags.split(',').filter(tag => tag.trim()) : []);
            
            // Set promotion settings
            setHasPromotion(item.has_promotion || false);
            if (item.promotion_start_date) {
              setPromotionStartDate(new Date(item.promotion_start_date));
            }
            if (item.promotion_end_date) {
              setPromotionEndDate(new Date(item.promotion_end_date));
            }
            
            // Set variants
            setHasVariants(item.has_variants || false);
            if (item.variants) {
              try {
                const parsedVariants = JSON.parse(item.variants);
                setVariants(parsedVariants || []);
              } catch (e) {
                console.error('Error parsing variants:', e);
                setVariants([]);
              }
            } else {
              setVariants([]);
            }
            
            if (item.variant_options) {
              try {
                const parsedOptions = JSON.parse(item.variant_options);
                setVariantOptions(parsedOptions || { size: [], color: [] });
              } catch (e) {
                console.error('Error parsing variant options:', e);
                setVariantOptions({ size: [], color: [] });
              }
            } else {
              setVariantOptions({ size: [], color: [] });
            }
            
            // Set gallery
            if (item.gallery) {
              try {
                const parsedGallery = JSON.parse(item.gallery);
                setProductImages(parsedGallery || []);
              } catch (e) {
                console.error('Error parsing gallery:', e);
                setProductImages([]);
              }
            } else {
              setProductImages([]);
            }
            
            // Reset form state
            setLocalImage(null);
            setActiveTab('basic');
            setValidationErrors({});
            
            // Scroll to top
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
          }}
          renderItemFields={(item) => (
            <View>
              {item.image_url && (
                <Image 
                  source={{ uri: item.image_url }} 
                  style={styles.productListImage} 
                />
              )}
              <Text style={styles.productListName}>{item.name}</Text>
              <Text style={styles.productListPrice}>
                {item.discount_price ? (
                  <>
                    <Text style={styles.discountedPrice}>{item.price} MRU</Text>
                    {' '}
                    <Text style={styles.activePrice}>{item.discount_price} MRU</Text>
                  </>
                ) : (
                  <Text style={styles.activePrice}>{item.price} MRU</Text>
                )}
              </Text>
              <View style={styles.productListDetails}>
                <Text style={styles.productListStock}>Stock: {item.stock_quantity || 0}</Text>
                <View style={[styles.productStatusBadge, styles[`status_${item.status || 'active'}`]]}>
                  <Text style={styles.productStatusText}>
                    {item.status === 'active' ? 'Active' : 
                     item.status === 'draft' ? 'Draft' : 
                     item.status === 'out_of_stock' ? 'Out of Stock' : 'Active'}
                  </Text>
                </View>
              </View>
            </View>
          )}
          extraActions={[
            {
              icon: 'copy-outline',
              color: '#2ecc71',
              action: duplicateProduct,
              tooltip: 'Duplicate'
            }
          ]}
        />
        
        {/* New Category Modal */}
        <Modal
          visible={showNewCategoryModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowNewCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Create New Category</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowNewCategoryModal(false)}
                  disabled={isLoading}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalCreateButton}
                  onPress={createNewCategory}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.modalCreateButtonText}>Create</Text>
                  )}
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
    padding: 20,
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
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
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
    height: 120,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
  pickerWrapper: {
    backgroundColor: 'white',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  promotionDatesContainer: {
    marginBottom: 15,
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  
  // Variant styles
  variantHelpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  variantInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  variantTypePicker: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  variantOptionInput: {
    flex: 2,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  addVariantButton: {
    backgroundColor: '#1e3c72',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  variantOptionsContainer: {
    marginBottom: 20,
  },
  variantTypeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  variantOptionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantOptionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  variantOptionChipText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
  },
  removeVariantOptionButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatedVariantsContainer: {
    marginTop: 15,
  },
  variantConfigCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  variantConfigHeader: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  variantConfigTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  variantConfigBody: {
    padding: 12,
  },
  variantConfigRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  variantConfigLabel: {
    width: 60,
    fontSize: 14,
    color: '#555',
  },
  variantConfigInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  // Image tab styles
  mainImageContainer: {
    marginBottom: 20,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  mainImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emptyImagePlaceholder: {
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
  emptyImageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  mainImageActions: {
    flex: 1,
  },
  mainImageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#ff3b30',
  },
  mainImageActionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  galleryContainer: {
    marginTop: 20,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addToGalleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addToGalleryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  galleryList: {
    paddingBottom: 10,
  },
  galleryImageContainer: {
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
  },
  emptyGalleryText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  
  // Tag styles
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'white',
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
    marginBottom: 20,
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
  
  // Form actions
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
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
    backgroundColor: '#f0f0f0',
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
  
  // Existing products list
  existingProductsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 15,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  productListImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 5,
  },
  productListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productListPrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  activePrice: {
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  discountedPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  productListDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productListStock: {
    fontSize: 12,
    color: '#666',
  },
  productStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status_active: {
    backgroundColor: '#2ecc71',
  },
  status_draft: {
    backgroundColor: '#f39c12',
  },
  status_out_of_stock: {
    backgroundColor: '#e74c3c',
  },
  productStatusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Category button
  createCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    padding: 12,
    borderRadius: 10,
  },
  createCategoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  // Modal styles
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
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
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
  modalCreateButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#1e3c72',
    alignItems: 'center',
  },
  modalCreateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});