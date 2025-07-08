import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import user screens
import HomeScreen from '../user/HomeScreen';
import NewsScreen from '../user/NewsScreen';
import NewsDetailScreen from '../user/NewsDetailScreen';
import TeamScreen from '../user/TeamsScreen';
import TeamDetailScreen from '../user/TeamDetailScreen';
import PlayerDetailScreen from '../user/PlayerDetailScreen';
import MatchesScreen from '../user/MatchesScreen';
import MatchDetailScreen from '../user/MatchDetailScreen';
import ShopScreen from '../user/ShopScreen';
import ShopItemDetailScreen from '../user/ShopItemDetailScreen';
import PresidentCupScreen from '../user/PresidentCupScreen';

// Import admin screens
import AdminDashboardScreen from '../admin/AdminDashboardScreen';
import AdminNewsCrudScreen from '../admin/AdminNewsCrudScreen';
import AdminTeamCrudScreen from '../admin/AdminTeamCrudScreen';
import AdminPlayerCrudScreen from '../admin/AdminPlayerCrudScreen';
import AdminMatchCrudScreen from '../admin/AdminMatchCrudScreen';
import AdminShopCrudScreen from '../admin/AdminShopCrudScreen';
import AdminCategoryCrudScreen from '../admin/AdminCategoryCrudScreen';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Accueil') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Matches') {
            iconName = focused ? 'football' : 'football-outline';
          } else if (route.name === 'Team') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'News') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'President Cup') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1e3c72',
        tabBarInactiveTintColor: '#8e9aaf',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerStyle: {
          backgroundColor: '#1e3c72',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen 
        name="Accueil" 
        component={HomeScreen} 
        options={{ 
          title: 'Accueil',
          headerTitle: '🏠 Super-D1'
        }}
      />
      <Tab.Screen 
        name="Matches" 
        component={MatchesScreen} 
        options={{ 
          title: 'Matchs',
          headerTitle: '⚽ Matchs'
        }}
      />
      <Tab.Screen 
        name="Team" 
        component={TeamScreen} 
        options={{ 
          title: 'Équipes',
          headerTitle: '👥 Équipes'
        }}
      />
      <Tab.Screen 
        name="Shop" 
        component={ShopScreen} 
        options={{ 
          title: 'Boutique',
          headerTitle: '🛍️ Boutique'
        }}
      />
      <Tab.Screen 
        name="News" 
        component={NewsScreen} 
        options={{ 
          title: 'Actualités',
          headerTitle: '📰 Actualités'
        }}
      />
      <Tab.Screen 
        name="President Cup" 
        component={PresidentCupScreen} 
        options={{ 
          title: 'Coupe du Président',
          headerTitle: '🏆 Coupe du Président'
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="TeamDetail" 
          component={TeamDetailScreen} 
          options={{ 
            headerShown: true,
            title: 'Détails Équipe',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="PlayerDetail"
          component={PlayerDetailScreen}
          options={{
            headerShown: true,
            title: 'Détails Joueur',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="MatchDetail"
          component={MatchDetailScreen}
          options={{
            headerShown: true,
            title: 'Détails Match',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ShopItemDetail"
          component={ShopItemDetailScreen}
          options={{
            headerShown: true,
            title: 'Détails Produit',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="NewsDetail"
          component={NewsDetailScreen}
          options={{
            headerShown: true,
            title: 'Détails Article',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        {/* Admin Screens */}
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{
            headerShown: true,
            title: 'Admin Dashboard',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="AdminNewsCrud"
          component={AdminNewsCrudScreen}
          options={{
            headerShown: true,
            title: 'Gestion Articles',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="AdminTeamCrud"
          component={AdminTeamCrudScreen}
          options={{
            headerShown: true,
            title: 'Gestion Équipes',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="AdminPlayerCrud"
          component={AdminPlayerCrudScreen}
          options={{
            headerShown: true,
            title: 'Gestion Joueurs',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="AdminMatchCrud"
          component={AdminMatchCrudScreen}
          options={{
            headerShown: true,
            title: 'Gestion Matchs',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="AdminShopCrud"
          component={AdminShopCrudScreen}
          options={{
            headerShown: true,
            title: 'Gestion Produits',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="AdminCategoryCrud"
          component={AdminCategoryCrudScreen}
          options={{
            headerShown: true,
            title: 'Gestion Catégories',
            headerStyle: { backgroundColor: '#1e3c72' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
