import { ContentPage } from "../components/site/content-page";
import { pageContent } from "../data/site";

export default function HistoryPage() {
  return <ContentPage {...pageContent.history} actionHref="/about" actionLabel="About FUTO" />;
}
