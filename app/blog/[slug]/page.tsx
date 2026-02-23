import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { generateBlogPostingSchema } from "@/lib/schema-data";
import { Footer } from "@/components/Footer";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

const blogContent: Record<
  string,
  {
    directAnswer: string;
    sections: Array<{ heading: string; content: string }>;
  }
> = {
  "what-is-geo-vs-seo": {
    directAnswer:
      "GEO (Generative Engine Optimization) focuses on making your content citable by AI chatbots and answer engines like ChatGPT, Claude, and Perplexity. SEO (Search Engine Optimization) focuses on ranking in traditional search results like Google and Bing. While both aim to increase visibility, GEO prioritizes direct answers, entity clarity, and structured data that AI systems use when choosing sources to cite.",
    sections: [
      {
        heading: "The Key Differences Between SEO and GEO/AEO",
        content:
          "Traditional SEO optimizes for search engine algorithms that rank websites based on keywords, backlinks, and technical factors. GEO optimizes for AI engines that synthesize information from multiple sources to generate direct answers. This fundamental difference means your GEO strategy needs to emphasize different signals.",
      },
      {
        heading: "Why You Need Both Strategies",
        content:
          "SEO isn't dead—Google still processes billions of searches daily. But AI is becoming the primary interface for information discovery. Users ask ChatGPT questions they used to type into Google. A comprehensive digital presence requires both SEO for traditional search and GEO for AI recommendations.",
      },
      {
        heading: "Getting Started with GEO",
        content:
          "Start by auditing your current AI recommendation readiness. Check if your content has clear direct answers, whether your entity information is consistent across the web, and if you have structured data that helps AI understand your expertise. Use GeoAnalyzer to get a comprehensive score and actionable recommendations.",
      },
    ],
  },
  "how-ai-engines-choose-citations": {
    directAnswer:
      "AI engines choose citations based on four main factors: (1) Entity clarity—can the AI understand who you are and what you offer? (2) Direct answer availability—does your content provide clear, extractable answers? (3) Trust signals—reviews, backlinks, and authority indicators. (4) Technical accessibility—can the AI crawler access and parse your content?",
    sections: [
      {
        heading: "Entity Understanding Comes First",
        content:
          "Before an AI can recommend you, it needs to understand what you offer. This is why entity clarity is the foundation of GEO. Your about page, schema markup, and consistent information across the web all contribute to entity understanding.",
      },
      {
        heading: "Direct Answers Are Preferred",
        content:
          "AI engines prioritize content that directly answers user questions. Clear headings, FAQ pages, and structured Q&A formats make it easier for AI to extract relevant information. This is why Direct Answer blocks are so effective for both users and AI.",
      },
      {
        heading: "Trust Verification Matters",
        content:
          "AI systems are cautious about recommending sources. They look for signals that verify your credibility: customer reviews, mentions in authoritative publications, backlinks from trusted domains, and security indicators like SSL certificates.",
      },
    ],
  },
  "entity-clarity-checklist": {
    directAnswer:
      "Entity clarity means AI engines can accurately understand who you are, what you offer, and why you're authoritative. This checklist covers: (1) Schema markup for your organization, (2) Consistent NAP (name, address, phone) across the web, (3) A comprehensive About page, (4) Knowledge graph presence (Wikipedia, Wikidata), (5) Social media verification.",
    sections: [
      {
        heading: "Schema Markup Fundamentals",
        content:
          "Add Organization schema to your homepage. Include your name, logo, description, URL, and contact information. For personal brands, use Person schema. For products or services, use SoftwareApplication or Product schema.",
      },
      {
        heading: "Consistent Information Everywhere",
        content:
          "Ensure your business name, address, and contact information are consistent across your website, social profiles, directories, and any third-party mentions. Inconsistent information confuses both users and AI engines.",
      },
      {
        heading: "Knowledge Graph Presence",
        content:
          "While not every brand has a Wikipedia page, you can establish knowledge graph presence through Wikidata, Crunchbase, industry directories, and authoritative mentions. These sources help AI verify your entity exists and is notable.",
      },
    ],
  },
  "geo-audit-template": {
    directAnswer:
      "A GEO audit evaluates your website's readiness for AI recommendations across five categories: entity clarity, direct answers, trust signals, competitive positioning, and technical accessibility. Use this free template to assess your current state and identify improvement opportunities.",
    sections: [
      {
        heading: "Entity Clarity Checklist",
        content:
          "- Does your homepage have Organization schema? [ ] Yes [ ] No\n- Is your About page comprehensive with team bios? [ ] Yes [ ] No\n- Is your NAP consistent across the web? [ ] Yes [ ] No\n- Do you have Wikipedia or Wikidata entries? [ ] Yes [ ] No",
      },
      {
        heading: "Direct Answers Checklist",
        content:
          "- Do key pages have Direct Answer blocks at the top? [ ] Yes [ ] No\n- Do you have an FAQ page with structured Q&A? [ ] Yes [ ] No\n- Is your heading hierarchy logical (H1 → H2 → H3)? [ ] Yes [ ] No\n- Do you use FAQPage schema? [ ] Yes [ ] No",
      },
      {
        heading: "Trust Signals Checklist",
        content:
          "- Do you have customer reviews visible on your site? [ ] Yes [ ] No\n- Do you have backlinks from authoritative domains? [ ] Yes [ ] No\n- Is your site secured with HTTPS? [ ] Yes [ ] No\n- Do you have media mentions or press coverage? [ ] Yes [ ] No",
      },
      {
        heading: "Using Your Audit Results",
        content:
          "After completing the checklist, prioritize fixes that will have the biggest impact. Entity clarity is foundational—start there. Then add direct answers. Then build trust signals. For a comprehensive automated audit, use GeoAnalyzer.",
      },
    ],
  },
  "direct-answer-block-examples": {
    directAnswer:
      "Direct Answer blocks are concise, factual paragraphs at the top of key pages that immediately answer user questions. They typically run 40-60 words, use plain language, and avoid marketing fluff. AI engines prefer this format because it's easy to extract and cite.",
    sections: [
      {
        heading: "Anatomy of a Direct Answer Block",
        content:
          "Start with an H1 that poses the core question users have. Follow with a single paragraph (40-60 words) that directly answers the question. Focus on facts, not features. Avoid superlatives like 'amazing' or 'world-class'. Be precise.",
      },
      {
        heading: "Example: Product Page",
        content:
          "H1: What is [Product Name]?\n\nAnswer: [Product Name] is a [category] that helps [target audience] [primary benefit]. Unlike [alternative], it [key differentiator]. It works by [brief mechanism] and integrates with [key platforms]. Pricing starts at [price] with a [guarantee length] money-back guarantee.",
      },
      {
        heading: "Example: Service Page",
        content:
          "H1: What services does [Company] offer?\n\nAnswer: [Company] provides [service category] for [industry]. Our core services include [service 1], [service 2], and [service 3]. We serve clients in [geographies or market segments] and specialize in [specialization]. Projects typically take [timeline] from kickoff to delivery.",
      },
      {
        heading: "Where to Use Direct Answers",
        content:
          "Place Direct Answer blocks on your homepage, key product/service pages, pricing page, about page, and FAQ pages. Each page should answer the primary question a user (or AI) would have about that page's topic.",
      },
    ],
  },
  "how-to-win-ai-citations": {
    directAnswer:
      "AI engines cite sources based on four pillars: entity clarity, direct answer structure, trust signals, and technical accessibility. ChatGPT favors Wikipedia-style factual content with clear attribution. Perplexity prioritizes fresh content and community discussions like Reddit. Google AI Overviews distributes citations across diverse source types. Winning citations requires structured data (FAQPage schema), clear Q&A formatting, factual accuracy, and consistent entity information across the web.",
    sections: [
      {
        heading: "Understanding How AI Engines Choose Citations",
        content:
          "Each major AI platform has distinct citation patterns. ChatGPT shows strongest preference for Wikipedia and sources with clear, verifiable facts. When ChatGPT Browse fetches live results, it provides reliable citations; when answering from training data, it provides none. Perplexity emphasizes Reddit (6.6% of citations compared to 2.2% for Google AI Overviews) and rewards freshness with indexing within hours. Google AI Overviews takes a more distributed approach, citing blogs, community discussions, and user-generated content. These differences mean your strategy should account for which platforms matter most for your audience.",
      },
      {
        heading: "The Four Pillars of Citation-Worthy Content",
        content:
          "Entity clarity comes first. Before an AI can recommend you, it must understand what you offer. This requires Organization schema on your homepage, consistent NAP (name, address, phone) across the web, and a comprehensive About page. Direct answers are the second pillar. AI engines extract content from FAQ pages, Q&A sections, and pages with clear question headings. Structure matters more than length. A well-structured 500-word FAQ often outperforms a 3,000-word meandering article. Trust signals form the third pillar. Reviews, backlinks from authoritative domains, security indicators, and media mentions all signal credibility. Fourth is technical accessibility. Your robots.txt must allow AI crawlers, your site should use HTTPS, and your content needs proper schema markup.",
      },
      {
        heading: "Schema Markup: The Technical Foundation",
        content:
          "JSON-LD is the preferred format for structured data. The four schemas that consistently drive citations are Organization, FAQPage, Article, and Person. Organization schema should include your name, logo, URL, description, and contact information. Use @id attributes to create persistent identifiers that survive URL changes. FAQPage schema explicitly tells AI engines that your content contains question-answer pairs, making it significantly easier to extract. Article schema with author, datePublished, and publisher information helps establish content provenance. Common mistakes to avoid include invalid nesting, missing required properties, and conflicting markup types on the same page.",
      },
      {
        heading: "Content Patterns That Win Citations",
        content:
          "Analysis of 8,000+ citations reveals clear patterns. Comparison posts that cover multiple products or services perform exceptionally well. Thinkific, LearnWorlds, Monday.com, and Pipedrive all earn citations through comprehensive comparison content. Data-driven posts with original research, statistics, or surveys have high citation potential. How-to guides with step-by-step instructions are frequently cited. What doesn't work: overly promotional content, opinion pieces without factual backing, thin content, and pages with unclear structure. The key is providing objective, verifiable information that helps AI answer user questions accurately.",
      },
      {
        heading: "Platform-Specific Optimization Tactics",
        content:
          "For ChatGPT, focus on encyclopedic content. Neutral tone, comprehensive coverage, clear structure, and verifiable claims mirror what ChatGPT finds in Wikipedia. Include specific numbers, dates, and named sources. For Perplexity, freshness matters. Publish current information, update timestamps, cover trending topics, and engage in community platforms that Perplexity indexes. For Google AI Overviews, diversify your content types. Blog posts, forum discussions, user-generated content, and local business citations all contribute. Google's distributed approach means authority across multiple content formats increases your odds.",
      },
      {
        heading: "Measuring Citation Success",
        content:
          "Traditional metrics like rankings and impressions don't capture AEO performance. The new metrics are Citation Frequency (how often you're mentioned across platforms), Share of Voice (your citations versus competitors), Attribution Quality (does the citation include your brand name, URL, or just a generic reference), and Cross-Platform Coverage (presence across ChatGPT, Perplexity, Google AI, Claude, Copilot). Track these manually by querying AI engines about your brand and industry, or use emerging AEO measurement tools. The goal is not just appearing in citations but owning the conversation around your category.",
      },
      {
        heading: "Implementing Your AEO Strategy",
        content:
          "Start with an audit. Check if your homepage has Organization schema. Verify your NAP is consistent across major directories. Review your top pages for direct answer structure. Identify content gaps where competitors earn citations. Then prioritize fixes. Schema markup is quick to implement and high impact. Restructuring key pages into Q&A format takes more time but pays dividends. Building trust signals is a long-term effort. Set realistic timelines. Schema can be done in a day. Content restructuring might take weeks. Trust building is ongoing. Measure results monthly, not daily. AI citation patterns emerge over time, not overnight.",
      },
    ],
  },
  "schema-markup-ai-citations-guide": {
    directAnswer:
      "Schema markup is machine-readable code that helps AI engines understand your content. For AI citations, the most important schema types are FAQPage (41% higher citation rate), Organization (entity clarity), Article (with author), and HowTo (for step-by-step guides). JSON-LD is the preferred format, implemented in the <head> of your HTML.",
    sections: [
      {
        heading: "Why Schema Markup Matters for AI Citations",
        content:
          "AI engines need to parse and understand your content quickly. Schema markup provides structured context that eliminates ambiguity. Research shows FAQPage schema increases citation probability by 2.7x compared to unstructured content. Organization schema helps AI understand who you are and what you offer. Without schema, AI must infer meaning from your content—with schema, you explicitly tell AI what your content means.",
      },
      {
        heading: "The Four Essential Schema Types for AI Citations",
        content:
          "FAQPage schema is the highest-impact schema for AEO. It explicitly marks Q&A content, making it trivial for AI to extract answers. Organization schema establishes your entity—name, logo, URL, description, contact info. Article schema with author and datePublished establishes content provenance and expertise. HowTo schema marks step-by-step instructions, which AI engines favor for procedural queries.",
      },
      {
        heading: "Implementing FAQPage Schema: JSON-LD Example",
        content:
          "Place this in your <head> section: <script type='application/ld+json'> { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [{ '@type': 'Question', 'name': 'What is GEO?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'GEO stands for Generative Engine Optimization...' } }] } </script>. This marks your FAQ content for AI extraction. Each Q&A pair gets its own Question object with an acceptedAnswer.",
      },
      {
        heading: "Implementing Organization Schema",
        content:
          "Your homepage needs Organization schema with: name (your brand name), url (canonical homepage URL), logo (URL to your logo image), description (what you do), sameAs (links to social profiles), contactPoint (contact information), and @id (a persistent URI that identifies your entity). Use @id consistently across all schema—this helps AI understand that references on different pages refer to the same entity.",
      },
      {
        heading: "Common Schema Markup Mistakes to Avoid",
        content:
          "Invalid nesting is the most common error. Ensure parent-child relationships are correct. Missing required properties causes validation failures. Conflicting schema types on the same page confuses AI—don't use both Article and Product schema on one page. Using microdata or RDFa instead of JSON-LD makes implementation harder. Forgetting to update schema when content changes leads to stale structured data.",
      },
      {
        heading: "Validating Your Schema Markup",
        content:
          "Use Google's Rich Results Test to validate your schema. It checks for syntax errors and reports which rich features your page qualifies for. The Schema.org Validator provides more detailed technical validation. Test each page type—homepage, product pages, FAQ pages—after implementation. Fix errors before deploying to production. Invalid schema is worse than no schema.",
      },
      {
        heading: "Advanced Schema Strategies for AI Citations",
        content:
          "Use @id attributes to create persistent identifiers. Link your schemas together—Article schema should reference Organization schema in publisher field. Use sameAs to connect your entity across platforms. Include knowsAbout in Person schema to demonstrate topical expertise. Use aggregateRating for products to show social proof. These advanced techniques signal authority and help AI understand your content ecosystem.",
      },
    ],
  },
  "ai-crawlers-robots-txt-guide": {
    directAnswer:
      "AI crawlers are bots that scan your website to train AI models or power AI search. Major AI crawlers include GPTBot (OpenAI/ChatGPT), CCBot (Common Crawl), Claude-Web (Anthropic), Google-Extended (Google AI), and Perplexity-Bot. To allow AI crawlers, ensure your robots.txt doesn't block them. For GEO, you generally want to allow these crawlers so your content can be cited.",
    sections: [
      {
        heading: "The Major AI Crawlers You Need to Know",
        content:
          "GPTBot is OpenAI's crawler for ChatGPT. User agent: GPTBot. CCBot is used by Common Crawl, which provides data for many AI models. User agent: CCBot. Claude-Web is Anthropic's crawler for Claude. User agent: Claude-Web. Google-Extended is used for Google AI models like Gemini and AI Overviews. User agent: Google-Extended. Perplexity-Bot crawls for Perplexity AI. User agent: Perplexity-Bot. Each crawler respects robots.txt directives.",
      },
      {
        heading: "To Allow or Block: The GEO Decision",
        content:
          "If you want AI engines to cite your content, you must allow AI crawlers. Blocking them means your content won't appear in AI-generated answers. However, allowing crawlers means your content may be used to train AI models. The tradeoff: more visibility versus potential content use. For most businesses, the citation benefit outweighs training concerns. You can allow crawling while blocking specific content types.",
      },
      {
        heading: "Configuring robots.txt for AI Crawlers",
        content:
          "To allow all AI crawlers: User-agent: GPTBot, Allow: /. User-agent: CCBot, Allow: /. User-agent: Claude-Web, Allow: /. User-agent: Google-Extended, Allow: /. User-agent: Perplexity-Bot, Allow: /. To block specific paths: User-agent: GPTBot, Allow: /blog/, Disallow: /admin/, /private/. This allows AI to index your public content while blocking sensitive areas.",
      },
      {
        heading: "Testing Your robots.txt Configuration",
        content:
          "Use Google's robots.txt tester in Search Console. Check each AI crawler's access by simulating their user agents. Verify that important content is accessible. Test that sensitive areas remain blocked. Remember: robots.txt is a public file. Anyone can see your rules. Don't use it to hide truly sensitive information—use authentication instead.",
      },
      {
        heading: "AI Crawler Behavior Differences",
        content:
          "GPTBot respects delays between requests. It doesn't aggressively crawl. CCBot crawls broadly and frequently. Google-Extended follows standard Googlebot behavior. Claude-Web is relatively new, so patterns are still emerging. Perplexity-Bot prioritizes fresh content. Understanding these patterns helps you anticipate crawl behavior and optimize timing for new content publication.",
      },
      {
        heading: "Monitoring AI Crawler Activity",
        content:
          "Check your server logs for AI crawler user agents. Look for GPTBot, CCBot, Claude-Web, Google-Extended, and Perplexity-Bot requests. Track which pages they crawl and how frequently. This tells you if AI engines are discovering your content. If you don't see AI crawler activity, check for robots.txt blocks or crawl errors in Search Console.",
      },
      {
        heading: "Future-Proofing Your AI Crawler Strategy",
        content:
          "New AI crawlers will emerge. Consider using a blanket allow policy with specific disallows for sensitive content. This approach accommodates new crawlers without manual updates. Document your robots.txt decisions and the rationale. Review quarterly as the AI landscape evolves. The balance between visibility and control will shift as AI search grows.",
      },
    ],
  },
  "google-ai-overviews-optimization": {
    directAnswer:
      "Google AI Overviews (formerly SGE) now appear in approximately 13% of Google searches and growing. To optimize for AI Overviews: create direct-answer content, use FAQPage schema, demonstrate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness), build topical authority, and ensure mobile-friendly technical SEO.",
    sections: [
      {
        heading: "Understanding Google AI Overviews in 2026",
        content:
          "Google AI Overviews represent the evolution of search from blue links to AI-generated answers. Originally called SGE (Search Generative Experience), AI Overviews synthesize information from multiple sources to answer queries directly. 13% of queries trigger AI Overviews, with higher rates in health, finance, and how-to categories. This percentage will grow throughout 2026. The goal is to be cited in the AI Overview, not just rank in traditional results.",
      },
      {
        heading: "Content Structure for AI Overview Citations",
        content:
          "Start with a direct answer. Put the answer to the user's question right at the top in 40-60 words. Use clear heading hierarchy: H1 for the main topic, H2 for sections, H3 for subsections. Create FAQ sections with question-based headings. Use bullet points and numbered lists for clarity. AI Overview algorithms favor structured, scannable content over long-form narrative.",
      },
      {
        heading: "E-E-A-T Signals for AI Overviews",
        content:
          "Google's emphasis on E-E-A-T intensifies with AI Overviews. Experience: Show first-hand knowledge. Include case studies, examples, and practical application. Expertise: Demonstrate subject matter knowledge. Author credentials, certifications, and track record matter. Authoritativeness: Build recognition in your field. Media mentions, awards, and external validation. Trustworthiness: Be accurate and transparent. Cite sources, disclose affiliations, maintain content freshness.",
      },
      {
        heading: "Schema Markup for AI Overview Optimization",
        content:
          "FAQPage schema is critical for AI Overviews. It explicitly marks Q&A content. Article schema with author and publisher information establishes provenance. Organization schema builds entity clarity. HowTo schema works for procedural queries. Review schema provides credibility for comparative content. Implement these using JSON-LD format in your page <head>. Validate with Google's Rich Results Test.",
      },
      {
        heading: "Technical Requirements for AI Overviews",
        content:
          "Mobile-first is non-negotiable. AI Overviews prioritize mobile-friendly sites. Page speed matters more than ever—Core Web Vitals affect AI Overview inclusion. HTTPS is required. Clean HTML structure helps parsing. Avoid JavaScript-rendered content for critical information. Ensure your robots.txt allows Google-Extended. Fix crawl errors in Search Console immediately.",
      },
      {
        heading: "Query Types That Trigger AI Overviews",
        content:
          "Informational queries dominate AI Overview triggers. 'How to', 'what is', 'why does', and 'best X for Y' formats frequently generate overviews. Health and medical queries show high overview rates. Financial and legal advice queries also trigger overviews regularly. Product comparison queries increasingly show AI Overviews. Research your industry's overview trigger patterns and create content accordingly.",
      },
      {
        heading: "Measuring AI Overview Performance",
        content:
          "Google doesn't yet provide dedicated AI Overview analytics. Monitor branded search increases—AI Overviews often lead to brand searches. Track impressions for queries known to trigger overviews. Use Search Console to monitor position changes. Manually check key queries for overview appearance. Track referral traffic from Google search. As measurement tools mature, new KPIs will emerge.",
      },
    ],
  },
  "direct-answer-blocks-guide": {
    directAnswer:
      "A direct answer block is a concise 40-60 word paragraph that immediately answers a user's question. It appears at the top of content, uses plain language, avoids marketing fluff, and is optimized for AI extraction. Direct answers are the single most effective format for winning AI citations.",
    sections: [
      {
        heading: "Anatomy of a Perfect Direct Answer Block",
        content:
          "Start with an H1 that poses the core question: 'What is X?' or 'How do I Y?'. Follow with a single paragraph of 40-60 words that directly answers the question. Include the what, who, and how in plain language. Avoid superlatives like 'amazing', 'world-class', 'revolutionary'. Be specific and factual. Include one concrete number or detail if possible. The answer must stand alone—no clicking required to understand.",
      },
      {
        heading: "Direct Answer Block Examples: Product Page",
        content:
          "H1: What is [Product Name]?\n\nDirect Answer: [Product Name] is a project management tool for software teams. Unlike Asana, it includes built-in time tracking and sprint planning. It integrates with Jira, GitHub, and Slack. Plans start at $12 per user per month with a 14-day free trial. The answer covers what, who, how, differentiator, integration, and price in 47 words.",
      },
      {
        heading: "Direct Answer Block Examples: Service Business",
        content:
          "H1: What services does [Agency] provide?\n\nDirect Answer: [Agency] provides SEO and content marketing services for B2B SaaS companies. Core services include technical SEO audits, blog content production, and link building. Clients typically see organic traffic increases of 50-150% within 6 months. Projects range from $5,000 to $25,000 monthly. Specific services, measurable outcomes, and pricing transparency.",
      },
      {
        heading: "Direct Answer Block Examples: How-To Content",
        content:
          "H1: How to optimize for AI search?\n\nDirect Answer: To optimize for AI search, add FAQPage schema to Q&A content, write 40-60 word direct answers at the top of pages, include Organization schema on your homepage, allow AI crawlers in robots.txt, and demonstrate E-E-A-T through author credentials and citations. Start with an audit to identify gaps. Five actionable steps with clear priority.",
      },
      {
        heading: "Writing Direct Answers: Do's and Don'ts",
        content:
          "DO use plain language. DO be specific and factual. DO include numbers and data. DO answer the question directly without preamble. DO keep sentences under 20 words. DON'T use marketing superlatives. DON'T bury the answer in narrative. DON'T use jargon without explanation. DON'T write more than 60 words. DON'T require clicking to understand.",
      },
      {
        heading: "Where to Place Direct Answer Blocks",
        content:
          "Homepage: Answer 'What does [Company] do?'. Product pages: Answer 'What is [Product]?'. Service pages: Answer 'What services do you offer?'. Pricing page: Answer 'How much does it cost?'. About page: Answer 'Who is [Company]?'. FAQ pages: Each Q&A is a direct answer. Blog posts: Start with a summary that answers the post's core question.",
      },
      {
        heading: "Direct Answers for Different AI Platforms",
        content:
          "ChatGPT prefers Wikipedia-style answers: neutral tone, comprehensive coverage, encyclopedic format. Perplexity favors fresh, news-style answers with recent data and current examples. Google AI Overviews work well with concise, bulleted answers that directly respond to the query. Claude appreciates nuanced answers that acknowledge complexity. Tailor your direct answer format to your target platforms.",
      },
    ],
  },
  "entity-clarity-geo-guide": {
    directAnswer:
      "Entity clarity means AI engines can accurately understand who you are, what you offer, and why you're authoritative. It requires consistent information across the web, structured schema markup, a comprehensive About page, and presence in knowledge graph sources like Wikipedia, Wikidata, and industry directories.",
    sections: [
      {
        heading: "What Is Entity Clarity?",
        content:
          "An entity is a distinct, well-defined thing—a person, organization, product, or place. Entity clarity means that when AI engines encounter your brand, they understand it as a specific entity with clear attributes. Without entity clarity, you're just text. With entity clarity, you're a recognized entity that AI can confidently reference and recommend.",
      },
      {
        heading: "The Three Pillars of Entity Clarity",
        content:
          "Consistency: Your name, description, and categorization must be consistent across your website, social profiles, directories, and mentions. Inconsistent information confuses AI. Structure: Use schema markup to explicitly define your entity attributes. Organization or Person schema provides the foundation. Authority: Build signals that verify your notability. Reviews, backlinks, media mentions, and knowledge graph presence all contribute.",
      },
      {
        heading: "Schema Markup for Entity Clarity",
        content:
          "Organization schema is essential for businesses. Include name, url, logo, description, sameAs (social profiles), and address. For personal brands, use Person schema with name, url, jobTitle, knowsAbout (topics of expertise), and sameAs. Use @id to create persistent identifiers. Link your schemas—Article should reference Organization in publisher field. This creates an entity graph AI can follow.",
      },
      {
        heading: "NAP Consistency Across the Web",
        content:
          "NAP stands for Name, Address, Phone. For local businesses, NAP consistency is foundational. For online businesses, focus on Name, URL, and Description consistency. Ensure your brand name is identical everywhere—no 'LLC' in one place and 'Inc.' in another. Your category description should be consistent. This consistency helps AI merge multiple references into a single, coherent entity.",
      },
      {
        heading: "Building Knowledge Graph Presence",
        content:
          "Wikipedia is the gold standard but not required. Wikidata entries are easier to get and provide structured entity data. Industry directories like Crunchbase for startups, Houzz for contractors, or Healthgrades for doctors all contribute to entity understanding. Professional directories like LinkedIn, Clutch, or G2 provide verified entity signals. Each mention in a structured directory strengthens AI's understanding of your entity.",
      },
      {
        heading: "Your About Page: The Entity Hub",
        content:
          "Your About page should tell a complete entity story. Who you are (founding story, mission). What you do (services, products, categories). Who you serve (target audience, use cases). Why you're qualified (team credentials, experience, track record). Include schema markup on this page. Link to social profiles and external mentions. This page should be the definitive source for 'who is [brand]?' queries.",
      },
      {
        heading: "Measuring Entity Clarity",
        content:
          "Test entity clarity by querying AI engines. Ask ChatGPT 'Who is [brand]?' and see if it answers accurately. Ask Perplexity the same. Check Google's Knowledge Panel for your brand—if one exists, your entity clarity is strong. Use GeoAnalyzer's entity clarity audit to get a scored assessment. Low scores indicate gaps in your entity signals.",
      },
    ],
  },
  "measure-geo-success-metrics": {
    directAnswer:
      "GEO success is measured through citation metrics (how often AI engines cite you), visibility metrics (brand mentions in AI responses), engagement metrics (sentiment and attribution quality), and business metrics (brand searches and conversions). Track these monthly to see patterns.",
    sections: [
      {
        heading: "Citation Frequency: The Primary GEO Metric",
        content:
          "Citation Frequency measures how often your brand appears in AI-generated answers across platforms. Track citations manually by querying ChatGPT, Perplexity, Claude, and Google AI for your brand and industry keywords. Count how many times you're cited per 100 queries. Citation Share compares your citations to competitors. Aim for increasing citation frequency month-over-month as your entity clarity and content quality improve.",
      },
      {
        heading: "Share of Voice in AI Responses",
        content:
          "Share of Voice measures your visibility relative to competitors in AI answers. For a given query set, calculate what percentage of citations go to you versus competitors. If 10 brands are cited across 100 AI responses and you appear 15 times, your Share of Voice is 15%. This metric shows whether you're gaining or losing ground in your category. Track it monthly to see competitive movement.",
      },
      {
        heading: "Attribution Quality Tracking",
        content:
          "Not all citations are equal. High-quality citations include your brand name and a clickable link. Medium citations include your brand name but no link. Low citations reference your content generically ('according to industry experts'). Attribution Quality measures the percentage of your citations that include your name. Aim for high attribution—being mentioned by name builds brand even without clicks.",
      },
      {
        heading: "Cross-Platform Coverage",
        content:
          "Different AI engines serve different audiences. Cross-Platform Coverage tracks your presence across ChatGPT, Perplexity, Google AI Overviews, Claude, and Copilot. You might be strong in Perplexity but absent from ChatGPT. Identify gaps and prioritize platform-specific optimization. This metric ensures you're not over-indexed on one platform at the expense of others.",
      },
      {
        heading: "Brand Search Lift",
        content:
          "AI citations drive brand searches even without clicks. When someone sees your brand in an AI answer, they may search for you directly. Track branded search volume in Google Search Console. An increase after AI citation activity indicates your GEO efforts are working. This is often the first measurable signal that AI citations are building awareness.",
      },
      {
        heading: "Sentiment and Context Analysis",
        content:
          "Being cited is good. Being cited favorably is better. Sentiment Analysis tracks whether AI responses position your brand positively, neutrally, or negatively. Context Analysis examines how you're mentioned—as a leader, as an option, or as a cautionary example. Monitor both to ensure your citations enhance rather than hurt your brand.",
      },
      {
        heading: "Business Impact: From Citations to Conversions",
        content:
          "Ultimately, GEO must drive business results. Track assisted conversions—users who search for your brand after seeing an AI citation. Monitor conversion rates from branded search traffic. Calculate citation-influenced revenue. If 10,000 people see your brand in AI answers and 0.1% convert at $100 each, that's $10,000 in revenue—even if zero people clicked through. This is the ROI of GEO.",
      },
    ],
  },
  "chatgpt-perplexity-google-ai-citations": {
    directAnswer:
      "ChatGPT favors encyclopedic, Wikipedia-style content with neutral tone and verifiable facts. Perplexity prioritizes fresh content and community discussions like Reddit. Google AI Overviews distributes citations across diverse source types including blogs and forums. Claude appreciates nuanced, well-reasoned content.",
    sections: [
      {
        heading: "ChatGPT Citation Preferences",
        content:
          "ChatGPT shows strongest preference for Wikipedia and sources that mirror Wikipedia's style: neutral tone, comprehensive coverage, clear structure, verifiable claims. When ChatGPT Browse fetches live results, it provides citations. When answering from training data, it cites nothing. For ChatGPT citations, focus on encyclopedic content. Include specific numbers, dates, and named sources. Avoid promotional language. Structure content with clear headings and logical flow.",
      },
      {
        heading: "Perplexity Citation Patterns",
        content:
          "Perplexity emphasizes community content. Reddit appears in 6.6% of Perplexity citations compared to 2.2% for Google AI Overviews. Freshness matters—Perplexity indexes new content within hours. Perplexity cites blog posts, news articles, research papers, and forum discussions. For Perplexity optimization, publish current information, update timestamps, engage on Reddit and other forums, and cover trending topics.",
      },
      {
        heading: "Google AI Overviews Distribution",
        content:
          "Google AI Overviews takes a more distributed approach. It cites blogs, community discussions, user-generated content, and established brands. Google's E-E-A-T framework heavily influences citations. Demonstrating Experience, Expertise, Authoritativeness, and Trustworthiness improves your odds. Google diversifies citation sources—you don't need to be #1 in traditional rankings to appear in AI Overviews.",
      },
      {
        heading: "Claude's Citation Approach",
        content:
          "Claude (Anthropic) tends to cite more cautiously. It prioritizes authoritative sources and shows preference for well-reasoned, nuanced content. Claude appreciates content that acknowledges complexity and uncertainty rather than oversimplifying. For Claude optimization, demonstrate expertise through depth, provide balanced perspectives, and cite your own sources.",
      },
      {
        heading: "Platform-Specific Content Strategies",
        content:
          "For ChatGPT: Create Wikipedia-style resource pages. Comprehensive, neutral, factual. For Perplexity: Publish news, trends, and timely content. Engage on Reddit. For Google AI: Demonstrate E-E-A-T through author bios, credentials, and citations. For Claude: Write nuanced, in-depth analysis that shows expertise. One size doesn't fit all—tailor your approach to your target platforms.",
      },
      {
        heading: "Cross-Platform Optimization Framework",
        content:
          "Start with foundations that help everywhere: entity clarity, direct answers, and schema markup. Then prioritize platforms based on your audience. B2B? Focus on ChatGPT and Perplexity. Local business? Google AI Overviews matters most. Research brand? Claude and ChatGPT. Don't try to optimize equally for all platforms—allocate resources where your audience lives.",
      },
      {
        heading: "Measuring Platform-Specific Performance",
        content:
          "Track citations separately for each platform. Query ChatGPT for your brand keywords and count citations. Do the same for Perplexity and Claude. For Google, monitor AI Overview appearance manually or use emerging tools. Compare your cross-platform performance. You might discover you're strong on Perplexity but invisible on ChatGPT. This insight directs your optimization efforts.",
      },
    ],
  },
  "eeat-ai-trust-signals": {
    directAnswer:
      "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. AI engines use these signals to determine which sources to cite. Demonstrate Experience through case studies and first-hand knowledge. Show Expertise through credentials and deep content. Build Authoritativeness through external recognition. Establish Trustworthiness through accuracy and transparency.",
    sections: [
      {
        heading: "Experience: Showing First-Hand Knowledge",
        content:
          "AI engines increasingly value content based on real experience. Share case studies with specific details and results. Describe processes you've actually executed. Include photos, videos, or documentation that proves hands-on experience. Avoid generic advice that could apply to anyone. The more specific and grounded in experience your content, the more AI trusts it as a citable source.",
      },
      {
        heading: "Expertise: Demonstrating Subject Matter Knowledge",
        content:
          "Credentials matter. Degrees, certifications, awards, and professional recognition all signal expertise. But so does content depth. Shallow, superficial content signals lack of expertise. Deep, nuanced analysis that addresses complexities signals true understanding. Use author bios to highlight credentials. Cite your own experience and data. Link to previous work that establishes your expertise in the topic.",
      },
      {
        heading: "Authoritativeness: Building External Recognition",
        content:
          "Authoritativeness comes from outside validation. Media mentions, awards, and speaking engagements all contribute. Being cited by other authoritative sources signals that you're recognized in your field. Backlinks from respected websites, industry rankings, and positive reviews all build authority. For AI citations, having Wikipedia or Wikidata entries is a strong authority signal.",
      },
      {
        heading: "Trustworthiness: Accuracy and Transparency",
        content:
          "Be accurate. Cite sources for claims. Update content when information changes. Disclose affiliations and potential conflicts. Use HTTPS and secure your site. Display clear contact information. Show customer reviews honestly. Respond to negative feedback constructively. Trustworthy content acknowledges uncertainty and doesn't overclaim. Avoid sensationalism and clickbait.",
      },
      {
        heading: "E-E-A-T in Practice: Author Schema",
        content:
          "Use Article schema with detailed Author information: { '@type': 'Article', 'author': { '@type': 'Person', 'name': 'Jane Doe', 'jobTitle': 'Senior SEO Analyst', 'knowsAbout': ['GEO', 'AEO', 'AI Search'], 'url': 'https://yoursite.com/about/jane', 'sameAs': ['https://linkedin.com/in/jane', 'https://twitter.com/jane'] } }. This schema explicitly signals expertise and helps AI verify author credentials.",
      },
      {
        heading: "E-E-A-T for Different Content Types",
        content:
          "YMYL (Your Money or Your Life) content requires the highest E-E-A-T standards. Health, finance, and legal advice need verifiable credentials and citations. Product reviews benefit from hands-on experience demonstrated through photos and testing details. How-to content should show actual process documentation. Thought leadership pieces need to demonstrate expertise through depth and nuance, not just assertions.",
      },
      {
        heading: "Measuring and Improving Your E-E-A-T",
        content:
          "Audit your top pages for E-E-A-T signals. Do you have author bios with credentials? Are sources cited? Is there evidence of first-hand experience? Are claims accurate and verifiable? Check competitor pages that rank well in AI answers—what E-E-A-T signals do they demonstrate? Use GeoAnalyzer to identify gaps. Prioritize improvements: add author bios first, then enhance content depth, then build external signals through PR and link building.",
      },
    ],
  },
  "zero-click-search-monetization": {
    directAnswer:
      "Zero-click search means users get answers without clicking through to websites. AI search accelerates this trend. Monetization strategies include: building owned audiences (email, community), focusing on brand searches, creating ungoogleable experiences (interactive tools, original research), and productizing expertise (courses, consulting).",
    sections: [
      {
        heading: "The Zero-Click Reality",
        content:
          "SparkToro's 2020 study found 65% of Google searches ended without a click. AI search accelerates this trend. When AI synthesizes answers from multiple sources, fewer users click through. This isn't catastrophic—it's a shift. Your brand gets exposure even without clicks. The question becomes: how do you monetize brand visibility when traffic declines?",
      },
      {
        heading: "Strategy 1: Build Owned Audiences",
        content:
          "Use AI citations as a funnel to owned channels. Every piece of content should include a clear call-to-action to subscribe. Build an email list that you own regardless of algorithm changes. Create community (Discord, Slack, Circle) that AI can't replicate. Offer lead magnets—tools, templates, checklists—that capture email addresses. Owned audiences are AI-proof.",
      },
      {
        heading: "Strategy 2: Win Brand Searches",
        content:
          "When someone sees your brand in an AI answer, they may search for you directly. Branded search traffic is high-converting and owned by you. Optimize your brand name everywhere. Ensure your entity is clear so AI mentions you by name, not generically. Track branded search volume in Google Search Console—it's a leading indicator of AI citation impact.",
      },
      {
        heading: "Strategy 3: Create Ungoogleable Experiences",
        content:
          "AI can synthesize information, but it can't replace experiences. Interactive tools and calculators provide value AI can't replicate. Community and conversation create experiences AI can't clone. Original research and proprietary data can't be synthesized elsewhere. Live events, workshops, and consulting deliver value beyond static content. Focus on what AI can't do.",
      },
      {
        heading: "Strategy 4: Productize Your Expertise",
        content:
          "When content becomes the product, citations become ads. Courses, templates, tools, and consulting monetize expertise directly. Your content demonstrates expertise—your products deliver the outcome. AI citations that establish your authority drive product sales. This is the paradox of zero-click: fewer clicks can mean more revenue when citations build authority that converts.",
      },
      {
        heading: "Measuring Zero-Click Success",
        content:
          "Traditional metrics like organic traffic become less relevant. New metrics emerge: citation frequency, brand search volume, email subscribers from brand traffic, community growth, and product sales from brand discovery. Track these metrics to understand the true impact of your GEO efforts. You might see fewer clicks but more revenue—that's success in the zero-click era.",
      },
      {
        heading: "The Balanced Portfolio Approach",
        content:
          "Don't abandon traditional channels. Maintain a balanced portfolio: 40% traditional SEO (still required for the citation pool), 40% GEO optimization (future-proofing for AI), 20% owned channels (email, community, direct traffic). This diversification protects against algorithm shifts and platform dependency. As AI search evolves, adjust your allocation based on what's working.",
      },
    ],
  },
  "geo-tools-software-2026": {
    directAnswer:
      "Essential GEO tools include schema validators (Google Rich Results Test, Schema.org Validator), AI citation trackers (manual monitoring or emerging platforms), content optimizers (GeoAnalyzer for GEO auditing), and analytics platforms (GSC for brand search, manual AI querying for citation tracking).",
    sections: [
      {
        heading: "Schema Markup Tools",
        content:
          "Google Rich Results Test validates your schema and reports which rich features you qualify for. Schema.org Validator provides detailed technical validation. Schema Markup Helper (Google) offers a visual interface for creating schema. For advanced users, JSON-LD generators automate schema creation. These tools are essential—invalid schema is worse than no schema.",
      },
      {
        heading: "GEO Audit and Analysis Tools",
        content:
          "GeoAnalyzer provides comprehensive GEO auditing across entity clarity, direct answers, trust signals, and technical accessibility. It scores your readiness and provides specific recommendations. Other emerging tools include AEO audit templates and checklists. Manual auditing involves checking each pillar individually: schema validation, content review for direct answers, entity consistency checks across the web, and backlink analysis for trust signals.",
      },
      {
        heading: "AI Citation Tracking Tools",
        content:
          "No mature, comprehensive citation tracking platform exists yet. Manual tracking involves querying each AI engine (ChatGPT, Perplexity, Claude, Google AI) for your brand keywords and recording citations. Emerging tools are entering the market but vary in reliability. For now, spreadsheets and consistent manual testing is the best approach. Track citation frequency, share of voice, and attribution quality monthly.",
      },
      {
        heading: "Content Optimization for GEO",
        content:
          "Direct answer optimization tools help craft 40-60 word answers. FAQ generators create structured Q&A content. Schema generators produce JSON-LD markup. Content brief templates ensure you cover entity signals, direct answers, and E-E-A-T factors. These tools streamline content creation but don't replace strategy—know what questions your audience asks and why you're the best source.",
      },
      {
        heading: "Analytics and Measurement",
        content:
          "Google Search Console tracks branded search volume, a leading indicator of AI citation impact. Google Analytics measures referral traffic and conversion rates. AI-specific analytics platforms are emerging but immature. For now, combine traditional tools with manual citation tracking. Set up custom dashboards that track both traditional metrics (traffic, rankings) and GEO metrics (citations, brand searches).",
      },
      {
        heading: "Competitive Intelligence Tools",
        content:
          "Understand who's winning citations in your space. Manually query AI engines for your target keywords and record which sources appear. Analyze their content structure—do they use direct answers? What schema do they implement? How do they demonstrate E-E-A-T? Use this intelligence to inform your strategy. Don't copy, but learn from what's working. Competitive citation tracking is manual but invaluable.",
      },
      {
        heading: "Building Your GEO Tech Stack",
        content:
          "Start with free tools: Google Rich Results Test, GSC, manual AI querying. Add GeoAnalyzer for comprehensive auditing. As budget allows, explore emerging GEO platforms. Prioritize tools that solve specific problems: schema validation for technical issues, audit tools for strategy, tracking tools for measurement. Don't overbuy—GEO is new and many tools are unproven. Focus on execution over tool acquisition.",
      },
    ],
  },
  "why-top-pages-win-ai-search": {
    directAnswer:
      "Top pages win AI search because they align tightly with user intent, provide short extractable answers, prove claims with credible sources, and maintain clean technical signals (canonical URLs, crawl access, fast pages). In practice, the winners are the pages that are easiest for both users and machines to trust and quote.",
    sections: [
      {
        heading: "Intent Match Beats Word Count",
        content:
          "Most high-performing AEO pages answer one clear question and resolve related follow-up questions in the same document. They don't try to rank for everything. Their structure mirrors user intent: definition first, then process, then edge cases, then examples. This reduces ambiguity and increases extractability for AI engines.",
      },
      {
        heading: "Extractable Answer Format",
        content:
          "Winning pages use direct answers near the top, question-based subheadings, short paragraphs, and clear lists. AI systems can quote these sections without heavy rewriting. If a paragraph is vague, promotional, or overloaded with fluff, it is less likely to be reused in generated answers.",
      },
      {
        heading: "Evidence and Source Quality",
        content:
          "Top pages support key claims with verifiable references and clear attribution. They use specific definitions, transparent methodology, and consistent terminology. AI products are conservative about trust. A page that shows where facts come from is easier to cite than one that only asserts opinions.",
      },
      {
        heading: "Technical Reliability",
        content:
          "Top search pages usually have one preferred canonical URL, permanent redirects from alternate versions, no accidental noindex directives, and consistent internal linking. Technical consistency helps search systems consolidate ranking signals instead of splitting them across URL variants.",
      },
      {
        heading: "How to Apply This to Your Site",
        content:
          "Pick one high-intent question per page. Add a 40-60 word direct answer under the H1. Add FAQPage or HowTo schema where appropriate. Verify canonical and redirect behavior. Then publish supporting pages that answer adjacent questions and link back to your main page. This cluster model is what most top AI-search pages have in common.",
      },
    ],
  },
  "top-questions-about-geo-aeo": {
    directAnswer:
      "The top GEO/AEO questions are practical: what GEO is, how it differs from SEO, how to appear in AI answers, which schema to implement, and how to measure citation performance. Content that answers these questions directly tends to earn more visibility across both classic search and AI search.",
    sections: [
      {
        heading: "Foundational Questions Users Ask First",
        content:
          "Common early-stage questions include: What is GEO? What is AEO? Is AEO different from SEO? Does ranking in Google guarantee visibility in ChatGPT or Perplexity? These are high-volume educational queries and ideal for pillar pages.",
      },
      {
        heading: "Execution Questions With Purchase Intent",
        content:
          "Mid-funnel questions include: How do I get cited in AI answers? What schema should I use first? How should I structure direct answer blocks? How do I compare competitors in AI citations? These queries map to checklists, templates, and service pages.",
      },
      {
        heading: "Technical Questions Decision-Makers Ask",
        content:
          "Technical questions often include: Is my robots.txt blocking key bots? Why does Search Console show 'Page with redirect'? Should I use canonical tags and redirects together? How often should I refresh content? These topics attract teams ready to implement changes.",
      },
      {
        heading: "Measurement Questions That Drive Retainers",
        content:
          "Measurement questions include: How do I track AI citations? What KPI replaces click-through rate in zero-click contexts? Which platforms should I prioritize first? These queries are useful for ongoing reporting and consulting packages.",
      },
      {
        heading: "Editorial Plan You Can Ship in 30 Days",
        content:
          "Publish one pillar page ('What is GEO/AEO?'), three implementation pages (schema, direct answers, crawler access), two diagnostics pages (redirects, canonicalization), and two measurement pages (citation tracking, reporting). Interlink all pages and update them monthly with examples and dateModified changes.",
      },
    ],
  },
  "page-with-redirect-google-search-console": {
    directAnswer:
      "In Google Search Console, 'Page with redirect' usually means Google found a URL that intentionally redirects to another URL. That source URL is excluded from indexing by design. You should only fix it if the redirect is accidental, loops, or points to the wrong destination.",
    sections: [
      {
        heading: "What the Status Means",
        content:
          "Google classifies redirecting URLs as non-indexed because they are not final destination pages. This is normal for URL variants such as HTTP to HTTPS, www to non-www, old slugs to new slugs, or trailing-slash normalization.",
      },
      {
        heading: "When You Should Ignore It",
        content:
          "Ignore the status when all variants redirect with a permanent redirect to your preferred canonical URL, and the destination URL is indexable. Example: http://www.example.com/ redirecting to https://example.com/ is expected behavior, not a defect.",
      },
      {
        heading: "When You Should Fix It",
        content:
          "Fix issues when redirects chain multiple hops, produce loops, point to unrelated destinations, or when your sitemap lists redirecting URLs instead of final URLs. Also fix if internal links keep pointing to non-canonical URLs, because that wastes crawl budget and dilutes signals.",
      },
      {
        heading: "Practical Fix Workflow",
        content:
          "1) Pick one canonical host/protocol format.\n2) Redirect all variants in one hop.\n3) Use self-referencing canonical tags on destination pages.\n4) Ensure sitemaps include only final indexable URLs.\n5) Update internal links to canonical URLs.\n6) Request re-crawl only for URLs that were truly fixed.",
      },
      {
        heading: "Why Validation Often Fails Here",
        content:
          "Validation fails if the redirect still exists, and in many cases that is expected. A redirecting URL is supposed to remain redirecting. In this scenario, there is nothing to 'repair'; the status is informational for excluded source URLs, while the destination URL is the one that should be indexed.",
      },
    ],
  },
  "canonical-redirects-technical-seo-ai-search": {
    directAnswer:
      "Canonical tags and redirects solve different problems. Redirects send users and crawlers to the preferred URL, while canonical tags consolidate duplicate signals when multiple URLs are still accessible. The strongest setup is one canonical URL plus permanent redirects from all alternate variants.",
    sections: [
      {
        heading: "Redirect vs Canonical: The Difference",
        content:
          "Use redirects when you do not want alternate URLs to remain accessible. Use canonical tags when duplicates must stay live (for example filtered URLs, print pages, or campaign parameters) but you want signals credited to one preferred version.",
      },
      {
        heading: "Preferred URL Architecture",
        content:
          "Choose one protocol (HTTPS), one host (www or non-www), one trailing-slash policy, and one content version per language/region. Enforce this with permanent redirects. Then place a self-referencing canonical tag on each destination page.",
      },
      {
        heading: "Common Implementation Mistakes",
        content:
          "Avoid canonical tags pointing to URLs that redirect. Avoid sitemap entries that are redirected, noindexed, or blocked. Avoid mixed internal linking where some links use HTTP and others use HTTPS. These inconsistencies weaken signal consolidation.",
      },
      {
        heading: "Testing Checklist",
        content:
          "Use header checks to confirm one-hop 301 behavior for all variants. Inspect rendered HTML for canonical tags. Fetch robots.txt and sitemap.xml to ensure consistency. Spot-check critical pages in Search Console URL Inspection and verify Google-selected canonical matches your preferred URL.",
      },
      {
        heading: "Why This Matters for AI Search",
        content:
          "AI systems rely on search and web signals to determine reliable source documents. Canonical and redirect consistency reduces ambiguity about which page should represent your information. Fewer duplicates and cleaner signals improve the odds your intended page is cited.",
      },
    ],
  },
  "chatgpt-search-crawling-guide": {
    directAnswer:
      "For ChatGPT visibility, you need crawlable public pages, clear factual content, and bot access that matches your policy. OpenAI identifies multiple bots for different purposes, so your robots.txt should explicitly allow or disallow the right bot depending on whether you want training access, search visibility, or both.",
    sections: [
      {
        heading: "Which OpenAI Bots Matter",
        content:
          "OpenAI documents separate bots for different functions. GPTBot is associated with improving foundation models. OAI-SearchBot is associated with search and linking in responses. ChatGPT-User represents user-triggered retrieval actions. Treat these separately in robots policy decisions.",
      },
      {
        heading: "Access Policy by Goal",
        content:
          "If you want your content discoverable in ChatGPT search experiences, do not block search-related crawling. If you do not want model-training crawling, you can disallow the training bot while still allowing search-related access. Document your policy so legal, editorial, and growth teams are aligned.",
      },
      {
        heading: "Content Patterns That Increase Citation Potential",
        content:
          "Pages with concise definitions, explicit question-answer structure, and verifiable claims tend to be easier for AI systems to quote. Add clear section headings, direct answers near the top, and specific examples. Avoid vague claims without context or evidence.",
      },
      {
        heading: "Debugging Crawl and Citation Gaps",
        content:
          "Check server logs for bot user agents, verify robots directives on production, and test whether key pages are accessible without heavy client-side rendering. If pages are technically crawlable but not cited, improve answer clarity, entity signals, and source transparency.",
      },
      {
        heading: "Operational Playbook",
        content:
          "Run a monthly check of robots rules, crawl accessibility, structured data validity, and question coverage for your highest-intent topics. Keep a single tracker for URL status, update dates, and citation checks so teams can iterate quickly instead of guessing.",
      },
    ],
  },
  "gptbot-vs-oai-searchbot": {
    directAnswer:
      "GPTBot and OAI-SearchBot serve different purposes. GPTBot relates to model improvement workflows, while OAI-SearchBot relates to search and link retrieval behavior. Publishers should decide bot access per business goal and set robots.txt directives explicitly rather than using one blanket rule.",
    sections: [
      {
        heading: "Quick Comparison",
        content:
          "GPTBot: typically discussed in the context of model training and data collection policy. OAI-SearchBot: associated with search indexing and citation/linking behavior. ChatGPT-User: user-initiated fetch behavior. These distinctions matter when deciding what to allow.",
      },
      {
        heading: "Robots.txt Examples",
        content:
          "Allow search, disallow training example:\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nAllow both example:\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: GPTBot\nAllow: /",
      },
      {
        heading: "Policy Framework for Teams",
        content:
          "Define goals first: citation visibility, model-training participation, or strict content control. Then map those goals to bot directives. Revisit policy quarterly as platform behavior and legal requirements evolve. Keep one owner accountable for policy changes to avoid accidental blocks.",
      },
      {
        heading: "Common Errors to Avoid",
        content:
          "Avoid assuming one directive controls all OpenAI behavior. Avoid production/dev mismatches where robots rules differ by environment. Avoid blocking bots globally while expecting AI visibility gains. Inconsistent policy is a frequent reason teams see no citation progress.",
      },
      {
        heading: "Measurement",
        content:
          "Track bot hits in logs, citation presence for target queries, and branded search lift after policy/content updates. Bot access alone does not create visibility; it simply removes a gate. Content quality and entity trust still determine whether your pages are selected.",
      },
    ],
  },
  "google-ai-overviews-ranking-signals": {
    directAnswer:
      "Google AI Overviews tend to favor pages that satisfy intent quickly, demonstrate source credibility, and are technically reliable. The most practical levers are concise first-paragraph answers, strong E-E-A-T signals, clean structured data, and consistent page maintenance on volatile topics.",
    sections: [
      {
        heading: "Intent Resolution and Query Fit",
        content:
          "Google's systems reward pages that answer the exact user question without forcing extra navigation. Put the direct answer at the top, then expand with context, caveats, and examples. Match page type to query type: definitions, comparisons, how-to, or troubleshooting.",
      },
      {
        heading: "Credibility and Corroboration",
        content:
          "Citable pages show who wrote the content, why they are qualified, when it was updated, and where key claims come from. Add author context, references, and clear methodology. Trust increases when your claims can be cross-checked against other reliable sources.",
      },
      {
        heading: "Structured Data and Technical Quality",
        content:
          "Use schema where it improves clarity (Organization, Article, FAQPage, HowTo where eligible). Keep Core Web Vitals acceptable, avoid broken internal links, and ensure canonical consistency. Technical quality does not replace content quality, but weak technical hygiene can suppress strong content.",
      },
      {
        heading: "Freshness by Query Volatility",
        content:
          "Not all pages require the same update cadence. Fast-moving topics (platform changes, policy updates, tooling) need frequent updates. Stable concepts can be refreshed less often. Add dateModified when meaningful changes are made and keep examples current.",
      },
      {
        heading: "How to Prioritize Work",
        content:
          "Start with pages already earning impressions for informational queries. Improve direct answers, add missing trust signals, and tighten structure. Then build supporting pages that answer adjacent questions. This usually produces faster gains than publishing random net-new posts.",
      },
    ],
  },
  "answer-engine-optimization-checklist-2026": {
    directAnswer:
      "A complete AEO setup needs four layers: technical access, clear answer structure, trust and entity signals, and recurring measurement. Teams that treat AEO as an ongoing operating system, not a one-time blog sprint, tend to earn more stable AI visibility.",
    sections: [
      {
        heading: "Layer 1: Technical Access",
        content:
          "Ensure key pages return 200 status, are not blocked by robots unintentionally, and are included in sitemap only if indexable. Normalize URL variants with permanent redirects and self-referencing canonicals. Validate structured data and resolve critical parse errors.",
      },
      {
        heading: "Layer 2: Answer Structure",
        content:
          "For each priority page, place a direct answer under the H1 in 40-60 words. Use question-led H2s. Add concise bullet lists for steps or comparisons. Include short FAQ sections for follow-up questions users commonly ask after the first answer.",
      },
      {
        heading: "Layer 3: Entity and Trust",
        content:
          "Publish clear About and Contact pages, maintain consistent brand identity across web properties, and include author context for expert content. Support claims with references and update outdated examples. These trust cues improve the chance your content is selected as a safe source.",
      },
      {
        heading: "Layer 4: Measurement Cadence",
        content:
          "Track monthly: citation presence for priority queries, branded search trend, key page indexation health, and content freshness backlog. Keep one dashboard that combines search visibility and AI citation checks so stakeholders can see trend lines, not snapshots.",
      },
      {
        heading: "30-Day Rollout",
        content:
          "Week 1: Technical cleanup and URL normalization. Week 2: Direct answers on top pages. Week 3: Schema and entity upgrades. Week 4: Citation monitoring setup plus editorial calendar for next cluster. Repeat monthly with one primary topic cluster at a time.",
      },
    ],
  },
  "topical-authority-for-ai-citations": {
    directAnswer:
      "Topical authority for AI citations comes from consistent, interconnected coverage of a topic cluster. One strong page is not enough. You need a pillar page, supporting pages for sub-questions, and internal links that make expertise relationships explicit.",
    sections: [
      {
        heading: "Build Topic Clusters, Not Isolated Posts",
        content:
          "Choose one business-critical topic, then map the parent question and 8-15 sub-questions users ask before buying. Publish a pillar page for the parent query and focused pages for each sub-question. Link child pages back to the pillar and to adjacent children where relevant.",
      },
      {
        heading: "Coverage Depth That Actually Matters",
        content:
          "Depth is not word count. Depth is answering practical follow-ups, tradeoffs, implementation details, and failure cases. Pages that only define terms are easy to replace. Pages that include process detail, examples, and constraints are harder to replace and more likely to be cited.",
      },
      {
        heading: "Internal Linking as a Relevance Graph",
        content:
          "Use descriptive anchor text that reflects question intent, not generic 'click here'. Every supporting page should link to the canonical pillar resource and at least two related support pages. This helps crawlers understand topical relationships and reduces orphaned content.",
      },
      {
        heading: "Refresh and Prune Strategy",
        content:
          "Audit clusters quarterly. Merge overlapping thin pages, redirect obsolete pages, and expand pages that rank but underperform on engagement or citation checks. A smaller high-quality cluster often outperforms a large fragmented cluster.",
      },
      {
        heading: "Example GEO Cluster",
        content:
          "Pillar: 'What is AEO?'\nSupport 1: 'AEO vs SEO'\nSupport 2: 'Schema for AEO'\nSupport 3: 'Direct answer blocks'\nSupport 4: 'Robots policy for AI bots'\nSupport 5: 'How to measure citations'\nThis structure aligns education, implementation, and measurement in one coherent graph.",
      },
    ],
  },
  "llms-txt-vs-robots-txt-guide": {
    directAnswer:
      "robots.txt is an established crawler-control mechanism used by major search bots. llms.txt is an emerging, non-standard convention that may help content discovery for some tools but is not a guaranteed ranking or indexing signal. Use robots.txt for enforceable bot policy and treat llms.txt as optional documentation.",
    sections: [
      {
        heading: "What robots.txt Does Today",
        content:
          "robots.txt gives crawl directives by user-agent and remains the practical control surface for mainstream crawlers. It is the right place to allow or disallow specific bots, restrict sensitive paths, and publish sitemap locations. It is widely implemented and operationally reliable.",
      },
      {
        heading: "What llms.txt Tries to Do",
        content:
          "llms.txt is typically used as a curated index of important pages and context for language-model tools. It may improve readability for agents that choose to consume it, but adoption and behavior are not standardized across platforms. It should not replace core technical SEO controls.",
      },
      {
        heading: "Recommended Setup",
        content:
          "Keep robots.txt accurate and explicit. Maintain clean sitemap and canonical signals. If you publish llms.txt, keep it concise: top docs, key policies, and stable URLs. Treat it as supplemental guidance, not a substitute for crawl/index foundations.",
      },
      {
        heading: "Avoid Common Misconceptions",
        content:
          "Publishing llms.txt does not force indexing or citation. Blocking a bot in robots.txt can still override your visibility goals regardless of llms.txt content. Most visibility gains still come from content quality, clear structure, and trust signals.",
      },
      {
        heading: "Minimal llms.txt Template",
        content:
          "Use a short list of canonical URLs to your primary docs, FAQ, and policy pages, plus a one-line site description. Update it when core URLs change. Keep the file stable so agents can rely on it without chasing outdated links.",
      },
    ],
  },
  "best-content-formats-for-ai-citations": {
    directAnswer:
      "The most citable formats are direct Q&A pages, comparison pages, how-to guides, concise definitions, and data-backed explainers. These formats work because they map to common user intents and are easy for AI systems to extract, summarize, and attribute.",
    sections: [
      {
        heading: "FAQ and Q&A Pages",
        content:
          "Q&A structures are highly extractable. Each question should have one concise answer paragraph followed by detail. Add FAQPage schema when eligible. Keep wording factual and specific so an AI answer can quote or paraphrase without losing meaning.",
      },
      {
        heading: "Comparison Pages",
        content:
          "Comparison intent is strong in both search and AI tools. Use neutral side-by-side criteria, explicit tradeoffs, and audience-based recommendations. Avoid blanket 'best for everyone' claims. Comparisons with transparent criteria are easier to trust and cite.",
      },
      {
        heading: "How-To and Troubleshooting Guides",
        content:
          "Procedural queries are ideal for step-based layouts. Use numbered steps, prerequisites, expected outcomes, and common failure points. Clear process documentation helps assistants answer 'how do I' queries accurately.",
      },
      {
        heading: "Definitions and Concept Pages",
        content:
          "For top-of-funnel queries, lead with a 1-2 sentence definition, then explain why it matters, how it differs from adjacent concepts, and when to use it. This format improves both classic snippet performance and AI extraction.",
      },
      {
        heading: "Data-Backed Explainers",
        content:
          "Pages that include transparent methods, sample sizes, and clear source notes are strong candidates for citation. If you use internal data, explain collection and limitations. Credibility increases when readers can evaluate the claim quality quickly.",
      },
    ],
  },
  "refresh-content-for-ai-overviews": {
    directAnswer:
      "Refresh frequency should match query volatility. Update fast-changing topics monthly, operational guides quarterly, and foundational definitions every 6-12 months. The goal is not constant rewrites; it is keeping high-value pages accurate enough to remain trusted citation candidates.",
    sections: [
      {
        heading: "Set Refresh Cadence by Query Type",
        content:
          "Fast-changing queries (platform updates, policy shifts, new features) need monthly review. Mid-volatility queries (implementation guides, tooling comparisons) usually need quarterly updates. Stable conceptual pages can run on semiannual or annual refreshes unless new evidence appears.",
      },
      {
        heading: "What to Update First",
        content:
          "Prioritize pages with high impressions, citation potential, or revenue impact. Refresh opening definitions, examples, screenshots, references, and FAQ entries first. If core guidance changed, update the direct answer block before expanding the rest of the article.",
      },
      {
        heading: "Efficient Refresh Workflow",
        content:
          "Use a recurring audit sheet with fields for last updated date, confidence level, stale sections, and required owner. Batch similar updates (for example all bot-policy mentions) in one sprint. This makes updates predictable and reduces editorial debt.",
      },
      {
        heading: "Show Freshness Transparently",
        content:
          "Use visible last-updated dates only when meaningful edits are made. Keep schema dateModified aligned with the real update. Avoid fake freshness updates that change a date without improving content; this erodes trust over time.",
      },
      {
        heading: "Measure Refresh Impact",
        content:
          "After updates, monitor impressions for target queries, citation checks on key platforms, and branded search trend over 2-6 weeks. If metrics do not improve, the issue may be intent mismatch or weak trust signals rather than content age alone.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found – GeoAnalyzer",
    };
  }

  return {
    title: `${post.title} – GeoAnalyzer`,
    description: post.description,
    openGraph: {
      title: `${post.title} – GeoAnalyzer`,
      description: post.description,
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const content = blogContent[slug];

  if (!post || !content) {
    notFound();
  }

  const schema = {
    ...generateBlogPostingSchema({
      title: post.title,
      description: post.description,
      datePublished: post.date,
      slug,
    }),
    "@context": "https://schema.org",
  };

  return (
    <>
      <Script
        id={`schema-blog-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Header */}
        <header className="border-b border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              GeoAnalyzer
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/faq"
                className="text-gray-300 hover:text-white transition-colors"
              >
                FAQ
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/blog"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <time className="text-gray-400 text-sm">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {post.description}
            </p>
          </header>

          {/* Direct Answer Block */}
          <section className="mb-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Direct Answer
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.directAnswer}
            </p>
          </section>

          {/* Content Sections */}
          <section className="prose prose-invert max-w-none">
            {content.sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {section.heading}
                </h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </section>

          {/* Related Posts */}
          <section className="mt-16 pt-16 border-t border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts
                .filter((p) => p.slug !== slug && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {relatedPost.description}
                    </p>
                  </Link>
                ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 text-center bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Check your GEO score
            </h2>
            <p className="text-gray-400 mb-8">
              See how well your website is optimized for AI recommendations.
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Analyze My Site
            </a>
          </section>
        </main>

        <Footer />
      </article>
    </>
  );
}
