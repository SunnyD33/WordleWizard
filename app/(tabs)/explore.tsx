import { StyleSheet } from "react-native";

import { Collapsible } from "@/components/ui/collapsible";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

export default function InstructionsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#6aaa64", dark: "#538d4e" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#ffffff"
          name="questionmark.circle"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          How to Use
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Wordle Wizard helps you find possible words based on your Wordle
        guesses.
      </ThemedText>

      <Collapsible title="Getting Started">
        <ThemedText>
          1. Tap letters on the keyboard to fill in your guess{"\n"}
          2. Mark each letter&apos;s status (gray, yellow, or green){"\n"}
          3. See suggested words that match your clues{"\n"}
          4. Use the Reset button to clear and start over
        </ThemedText>
      </Collapsible>

      <Collapsible title="Marking Letter Status">
        <ThemedText>
          Before typing a letter, select its status:{"\n\n"}
          <ThemedText type="defaultSemiBold">✓ Correct</ThemedText> - Letter is
          in the correct position (green){"\n"}
          <ThemedText type="defaultSemiBold">? Wrong Spot</ThemedText> - Letter
          is in the word but wrong position (yellow){"\n"}
          <ThemedText type="defaultSemiBold">✗ Not In Word</ThemedText> - Letter
          is not in the word (gray)
        </ThemedText>
      </Collapsible>

      <Collapsible title="Changing Letter Status">
        <ThemedText>
          You can also tap any filled letter tile to cycle through the statuses:
          {"\n\n"}
          Gray → Yellow → Green → Gray...
        </ThemedText>
      </Collapsible>

      <Collapsible title="Word Suggestions">
        <ThemedText>
          As you enter letters, the app filters through thousands of possible
          Wordle answers and shows you the most likely matches based on your
          clues.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Hard Mode">
        <ThemedText>
          Enable Hard Mode in Settings for an extra challenge!{"\n\n"}
          <ThemedText type="defaultSemiBold">When Hard Mode is ON:</ThemedText>
          {"\n"}• Green letters (correct position) must be reused in the same
          spot{"\n"}• Yellow letters (wrong position) must be included in future
          guesses{"\n"}• The app validates your guesses and alerts you if they
          break the rules{"\n"}• Suggestions are filtered to only show valid
          hard mode words{"\n\n"}
          Perfect for players who want to practice Wordle`&apos;s hard mode!
        </ThemedText>
      </Collapsible>

      <Collapsible title="Tips">
        <ThemedText>
          • You only need to enter one guess at a time{"\n"}• The suggestions
          update instantly as you type{"\n"}• Use the backspace key (⌫) to
          delete letters{"\n"}• Hit Reset to clear everything and start fresh
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
