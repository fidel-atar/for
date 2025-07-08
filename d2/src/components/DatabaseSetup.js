import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { insertInitialData } from '../data/initialData';
import dataService from '../services/dataService';

const DatabaseSetup = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const handleInsertData = async () => {
    Alert.alert(
      'إدراج البيانات الأولية',
      'هل تريد إدراج البيانات الأولية في قاعدة البيانات؟ سيتم إضافة فرق، لاعبين، أخبار، ومباريات تجريبية.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'موافق', onPress: insertData }
      ]
    );
  };

  const insertData = async () => {
    setLoading(true);
    try {
      const result = await insertInitialData();
      if (result.success) {
        Alert.alert('نجح', result.message, [
          { text: 'موافق', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('خطأ', result.error || 'حدث خطأ أثناء إدراج البيانات');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إدراج البيانات');
      console.error('Error inserting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      const result = await dataService.testConnection();
      setConnectionStatus(result);
      
      if (result.success) {
        Alert.alert('نجح', 'تم الاتصال بقاعدة البيانات بنجاح!');
      } else {
        Alert.alert('خطأ', 'فشل الاتصال بقاعدة البيانات. تأكد من إعدادات Supabase.');
      }
    } catch (error) {
      setConnectionStatus({ success: false, message: 'خطأ في الاتصال' });
      Alert.alert('خطأ', 'خطأ في الاتصال بقاعدة البيانات');
      console.error('Connection test error:', error);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1e3c72', '#2a5298']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>إعداد قاعدة البيانات</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="database" size={24} color="#1e3c72" />
              <Text style={styles.cardTitle}>حالة الاتصال</Text>
            </View>
            <Text style={styles.cardDescription}>
              اختبر الاتصال بقاعدة البيانات للتأكد من أن الإعدادات صحيحة
            </Text>
            <TouchableOpacity
              style={[styles.button, testingConnection && styles.buttonDisabled]}
              onPress={testConnection}
              disabled={testingConnection}
            >
              {testingConnection ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="wifi" size={20} color="#fff" />
              )}
              <Text style={styles.buttonText}>
                {testingConnection ? 'جاري الاختبار...' : 'اختبار الاتصال'}
              </Text>
            </TouchableOpacity>
            
            {connectionStatus && (
              <View style={[
                styles.statusContainer,
                connectionStatus.success ? styles.successStatus : styles.errorStatus
              ]}>
                <Ionicons
                  name={connectionStatus.success ? "checkmark-circle" : "alert-circle"}
                  size={20}
                  color={connectionStatus.success ? "#4CAF50" : "#f44336"}
                />
                <Text style={[
                  styles.statusText,
                  connectionStatus.success ? styles.successText : styles.errorText
                ]}>
                  {connectionStatus.message}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="add-circle" size={24} color="#1e3c72" />
              <Text style={styles.cardTitle}>البيانات الأولية</Text>
            </View>
            <Text style={styles.cardDescription}>
              إضافة بيانات تجريبية للتطبيق تتضمن:
              {'\n'}• 4 فرق رياضية
              {'\n'}• 4 لاعبين
              {'\n'}• 4 أخبار
              {'\n'}• 3 مباريات
              {'\n'}• 4 فئات متجر
              {'\n'}• 4 منتجات متجر
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.insertButton, loading && styles.buttonDisabled]}
              onPress={handleInsertData}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="cloud-upload" size={20} color="#fff" />
              )}
              <Text style={styles.buttonText}>
                {loading ? 'جاري الإدراج...' : 'إدراج البيانات'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle" size={24} color="#1e3c72" />
              <Text style={styles.cardTitle}>معلومات مهمة</Text>
            </View>
            <Text style={styles.infoText}>
              • تأكد من تشغيل السكيما في Supabase أولاً
              {'\n'}• يمكن إدراج البيانات مرة واحدة فقط
              {'\n'}• لحذف البيانات، استخدم لوحة Supabase
              {'\n'}• تأكد من الاتصال بالإنترنت
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginLeft: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  insertButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  successStatus: {
    backgroundColor: '#f0f9f0',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  errorStatus: {
    backgroundColor: '#fef0f0',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#4CAF50',
  },
  errorText: {
    color: '#f44336',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default DatabaseSetup; 