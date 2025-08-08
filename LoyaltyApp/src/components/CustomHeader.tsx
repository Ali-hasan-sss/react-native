import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import { DrawerMenu } from './DrawerMenu';
import { NotificationDropdown } from './NotificationDropdown';

export function CustomHeader() {
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { colors } = useTheme();

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
              paddingTop: insets.top,
            },
          ]}
        >
          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <Icon name="menu" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.logo, { color: colors.primary }]}>
            LoyaltyApp
          </Text>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setNotificationsOpen(true)}
          >
            <Icon name="notifications" size={24} color={colors.text} />
            <View
              style={[
                styles.notificationBadge,
                { backgroundColor: colors.error },
              ]}
            >
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={drawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDrawerOpen(false)}
      >
        <DrawerMenu onClose={() => setDrawerOpen(false)} />
      </Modal>

      <NotificationDropdown
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});