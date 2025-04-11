import { Stack } from "expo-router";
import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "../src/context/ThemeContext";
import CalendarView from "../src/components/calendarView";

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
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({}).current;
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({}).current;
  const [openSwipeableId, setOpenSwipeableId] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = {
    light: {
      background: "#f9f9f9",
      taskBackground: "#ffffff",
      text: "#333",
      placeholder: "#999999",
      border: "#dddddd",
      completedText: "#aaaaaa",
    },
    dark: {
      background: "#121212",
      taskBackground: "#1e1e1e",
      text: "#eeeeee",
      placeholder: "#888888",
      border: "#333333",
      completedText: "#666666",
    },
  };
  const themeColors = isDark ? colors.dark : colors.light;
  const [selectedDate, setSelectedDate] = useState<string>("");
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Hacer ejercicio", completed: false, date: "2025-04-10" },
    { id: "2", text: "Estudiar React", completed: false, date: "2025-04-10" },
    { id: "3", text: "Leer un libro", completed: false, date: "2025-04-11" },
  ]);

  const filteredTasks = tasks.filter((task) => task.date === selectedDate);
  const closePreviousSwipeable = (newId: string) => {
    if (openSwipeableId && openSwipeableId !== newId) {
      swipeableRefs[openSwipeableId]?.close();
    }
  };

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
        task.id === id ? { ...task, title: editingText } : task,
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

    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  };

  const renderRightActions = (id: string) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        onPress={() => handleDeleteTask(id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: Task }) => {
    if (!animatedValues[item.id]) {
      animatedValues[item.id] = new Animated.Value(1);
    }

    const isEditing = editingId === item.id;

    const translateY = animatedValues[item.id].interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 0],
    });

    const opacity = animatedValues[item.id];

    return (
      <Swipeable
        ref={(ref) => {
          swipeableRefs[item.id] = ref;
        }}
        renderRightActions={() => renderRightActions(item.id)}
        friction={2}
        overshootRight={false}
        rightThreshold={40}
        onSwipeableWillOpen={() => {
          closePreviousSwipeable(item.id);
          setOpenSwipeableId(item.id);
        }}
      >
        <Animated.View
          style={[
            styles.taskItem,
            {
              backgroundColor: themeColors.taskBackground,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => !isEditing && handleToggleCompleted(item.id)}
            style={{ flex: 1 }}
          >
            {isEditing ? (
              <TextInput
                value={editingText}
                onChangeText={setEditingText}
                style={[
                  styles.inputEdit,
                  {
                    color: themeColors.text,
                    borderBottomColor: themeColors.border,
                  },
                ]}
                autoFocus
              />
            ) : (
              <Text
                style={[
                  styles.taskText,
                  { color: themeColors.text },
                  item.completed && {
                    color: themeColors.completedText,
                    textDecorationLine: "line-through",
                  },
                ]}
              >
                {item.text}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            {isEditing ? (
              <TouchableOpacity onPress={() => handleSaveEdit(item.id)}>
                <Ionicons name="save-outline" size={22} color="#4CAF50" />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity onPress={() => handleEditTask(item)}>
                  <Ionicons name="create-outline" size={22} color="#FFA500" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteTask(item.id)}
                  style={{ marginLeft: 12 }}
                >
                  <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </Swipeable>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "To-Do List" }} />
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            value={taskInput}
            onChangeText={setTaskInput}
            placeholder="Escribe una tarea..."
            placeholderTextColor={themeColors.placeholder}
            style={[
              styles.input,
              { color: themeColors.text, borderColor: themeColors.border },
            ]}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Ionicons name="add-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Aquí agregamos el calendario */}
        <CalendarView
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        {/* Lista de tareas filtradas por la fecha seleccionada */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingHorizontal: "10%",
          }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No tienes tareas todavía.
            </Text>
          }
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginLeft: "10%",
    marginRight: "10%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    height: 50,
    borderColor: "#ccc",
    color: "#000",
  },
  inputEdit: {
    fontSize: 16,
    borderBottomColor: "#007BFF",
    borderBottomWidth: 1,
    paddingVertical: 2,
    color: "#000",
  },
  addButton: {
    backgroundColor: "#007BFF",
    marginLeft: 10,
    borderRadius: 10,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    height: 60,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  swipeActions: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 60,
    top: 0,
    marginLeft: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    borderRadius: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});
