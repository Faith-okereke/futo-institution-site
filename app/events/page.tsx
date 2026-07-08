import { getEvents } from "../../lib/contentful-event";
import EventsPageClient from "../components/events/EventsPageClient";

export const dynamic = "force-dynamic"
export default async function EventsPage() {
  const events = await getEvents();

  return <EventsPageClient events={events} />;
}
