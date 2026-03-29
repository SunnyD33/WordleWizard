import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { GuessRow } from "@/src/components/GuessRow";
import { VirtualKeyboard } from "@/src/components/VirtualKeyboard";
import { WordSuggestionsList } from "@/src/components/WordSuggestionsList";
import { GuessRow as GuessRowType, LetterStatus } from "@/src/types/wordle";
import { getTopSuggestions } from "@/src/utils/wordFilter";
import { WORDLE_ANSWERS } from "@/src/data/wordList";
import { validateHardModeGuess } from "@/src/utils/hardModeValidator";

const TILES_PER_ROW = 5;
const MAX_GUESSES = 6;

type ThemeMode = 'light' | 'dark' | 'auto';

function createEmptyRow(): GuessRowType {
  return {
    tiles: Array(TILES_PER_ROW)
      .fill(null)
      .map(() => ({
        letter: "",
        status: "empty" as LetterStatus,
      })),
  };
}

export default function HomeScreen() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [hardMode, setHardMode] = useState(false);
  
  // Determine actual theme to use
  const isDark = themeMode === 'auto' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';
  
  const [guesses, setGuesses] = useState<GuessRowType[]>(
    Array(MAX_GUESSES).fill(null).map(() => createEmptyRow())
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentTile, setCurrentTile] = useState(0);
  const [currentStatus, setCurrentStatus] =
    useState<LetterStatus>("not-in-word");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load settings on mount and poll periodically for changes
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
    
    // Poll for setting changes every second
    const interval = setInterval(loadSettings, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newSuggestions = getTopSuggestions(
      WORDLE_ANSWERS,
      guesses,
      20,
      hardMode
    );
    setSuggestions(newSuggestions);
  }, [guesses, hardMode]);

  // Add keyboard support for web
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();

      // Handle backspace
      if (key === "BACKSPACE") {
        event.preventDefault();
        handleBackspace();
        return;
      }

      // Handle letter keys (A-Z)
      if (key.length === 1 && /^[A-Z]$/.test(key)) {
        event.preventDefault();
        handleLetterPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTile, currentRow, guesses, currentStatus]);

  const handleLetterPress = (letter: string) => {
    if (currentRow >= MAX_GUESSES || currentTile >= TILES_PER_ROW) return;

    const newGuesses = [...guesses];
    newGuesses[currentRow].tiles[currentTile] = {
      letter,
      status: currentStatus,
    };

    setGuesses(newGuesses);

    if (currentTile < TILES_PER_ROW - 1) {
      setCurrentTile(currentTile + 1);
    }
  };

  const handleBackspace = () => {
    if (currentTile === 0 && !guesses[currentRow].tiles[0].letter) return;

    const newGuesses = [...guesses];
    const currentGuess = newGuesses[currentRow];

    // If current tile has a letter, delete it
    if (currentGuess.tiles[currentTile].letter) {
      currentGuess.tiles[currentTile] = {
        letter: "",
        status: "empty",
      };
      setGuesses(newGuesses);
    }
    // Otherwise, move back and delete previous tile
    else if (currentTile > 0) {
      const newTile = currentTile - 1;
      currentGuess.tiles[newTile] = {
        letter: "",
        status: "empty",
      };
      setGuesses(newGuesses);
      setCurrentTile(newTile);
    }
  };

  const handleReset = () => {
    setGuesses(Array(MAX_GUESSES).fill(null).map(() => createEmptyRow()));
    setCurrentRow(0);
    setCurrentTile(0);
    setSuggestions([]);
    setShowCelebration(false);
  };

  const handleFoundWord = async () => {
    // Trigger haptic feedback on mobile
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Show celebration modal
    setShowCelebration(true);
  };

  const handleCelebrationClose = (shouldReset: boolean) => {
    setShowCelebration(false);
    if (shouldReset) {
      handleReset();
    }
  };

  const handleNextRow = () => {
    if (currentRow >= MAX_GUESSES - 1) return;

    // Validate hard mode if enabled
    if (hardMode) {
      const previousGuesses = guesses.slice(0, currentRow);
      const validation = validateHardModeGuess(guesses[currentRow], previousGuesses);
      
      if (!validation.isValid) {
        if (Platform.OS === 'web') {
          alert(validation.errorMessage);
        } else {
          Alert.alert('Invalid Guess', validation.errorMessage);
        }
        return;
      }
    }

    setCurrentRow(currentRow + 1);
    setCurrentTile(0);
  };

  const handleTilePress = (rowIndex: number, tileIndex: number) => {
    const tile = guesses[rowIndex].tiles[tileIndex];
    if (!tile.letter) return;

    const statusCycle: LetterStatus[] = [
      "not-in-word",
      "wrong-position",
      "correct",
    ];
    const currentIndex = statusCycle.indexOf(tile.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    const newGuesses = [...guesses];
    newGuesses[rowIndex].tiles[tileIndex] = {
      ...tile,
      status: nextStatus,
    };
    setGuesses(newGuesses);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={["top"]}>
      <KeyboardAvoidingView
        style={[styles.container, isDark && styles.containerDark]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.header, isDark && styles.headerDark]}>
          {hardMode && (
            <View style={styles.hardModeBadge}>
              <Text style={styles.hardModeText}>Hard Mode</Text>
            </View>
          )}
          {!hardMode && <View style={styles.headerSpacer} />}
          <Text style={[styles.title, isDark && styles.titleDark]}>Wordle Wizard</Text>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
        </View>

        <ScrollView
          style={[styles.content, isDark && styles.contentDark]}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.guessGrid}>
            {guesses.map((row, index) => (
              <GuessRow
                key={index}
                row={row}
                isActive={index === currentRow}
                isDark={isDark}
                onTilePress={(tileIndex) => handleTilePress(index, tileIndex)}
              />
            ))}
          </View>

          {currentRow < MAX_GUESSES - 1 && 
           guesses[currentRow].tiles.every(tile => tile.letter !== '') && (
            <Pressable style={styles.nextRowButton} onPress={handleNextRow}>
              <Text style={styles.nextRowButtonText}>Next Guess ↓</Text>
            </Pressable>
          )}

          <View style={styles.suggestionsContainer}>
            <WordSuggestionsList 
              suggestions={suggestions} 
              isDark={isDark}
              onFoundWord={handleFoundWord}
            />
          </View>
        </ScrollView>

        {/* Celebration Modal */}
        <Modal
          visible={showCelebration}
          transparent={true}
          animationType="fade"
          onRequestClose={() => handleCelebrationClose(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.celebrationCard, isDark && styles.celebrationCardDark]}>
              <Text style={styles.celebrationEmoji}>🎉</Text>
              <Text style={[styles.celebrationTitle, isDark && styles.celebrationTitleDark]}>
                Congratulations!
              </Text>
              <Text style={[styles.celebrationMessage, isDark && styles.celebrationMessageDark]}>
                You found the word!{'\n'}Want to start a new game?
              </Text>
              
              <View style={styles.celebrationButtons}>
                <Pressable 
                  style={[styles.celebrationButton, styles.celebrationButtonSecondary]}
                  onPress={() => handleCelebrationClose(false)}
                >
                  <Text style={styles.celebrationButtonSecondaryText}>Keep Board</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.celebrationButton, styles.celebrationButtonPrimary]}
                  onPress={() => handleCelebrationClose(true)}
                >
                  <Text style={styles.celebrationButtonPrimaryText}>New Game</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <VirtualKeyboard
          onLetterPress={handleLetterPress}
          onBackspace={handleBackspace}
          onStatusChange={setCurrentStatus}
          currentStatus={currentStatus}
          isDark={isDark}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  headerDark: {
    borderBottomColor: "#3a3a3a",
    backgroundColor: "#121212",
  },
  headerSpacer: {
    width: 68,
  },
  hardModeBadge: {
    width: 68,
    backgroundColor: '#c9b458',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardModeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000000",
    flex: 1,
    textAlign: "center",
  },
  titleDark: {
    color: "#ffffff",
  },
  resetButton: {
    backgroundColor: "#6aaa64",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentDark: {
    backgroundColor: '#121212',
  },
  contentContainer: {
    padding: 16,
  },
  guessGrid: {
    alignItems: "center",
    marginBottom: 16,
  },
  nextRowButton: {
    backgroundColor: "#6aaa64",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 24,
  },
  nextRowButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  suggestionsContainer: {
    flex: 1,
    minHeight: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  celebrationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  celebrationCardDark: {
    backgroundColor: '#1e1e1e',
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 12,
  },
  celebrationTitleDark: {
    color: '#ffffff',
  },
  celebrationMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  celebrationMessageDark: {
    color: '#a0a0a0',
  },
  celebrationButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  celebrationButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  celebrationButtonPrimary: {
    backgroundColor: '#6aaa64',
  },
  celebrationButtonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  celebrationButtonSecondary: {
    backgroundColor: '#d3d6da',
  },
  celebrationButtonSecondaryText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});
