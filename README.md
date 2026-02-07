# GEO/AEO Analyzer - AI Recommendation Readiness Scanner

A sleek, Apple-inspired Next.js web application that analyzes websites for their AI recommendation readiness using the GEO/AEO (Generative Engine Optimization / Answer Engine Optimization) framework.

## Features

- **Evidence-Based Analysis**: Conservative scoring with cited evidence from actual page content
- **AI-Powered Scoring**: OpenAI GPT-5.2 analyzes sites against the GEO/AEO framework
- **Beautiful UI**: Apple-inspired design with smooth animations and transitions
- **Instant Partial Report**: See your score immediately in the browser
- **Full Email Report**: Detailed analysis sent directly to your inbox
- **Animated Visualizations**: Progress bars and score animations for engaging UX

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Analysis**: OpenAI GPT-5.2
- **Email Delivery**: Mailgun
- **Web Crawling**: Cheerio

## Setup Instructions

### 1. Install Dependencies

```bash
cd geo-analyzer
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mg.yourdomain.com
```

### 3. Get API Keys

**OpenAI API Key:**

1. Visit https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key

**Mailgun API Key:**

1. Visit https://www.mailgun.com
2. Sign up for a free account
3. Verify your domain or use sandbox domain for testing
4. Get your API key from Settings → API Keys
5. Get your domain from Sending → Domains

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## How It Works

### 1. Website Crawling

The app crawls up to 8 pages from the submitted URL:

- Homepage (/)
- About page
- Contact page
- Top service pages
- Blog/content pages

For each page, it extracts:

- Title and meta description
- Headings (H1, H2, H3)
- Text content (first 2000 words)
- JSON-LD structured data
- Signals: entity mentions, locations, dates, hedging words

### 2. Signal Extraction

Before AI analysis, deterministic signals are extracted:

- **Entity Signals**: Business name variations, location mentions
- **Direct Answer Signals**: 40-60 word answer blocks, Q&A patterns
- **Structural Signals**: Heading quality, paragraph length
- **Trust Signals**: Dates, specific numbers, constraints
- **Competitive Positioning**: Differentiation language

### 3. AI Scoring

OpenAI GPT-5.2 analyzes the extracted data against the GEO/AEO framework:

**Scoring Weights:**

- Entity Clarity: 30%
- Direct Answers: 30%
- Trust & Specificity: 20%
- Competitive Positioning: 10%
- Technical Accessibility: 10%

**Score Tiers:**

- 0-39: Invisible to AI
- 40-59: Weak / inconsistent
- 60-74: Functional AI presence
- 75-89: AI-reference capable
- 90-100: Primary citation candidate

### 4. Report Delivery

- **Partial Report**: Displayed immediately in browser with animated score cards
- **Full Report**: Sent via email with detailed hesitations and fix plan

## Project Structure

```
geo-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Main analysis API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── components/
│   └── ScoreCard.tsx             # Animated score visualization
├── lib/
│   ├── crawler.ts                # Website crawling logic
│   ├── analyzer.ts               # OpenAI integration
│   └── email.ts                  # Mailgun email service
├── types/
│   └── geo.ts                    # TypeScript type definitions (GEO/AEO)
└── public/                       # Static assets
```

## Customization

### Modify Scoring Weights

Edit `lib/analyzer.ts` and update the `SCORING_PROMPT`:

```typescript
Scoring weights:
- Entity Clarity: 30%
- Direct Answers: 30%
- Trust & Specificity: 20%
- Competitive Positioning: 10%
- Technical Accessibility: 10%
```

### Change Crawl Scope

Edit `lib/crawler.ts` and modify `pathsToCrawl`. Current v1.1 crawls homepage only:

```typescript
const pathsToCrawl = ["/"]; // Homepage only for lean analysis
```

### Customize Email Template

Edit `lib/email.ts` and modify the `generateReportHTML` function.

### Adjust Animation Timing

Edit `components/ScoreCard.tsx` and `app/page.tsx` to modify Framer Motion transitions:

```typescript
transition={{ delay: 0.5, duration: 0.6 }}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Visit https://vercel.com
3. Import your repository
4. Add environment variables in project settings
5. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Cost Considerations

- **OpenAI API**: ~$0.02-0.05 per analysis (GPT-5.2 usage)
- **Mailgun**: Free tier includes 5,000 emails/month
- **Hosting**: Vercel free tier is sufficient for moderate traffic

## Troubleshooting

**Crawling Fails:**

- Check if the website blocks crawlers
- Verify the URL is accessible and uses HTTPS
- Some sites require JavaScript rendering (limitation)

**Email Not Sending:**

- Verify Mailgun domain is verified
- Check API keys are correct
- For sandbox domain, add recipient as authorized

**OpenAI Errors:**

- Ensure API key has sufficient credits
- Check for rate limiting (wait and retry)
- Verify model name is correct (gpt-5.2)

## License

This is a commercial tool. All rights reserved.

## Support

For questions or issues, please contact the developer.
