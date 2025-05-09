import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const index = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.WELCOME}>WELCOME TO THE APP!</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.buttonText}>Continue Shopping!</Text>
      </TouchableOpacity>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  WELCOME: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})