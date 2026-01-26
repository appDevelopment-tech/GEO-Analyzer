import Script from "next/script";
import { ORGANIZATION_JSON_LD, WEBSITE_JSON_LD } from "@/lib/schema-data";

export function JsonLd() {
  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
      />
    </>
  );
}
