import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import dataService from '../services/dataService';

export default function NewsDetailScreen({ route }) {
  const { newsId } = route.params;
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsDetail();
  }, []);

  const loadNewsDetail = async () => {
    try {
      setLoading(true);
      const response = await dataService.getNewsById(newsId);
      setNews(response);
    } catch (error) {
      console.error('Error loading news detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3c72" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>الخبر غير موجود</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {news.image_url && (
        <Image source={{ uri: news.image_url }} style={styles.coverImage} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{news.title || 'عنوان غير محدد'}</Text>
        <View style={styles.meta}>
          <Text style={styles.author}>{news.author || 'غير محدد'}</Text>
          <Text style={styles.date}>
            {news.created_at ? new Date(news.created_at).toLocaleDateString() : 'غير محدد'}
          </Text>
        </View>
        <Text style={styles.contentText}>{news.content || 'لا توجد محتوى متاح'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  coverImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 16,
    lineHeight: 32,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  author: {
    fontSize: 14,
    color: '#1e3c72',
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
}); 