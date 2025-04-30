
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEvents } from "@/contexts/EventContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

const EventForm = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeValue, setTimeValue] = useState("");
  const [amPm, setAmPm] = useState("AM");
  const { addEvent } = useEvents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !location || !date || !timeValue) {
      return;
    }
    
    // Format time with AM/PM
    const formattedTime = `${timeValue} ${amPm}`;
    
    addEvent({
      title,
      location,
      date,
      time: formattedTime
    });
    
    // Reset form
    setTitle("");
    setLocation("");
    setDate(undefined);
    setTimeValue("");
    setAmPm("AM");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Name</Label>
        <Input
          id="title"
          placeholder="Enter event name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              id="date"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="time"
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              required
            />
          </div>
          <Select value={amPm} onValueChange={setAmPm}>
            <SelectTrigger className="w-24">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-event hover:bg-event-hover">
        Add Event
      </Button>
    </form>
  );
};

export default EventForm;
