
import { useState, useRef } from "react";
import { useEvents } from "@/contexts/EventContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download } from "lucide-react";
import EventDay from "@/components/EventDay";
import * as htmlToImage from 'html-to-image';
import { toast } from "@/components/ui/sonner";

const CalendarView = () => {
  const { events } = useEvents();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for the first day of the month (0 is Sunday)
  const startDay = getDay(monthStart);
  
  const daysInPreviousMonth = Array.from({ length: startDay }).map((_, i) => null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const downloadCalendar = async () => {
    if (!calendarRef.current) return;
    
    try {
      toast("Preparing download...");
      
      const dataUrl = await htmlToImage.toPng(calendarRef.current, {
        quality: 1.0,
        backgroundColor: '#fff'
      });
      
      const link = document.createElement('a');
      link.download = `calendar-${format(currentMonth, 'MMMM-yyyy')}.png`;
      link.href = dataUrl;
      link.click();
      
      toast("Calendar downloaded successfully!");
    } catch (error) {
      console.error('Error downloading calendar:', error);
      toast("Failed to download calendar", {
        description: "Please try again later."
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[#1ea69a]">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button onClick={prevMonth} variant="outline" size="sm" className="border-[#1ea69a] text-[#1ea69a] hover:bg-[#e8f7f6]">
            Previous
          </Button>
          <Button 
            onClick={() => setCurrentMonth(new Date())} 
            variant="outline" 
            size="sm"
            className="flex items-center border-[#1ea69a] text-[#1ea69a] hover:bg-[#e8f7f6]"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button onClick={nextMonth} variant="outline" size="sm" className="border-[#1ea69a] text-[#1ea69a] hover:bg-[#e8f7f6]">
            Next
          </Button>
          <Button 
            onClick={downloadCalendar} 
            variant="outline" 
            size="sm" 
            className="flex items-center bg-[#1ea69a] text-white hover:bg-[#57bcb3]"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      
      <div ref={calendarRef} className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div 
            key={day} 
            className="text-center py-2 font-medium border-b text-[#1ea69a]"
          >
            {day}
          </div>
        ))}
        
        {daysInPreviousMonth.map((_, index) => (
          <div 
            key={`prev-${index}`}
            className="h-28 border border-gray-200 bg-gray-50 p-1"
          />
        ))}
        
        {days.map((day) => {
          // Filter events for this day
          const dayEvents = events.filter((event) => 
            isSameDay(new Date(event.date), day)
          );
          
          return (
            <EventDay 
              key={day.toString()} 
              date={day} 
              events={dayEvents}
              isCurrentMonth={isSameMonth(day, currentMonth)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
