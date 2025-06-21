import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export interface HydrationData {
  totalIntake: number;
  lastDrink: Date;
  dailyGoal: number;
  reminderInterval: number; // in minutes
  isReminderEnabled: boolean;
}

export interface HydrationSettings {
  dailyGoal: number;
  reminderInterval: number;
  isReminderEnabled: boolean;
  customAmounts: number[];
}

const DEFAULT_HYDRATION_DATA: HydrationData = {
  totalIntake: 0,
  lastDrink: new Date(),
  dailyGoal: 2000,
  reminderInterval: 60,
  isReminderEnabled: true,
};

const DEFAULT_SETTINGS: HydrationSettings = {
  dailyGoal: 2000,
  reminderInterval: 60,
  isReminderEnabled: true,
  customAmounts: [250, 500, 1000],
};

export const useHydration = () => {
  const [hydrationData, setHydrationData] = useState<HydrationData>(DEFAULT_HYDRATION_DATA);
  const [settings, setSettings] = useState<HydrationSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load settings first
      const storedSettings = await AsyncStorage.getItem('hydrationSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
      }

      // Load hydration data
      const storedHydration = await AsyncStorage.getItem('hydrationData');
      if (storedHydration) {
        const parsedHydration = JSON.parse(storedHydration);
        parsedHydration.lastDrink = new Date(parsedHydration.lastDrink);
        
        // Sync with settings
        const syncedHydration = {
          ...parsedHydration,
          dailyGoal: settings.dailyGoal || parsedHydration.dailyGoal,
          reminderInterval: settings.reminderInterval || parsedHydration.reminderInterval,
          isReminderEnabled: settings.isReminderEnabled !== undefined ? settings.isReminderEnabled : parsedHydration.isReminderEnabled,
        };
        
        setHydrationData(syncedHydration);
        await AsyncStorage.setItem('hydrationData', JSON.stringify(syncedHydration));
      }
    } catch (error) {
      console.error('Error loading hydration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHydrationData = async (data: HydrationData) => {
    try {
      await AsyncStorage.setItem('hydrationData', JSON.stringify(data));
      setHydrationData(data);
    } catch (error) {
      console.error('Error saving hydration data:', error);
    }
  };

  const saveSettings = async (newSettings: HydrationSettings) => {
    try {
      await AsyncStorage.setItem('hydrationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Update hydration data with new settings
      const updatedHydrationData = {
        ...hydrationData,
        dailyGoal: newSettings.dailyGoal,
        reminderInterval: newSettings.reminderInterval,
        isReminderEnabled: newSettings.isReminderEnabled,
      };
      
      await saveHydrationData(updatedHydrationData);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const addWaterIntake = async (amount: number) => {
    const newData = {
      ...hydrationData,
      totalIntake: hydrationData.totalIntake + amount,
      lastDrink: new Date(),
    };
    await saveHydrationData(newData);
  };

  const resetDailyIntake = async () => {
    const newData = {
      ...hydrationData,
      totalIntake: 0,
      lastDrink: new Date(),
    };
    await saveHydrationData(newData);
  };

  const scheduleReminder = async () => {
    if (Platform.OS === 'web' || !hydrationData.isReminderEnabled) return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      const notificationContent = {
        title: 'Time to Hydrate! 💧',
        body: 'Your body needs water. Take a sip to stay healthy!',
        sound: true,
        color: '#0a7ea4',
        ...(Platform.OS === 'android' && {
          priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
      };
      
      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: hydrationData.reminderInterval * 60,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  };

  const cancelReminders = async () => {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling reminders:', error);
    }
  };

  const getProgressPercentage = () => {
    return Math.min((hydrationData.totalIntake / hydrationData.dailyGoal) * 100, 100);
  };

  return {
    hydrationData,
    settings,
    isLoading,
    addWaterIntake,
    resetDailyIntake,
    saveSettings,
    scheduleReminder,
    cancelReminders,
    getProgressPercentage,
  };
}; 