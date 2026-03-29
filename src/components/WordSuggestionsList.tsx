import React from 'react';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';

interface WordSuggestionsListProps {
  suggestions: string[];
  isDark?: boolean;
  onFoundWord?: () => void;
}

export function WordSuggestionsList({ suggestions, isDark = false, onFoundWord }: WordSuggestionsListProps) {
  const showFoundButton = suggestions.length > 0 && suggestions.length <= 10;
  
  if (suggestions.length === 0) {
    return (
      <View style={[styles.emptyContainer, isDark && styles.emptyContainerDark]}>
        <Text style={[styles.emptyText, isDark && styles.emptyTextDark]} numberOfLines={2}>Enter letters to see suggestions</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.header, isDark && styles.headerDark]} numberOfLines={1} adjustsFontSizeToFit>
        Possible Words ({suggestions.length})
      </Text>
      
      {showFoundButton && onFoundWord && (
        <Pressable 
          style={[styles.foundButton, isDark && styles.foundButtonDark]}
          onPress={onFoundWord}
        >
          <Text style={styles.foundButtonText}>🎉 Found It!</Text>
        </Pressable>
      )}
      
      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <View style={[styles.suggestionItem, isDark && styles.suggestionItemDark]}>
            <Text style={[styles.suggestionText, isDark && styles.suggestionTextDark]}>{item.toUpperCase()}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#1e1e1e',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexShrink: 1,
  },
  headerDark: {
    color: '#ffffff',
    borderBottomColor: '#3a3a3a',
  },
  list: {
    pointerEvents: 'auto',
  },
  foundButton: {
    backgroundColor: '#6aaa64',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foundButtonDark: {
    backgroundColor: '#6aaa64',
  },
  foundButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
  },
  suggestionItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionItemDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  suggestionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 2,
    flexShrink: 1,
  },
  suggestionTextDark: {
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    width: '100%',
  },
  emptyContainerDark: {
    backgroundColor: '#1e1e1e',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    width: '100%',
  },
  emptyTextDark: {
    color: '#a0a0a0',
  },
});
