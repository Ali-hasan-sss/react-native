import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../hooks/useTheme';

interface CreateAdModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateAdModal({ visible, onClose }: CreateAdModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [adType, setAdType] = useState<'meals' | 'drinks'>('meals');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setSelectedImage(response.assets[0].uri || null);
        }
      }
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !details.trim()) {
      Alert.alert(t('common.error'), 'Please fill in all fields');
      return;
    }

    // Here you would normally submit to your backend
    Alert.alert(t('common.success'), 'Ad created successfully!');
    
    // Reset form
    setTitle('');
    setDetails('');
    setAdType('meals');
    setSelectedImage(null);
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
              {t('restaurant.createAd')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('restaurant.adImage')}
              </Text>
              <TouchableOpacity
                style={[styles.imageUpload, { borderColor: colors.border }]}
                onPress={handleImagePicker}
              >
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Icon name="add-a-photo" size={32} color={colors.textSecondary} />
                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                      {t('restaurant.uploadImage')}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('restaurant.adTitle')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={t('restaurant.adTitlePlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('restaurant.adDetails')}
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={t('restaurant.adDetailsPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={details}
                onChangeText={setDetails}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('restaurant.adType')}
              </Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor: adType === 'meals'
                        ? colors.primary
                        : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setAdType('meals')}
                >
                  <Icon
                    name="restaurant"
                    size={20}
                    color={adType === 'meals' ? 'white' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color: adType === 'meals' ? 'white' : colors.textSecondary,
                      },
                    ]}
                  >
                    {t('promotions.food')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor: adType === 'drinks'
                        ? colors.primary
                        : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setAdType('drinks')}
                >
                  <Icon
                    name="local-cafe"
                    size={20}
                    color={adType === 'drinks' ? 'white' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color: adType === 'drinks' ? 'white' : colors.textSecondary,
                      },
                    ]}
                  >
                    {t('promotions.drinks')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {t('restaurant.createAd')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: '90%',
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
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageUpload: {
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});