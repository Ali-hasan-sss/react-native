import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react-native';
import { RootState } from '@/store/store';
import { setSelectedRestaurant } from '@/store/slices/restaurantSlice';
import { useTheme } from '@/hooks/useTheme';

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  userBalance: {
    walletBalance: number;
    drinkPoints: number;
    mealPoints: number;
  };
}

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Café Central',
    address: '123 Coffee Street, Downtown',
    userBalance: {
      walletBalance: 150.75,
      drinkPoints: 25,
      mealPoints: 12,
    },
  },
  {
    id: '2',
    name: 'Pizza Palace',
    address: '456 Italian Avenue, City Center',
    userBalance: {
      walletBalance: 89.50,
      drinkPoints: 18,
      mealPoints: 8,
    },
  },
  {
    id: '3',
    name: 'Burger Barn',
    address: '789 Grill Road, Food District',
    userBalance: {
      walletBalance: 203.25,
      drinkPoints: 32,
      mealPoints: 15,
    },
  },
];

interface RestaurantSelectorProps {
  onRestaurantChange?: (restaurant: Restaurant) => void;
}

export function RestaurantSelector({ onRestaurantChange }: RestaurantSelectorProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));
    onRestaurantChange?.(restaurant);
    setModalVisible(false);
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={[
        styles.restaurantItem,
        {
          backgroundColor: selectedRestaurant?.id === item.id ? colors.primary + '20' : colors.surface,
          borderColor: selectedRestaurant?.id === item.id ? colors.primary : colors.border,
        },
      ]}
      onPress={() => handleSelectRestaurant(item)}
    >
      <View style={styles.restaurantInfo}>
        <Text style={[styles.restaurantName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.restaurantAddress, { color: colors.textSecondary }]}>
          {item.address}
        </Text>
      </View>
      {selectedRestaurant?.id === item.id && (
        <Check size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Restaurant
          </Text>
          <Text style={[styles.selectedText, { color: colors.text }]}>
            {selectedRestaurant?.name || 'Select Restaurant'}
          </Text>
        </View>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Restaurant
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={mockRestaurants}
              renderItem={renderRestaurant}
              keyExtractor={(item) => item.id}
              style={styles.restaurantList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  selectorContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 16,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantList: {
    maxHeight: 400,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
  },
});