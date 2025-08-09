import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';
import { RootState } from '../../store/store';
import { updateProfile, logout } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';

export function AccountScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  
  const [name, setName] = useState(auth.user?.name || '');
  const [email, setEmail] = useState(auth.user?.email || '');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isRestaurant = auth.user?.accountType === 'restaurant';

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }

    dispatch(updateProfile({ name: name.trim(), email: email.trim() }));
    Alert.alert(t('common.success'), 'Profile updated successfully');
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), 'New passwords do not match');
      return;
    }

    Alert.alert(t('common.success'), 'Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    Alert.alert(
      t('account.logout'),
      'Are you sure you want to logout?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('account.logout'), onPress: () => dispatch(logout()) },
      ]
    );
  };

  const userQRData = JSON.stringify({
    userId: auth.user?.id,
    email: auth.user?.email,
    type: 'user_receive',
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('account.profile')}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('account.name')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('account.email')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('account.phone')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>
              {t('account.save')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('account.updatePassword')}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('account.currentPassword')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('account.newPassword')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('account.confirmNewPassword')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleUpdatePassword}
          >
            <Text style={styles.saveButtonText}>
              {t('account.updatePassword')}
            </Text>
          </TouchableOpacity>
        </View>

        {!isRestaurant && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('account.myQRCode')}
            </Text>
            <Text style={[styles.qrDescription, { color: colors.textSecondary }]}>
              {t('account.qrCodeDesc')}
            </Text>

            <View style={styles.qrContainer}>
              <QRCode
                value={userQRData}
                size={150}
                color={colors.text}
                backgroundColor={colors.background}
              />
            </View>
          </View>
        )}

        {isRestaurant && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('restaurant.planManagement')}
            </Text>

            <TouchableOpacity
              style={[styles.upgradeButton, { backgroundColor: colors.warning }]}
            >
              <Icon name="workspace-premium" size={24} color="white" />
              <Text style={styles.upgradeButtonText}>
                {t('restaurant.upgradePlan')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color="white" />
          <Text style={styles.logoutButtonText}>
            {t('account.logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  saveButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  qrDescription: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    padding: 20,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});