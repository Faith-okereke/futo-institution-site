import { ContentPage } from "../components/site/content-page";
import { pageContent } from "../data/site";

export default function PrivacyPoliciesPage() {
  return <ContentPage {...pageContent.privacy} actionHref="/" actionLabel="Return home" />;
}
