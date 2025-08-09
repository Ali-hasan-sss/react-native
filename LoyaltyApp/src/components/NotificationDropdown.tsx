import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';

interface NotificationDropdownProps {
  visible: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: '1',
    title: 'Payment Successful',
    message: 'Your payment of $15.50 was processed successfully',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'New Promotion Available',
    message: 'Check out the new 20% discount at Pizza Palace',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Points Earned',
    message: 'You earned 5 meal points from your recent purchase',
    time: '3 hours ago',
    read: true,
  },
];

export function NotificationDropdown({ visible, onClose }: NotificationDropdownProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? colors.surface : colors.primary + '10',
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
          {item.message}
        </Text>
        <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
          {item.time}
        </Text>
      </View>
      {!item.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View style={[styles.dropdown, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('notifications.title')}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.markAllRead, { color: colors.primary }]}>
                {t('notifications.markAllRead')}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockNotifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            style={styles.notificationsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  dropdown: {
    borderRadius: 12,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    maxHeight: 300,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});