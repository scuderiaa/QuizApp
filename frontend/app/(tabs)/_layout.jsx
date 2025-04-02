import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons"; 
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
export default function TabLayout() {
const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#a5b4fc",
         
        },
       
      }}
    >
      <Tabs.Screen
        name="categories"
        options={{
          title: "Quiz",
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name="brain"
              size={30}
              color={focused ? "white" : "purple"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="admin_login"
        options={{
          title: "Admin",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="admin-panel-settings"
              size={30}
              color={focused ? "white" : "purple"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
