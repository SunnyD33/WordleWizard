import { StyleSheet, View, Text, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'auto';

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [hardMode, setHardMode] = useState(false);

  const isDark = themeMode === 'auto' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        const savedHardMode = await AsyncStorage.getItem('hardMode');
        
        if (savedTheme) setThemeMode(savedTheme as ThemeMode);
        if (savedHardMode) setHardMode(savedHardMode === 'true');
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleThemeChange = async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const handleHardModeToggle = async (value: boolean) => {
    setHardMode(value);
    try {
      await AsyncStorage.setItem('hardMode', value.toString());
    } catch (error) {
      console.log('Error saving hard mode:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.header, isDark && styles.headerDark]}>Settings</Text>

        {/* Hard Mode Section */}
        <View style={styles.section}>
          <View style={[styles.settingRow, isDark && styles.settingRowDark]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isDark && styles.settingTitleDark]}>Hard Mode</Text>
              <Text style={[styles.settingDescription, isDark && styles.settingDescriptionDark]}>
                Any revealed hints must be used in subsequent guesses
              </Text>
            </View>
            <Switch
              value={hardMode}
              onValueChange={handleHardModeToggle}
              trackColor={{ false: '#d3d6da', true: '#6aaa64' }}
              thumbColor={hardMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Appearance</Text>
          
          <Pressable 
            style={[styles.themeOption, isDark && styles.themeOptionDark, themeMode === 'auto' && styles.themeOptionActive]}
            onPress={() => handleThemeChange('auto')}
          >
            <Text style={styles.themeIcon}>⚙️</Text>
            <View style={styles.themeInfo}>
              <Text style={[styles.themeTitle, isDark && styles.themeTitleDark]}>Auto</Text>
              <Text style={[styles.themeDescription, isDark && styles.themeDescriptionDark]}>
                Match system theme
              </Text>
            </View>
            {themeMode === 'auto' && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>

          <Pressable 
            style={[styles.themeOption, isDark && styles.themeOptionDark, themeMode === 'light' && styles.themeOptionActive]}
            onPress={() => handleThemeChange('light')}
          >
            <Text style={styles.themeIcon}>☀️</Text>
            <View style={styles.themeInfo}>
              <Text style={[styles.themeTitle, isDark && styles.themeTitleDark]}>Light</Text>
              <Text style={[styles.themeDescription, isDark && styles.themeDescriptionDark]}>
                Always use light theme
              </Text>
            </View>
            {themeMode === 'light' && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>

          <Pressable 
            style={[styles.themeOption, isDark && styles.themeOptionDark, themeMode === 'dark' && styles.themeOptionActive]}
            onPress={() => handleThemeChange('dark')}
          >
            <Text style={styles.themeIcon}>🌙</Text>
            <View style={styles.themeInfo}>
              <Text style={[styles.themeTitle, isDark && styles.themeTitleDark]}>Dark</Text>
              <Text style={[styles.themeDescription, isDark && styles.themeDescriptionDark]}>
                Always use dark theme
              </Text>
            </View>
            {themeMode === 'dark' && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 24,
  },
  headerDark: {
    color: '#ffffff',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#ffffff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  settingRowDark: {
    backgroundColor: '#2a2a2a',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  settingTitleDark: {
    color: '#ffffff',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
  },
  settingDescriptionDark: {
    color: '#a0a0a0',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeOptionDark: {
    backgroundColor: '#2a2a2a',
  },
  themeOptionActive: {
    borderColor: '#6aaa64',
  },
  themeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  themeInfo: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  themeTitleDark: {
    color: '#ffffff',
  },
  themeDescription: {
    fontSize: 14,
    color: '#666666',
  },
  themeDescriptionDark: {
    color: '#a0a0a0',
  },
  checkmark: {
    fontSize: 20,
    color: '#6aaa64',
    fontWeight: '700',
  },
});
