import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'

const Help = () => {
  const { colors } = useTheme()
  const router = useRouter()

  const helpSections = [
    {
      title: 'Frequently Asked Questions',
      icon: 'help-circle-outline',
      items: [
        {
          question: 'How do I place an order?',
          answer: 'Browse products, select quantity, add to cart, and proceed to checkout. Follow the payment process to complete your order.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept major credit cards, debit cards, and digital payment methods.'
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order is shipped, you\'ll receive a tracking number via email to monitor your delivery.'
        }
      ]
    },
    {
      title: 'Contact Support',
      icon: 'mail-outline',
      items: [
        {
          title: 'Email Support',
          subtitle: 'support@playstation.com',
          action: () => Linking.openURL('mailto:support@playstation.com')
        },
        {
          title: 'Phone Support',
          subtitle: '1-800-345-7669',
          action: () => Linking.openURL('tel:18003457669')
        }
      ]
    }
  ]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {helpSections.map((section, index) => (
          <View 
            key={index} 
            style={[styles.section, { backgroundColor: colors.surface }]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={24} color={colors.text} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            </View>

            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.item}
                onPress={item.action}
              >
                {item.question ? (
                  <View style={styles.faqItem}>
                    <Text style={[styles.question, { color: colors.text }]}>{item.question}</Text>
                    <Text style={[styles.answer, { color: colors.textSecondary }]}>{item.answer}</Text>
                  </View>
                ) : (
                  <View style={styles.contactItem}>
                    <Text style={[styles.contactTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.contactSubtitle, { color: colors.primary }]}>{item.subtitle}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default Help

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  faqItem: {
    gap: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    gap: 4,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactSubtitle: {
    fontSize: 14,
  }
})
