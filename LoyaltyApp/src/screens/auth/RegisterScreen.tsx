import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { loginStart, loginSuccess } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import { Checkbox } from '../../components/Checkbox';
import { PrivacyPolicyModal } from '../../components/PrivacyPolicyModal';
import { TermsOfUseModal } from '../../components/TermsOfUseModal';

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), 'Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert(t('common.error'), 'Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    // Simulate API call
    setTimeout(() => {
      dispatch(loginSuccess({
        id: '1',
        email,
        name: email === 'restaurant@example.com' ? 'Restaurant Owner' : 'New User',
      }));
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <LinearGradient
        colors={colors.gradient}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.text }]}>
                {t('auth.register')}
              </Text>
              
              <View style={[styles.form, { backgroundColor: colors.surface }]}>
                <View style={styles.inputContainer}>
                  <Icon name="email" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={t('auth.email')}
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={t('auth.password')}
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={t('auth.confirmPassword')}
                    placeholderTextColor={colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>

                <View style={styles.checkboxContainer}>
                  <Checkbox
                    checked={agreedToTerms}
                    onPress={() => setAgreedToTerms(!agreedToTerms)}
                  />
                  <Text style={[styles.checkboxText, { color: colors.textSecondary }]}>
                    {t('auth.agreeToTerms').split(' ').slice(0, 4).join(' ')}{' '}
                    <TouchableOpacity onPress={() => setPrivacyModalVisible(true)}>
                      <Text style={[styles.linkText, { color: colors.primary }]}>
                        {t('auth.privacyPolicy')}
                      </Text>
                    </TouchableOpacity>
                    {' '}{t('common.and')}{' '}
                    <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
                      <Text style={[styles.linkText, { color: colors.primary }]}>
                        {t('auth.termsOfUse')}
                      </Text>
                    </TouchableOpacity>
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: agreedToTerms ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={handleRegister}
                  disabled={loading || !agreedToTerms}
                >
                  <Text style={styles.buttonText}>
                    {loading ? t('common.loading') : t('auth.registerButton')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkContainer}
                  onPress={() => navigation.navigate('Login' as never)}
                >
                  <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                    {t('auth.hasAccount')} 
                    <Text style={[styles.link, { color: colors.primary }]}>
                      {' ' + t('auth.login')}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      <PrivacyPolicyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />

      <TermsOfUseModal
        visible={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: 'white',
  },
  form: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    paddingVertical: 8,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
  link: {
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    gap: 8,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});