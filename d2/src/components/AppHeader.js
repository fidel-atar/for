import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function AppHeader() {
  return (
    <View style={styles.header}>
      {/* Empty header space to maintain consistent layout */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 120, // Same height as the original header
    backgroundColor: '#1e3c72',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
}); 