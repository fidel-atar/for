import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import dataService from '../services/dataService';

export default function ShopItemDetailScreen({ route }) {
  const { itemId } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await dataService.getShopItemById(itemId);
        setItem(response);
      } catch (err) {
        console.error('Error loading shop item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e3c72" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>المنتج غير موجود</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {item.image_url && <Image source={{ uri: item.image_url }} style={styles.itemImage} />}
        <Text style={styles.itemName}>{item.name || 'منتج غير محدد'}</Text>
        <Text style={styles.itemPrice}>{item.price || 0} MRU</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الوصف</Text>
        <Text style={styles.description}>{item.description || 'لا يوجد وصف متاح'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معلومات المنتج</Text>
        <Info label="الفئة" value={item.category || 'غير محدد'} />
        <Info label="المخزون" value={item.stock_quantity || 0} />
        <Info label="الحجم" value={item.size || 'غير محدد'} />
        <Info label="اللون" value={item.color || 'غير محدد'} />
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
  itemImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#1e3c72',
    fontSize: 16,
  },
  infoValue: {
    color: '#333',
    fontSize: 16,
  },
}); 