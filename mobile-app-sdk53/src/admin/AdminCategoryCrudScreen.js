import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, Button, Alert, View, Image } from 'react-native';
// import { adminAPI } from '../../api'; // تم حذف API، استخدم dataService
import CrudList from '../components/admin/CrudList';
import * as ImagePicker from 'expo-image-picker';

export default function AdminCategoryCrudScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [localImage, setLocalImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const listRef = React.useRef();

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setLocalImage(null);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', "Accès à la galerie refusé");
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

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Erreur', 'Nom de catégorie requis');
      return;
    }
    
    try {
      let finalImageUrl = imageUrl;
      if (localImage) {
        const fileObj = {
          uri: localImage.uri,
          name: localImage.fileName || `category_${Date.now()}.jpg`,
          type: localImage.mimeType || 'image/jpeg',
        };
        const uploadRes = await adminAPI.uploadImage(fileObj);
        finalImageUrl = uploadRes.data.url;
      }

      const categoryData = {
        name,
        description,
        image_url: finalImageUrl
      };

      if (editingId) {
        await adminAPI.category.update(editingId, categoryData);
        Alert.alert('Succès', 'Catégorie mise à jour');
      } else {
        await adminAPI.category.create(categoryData);
        Alert.alert('Succès', 'Catégorie créée');
      }
      resetForm();
      listRef.current?.reload();
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Opération échouée');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Créer une Catégorie</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nom de la catégorie" 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={[styles.input, { height: 80 }]} 
        placeholder="Description" 
        multiline
        value={description} 
        onChangeText={setDescription} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Image URL (ou choisir)" 
        value={imageUrl} 
        onChangeText={setImageUrl} 
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <Button title="Choisir Image" onPress={pickImage} />
        {localImage && (
          <Image source={{ uri: localImage.uri }} style={{ width: 50, height: 50, marginLeft: 10 }} />
        )}
      </View>
      <Button title={editingId ? 'Mettre à jour' : 'Créer'} onPress={handleSave} />
      {editingId && <Button color="grey" title="Annuler" onPress={resetForm} />}

      <Text style={[styles.title, { marginTop: 30 }]}>Catégories Existantes</Text>
      <CrudList
        ref={listRef}
        fetchFn={adminAPI.category.getAll}
        deleteFn={adminAPI.category.delete}
        onEdit={(item) => {
          setEditingId(item.id);
          setName(item.name);
          setDescription(item.description || '');
          setImageUrl(item.image_url || '');
          setLocalImage(null);
        }}
        renderItemFields={(item) => (
          <View>
            <Text style={{ fontWeight: '500' }}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e3c72', marginBottom: 20 },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 15 },
}); 