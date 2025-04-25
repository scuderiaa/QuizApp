import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";

const decodeText = (text) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;

  return txt.value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/%20/g, " ")
    .replace(/@/g, "")
    .replace(/;/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const PlayQuiz = () => {
  const { categoryId, combinedQuestions, categoryName } =
    useLocalSearchParams();
  const [highScore, setHighScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSurvivalMode, setIsSurvivalMode] = useState(false);

  // Animation References
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const [gameScore, setGameScore] = useState({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    totalQuestions: 0,
    scorePercentage: 0,
  });
  const [gameEnded, setGameEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);

  const startFadeInAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const startSlideAnimation = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const startScaleAnimation = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startFadeInAnimation();
    startSlideAnimation();
    startScaleAnimation();
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (categoryName?.toLowerCase() === "survival") {
      setIsSurvivalMode(true);
    }
  }, [categoryName]);

  useEffect(() => {
    if (questions.length > 0 && !gameEnded) {
      const timerDuration = isSurvivalMode ? 15 : 10;
      setTimeLeft(timerDuration);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleTimeOut();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex, questions, isSurvivalMode]);

  useEffect(() => {
    if (combinedQuestions) {
      const parsedQuestions = JSON.parse(combinedQuestions);
      const shuffledQuestions = parsedQuestions.map((question) => ({
        ...question,
        allAnswers: shuffleAnswers([
          question.correctAnswer,
          question.wrongAnswer1,
          question.wrongAnswer2,
          question.wrongAnswer3,
        ]),
      }));

      setQuestions(shuffledQuestions);
      setGameScore((prev) => ({
        ...prev,
        totalQuestions: shuffledQuestions.length,
      }));
    }
  }, [combinedQuestions]);

  const shuffleAnswers = (answers) => {
    return answers.sort(() => Math.random() - 0.5);
  };

  const handleTimeOut = () => {
    if (isSurvivalMode) {
      endGame();
    } else {
      setGameScore((prev) => ({
        ...prev,
        unanswered: prev.unanswered + 1,
      }));
      moveToNextQuestion();
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      endGame();
    }
  };

  const handleAnswerSelect = (answer) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;

    if (isCorrect) {
      setGameScore((prev) => ({
        ...prev,
        correct: prev.correct + 1,
        scorePercentage: isSurvivalMode
          ? 0
          : Math.round(((prev.correct + 1) / prev.totalQuestions) * 100),
      }));

      setTimeout(() => moveToNextQuestion(), isSurvivalMode ? 500 : 1000);
    } else {
      setGameScore((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        scorePercentage: isSurvivalMode
          ? 0
          : Math.round((prev.correct / prev.totalQuestions) * 100),
      }));

      setTimeout(
        () => {
          if (isSurvivalMode) {
            endGame();
          } else {
            moveToNextQuestion();
          }
        },
        isSurvivalMode ? 500 : 1000
      );
    }
  };

  const endGame = () => {
    setGameEnded(true);
  };

  const getAnswerStyle = (answer) => {
    if (!selectedAnswer) {
      return "bg-blue-100 border border-blue-300";
    }

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      return "bg-green-500";
    }

    if (answer === selectedAnswer) {
      return "bg-red-500";
    }

    return "bg-blue-100 border border-blue-300";
  };

  const getAnswerTextStyle = (answer) => {
    if (!selectedAnswer) {
      return "text-gray-800";
    }

    if (
      answer === questions[currentQuestionIndex].correctAnswer ||
      answer === selectedAnswer
    ) {
      return "text-white font-bold";
    }

    return "text-gray-800";
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setGameScore({
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      totalQuestions: questions.length,
      scorePercentage: 0,
    });
    setGameEnded(false);
  };

 if (gameEnded) {
   return (
     <MotiView
       from={{ opacity: 0, scale: 0.5 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ type: "spring" }}
       className="flex-1 justify-center items-center bg-indigo-300 p-6"
     >
       <MotiView
         from={{ opacity: 0, translateY: 50 }}
         animate={{ opacity: 1, translateY: 0 }}
         transition={{ type: "timing", duration: 500 }}
         className="w-full items-center"
       >
         <Text className="text-3xl font-bold text-center mb-6 text-white">
           {isSurvivalMode ? "Survival Mode Ended!" : "Quiz Completed!"}
         </Text>

         <MotiView
           from={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ type: "spring", delay: 300 }}
           className="w-full max-w-md bg-white rounded-xl p-6 shadow-md"
         >
           <View className="mb-4">
             <Text className="text-2xl font-bold text-center text-indigo-600 mb-4">
               {isSurvivalMode ? "Survival Score" : "Your Performance"}
             </Text>

             {isSurvivalMode ? (
               <>
                 <Text className="text-lg text-center text-gray-700 mb-4">
                   You survived {gameScore.correct} questions!
                 </Text>
                 {gameScore.correct > highScore && (
                   <Text className="text-lg text-center text-green-600 mb-4">
                     New High Score!
                   </Text>
                 )}
               </>
             ) : (
               <>
                 <View className="flex-row justify-between mb-3 border-b border-gray-200 pb-2">
                   <Text className="text-lg text-green-600">
                     Questions Answered:
                   </Text>
                   <Text className="text-lg font-bold text-green-600">
                     {gameScore.correct}
                   </Text>
                 </View>

                 <View className="flex-row justify-between mb-3 border-b border-gray-200 pb-2">
                   <Text className="text-lg text-red-600">
                     Incorrect Answers:
                   </Text>
                   <Text className="text-lg font-bold text-red-600">
                     {gameScore.incorrect}
                   </Text>
                 </View>

                 <View className="flex-row justify-between mb-3 border-b border-gray-200 pb-2">
                   <Text className="text-lg text-gray-600">Unanswered:</Text>
                   <Text className="text-lg font-bold text-gray-600">
                     {gameScore.unanswered}
                   </Text>
                 </View>

                 {/* Add percentage display */}
                 <View className="flex-row justify-between mb-4 border-b border-gray-200 pb-2">
                   <Text className="text-lg text-indigo-600">
                     Score Percentage:
                   </Text>
                   <Text className="text-lg font-bold text-indigo-600">
                     {gameScore.scorePercentage}%
                   </Text>
                 </View>
               </>
             )}
           </View>
         </MotiView>

         <MotiView
           from={{ opacity: 0, translateY: 100 }}
           animate={{ opacity: 1, translateY: 0 }}
           transition={{ type: "timing", duration: 500, delay: 600 }}
         >
           <TouchableOpacity
             className="mt-6 bg-white px-6 py-3 rounded-lg shadow-md"
             onPress={restartQuiz}
           >
             <Text className="text-indigo-600 text-lg font-bold text-center">
               Try Again
             </Text>
           </TouchableOpacity>
         </MotiView>
       </MotiView>
     </MotiView>
   );
 }


  if (questions.length === 0) {
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" }}
        className="flex-1 justify-center items-center bg-gray-100"
      >
        <Text className="text-xl text-gray-600">Loading questions...</Text>
      </MotiView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
      className="flex-1 bg-indigo-300 font-Row_Regular p-4 justify-center"
    >
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 300 }}
        className="absolute top-10 right-6 bg-red-500 w-12 h-12 rounded-full justify-center items-center"
      >
        <Text className="text-white text-2xl font-bold">{timeLeft}</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        className="bg-white rounded-xl shadow-md p-6 mb-6"
      >
        <Text className="text-xl font-bold text-center mb-4">
          {currentQuestion.questionText}
        </Text>

        <View>
          {currentQuestion.allAnswers.map((answer, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: "timing",
                duration: 300,
                delay: index * 100,
              }}
            >
              <TouchableOpacity
                className={`p-4 rounded-lg mb-3 ${getAnswerStyle(answer)}`}
                onPress={() => handleAnswerSelect(answer)}
              >
                <Text
                  className={`text-center text-base ${getAnswerTextStyle(
                    answer
                  )}`}
                >
                  {answer}
                </Text>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 500 }}
        className="flex-row justify-between px-4"
      >
        <Text className="text-base font-semibold text-gray-700">
          Score: <Text className="text-green-600">{gameScore.correct}</Text>
        </Text>
        <Text className="text-base font-semibold text-gray-700">
          Question {currentQuestionIndex + 1} of {gameScore.totalQuestions}
        </Text>
      </MotiView>
    </Animated.View>
  );
};

export default PlayQuiz;
