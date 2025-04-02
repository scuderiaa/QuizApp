import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { ImageBackground } from "react-native";

const { width } = Dimensions.get("window");
const triviaCategories = {
  4: 9, // General Knowledge
  2: 22, // Geography
  1: 23, // History
  3: 17, // Sciences
  5: 21, // Sports
};

const decodeText = (text) => {
  const htmlEntities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&#x2013;": "–",
    "&#x2014;": "—",
    "&ndash;": "–",
    "&mdash;": "—",
    "&#x2605;": "★",
    "&#x2606;": "☆",
  };

  let decodedText = text;
  Object.entries(htmlEntities).forEach(([entity, replacement]) => {
    decodedText = decodedText.replace(new RegExp(entity, "g"), replacement);
  });

  try {
    decodedText = decodeURIComponent(decodedText);
  } catch (e) {
    console.warn("Failed to decode URI component:", decodedText);
  }

  decodedText = decodedText.replace(/<[^>]*>/g, "");
  return decodedText.replace(/\s+/g, " ").trim();
};

const QuizCategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://192.168.88.85:8080/api/quiz/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories");
    }
  };

  const fetchLocalQuestions = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://192.168.88.85:8080/api/quiz/random-questions/${categoryId}`
      );
      return response.data.map((question) => ({
        questionText: decodeText(question.questionText),
        correctAnswer: decodeText(question.correctAnswer),
        wrongAnswer1: decodeText(question.wrongAnswer1),
        wrongAnswer2: decodeText(question.wrongAnswer2),
        wrongAnswer3: decodeText(question.wrongAnswer3),
      }));
    } catch (error) {
      console.error("Error fetching local questions:", error);
      return [];
    }
  };

  const fetchTriviaQuestions = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`
      );
      return response.data.results.map((triviaQuestion) => ({
        questionText: decodeText(triviaQuestion.question),
        correctAnswer: decodeText(triviaQuestion.correct_answer),
        wrongAnswer1: decodeText(triviaQuestion.incorrect_answers[0]),
        wrongAnswer2: decodeText(triviaQuestion.incorrect_answers[1]),
        wrongAnswer3: decodeText(triviaQuestion.incorrect_answers[2]),
      }));
    } catch (error) {
      console.error("Error fetching trivia questions:", error);
      return [];
    }
  };
  const handleGeneralCategory = async () => {
    try {
      // Fetch questions from local database for general category (id: 4)
      const localQuestions = await fetchLocalQuestions(4);

      // Fetch trivia questions from general knowledge category (id: 9)
      const triviaQuestions = await fetchTriviaQuestions(9);

      // Combine, filter, and shuffle all questions
      return [...localQuestions, ...triviaQuestions]
        .filter(
          (question) =>
            question.questionText &&
            question.correctAnswer &&
            question.wrongAnswer1 &&
            question.wrongAnswer2 &&
            question.wrongAnswer3
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 10); // Take only 10 questions
    } catch (error) {
      console.error("Error preparing general category:", error);
      throw error;
    }
  };

 const handleCategoryPress = async (categoryId, categoryName) => {
   setLoading(true);
   try {
     let finalQuestions = [];

     if (categoryName.toLowerCase() === "survival") {
       finalQuestions = await handleSurvivalMode();
     } else if (categoryName.toLowerCase() === "general") {
       finalQuestions = await handleGeneralCategory();
     } else {
       // Handle other categories
       const localQuestions = await fetchLocalQuestions(categoryId);
       let triviaQuestions = [];

       if (triviaCategories[categoryId]) {
         triviaQuestions = await fetchTriviaQuestions(
           triviaCategories[categoryId]
         );
       }

       finalQuestions = [...localQuestions, ...triviaQuestions]
         .filter(
           (question) =>
             question.questionText &&
             question.correctAnswer &&
             question.wrongAnswer1 &&
             question.wrongAnswer2 &&
             question.wrongAnswer3
         )
         .sort(() => Math.random() - 0.5)
         .slice(0, 10);
     }

     // Check if we have enough questions
     if (finalQuestions.length < 10) {
       Alert.alert(
         "Warning",
         "Not enough questions available for this category. Please try again later."
       );
       setLoading(false);
       return;
     }

     // Navigate to PlayQuiz with the questions
     router.push({
       pathname: "/PlayQuiz",
       params: {
         categoryId: categoryId,
         categoryName: categoryName,
         combinedQuestions: JSON.stringify(finalQuestions),
       },
     });
   } catch (error) {
     console.error("Error preparing quiz:", error);
     Alert.alert("Error", "Failed to prepare quiz questions");
   } finally {
     setLoading(false);
   }
 };

  const handleSurvivalMode = async () => {
    try {
      // Fetch all categories
      const categoriesResponse = await axios.get(
        "http://192.168.88.85:8080/api/quiz/categories"
      );

      // Fetch local questions from all categories
      const localQuestions = (
        await Promise.all(
          categoriesResponse.data.map((category) =>
            fetchLocalQuestions(category.id)
          )
        )
      ).flat();

      // Fetch trivia questions from multiple categories
      const triviaCategories = [9, 17, 22, 23, 21];
      const triviaQuestions = (
        await Promise.all(
          triviaCategories.map((category) => fetchTriviaQuestions(category))
        )
      ).flat();

      // Combine, filter, and shuffle all questions
      return [...localQuestions, ...triviaQuestions]
        .filter(
          (question) =>
            question.questionText &&
            question.correctAnswer &&
            question.wrongAnswer1 &&
            question.wrongAnswer2 &&
            question.wrongAnswer3
        )
        .sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error("Error preparing survival mode:", error);
      throw error;
    }
  };

  const getCategoryImage = (categoryName) => {
    const categoryImages = {
      History: require("@/assets/images/history.jpg"),
      Sciences: require("@/assets/images/sciences.jpg"),
      Geography: require("@/assets/images/geo.jpg"),
      General: require("@/assets/images/general.jpg"),
      Sports: require("@/assets/images/sports.webp"),
      Survival: require("@/assets/images/survival.jpg"),
    };

    const normalizedName = categoryName
      .toLowerCase()
      .split(" ")[0]
      .replace(/[^a-zA-Z]/g, "");

    const matchedImage = Object.keys(categoryImages).find(
      (key) => key.toLowerCase() === normalizedName
    );

    return categoryImages[matchedImage] || categoryImages["General"];
  };

  const CategoryCard = ({ item }) => {
    const categoryImage = getCategoryImage(item.name);

    return (
      <TouchableOpacity
        onPress={() => handleCategoryPress(item.id, item.name)}
        disabled={loading}
        className="mb-4"
        style={{ width: width * 0.9, alignSelf: "center" }}
      >
        <ImageBackground
          source={categoryImage}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 15,
            overflow: "hidden",
          }}
          imageStyle={{ borderRadius: 15, resizeMode: "cover" }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 15,
              left: 15,
              right: 15,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text
              className="text-white text-center text-2xl font-bold"
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-indigo-300">
      <View className="p-5">
        <Text className="text-3xl text-white font-Row_Regular mb-5 text-center mt-10">
          Quiz Categories
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          alignItems: "center",
        }}
      >
        {categories.map((category) => (
          <CategoryCard key={category.id} item={category} />
        ))}
      </ScrollView>
    </View>
  );
};

export default QuizCategoriesScreen;
