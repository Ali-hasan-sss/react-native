import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Coffee,
  UtensilsCrossed,
  Wallet,
  ArrowRight,
  X,
} from 'lucide-react-native';
import { RootState } from '@/store/store';
import { updateRestaurantBalance } from '@/store/slices/restaurantSlice';
import { useTheme } from '@/hooks/useTheme';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  initialPaymentType?: 'drink' | 'meal' | 'wallet';
}

export function PaymentModal({
  visible,
  onClose,
  initialPaymentType = 'wallet',
}: PaymentModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);

  const [selectedPaymentType, setSelectedPaymentType] = useState<
    'drink' | 'meal' | 'wallet'
  >(initialPaymentType);
  const [amount, setAmount] = useState('');

  // Use selected restaurant's balance or fallback to default
  const currentBalance = selectedRestaurant?.userBalance || {
    walletBalance: 0,
    drinkPoints: 0,
    mealPoints: 0,
  };

  const paymentOptions = [
    {
      type: 'wallet' as const,
      label: t('purchase.walletBalance'),
      icon: Wallet,
      balance: currentBalance.walletBalance,
      color: colors.success,
      prefix: '$',
    },
    {
      type: 'drink' as const,
      label: t('purchase.drinkPoints'),
      icon: Coffee,
      balance: currentBalance.drinkPoints,
      color: colors.secondary,
      prefix: '',
    },
    {
      type: 'meal' as const,
      label: t('purchase.mealPoints'),
      icon: UtensilsCrossed,
      balance: currentBalance.mealPoints,
      color: colors.primary,
      prefix: '',
    },
  ];

  const selectedOption = paymentOptions.find(
    (option) => option.type === selectedPaymentType
  );
  const numericAmount = parseFloat(amount) || 0;
  const hasInsufficientBalance = numericAmount > (selectedOption?.balance || 0);

  const handleSlideConfirm = () => {
    if (!selectedRestaurant) {
      Alert.alert(t('common.error'), 'Please select a restaurant first');
      return;
    }

    // منع إعادة السحب إذا لم يتم إدخال قيمة صحيحة
    if (!amount || numericAmount <= 0) {
      Alert.alert(t('common.error'), 'Please enter a valid amount');
      return;
    }

    if (hasInsufficientBalance) {
      Alert.alert(t('common.error'), t('payment.insufficientBalance'));
      return;
    }

    // تنفيذ الدفع
    const newBalance = (selectedOption?.balance || 0) - numericAmount;
    switch (selectedPaymentType) {
      case 'wallet':
        dispatch(updateRestaurantBalance({
          restaurantId: selectedRestaurant.id,
          balanceType: 'walletBalance',
          amount: newBalance,
        }));
        break;
      case 'drink':
        dispatch(updateRestaurantBalance({
          restaurantId: selectedRestaurant.id,
          balanceType: 'drinkPoints',
          amount: newBalance,
        }));
        break;
      case 'meal':
        dispatch(updateRestaurantBalance({
          restaurantId: selectedRestaurant.id,
          balanceType: 'mealPoints',
          amount: newBalance,
        }));
        break;
    }

    // التوست أو الإشعار
    Alert.alert(t('common.success'), t('payment.paymentSuccessful'));

    // إعادة الحالة
    translateX.value = 0;
    setAmount('');
    onClose();
  };

  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // تمنع الخروج عن حدود الحاوية
      translateX.value = Math.min(event.translationX, 220);
    })
    .onEnd(() => {
      if (translateX.value > 200) {
        runOnJS(handleSlideConfirm)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContentWrapper}
          >
            <ScrollView
              contentContainerStyle={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.title, { color: colors.text }]}>
                {t('payment.selectPaymentMethod')}
              </Text>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('payment.currentBalance')}
              </Text>

              <View style={styles.paymentOptions}>
                {paymentOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = selectedPaymentType === option.type;

                  return (
                    <TouchableOpacity
                      key={option.type}
                      style={[
                        styles.paymentOption,
                        {
                          backgroundColor: isSelected
                            ? option.color + '20'
                            : colors.surface,
                          borderColor: isSelected
                            ? option.color
                            : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedPaymentType(option.type)}
                    >
                      <IconComponent size={24} color={option.color} />
                      <View style={styles.optionContent}>
                        <Text
                          style={[styles.optionLabel, { color: colors.text }]}
                        >
                          {option.label}
                        </Text>
                        <Text
                          style={[
                            styles.optionBalance,
                            { color: option.color },
                          ]}
                        >
                          {option.prefix}
                          {option.balance}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('payment.paymentAmount')}
              </Text>

              <TextInput
                style={[
                  styles.amountInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: hasInsufficientBalance
                      ? colors.error
                      : colors.border,
                  },
                ]}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              {hasInsufficientBalance && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {t('payment.insufficientBalance')}
                </Text>
              )}

              <View
                style={[
                  styles.slideContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* أسهم الخلفية كدلالة سحب */}
                <View style={styles.slideHints}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ArrowRight
                      key={index}
                      size={18}
                      color={colors.textSecondary}
                      style={{ marginHorizontal: 4 }}
                    />
                  ))}
                </View>

                <GestureDetector gesture={panGesture}>
                  <Animated.View
                    style={[
                      styles.slideButton,
                      animatedStyle,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <ArrowRight size={24} color="white" />
                  </Animated.View>
                </GestureDetector>
              </View>

              <TouchableOpacity style={[styles.cancelButton]} onPress={onClose}>
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  <X size={24} color="white" />
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </BlurView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  modalContentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  paymentOptions: {
    gap: 12,
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionContent: {
    marginLeft: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionBalance: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  amountInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideContainer: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  slideHints: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  slideButton: {
    position: 'absolute',
    left: 4,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  slideText: {
    fontSize: 16,
    fontWeight: '500',
  },

  cancelButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  cancelButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
