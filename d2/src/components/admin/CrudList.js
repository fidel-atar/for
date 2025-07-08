import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CrudList = forwardRef(function CrudList({ fetchFn, deleteFn, onEdit, renderItemFields, emptyText = 'Aucun enregistrement', headerComponent = null }, ref) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const res = await fetchFn();
      const newData = res || [];
      setData(newData);
      
      // Animate in new data
      if (newData.length > 0) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } catch (err) {
      console.log('Error loading list', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useImperativeHandle(ref, () => ({ reload: () => load(false) }));

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmer la suppression', 
      'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteFn(id);
              if (result && result.success) {
                load();
              } else {
                Alert.alert('Erreur', result?.message || 'La suppression a échoué. Veuillez réessayer.');
              }
            } catch (err) {
              Alert.alert('Erreur', 'La suppression a échoué. Veuillez réessayer.');
            }
          },
        },
      ]
    );
  };

  const renderRow = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.row,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.rowContent} 
        onPress={() => onEdit(item)}
        activeOpacity={0.7}
      >
        {renderItemFields(item)}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDelete(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color="#dc3545" />
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3c72" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-outline" size={48} color="#ccc" />
        <Text style={styles.empty}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <FlatList 
      data={data} 
      renderItem={renderRow} 
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={headerComponent}
      ListHeaderComponentStyle={{ marginBottom: 10 }}
      refreshing={refreshing}
      onRefresh={() => load(true)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
});

export default CrudList;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rowContent: {
    flex: 1,
    paddingRight: 10,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  empty: {
    textAlign: 'center',
    marginTop: 15,
    color: '#999',
    fontSize: 16,
  },
}); 