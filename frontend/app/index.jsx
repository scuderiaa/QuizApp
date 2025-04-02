import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
 import LottieView from "lottie-react-native";
const HomeScreen = () => {
  const router = useRouter();
// const animation = useRef < LottieView > null;
  return (
    <View className="flex-1 justify-center items-center bg-indigo-300">
      <LottieView
        autoPlay
        // ref={animation}
        style={{
          width: 250,
          height: 250,
        }}
        source={require("../assets/lottie/Animation - 1734420311883.json")}
      />
      <Text className="text-3xl text-gray-50 bg-clip-text  mb-5 font-Row_Regular">
        Welcome to the Quiz App
      </Text>
      <TouchableOpacity
        className="bg-purple-600 py-3 px-6 rounded-lg"
        onPress={() => router.push("/categories")}
       >
        <Text className="text-white  text-xl font-Row_Bold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
