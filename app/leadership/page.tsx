import { ContentPage } from "../components/site/content-page";
import { pageContent } from "../data/site";

export default function LeadershipPage() {
  return (
    <ContentPage
      {...pageContent.leadership}
      actionHref="/events"
      actionLabel="See university events"
    />
  );
}
