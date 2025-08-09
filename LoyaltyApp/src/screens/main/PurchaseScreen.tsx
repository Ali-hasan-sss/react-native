import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store/store';
import { useTheme } from '../../hooks/useTheme';

const mockScans = [
  {
    id: '1',
    type: 'meal',
    points: 10,
    timestamp: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    type: 'drink',
    points: 5,
    timestamp: '2024-01-15T12:15:00Z',
  },
  {
    id: '3',
    type: 'meal',
    points: 15,
    timestamp: '2024-01-14T19:45:00Z',
  },
  {
    id: '4',
    type: 'drink',
    points: 3,
    timestamp: '2024-01-14T16:20:00Z',
  },
];

export function PurchaseScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const auth = useSelector((state: RootState) => state.auth);
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
  const [selectedTab, setSelectedTab] = useState<'recharge' | 'gift' | 'receive'>('recharge');

  const isRestaurant = auth.user?.accountType === 'restaurant';

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderScanItem = ({ item }: { item: any }) => (
    <View style={[styles.scanItem, { backgroundColor: colors.surface }]}>
      <View style={styles.scanIcon}>
        <Icon
          name={item.type === 'meal' ? 'restaurant' : 'local-cafe'}
          size={24}
          color={item.type === 'meal' ? colors.primary : colors.secondary}
        />
      </View>
      <View style={styles.scanDetails}>
        <Text style={[styles.scanType, { color: colors.text }]}>
          {item.type === 'meal' ? t('purchase.mealPoints') : t('purchase.drinkPoints')}
        </Text>
        <Text style={[styles.scanTime, { color: colors.textSecondary }]}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
      <Text style={[styles.scanPoints, { color: colors.error }]}>
        -{item.points} pts
      </Text>
    </View>
  );

  if (isRestaurant) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('restaurant.scans')}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Icon name="qr-code-scanner" size={32} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {mockScans.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('restaurant.recentScans')}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Icon name="trending-up" size={32} color={colors.success} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {mockScans.reduce((sum, scan) => sum + scan.points, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Points
            </Text>
          </View>
        </View>

        <View style={styles.scansList}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('restaurant.recentScans')}
          </Text>
          <FlatList
            data={mockScans}
            renderItem={renderScanItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.tabContainer}>
        {[
          { key: 'recharge', label: t('purchase.recharge'), icon: 'account-balance-wallet' },
          { key: 'gift', label: t('purchase.gift'), icon: 'card-giftcard' },
          { key: 'receive', label: t('purchase.receiveFromFriend'), icon: 'qr-code-scanner' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: selectedTab === tab.key ? colors.primary : colors.surface,
              },
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={selectedTab === tab.key ? 'white' : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedTab === tab.key ? 'white' : colors.textSecondary,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'recharge' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('purchase.recharge')}
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              {t('purchase.rechargeDesc')}
            </Text>
            
            <View style={styles.amountButtons}>
              {[10, 25, 50, 100].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.amountButton, { backgroundColor: colors.surface }]}
                >
                  <Text style={[styles.amountText, { color: colors.text }]}>
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'gift' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('purchase.giftOptions')}
            </Text>
            
            <View style={styles.giftOptions}>
              <TouchableOpacity
                style={[styles.giftOption, { backgroundColor: colors.surface }]}
              >
                <Icon name="account-balance-wallet" size={24} color={colors.success} />
                <Text style={[styles.giftOptionText, { color: colors.text }]}>
                  {t('purchase.walletBalance')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.giftOption, { backgroundColor: colors.surface }]}
              >
                <Icon name="local-cafe" size={24} color={colors.secondary} />
                <Text style={[styles.giftOptionText, { color: colors.text }]}>
                  {t('purchase.drinkPoints')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.giftOption, { backgroundColor: colors.surface }]}
              >
                <Icon name="restaurant" size={24} color={colors.primary} />
                <Text style={[styles.giftOptionText, { color: colors.text }]}>
                  {t('purchase.mealPoints')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selectedTab === 'receive' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('purchase.receiveFromFriend')}
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              {t('purchase.scanFriendCode')}
            </Text>

            <TouchableOpacity
              style={[styles.scanButton, { backgroundColor: colors.primary }]}
            >
              <Icon name="qr-code-scanner" size={32} color="white" />
              <Text style={styles.scanButtonText}>
                {t('purchase.scanOrUpload')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  amountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amountButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  giftOptions: {
    gap: 12,
  },
  giftOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  giftOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  scansList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  scanIcon: {
    marginRight: 12,
  },
  scanDetails: {
    flex: 1,
  },
  scanType: {
    fontSize: 16,
    fontWeight: '500',
  },
  scanTime: {
    fontSize: 12,
    marginTop: 2,
  },
  scanPoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});