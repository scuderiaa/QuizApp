import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const route = useRouter();
  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.88.85:8080/api/admin/login`,
        {
          username,
          password,
        }
      );

      if (response.data.success) {
        // Navigate to admin panel if login successful
        route.push('/questions')
        // navigation.navigate("AdminPanel");
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login");
      console.error(error);
    }
  };

  return (
    <View className="bg-indigo-300">
      <View className="w-4/6 mx-auto  justify-center h-full ">
        <Text className="text-3xl text-white font-Row_Regular text-center mb-6">
          Admin Login
        </Text>

        <View className="mb-4">
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300 text-base"
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-300 text-base"
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg items-center"
          onPress={handleLogin}
        >
          <Text className="text-white text-lg font-bold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
