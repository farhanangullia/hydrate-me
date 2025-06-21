import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useHydration } from '@/hooks/useHydration';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Configure notifications for both platforms
const configureNotifications = async () => {
  // Configure Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('hydration-reminders', {
      name: 'Hydration Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0a7ea4',
      sound: 'default',
      enableVibrate: true,
      showBadge: false,
    });
  }
  
  // iOS notification settings are configured in app.json and handled automatically
  // The app icon and color will be used automatically for iOS notifications
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const {
    hydrationData,
    settings,
    isLoading,
    addWaterIntake,
    resetDailyIntake,
    scheduleReminder,
    cancelReminders,
    getProgressPercentage,
  } = useHydration();
  const [nextReminder, setNextReminder] = useState<Date | null>(null);

  useEffect(() => {
    requestNotificationPermissions();
    configureNotifications();
  }, []);

  useEffect(() => {
    if (hydrationData.isReminderEnabled) {
      scheduleReminder();
      const trigger = new Date(Date.now() + hydrationData.reminderInterval * 60 * 1000);
      setNextReminder(trigger);
    } else {
      cancelReminders();
      setNextReminder(null);
    }
  }, [hydrationData.reminderInterval, hydrationData.isReminderEnabled]);

  const requestNotificationPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Permission Required', 'Please enable notifications to receive hydration reminders.');
        return;
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedText type="title" style={styles.title}>KEEP HYDRATING!!!</ThemedText>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: Colors[colorScheme ?? 'light'].tint
                }
              ]} 
            />
          </View>
          <ThemedText style={styles.progressText}>
            {hydrationData.totalIntake}ml / {hydrationData.dailyGoal}ml
          </ThemedText>
          <ThemedText style={styles.percentageText}>
            {Math.round(getProgressPercentage())}% of daily goal
          </ThemedText>
        </View>

        <View style={styles.quickAddContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Add</ThemedText>
          <View style={styles.buttonRow}>
            {settings.customAmounts.map((amount, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => addWaterIntake(amount)}
              >
                <ThemedText style={styles.buttonText}>
                  {amount >= 1000 ? `${amount / 1000}L` : `${amount}ml`}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Today&apos;s Stats</ThemedText>
          <View style={styles.statRow}>
            <ThemedText>Last drink:</ThemedText>
            <ThemedText style={styles.statValue}>
              {formatTime(hydrationData.lastDrink)}
            </ThemedText>
          </View>
          {nextReminder && (
            <View style={styles.statRow}>
              <ThemedText>Next reminder:</ThemedText>
              <ThemedText style={styles.statValue}>
                {formatTime(nextReminder)}
              </ThemedText>
            </View>
          )}
          <View style={styles.statRow}>
            <ThemedText>Reminder interval:</ThemedText>
            <ThemedText style={styles.statValue}>
              {hydrationData.reminderInterval} minutes
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.resetButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={resetDailyIntake}
        >
          <ThemedText style={[styles.resetButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
            Reset Daily Intake
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  logo: {
    height: 80,
    width: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 14,
    opacity: 0.7,
  },
  quickAddContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    marginBottom: 30,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statValue: {
    fontWeight: '600',
  },
  resetButton: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
