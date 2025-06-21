import * as Notifications from 'expo-notifications';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HydrationSettings, useHydration } from '@/hooks/useHydration';

const DEFAULT_SETTINGS: HydrationSettings = {
  dailyGoal: 2000,
  reminderInterval: 60,
  isReminderEnabled: true,
  customAmounts: [250, 500, 1000],
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { settings, saveSettings } = useHydration();

  const updateDailyGoal = (goal: number) => {
    const newSettings = { ...settings, dailyGoal: goal };
    saveSettings(newSettings);
  };

  const updateReminderInterval = (interval: number) => {
    const newSettings = { ...settings, reminderInterval: interval };
    saveSettings(newSettings);
  };

  const toggleReminders = async (enabled: boolean) => {
    if (enabled && Platform.OS !== 'web') {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission Required', 'Please enable notifications to receive hydration reminders.');
          return;
        }
      }
    }
    
    const newSettings = { ...settings, isReminderEnabled: enabled };
    saveSettings(newSettings);
  };

  const updateCustomAmount = (index: number, amount: number) => {
    const newCustomAmounts = [...settings.customAmounts];
    newCustomAmounts[index] = amount;
    const newSettings = { ...settings, customAmounts: newCustomAmounts };
    saveSettings(newSettings);
  };

  const addCustomAmount = () => {
    if (settings.customAmounts.length < 5) {
      const newCustomAmounts = [...settings.customAmounts, 250];
      const newSettings = { ...settings, customAmounts: newCustomAmounts };
      saveSettings(newSettings);
    }
  };

  const removeCustomAmount = (index: number) => {
    if (settings.customAmounts.length > 1) {
      const newCustomAmounts = settings.customAmounts.filter((_, i) => i !== index);
      const newSettings = { ...settings, customAmounts: newCustomAmounts };
      saveSettings(newSettings);
    }
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => saveSettings(DEFAULT_SETTINGS) },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>Configure your hydration preferences</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Daily Goal</ThemedText>
          <View style={styles.goalContainer}>
            <TouchableOpacity 
              style={[styles.goalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => updateDailyGoal(1500)}
            >
              <ThemedText style={[styles.goalButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>1.5L</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.goalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => updateDailyGoal(2000)}
            >
              <ThemedText style={[styles.goalButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>2L</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.goalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => updateDailyGoal(2500)}
            >
              <ThemedText style={[styles.goalButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>2.5L</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.goalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => updateDailyGoal(3000)}
            >
              <ThemedText style={[styles.goalButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>3L</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.currentGoal}>Current goal: {settings.dailyGoal}ml</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Reminder Interval</ThemedText>
          <View style={styles.intervalContainer}>
            <TouchableOpacity 
              style={[styles.intervalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => updateReminderInterval(30)}
            >
              <ThemedText style={[styles.intervalButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>30 min</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.intervalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => updateReminderInterval(60)}
            >
              <ThemedText style={[styles.intervalButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>1 hour</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.intervalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => updateReminderInterval(90)}
            >
              <ThemedText style={[styles.intervalButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>1.5 hours</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.intervalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => updateReminderInterval(120)}
            >
              <ThemedText style={[styles.intervalButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>2 hours</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.currentInterval}>Current interval: {settings.reminderInterval} minutes</ThemedText>
        </View>

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <ThemedText type="subtitle">Enable Reminders</ThemedText>
            <Switch
              value={settings.isReminderEnabled}
              onValueChange={toggleReminders}
              trackColor={{ false: '#767577', true: Colors[colorScheme ?? 'light'].tint }}
              thumbColor={settings.isReminderEnabled ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          <ThemedText style={styles.settingDescription}>
            Receive push notifications to remind you to drink water
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Custom Amounts</ThemedText>
          <ThemedText style={styles.settingDescription}>
            Configure the quick add buttons on the home screen
          </ThemedText>
          {settings.customAmounts.map((amount, index) => (
            <View key={index} style={styles.customAmountRow}>
              <TouchableOpacity 
                style={[styles.amountButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => {
                  const newAmount = amount === 250 ? 500 : amount === 500 ? 1000 : 250;
                  updateCustomAmount(index, newAmount);
                }}
              >
                <ThemedText style={[styles.amountButtonText, { color: Colors[colorScheme ?? 'light'].buttonText }]}>{amount}ml</ThemedText>
              </TouchableOpacity>
              {settings.customAmounts.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeCustomAmount(index)}
                >
                  <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {settings.customAmounts.length < 5 && (
            <TouchableOpacity 
              style={[styles.addButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={addCustomAmount}
            >
              <ThemedText style={[styles.addButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                + Add Amount
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.resetButton, { borderColor: '#FF3B30' }]}
          onPress={resetSettings}
        >
          <ThemedText style={[styles.resetButtonText, { color: '#FF3B30' }]}>
            Reset to Defaults
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  goalButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  currentGoal: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  intervalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  intervalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  intervalButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  currentInterval: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 15,
  },
  customAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  amountButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  amountButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  addButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  resetButton: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
