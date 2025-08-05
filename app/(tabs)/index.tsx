import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Camera,
  Coffee,
  Star,
  UtensilsCrossed,
  Wallet,
  QrCode,
} from 'lucide-react-native';
import { RootState } from '@/store/store';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { PaymentModal } from '@/components/PaymentModal';
import { RestaurantSelector, mockRestaurants, Restaurant } from '@/components/RestaurantSelector';
import { setSelectedRestaurant, setRestaurants } from '@/store/slices/restaurantSlice';
import QRCode from 'react-native-qrcode-svg';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    'drink' | 'meal' | 'wallet'
  >('wallet');

  const [showWelcome, setShowWelcome] = useState(true);
  const isRestaurant = auth.user?.accountType === 'restaurant';

  useEffect(() => {
    // Initialize restaurants data
    dispatch(setRestaurants(mockRestaurants));
    if (!selectedRestaurant) {
      dispatch(setSelectedRestaurant(mockRestaurants[0]));
    }
  }, [dispatch, selectedRestaurant]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowWelcome(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  const handleScanCode = () => {
    router.push('/camera/scan');
  };

  const handlePayWithDrink = () => {
    setSelectedPaymentType('drink');
    setPaymentModalVisible(true);
  };

  const handlePayWithMeal = () => {
    setSelectedPaymentType('meal');
    setPaymentModalVisible(true);
  };

  const handlePayWithWallet = () => {
    setSelectedPaymentType('wallet');
    setPaymentModalVisible(true);
  };

  const handleRestaurantChange = (restaurant: Restaurant) => {
    // Restaurant change is handled in the RestaurantSelector component
  };

  // Use selected restaurant's balance or fallback to default
  const currentBalance = selectedRestaurant?.userBalance || {
    walletBalance: 0,
    drinkPoints: 0,
    mealPoints: 0,
  };

  // Restaurant QR codes
  const restaurantCodes = {
    meals: JSON.stringify({
      type: 'meal',
      restaurantId: selectedRestaurant?.id || '1',
      restaurantName: selectedRestaurant?.name || 'Restaurant',
    }),
    drinks: JSON.stringify({
      type: 'drink',
      restaurantId: selectedRestaurant?.id || '1',
      restaurantName: selectedRestaurant?.name || 'Restaurant',
    }),
  };
  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {showWelcome && (
          <LinearGradient
            colors={colors.gradient}
            style={styles.welcomeSection}
          >
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.subtitle}>{t('home.title')}</Text>
          </LinearGradient>
        )}

        <View style={styles.content}>
          {!isRestaurant && (
            <RestaurantSelector onRestaurantChange={handleRestaurantChange} />
          )}

          {isRestaurant ? (
            <View style={styles.restaurantSection}>
              <Text style={[styles.restaurantTitle, { color: colors.text }]}>
                {selectedRestaurant?.name || 'My Restaurant'}
              </Text>
              
              <View style={styles.qrCodesContainer}>
                <View style={[styles.qrCodeCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.qrCodeHeader}>
                    <UtensilsCrossed size={24} color={colors.primary} />
                    <Text style={[styles.qrCodeTitle, { color: colors.text }]}>
                      {t('restaurant.mealsCode')}
                    </Text>
                  </View>
                  <View style={styles.qrCodeWrapper}>
                    <QRCode
                      value={restaurantCodes.meals}
                      size={120}
                      color={colors.text}
                      backgroundColor={colors.background}
                    />
                  </View>
                </View>

                <View style={[styles.qrCodeCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.qrCodeHeader}>
                    <Coffee size={24} color={colors.secondary} />
                    <Text style={[styles.qrCodeTitle, { color: colors.text }]}>
                      {t('restaurant.drinksCode')}
                    </Text>
                  </View>
                  <View style={styles.qrCodeWrapper}>
                    <QRCode
                      value={restaurantCodes.drinks}
                      size={120}
                      color={colors.text}
                      backgroundColor={colors.background}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={handleScanCode}
            >
              <Camera size={32} color="white" />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.primaryButtonText}>{t('home.scanCode')}</Text>
                <Text style={styles.primaryButtonDesc}>
                  {t('home.scanCodeDesc')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {!isRestaurant && (
            <View style={styles.paymentButtons}>
              <TouchableOpacity
                style={[
                  styles.paymentButton,
                  { backgroundColor: colors.surface },
                ]}
                onPress={handlePayWithWallet}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.success + '20' },
                  ]}
                >
                  <View
                    style={{
                      borderRadius: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                    }}
                  >
                    <Wallet size={24} color={colors.success} />
                    <Text style={{ color: colors.success }}>
                      {currentBalance.walletBalance.toFixed(2)} $
                    </Text>
                  </View>
                  <View
                    style={{
                      borderRadius: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                    }}
                  >
                    <UtensilsCrossed size={24} color={colors.primary} />
                    <Text style={{ color: colors.success }}>
                      {currentBalance.mealPoints} <Star size={16} color={colors.success} />
                    </Text>
                  </View>
                  <View
                    style={{
                      borderRadius: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                    }}
                  >
                    <Coffee size={24} color={colors.secondary} />
                    <Text style={{ color: colors.success }}>
                      {currentBalance.drinkPoints} <Star size={16} color={colors.success} />
                    </Text>
                  </View>
                </View>
                <Text style={[styles.paymentButtonText, { color: colors.text }]}>
                  {t('home.payWallet')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {!isRestaurant && (
        <PaymentModal
          visible={paymentModalVisible}
          onClose={() => setPaymentModalVisible(false)}
          initialPaymentType={selectedPaymentType}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonTextContainer: {
    marginLeft: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  primaryButtonDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  paymentButtons: {
    gap: 16,
  },
  paymentButton: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    alignSelf: 'center',
  },
  paymentButtonDesc: {
    fontSize: 14,
  },
  restaurantSection: {
    marginBottom: 24,
  },
  restaurantTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrCodesContainer: {
    gap: 20,
  },
  qrCodeCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  qrCodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  qrCodeTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  qrCodeWrapper: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
});
