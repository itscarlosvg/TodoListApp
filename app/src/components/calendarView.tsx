import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';
import { Calendar } from 'react-native-calendars';

interface CalendarViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function CalendarView({ selectedDate, onDateChange }: CalendarViewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const themeColors = {
    background: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#eee' : '#333',
    selected: isDark ? '#4F46E5' : '#6366F1',
    today: isDark ? '#10B981' : '#06B6D4',
    arrow: isDark ? '#ccc' : '#666',
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Calendar
        onDayPress={(day: { dateString: string; }) => onDateChange(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: themeColors.selected,
            disableTouchEvent: true,
          },
          [new Date().toISOString().split('T')[0]]: {
            selected: selectedDate !== new Date().toISOString().split('T')[0],
            marked: true,
            dotColor: themeColors.today,
          }
        }}
        theme={{
          backgroundColor: themeColors.background,
          calendarBackground: themeColors.background,
          textSectionTitleColor: themeColors.text,
          dayTextColor: themeColors.text,
          monthTextColor: themeColors.text,
          arrowColor: themeColors.arrow,
          selectedDayBackgroundColor: themeColors.selected,
          todayTextColor: themeColors.today,
          textDisabledColor: isDark ? '#555' : '#ccc',
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
    marginHorizontal: '5%',
    marginBottom: 20,
    padding: 10,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  calendar: {
    borderRadius: 15,
    overflow: 'hidden',
  },
});
