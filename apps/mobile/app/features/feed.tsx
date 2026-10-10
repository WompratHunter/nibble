import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import FeedList from '@/components/feed-list';
import RecipeButton from '@/components/ui/recipe-button';
import { Colors } from '@/constants/theme';
import { useFeedData } from '@/hooks/use-feed-data';
import { ResolvedFeedItem } from '@/types/feed';

export default function FeedScreen() {
  const { items, activeIndex, setActiveIndex, activeItem, isLoading, error } = useFeedData();
  const isFocused = useIsFocused();
  const { height: windowHeight } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const itemHeight = windowHeight - tabBarHeight;

  const handleRecipePress = (item: ResolvedFeedItem) => {
    // TODO: navigate to recipe screen
    console.log('Recipe pressed:', item.title);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color={Colors.accent}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading feed"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FeedList
        items={items}
        activeIndex={activeIndex}
        isFocused={isFocused}
        onActiveChange={setActiveIndex}
        itemHeight={itemHeight}
      />
      <View style={styles.fabContainer}>
        <RecipeButton item={activeItem} onPress={handleRecipePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 24,
  },
});
