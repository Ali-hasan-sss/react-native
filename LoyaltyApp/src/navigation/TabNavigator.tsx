import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import { HomeScreen } from '../screens/main/HomeScreen';
import { PromotionsScreen } from '../screens/main/PromotionsScreen';
import { PurchaseScreen } from '../screens/main/PurchaseScreen';
import { AccountScreen } from '../screens/main/AccountScreen';
import { CustomHeader } from '../components/CustomHeader';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ size, color }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Promotions"
        component={PromotionsScreen}
        options={{
          tabBarIcon: ({ size, color }) => <Icon name="local-offer" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Purchase"
        component={PurchaseScreen}
        options={{
          tabBarIcon: ({ size, color }) => <Icon name="shopping-bag" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ size, color }) => <Icon name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}