
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
      
      // Create a temporary wrapper div to include month and year header
      const tempContainer = document.createElement('div');
      tempContainer.style.padding = '20px';
      tempContainer.style.backgroundColor = '#ffffff';
      
      // Create a header for the month and year
      const header = document.createElement('h1');
      header.textContent = format(currentMonth, "MMMM yyyy");
      header.style.fontSize = '24px';
      header.style.fontWeight = 'bold';
      header.style.marginBottom = '16px';
      header.style.color = '#1ea69a';
      header.style.textAlign = 'center';
      
      // Clone the calendar element
      const calendarClone = calendarRef.current.cloneNode(true) as HTMLElement;
      
      // Fix: Use a safer way to select elements without complex CSS selectors
      // Ensure all event texts are fully visible
      const eventTexts = calendarClone.querySelectorAll('[class*="truncate"]');
      eventTexts.forEach(el => {
        (el as HTMLElement).classList.remove('truncate');
        (el as HTMLElement).style.whiteSpace = 'normal';
        (el as HTMLElement).style.wordBreak = 'break-word';
      });
      
      // Make sure all events are visible by expanding the day cells
      const dayCells = calendarClone.querySelectorAll('[class*="h-28"]');
      dayCells.forEach(cell => {
        (cell as HTMLElement).style.height = 'auto';
        (cell as HTMLElement).style.minHeight = '7rem'; // Keep minimum height
      });
      
      // Fix: Use a safer selector for max-height elements
      const eventContainers = calendarClone.querySelectorAll('[class*="overflow-auto"]');
      eventContainers.forEach(container => {
        (container as HTMLElement).style.maxHeight = 'none';
        (container as HTMLElement).style.overflow = 'visible';
      });
      
      // Append elements to the temporary container
      tempContainer.appendChild(header);
      tempContainer.appendChild(calendarClone);
      
      // Temporarily add to document to render it
      document.body.appendChild(tempContainer);
      
      const dataUrl = await htmlToImage.toPng(tempContainer, {
        quality: 1.0,
        backgroundColor: '#fff',
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight
      });
      
      // Remove the temporary container
      document.body.removeChild(tempContainer);
      
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
