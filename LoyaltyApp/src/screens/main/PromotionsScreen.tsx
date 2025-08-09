import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store/store';
import { useTheme } from '../../hooks/useTheme';
import { CreateAdModal } from '../../components/CreateAdModal';

const mockPromotions = [
  {
    id: '1',
    title: '20% Off All Pizzas',
    description: 'Get 20% discount on all pizza orders',
    restaurant: 'Pizza Palace',
    validUntil: '2024-02-15',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
    type: 'food',
  },
  {
    id: '2',
    title: 'Buy 2 Get 1 Free Coffee',
    description: 'Purchase any 2 coffees and get the third one free',
    restaurant: 'Café Central',
    validUntil: '2024-02-20',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    type: 'drinks',
  },
];

export function PromotionsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const auth = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [createAdModalVisible, setCreateAdModalVisible] = useState(false);

  const isRestaurant = auth.user?.accountType === 'restaurant';

  const filters = [
    { key: 'all', label: 'All', icon: 'apps' },
    { key: 'food', label: t('promotions.food'), icon: 'restaurant' },
    { key: 'drinks', label: t('promotions.drinks'), icon: 'local-cafe' },
  ];

  const filteredPromotions = mockPromotions.filter(promotion => {
    const matchesSearch = promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promotion.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || promotion.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('promotions.search')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedFilter === filter.key
                    ? colors.primary
                    : colors.surface,
                },
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Icon
                name={filter.icon}
                size={16}
                color={selectedFilter === filter.key ? 'white' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: selectedFilter === filter.key ? 'white' : colors.textSecondary,
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.promotionsList}>
          {filteredPromotions.length > 0 ? (
            filteredPromotions.map((promotion) => (
              <View
                key={promotion.id}
                style={[styles.promotionCard, { backgroundColor: colors.surface }]}
              >
                <Image source={{ uri: promotion.image }} style={styles.promotionImage} />
                <View style={styles.promotionContent}>
                  <Text style={[styles.promotionTitle, { color: colors.text }]}>
                    {promotion.title}
                  </Text>
                  <Text style={[styles.promotionDescription, { color: colors.textSecondary }]}>
                    {promotion.description}
                  </Text>
                  <View style={styles.promotionFooter}>
                    <Text style={[styles.restaurantName, { color: colors.primary }]}>
                      {promotion.restaurant}
                    </Text>
                    <Text style={[styles.validUntil, { color: colors.textSecondary }]}>
                      {t('promotions.validUntil', { date: promotion.validUntil })}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="local-offer" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('promotions.noPromotions')}
              </Text>
            </View>
          )}
        </ScrollView>

        {isRestaurant && (
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary }]}
            onPress={() => setCreateAdModalVisible(true)}
          >
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {isRestaurant && (
        <CreateAdModal
          visible={createAdModalVisible}
          onClose={() => setCreateAdModalVisible(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filtersContent: {
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  promotionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  promotionCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promotionImage: {
    width: '100%',
    height: 150,
  },
  promotionContent: {
    padding: 16,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promotionDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  promotionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
  },
  validUntil: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});