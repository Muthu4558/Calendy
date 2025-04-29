
import React, { createContext, useContext, useState, useEffect } from "react";
import { Event } from "@/types/event";
import { toast } from "@/components/ui/sonner";

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, "id" | "createdAt">) => void;
  deleteEvent: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within a EventProvider");
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      try {
        // Parse the stored JSON and convert date strings back to Date objects
        const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt)
        }));
        setEvents(parsedEvents);
      } catch (error) {
        console.error("Failed to parse stored events:", error);
        localStorage.removeItem("events");
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: Omit<Event, "id" | "createdAt">) => {
    const newEvent: Event = {
      ...eventData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    setEvents((prev) => [...prev, newEvent]);
    toast("Event created successfully", {
      description: `${eventData.title} scheduled for ${eventData.date.toLocaleDateString()}`
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    toast("Event deleted", {
      description: "The event has been successfully removed"
    });
  };

  return (
    <EventContext.Provider value={{ events, addEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};
