import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StarknetProvider } from './src/services/StarknetProvider';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import ListItemScreen from './src/screens/ListItemScreen';
import MyRentalsScreen from './src/screens/MyRentalsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StarknetProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: '#000',
                borderTopColor: '#333',
              },
              tabBarActiveTintColor: '#4ADE80',
              tabBarInactiveTintColor: '#888',
              headerStyle: {
                backgroundColor: '#000',
              },
              headerTintColor: '#fff',
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'FashionSwap',
              }}
            />
            <Tab.Screen
              name="Explore"
              component={ExploreScreen}
              options={{
                title: 'Explore',
              }}
            />
            <Tab.Screen
              name="List"
              component={ListItemScreen}
              options={{
                title: 'List Item',
              }}
            />
            <Tab.Screen
              name="Rentals"
              component={MyRentalsScreen}
              options={{
                title: 'My Rentals',
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: 'Profile',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </StarknetProvider>
    </SafeAreaProvider>
  );
}
