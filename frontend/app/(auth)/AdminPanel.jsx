import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const AdminPanel = () => {
  const route=useRouter()
  return (
    <View>
      <Text>jdjddh</Text>
      <TouchableOpacity onPress={()=> route.push("/questions")}>
        <Text >Questions</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AdminPanel