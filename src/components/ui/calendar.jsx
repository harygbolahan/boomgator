import * as React from "react";
import { format, addMonths, subMonths, isEqual, isToday, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addDays } from "date-fns";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = React.forwardRef(({
  className,
  selected,
  month = new Date(),
  onMonthChange,
  onDayClick,
  mode = "single",
  ...props
}, ref) => {
  const [currentMonth, setCurrentMonth] = React.useState(month);
  const [selectedDates, setSelectedDates] = React.useState(
    Array.isArray(selected) ? selected : selected ? [selected] : []
  );

  React.useEffect(() => {
    if (month && !isEqual(month, currentMonth)) {
      setCurrentMonth(month);
    }
  }, [month, currentMonth]);

  React.useEffect(() => {
    if (selected) {
      setSelectedDates(Array.isArray(selected) ? selected : [selected]);
    }
  }, [selected]);

  const handlePreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleDayClick = (day) => {
    if (mode === "single") {
      setSelectedDates([day]);
    } else if (mode === "multiple") {
      setSelectedDates(prev => {
        const isSelected = prev.some(date => isEqual(date, day));
        if (isSelected) {
          return prev.filter(date => !isEqual(date, day));
        }
        return [...prev, day];
      });
    }
    onDayClick?.(day);
  };

  const isSelectedDay = (day) => {
    return selectedDates.some(date => isEqual(date, day));
  };

  // Get days in month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  // Group by weeks
  const weeks = [];
  let week = [];

  days.forEach((day, index) => {
    week.push(day);
    if (week.length === 7 || index === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div 
      ref={ref}
      className={`w-full p-3 ${className || ""}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          className="p-2 hover:bg-accent rounded-md"
          onClick={handlePreviousMonth}
        >
          &lt;
        </button>
        <div className="font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded-md"
          onClick={handleNextMonth}
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-1">{day}</div>
        ))}
        {weeks.map((week, weekIndex) => (
          React.Children.toArray(
            week.map((day) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isSelected = isSelectedDay(day);
              const isCurrentDay = isToday(day);

              return (
                <button
                  type="button"
                  className={`h-9 w-9 p-0 font-normal rounded-md text-center text-sm ${
                    !isCurrentMonth 
                      ? "text-muted-foreground opacity-50" 
                      : isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : isCurrentDay 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-accent"
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {format(day, "d")}
                </button>
              );
            })
          )
        ))}
      </div>
    </div>
  );
});
Calendar.displayName = "Calendar";

export { Calendar }; 