import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import LottieView from "lottie-react-native";
const QuestionManagement = () => {
  // State for questions, modal visibility, and categories
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Enhanced new question state with additional fields
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    correctAnswer: "",
    wrongAnswer1: "",
    wrongAnswer2: "",
    wrongAnswer3: "",
    categoryId: null,
  });

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://192.168.88.85:8080/api/quiz/categories"
        );

        // Transform categories for dropdown
        const categoryDropdownItems = response.data.map((category) => ({
          label: category.name,
          value: category.id,
        }));

        setCategories(categoryDropdownItems);

        // Set default category if available
        if (categoryDropdownItems.length > 0) {
          setSelectedCategory(categoryDropdownItems[0].value);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Error", "Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Enhanced submit handler
const handleSubmitQuestion = async () => {
  // Validate all required fields are filled
  if (
    !newQuestion.questionText ||
    !newQuestion.correctAnswer ||
    !newQuestion.wrongAnswer1 ||
    !newQuestion.wrongAnswer2 ||
    !newQuestion.wrongAnswer3 ||
    !selectedCategory
  ) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  try {
    // Prepare the question object to match the backend model
    const questionToSubmit = {
      questionText: newQuestion.questionText,
      correctAnswer: newQuestion.correctAnswer,
      wrongAnswer1: newQuestion.wrongAnswer1,
      wrongAnswer2: newQuestion.wrongAnswer2,
      wrongAnswer3: newQuestion.wrongAnswer3,
      category: {
        id: Number(selectedCategory),
      },
    };

    console.log("Submitting question:", questionToSubmit);

    const response = await axios.post(
      "http://192.168.88.85:8080/api/quiz/question",
      questionToSubmit,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("Response:", response.data);

    // Show success alert
    Alert.alert("Success", "Question added successfully");

    // Reset form and close modal
    setNewQuestion({
      questionText: "",
      correctAnswer: "",
      wrongAnswer1: "",
      wrongAnswer2: "",
      wrongAnswer3: "",
      categoryId: null,
    });
    setSelectedCategory(categories[0]?.value || null);
    setModalVisible(false);
  } catch (error) {
    // Detailed error logging
    console.error("Full error object:", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);

      Alert.alert(
        "Server Error",
        `Status: ${error.response.status}\nMessage: ${JSON.stringify(
          error.response.data
        )}`
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      Alert.alert("Network Error", "No response received from server");
    } else {
      console.error("Error setting up request:", error.message);
      Alert.alert("Error", error.message);
    }
  }
};

  return (
    <SafeAreaView className="flex-1 justify-center bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-center mb-4">
          Question Management
        </Text>

        {/* Add Question Button */}
        <TouchableOpacity
          className="bg-green-500 p-3 rounded-lg mb-4"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center font-semibold">
            Add New Question
          </Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          visible={isModalVisible}
          transparent={false}
          animationType="slide"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <FlatList
              className="flex-1 p-4 bg-white"
              keyboardShouldPersistTaps="handled"
              data={[{}]} // Single item to allow scrolling
              renderItem={() => (
                <View>
                  <Text className="text-xl text-center mb-4 font-semibold">
                    Add New Question
                  </Text>

                  {/* Question Text Input */}
                  <TextInput
                    className="border border-gray-300 p-2 rounded-lg mb-4 h-24"
                    placeholder="Question Text"
                    multiline
                    value={newQuestion.questionText}
                    onChangeText={(text) =>
                      setNewQuestion({ ...newQuestion, questionText: text })
                    }
                  />

                  {/* Correct Answer Input */}
                  <TextInput
                    className="border border-green-500 p-2 rounded-lg mb-4"
                    placeholder="Correct Answer"
                    value={newQuestion.correctAnswer}
                    onChangeText={(text) =>
                      setNewQuestion({ ...newQuestion, correctAnswer: text })
                    }
                  />

                  {/* Wrong Answers Inputs */}
                  <TextInput
                    className="border border-red-500 p-2 rounded-lg mb-4"
                    placeholder="Wrong Answer 1"
                    value={newQuestion.wrongAnswer1}
                    onChangeText={(text) =>
                      setNewQuestion({ ...newQuestion, wrongAnswer1: text })
                    }
                  />

                  <TextInput
                    className="border border-red-500 p-2 rounded-lg mb-4"
                    placeholder="Wrong Answer 2"
                    value={newQuestion.wrongAnswer2}
                    onChangeText={(text) =>
                      setNewQuestion({ ...newQuestion, wrongAnswer2: text })
                    }
                  />

                  <TextInput
                    className="border border-red-500 p-2 rounded-lg mb-4"
                    placeholder="Wrong Answer 3"
                    value={newQuestion.wrongAnswer3}
                    onChangeText={(text) =>
                      setNewQuestion({ ...newQuestion, wrongAnswer3: text })
                    }
                  />

                  {/* Category Dropdown */}
                  <View className="mb-4 z-50">
                    <DropDownPicker
                      open={open}
                      value={selectedCategory}
                      items={categories}
                      setOpen={setOpen}
                      setValue={setSelectedCategory}
                      setItems={setCategories}
                      placeholder="Select a category"
                      ArrowDownIconComponent={() => (
                        <Ionicons name="chevron-down" size={24} color="black" />
                      )}
                      ArrowUpIconComponent={() => (
                        <Ionicons name="chevron-up" size={24} color="black" />
                      )}
                      CloseIconComponent={() => (
                        <Ionicons name="close" size={24} color="black" />
                      )}
                      style={{
                        borderColor: "#d1d5db", // tailwind gray-300
                        borderWidth: 1,
                      }}
                      dropDownContainerStyle={{
                        borderColor: "#d1d5db", // tailwind gray-300
                      }}
                    />
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    className="bg-green-500 p-3 rounded-lg mb-4"
                    onPress={handleSubmitQuestion}
                  >
                    <Text className="text-white text-center font-semibold">
                      Submit Question
                    </Text>
                  </TouchableOpacity>

                  {/* Close Button */}
                  <TouchableOpacity
                    className="bg-red-500 p-3 rounded-lg"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-white text-center font-semibold">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              ListFooterComponent={<View className="h-20" />} // Add extra space at bottom
            />
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default QuestionManagement;
