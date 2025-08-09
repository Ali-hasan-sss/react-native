import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../store/store';
import { setTheme } from '../store/slices/themeSlice';
import { setLanguage } from '../store/slices/languageSlice';
import { logout } from '../store/slices/authSlice';
import { useTheme } from '../hooks/useTheme';
import i18n from '../i18n/i18n';

interface DrawerMenuProps {
  onClose: () => void;
}

export function DrawerMenu({ onClose }: DrawerMenuProps) {
  const { t } = useTranslation();
  const { colors, mode } = useTheme();
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(newTheme));
  };

  const handleLanguageChange = (language: string) => {
    dispatch(setLanguage(language));
    i18n.changeLanguage(language);
  };

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={[styles.drawer, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Settings
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('drawer.theme')}
            </Text>
            {['light', 'dark', 'system'].map((theme) => (
              <TouchableOpacity
                key={theme}
                style={[
                  styles.option,
                  mode === theme && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => handleThemeChange(theme as any)}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>
                  {t(`drawer.${theme}`)}
                </Text>
                {mode === theme && (
                  <Icon name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('drawer.language')}
            </Text>
            {[
              { code: 'en', name: 'English' },
              { code: 'ar', name: 'العربية' },
              { code: 'de', name: 'Deutsch' },
            ].map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.option,
                  currentLanguage === lang.code && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>
                  {lang.name}
                </Text>
                {currentLanguage === lang.code && (
                  <Icon name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
          >
            <Icon name="logout" size={20} color="white" />
            <Text style={styles.logoutText}>
              {t('account.logout')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: 300,
    height: '100%',
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
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});