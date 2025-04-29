
import { format } from "date-fns";
import { Event } from "@/types/event";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useEvents } from "@/contexts/EventContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";

interface EventDayProps {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
}

const EventItem = ({ event }: { event: Event }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { deleteEvent } = useEvents();

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="mb-1 rounded overflow-hidden cursor-pointer bg-white shadow-sm border border-gray-100"
              onClick={() => setShowDialog(true)}
            >
              <div className="px-1 py-0.5 font-medium text-xs truncate bg-[#1ea69a] text-white">
                {event.title}
              </div>
              <div className="px-1 py-0.5 text-xs truncate bg-[#57bcb3] text-white flex items-center">
                <Clock className="h-2.5 w-2.5 mr-0.5" /> 
                <span className="truncate">{event.time}</span>
              </div>
              <div className="px-1 py-0.5 text-xs truncate bg-[#9fe0db] text-gray-700 flex items-center">
                <MapPin className="h-2.5 w-2.5 mr-0.5" /> 
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{event.title}</p>
            <p>Location: {event.location}</p>
            <p>Time: {event.time}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription>
              {format(event.date, "PPPP")} at {event.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
            <div>
              <span className="font-medium">Created:</span> {format(event.createdAt, "PPpp")}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => {
                deleteEvent(event.id);
                setShowDialog(false);
              }}
            >
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const EventDay = ({ date, events, isCurrentMonth }: EventDayProps) => {
  const isToday = date.toDateString() === new Date().toDateString();
  
  return (
    <div 
      className={cn(
        "h-28 border border-gray-200 p-1 overflow-hidden",
        !isCurrentMonth && "bg-gray-50 text-gray-400",
        isToday && "bg-[#e8f7f6]"
      )}
    >
      <div className={cn(
        "text-sm font-medium mb-1",
        isToday && "text-[#1ea69a]"
      )}>
        {format(date, "d")}
      </div>
      <div className="overflow-y-auto max-h-[calc(100%-1.5rem)]">
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventDay;
