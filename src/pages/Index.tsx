
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CalendarView from "@/components/CalendarView";
import EventForm from "@/components/EventForm";
import { EventProvider } from "@/contexts/EventContext";

const Index = () => {
  return (
    <EventProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Event Horizon Planner</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Click the Download button to save as PNG
                </div>
              </CardHeader>
              <CardContent>
                <CalendarView />
              </CardContent>
            </Card>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Create Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </EventProvider>
  );
};

export default Index;
