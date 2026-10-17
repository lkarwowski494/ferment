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
        tabBarActiveTintColor: '#B86D3B',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('SEROWAR'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>🧀</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="dairy"
        options={{
          title: t('Nabiał'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>🧈</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="cave"
        options={{
          title: t('Dojrzewalnia'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>🏔️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="pantry-knowledge"
        options={{
          title: t('Spiżarnia'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>📦</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1E2229',
    borderTopColor: '#374151',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.75,
  },
  tabIconActive: {
    opacity: 1.0,
    transform: [{ scale: 1.1 }],
  },
});
