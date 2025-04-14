import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AddTaskInputProps {
  taskInput: string;
  setTaskInput: (text: string) => void;
  handleAddTask: () => void;
  themeColors: any;
  isDark: boolean;
}

export default function AddTaskInput({
  taskInput,
  setTaskInput,
  handleAddTask,
  themeColors,
  isDark,
}: AddTaskInputProps) {
  return (
    <View className="mx-10 mb-5 flex-row">
      <TextInput
        value={taskInput}
        onChangeText={setTaskInput}
        placeholder="Escribe una tarea..."
        placeholderTextColor={isDark ? "#888" : "#999"}
        className={`h-12 flex-1 rounded-lg border px-4 text-base ${themeColors.text} ${themeColors.border}`}
      />
      <TouchableOpacity
        onPress={handleAddTask}
        className="ml-3 h-12 w-12 items-center justify-center rounded-lg bg-blue-500"
      >
        <Ionicons name="add-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
