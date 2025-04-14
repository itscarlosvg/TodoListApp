import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
};

interface TodoItemProps {
  item: Task;
  isEditing: boolean;
  editingText: string;
  setEditingText: (text: string) => void;
  handleDeleteTask: (id: string) => void;
  handleEditTask: (task: Task) => void;
  handleSaveEdit: (id: string) => void;
  handleToggleCompleted: (id: string) => void;
  animatedValues: { [key: string]: Animated.Value };
  swipeableRefs: { [key: string]: Swipeable | null };
  openSwipeableId: string | null;
  setOpenSwipeableId: (id: string | null) => void;
  themeColors: any;
}

export default function TodoItem({
  item,
  isEditing,
  editingText,
  setEditingText,
  handleDeleteTask,
  handleEditTask,
  handleSaveEdit,
  handleToggleCompleted,
  animatedValues,
  swipeableRefs,
  openSwipeableId,
  setOpenSwipeableId,
  themeColors,
}: TodoItemProps) {
  if (!animatedValues[item.id]) {
    animatedValues[item.id] = new Animated.Value(1);
  }

  const translateY = animatedValues[item.id].interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });
  const opacity = animatedValues[item.id];

  const renderRightActions = (
    id: string,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleDeleteTask(id)}
        className="my-1 mr-4 h-full w-16 items-center justify-center rounded-2xl bg-red-500"
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={(ref) => {
        swipeableRefs[item.id] = ref;
      }}
      renderRightActions={(progress, dragX) =>
        renderRightActions(item.id, dragX)
      }
      friction={2}
      overshootRight={false}
      rightThreshold={40}
      onSwipeableWillOpen={() => {
        if (openSwipeableId && openSwipeableId !== item.id) {
          swipeableRefs[openSwipeableId]?.close();
        }
        setOpenSwipeableId(item.id);
      }}
    >
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <View
          className={`mx-4 mb-4 flex-row items-center justify-between rounded-2xl px-4 py-3 ${themeColors.taskBackground} shadow-lg`}
        >
          <TouchableOpacity
            onPress={() => !isEditing && handleToggleCompleted(item.id)}
            className="flex-1"
          >
            {isEditing ? (
              <TextInput
                value={editingText}
                onChangeText={setEditingText}
                className={`border-b ${themeColors.border} text-lg ${themeColors.text}`}
                autoFocus
              />
            ) : (
              <Text
                className={`text-lg ${item.completed ? themeColors.completedText : themeColors.text}`}
                style={
                  item.completed ? { textDecorationLine: "line-through" } : {}
                }
              >
                {item.text}
              </Text>
            )}
          </TouchableOpacity>
          <View className="ml-2 flex-row">
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
                  className="ml-3"
                >
                  <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Animated.View>
    </Swipeable>
  );
}
