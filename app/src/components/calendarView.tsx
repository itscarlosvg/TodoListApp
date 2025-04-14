import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { useTheme } from "../context/ThemeContext";
import { Calendar, DateData } from "react-native-calendars";

interface CalendarViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function CalendarView({
  selectedDate,
  onDateChange,
}: CalendarViewProps) {
  const { colors } = useTheme();
  const todayString = new Date().toISOString().split("T")[0];

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Calendar
        key={colors.background} // <-- Esta línea es la clave
        onDayPress={(day: DateData) => onDateChange(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: colors.selected,
            disableTouchEvent: true,
          },
          ...(selectedDate !== todayString && {
            [todayString]: {
              marked: true,
              dotColor: colors.today,
            },
          }),
        }}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          textSectionTitleColor: colors.text,
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          arrowColor: colors.arrow,
          selectedDayBackgroundColor: colors.selected,
          todayTextColor: colors.today,
          textDisabledColor: colors.disabled,
        }}
        firstDay={1}
        enableSwipeMonths
        style={styles.calendar}
      />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "5%",
    marginBottom: 20,
    padding: 10,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  calendar: {
    borderRadius: 15,
    overflow: "hidden",
  },
});
