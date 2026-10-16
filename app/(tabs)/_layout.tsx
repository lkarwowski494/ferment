import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { t } from '../../src/lib/i18n';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#78350F',
        tabBarInactiveTintColor: '#78716C',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('Kalkulator'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>🧀</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="batches"
        options={{
          title: t('Partie'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: t('Spiżarnia'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>📦</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="school"
        options={{
          title: t('Wiedza'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>🎓</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('Ustawienia'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FAF8F5',
    borderTopColor: '#E7E5E4',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.7,
  },
  tabIconActive: {
    opacity: 1.0,
    transform: [{ scale: 1.1 }],
  },
});
