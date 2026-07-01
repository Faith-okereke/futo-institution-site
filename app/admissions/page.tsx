import { ContentPage } from "../components/site/content-page";
import { pageContent } from "../data/site";

export default function AdmissionsPage() {
  return (
    <ContentPage
      {...pageContent.admissions}
      actionHref="/schools"
      actionLabel="View programmes"
    />
  );
}
