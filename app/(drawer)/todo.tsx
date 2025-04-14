import { Stack } from "expo-router";
import { useState, useRef } from "react";
import { View, Text, FlatList, Animated, Alert, Platform } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useTheme } from "../src/context/ThemeContext";
import CalendarView from "../src/components/CalendarView";
import AddTaskInput from "../src/components/AddTaskInput";
import TodoItem from "../src/components/TodoItem";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
};

export default function TodoScreen() {
  const [taskInput, setTaskInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Hacer ejercicio", completed: false, date: "2025-04-10" },
    { id: "2", text: "Estudiar React", completed: false, date: "2025-04-10" },
    { id: "3", text: "Leer un libro", completed: false, date: "2025-04-11" },
  ]);
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({}).current;
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({}).current;
  const [openSwipeableId, setOpenSwipeableId] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    light: {
      background: "bg-gray-100",
      taskBackground: "bg-white",
      text: "text-gray-900",
      placeholder: "text-gray-400",
      border: "border-gray-300",
      completedText: "text-gray-400",
    },
    dark: {
      background: "bg-gray-900",
      taskBackground: "bg-gray-800",
      text: "text-gray-100",
      placeholder: "text-gray-500",
      border: "border-gray-700",
      completedText: "text-gray-500",
    },
  };
  const themeColors = isDark ? colors.dark : colors.light;

  const handleDateChange = (date: string) => setSelectedDate(date);

  const filteredTasks = tasks.filter((task) => task.date === selectedDate);

  const handleAddTask = () => {
    if (taskInput.trim() === "" || !selectedDate) {
      Alert.alert("Error", "La tarea no puede estar vacía.");
      return;
    }
    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      text: taskInput,
      completed: false,
      date: selectedDate,
    };
    const animation = new Animated.Value(0);
    animatedValues[newTask.id] = animation;
    setTasks((prev) => [newTask, ...prev]);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTaskInput("");
  };

  const handleDeleteTask = (id: string) => {
    Animated.timing(animatedValues[id], {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      delete animatedValues[id];
      delete swipeableRefs[id];
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const handleSaveEdit = (id: string) => {
    if (editingText.trim() === "") {
      Alert.alert("Error", "La tarea no puede estar vacía.");
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: editingText } : task,
      ),
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleToggleCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
    if (Platform.OS !== "web") Haptics.selectionAsync();
  };

  return (
    <>
      <Stack.Screen options={{ title: "To-Do List" }} />
      <View className={`flex-1 ${themeColors.background} p-5`}>
        <AddTaskInput
          taskInput={taskInput}
          setTaskInput={setTaskInput}
          handleAddTask={handleAddTask}
          themeColors={themeColors}
          isDark={isDark}
        />

        <View className="mx-5 mb-5">
          <CalendarView
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              item={item}
              isEditing={editingId === item.id}
              editingText={editingText}
              setEditingText={setEditingText}
              handleDeleteTask={handleDeleteTask}
              handleEditTask={handleEditTask}
              handleSaveEdit={handleSaveEdit}
              handleToggleCompleted={handleToggleCompleted}
              animatedValues={animatedValues}
              swipeableRefs={swipeableRefs}
              openSwipeableId={openSwipeableId}
              setOpenSwipeableId={setOpenSwipeableId}
              themeColors={themeColors}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text className={`mt-10 text-center text-lg ${themeColors.text}`}>
              No tienes tareas todavía.
            </Text>
          }
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </>
  );
}
