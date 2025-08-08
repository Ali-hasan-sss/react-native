import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../store/store';
import { updateRestaurantBalance } from '../store/slices/restaurantSlice';
import { useTheme } from '../hooks/useTheme';

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
      icon: 'account-balance-wallet',
      balance: currentBalance.walletBalance,
      color: colors.success,
      prefix: '$',
    },
    {
      type: 'drink' as const,
      label: t('purchase.drinkPoints'),
      icon: 'local-cafe',
      balance: currentBalance.drinkPoints,
      color: colors.secondary,
      prefix: '',
    },
    {
      type: 'meal' as const,
      label: t('purchase.mealPoints'),
      icon: 'restaurant',
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

  const handleConfirmPayment = () => {
    if (!selectedRestaurant) {
      Alert.alert(t('common.error'), 'Please select a restaurant first');
      return;
    }

    if (!amount || numericAmount <= 0) {
      Alert.alert(t('common.error'), 'Please enter a valid amount');
      return;
    }

    if (hasInsufficientBalance) {
      Alert.alert(t('common.error'), t('payment.insufficientBalance'));
      return;
    }

    // Process payment
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

    Alert.alert(t('common.success'), t('payment.paymentSuccessful'));
    setAmount('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('payment.selectPaymentMethod')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('payment.currentBalance')}
            </Text>

            <View style={styles.paymentOptions}>
              {paymentOptions.map((option) => {
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
                    <Icon name={option.icon} size={24} color={option.color} />
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

            <TouchableOpacity
              style={[
                styles.confirmButton,
                {
                  backgroundColor: hasInsufficientBalance || !amount
                    ? colors.border
                    : colors.primary,
                },
              ]}
              onPress={handleConfirmPayment}
              disabled={hasInsufficientBalance || !amount}
            >
              <Text style={styles.confirmButtonText}>
                {t('common.confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 16,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
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
  confirmButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});