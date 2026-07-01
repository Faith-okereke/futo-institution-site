import { ContentPage } from "../components/site/content-page";
import { pageContent } from "../data/site";

export default function AboutPage() {
  return (
    <ContentPage
      {...pageContent.about}
      actionHref="/schools"
      actionLabel="Explore schools"
    />
  );
}
