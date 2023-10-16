import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use the appropriate icon library

// Import your screen components
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ActivityScreen from '../screens/ActivityScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Discover':
                iconName = 'compass';
                break;
              case 'Activity':
                iconName = 'bell';
                break;
              case 'Bookmarks':
                iconName = 'bookmark';
                break;
              case 'Profile':
                iconName = 'user';
                break;
              default:
                iconName = 'question-circle';
                break;
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'white', // Customize the active tab color
          tabBarInactiveTintColor: 'gray', // Customize the inactive tab color
          tabBarStyle: {
              display: 'flex',
              backgroundColor: 'black'
          },
        })}
      >
              <Tab.Screen name="Home" component={HomeScreen}
                  options={{headerShown: false}} />
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
