// pages/api/get-prompts.js
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Hardcoded list of prompts
  const prompts = [
    {
      name: 'Buyer Persona',
      content: `Context:
You are a market research analyst for OptiGen, a cutting-edge generative AI inference optimization company competing with players like Together.ai. OptiGen specializes in maximizing the efficiency and performance of AI models during inference, helping organizations save costs and accelerate AI applications.

Instruction:
Develop 3 distinct buyer personas for OptiGen customers. For each persona, provide:

- Demographic Information: Age, gender, occupation, industry, company size, and region.

- Psychographic Details: Values, goals, challenges, and attitudes toward AI and cost-efficiency.

- Technology Usage Habits: Familiarity with AI tools, cloud platforms, and interest in optimization solutions.

- Preferred Communication Channels: Most effective ways to reach them (email, webinars, LinkedIn, etc.).

- Key Motivations for Using OptiGen: Why they would value generative AI inference optimization (e.g., reducing cloud costs, improving latency, scaling efficiently).

- Potential Objections or Concerns: Common barriers to adoption (e.g., integration complexity, budget constraints, trust in a new company).

Input:
Key Features of OptiGen:
- Up to 40% reduction in inference costs without compromising model accuracy.
- Streamlined integration with existing ML pipelines.
- Compatibility with leading frameworks (PyTorch, TensorFlow, etc.).
- Real-time insights into model performance and energy efficiency.`
    },
    {
      name: 'Social Strategy',
      content: `Context:
You are a social media strategist for NimbusDB, a cloud-based database platform offering managed OLTP databases with faster deployments, zero downtime, and minimal administrative overhead. Our brand voice is professional, innovative, and developer-friendly.

Instruction:
Develop a 4-week social media content strategy for LinkedIn to promote NimbusDB’s streamlined database management features. Follow these steps:

- Create a content theme for each week, aligned with the benefits of faster deployments, simplified management, and reliability.
- For each theme, propose 3 post ideas: one educational, one customer testimonial, and one call-to-action prompt to encourage free trials.
- Suggest relevant hashtags for each post (5–7 hashtags per post).
- Outline a brief caption structure for each post type (educational, testimonial, call-to-action).

Input:
Key Features of NimbusDB:
- Deploy databases in under 5 minutes with one-click setup.
- Automated backups and updates.
- High availability with no maintenance windows.
- Scalable pricing that grows with your business.`
    },
    {
      name: 'Product Launch',
      content: `Context:
You are the social media manager for QubitCore, a pioneering tech company leading the way in quantum computing solutions. We’re launching our new QubitCore Quantum Processor, a breakthrough in quantum performance designed to accelerate innovation for enterprises and researchers.

Instruction:
Create a series of 5 tweets to build excitement for our QubitCore Quantum Processor launch. Follow these guidelines:

- Each tweet should be under 280 characters.
- Incorporate our brand voice: visionary, bold, and empowering.
- Focus on different aspects: innovation, performance, use cases, industry impact, and a teaser.
- Include relevant hashtags and a call-to-action in each tweet.
- Ensure a cohesive narrative across all tweets that builds anticipation.

Input:
- Launch Date: March 1st
- Key Features: 256 qubits for unmatched computational power, low-error gates for higher accuracy, scalable architecture, integrated developer tools for quantum app development.
- Tagline: “Accelerating the Quantum Leap.”
- Website: qubitcore.com/quantum`
    },
    {
      name: 'Ad Campaign',
      content: `Context:
You are the lead copywriter for KubeEase, a revolutionary iPaaS platform that automates the deployment and scaling of Kubernetes applications.

Our brand voice is innovative, approachable, and empowering.

We're launching a new feature: AutoPilot, which simplifies Kubernetes scaling with intelligent auto-scaling and zero-downtime updates.

Target Audience:
Developers, DevOps professionals, and tech startups aged 25–45 who want the power of Kubernetes without the complexity. They value innovation, time-saving solutions, and reliability in their workflows.

Campaign Goal:
Increase awareness of the new AutoPilot feature and drive signups through targeted social media advertising.

Competitive Landscape:
Our main competitors are CloudFlex and K8sNow. CloudFlex offers a broad suite of cloud tools but is costly and complex. K8sNow is affordable but lacks advanced auto-scaling and user-friendly features.

Instruction:
Create a series of three short, compelling ad copies (max 50 words each) for LinkedIn that highlight the simplicity and power of AutoPilot for Kubernetes. Each ad should include a clear call-to-action.

Input:
Product USPs:

Automates Kubernetes scaling with intelligent load balancing.
Enables zero-downtime updates with smart rollbacks.
Simplifies Kubernetes management for teams of all sizes.
Flexible pricing with no hidden fees.`
    },
    {
      name: 'Email Subjects',
      content: `Context:
You are the email marketing specialist for CodeForge, a B2B dev tools company offering powerful solutions to streamline development workflows. We’re running an A/B test on email subject lines for our monthly developer newsletter.

Instruction:
Generate 5 variations of an email subject line for our monthly newsletter. The subject line should encourage opens and align with our brand voice (innovative, empowering, credible, accessible). After generating the subject lines, provide a brief explanation of why each might be effective.

Input:
Newsletter Content: A guide to CI/CD best practices, a case study from a startup that reduced deployment time by 50%, tips for optimizing developer workflows.
Target Audience: Developers, DevOps engineers, and tech leads at mid-sized companies and startups.
Previous Best-Performing Subject Line: “Streamline Your Workflow: 3 DevOps Best Practices You Can’t Miss”`
    },
    {
      name: 'Ad/Lead Analysis',
      content: `Context:
You are a marketing operations manager using FlowSynth, a cutting-edge AI framework for building and deploying powerful data analysis workflows with minimal code. You need to analyze campaign performance data from multiple sources (Google Ads, HubSpot, and Salesforce) to identify trends, optimize ad spend, and forecast lead conversions.

Instruction:
Using the following data from Google Ads, HubSpot, and Salesforce, generate a cohesive report with actionable insights.

Data:
Google Ads:
- Campaign A: Spend $10,000, Impressions 200,000, CTR 2.5%, Conversions 400
- Campaign B: Spend $7,500, Impressions 150,000, CTR 1.8%, Conversions 250
- Campaign C: Spend $5,000, Impressions 100,000, CTR 3.0%, Conversions 150

HubSpot:
Leads by Source:
- Google Ads: 500 leads, 350 MQLs, 200 SQLs
- Organic Search: 400 leads, 300 MQLs, 180 SQLs
- Email Campaigns: 300 leads, 250 MQLs, 150 SQLs

Salesforce:
Closed Deals by Source:
- Google Ads: 50 deals, $250,000 revenue, Average Deal Size $5,000
- Organic Search: 45 deals, $180,000 revenue, Average Deal Size $4,000
- Email Campaigns: 35 deals, $140,000 revenue, Average Deal Size $4,000

Task:
Generate a report that includes:
- Performance Trends: Identify the top-performing Google Ads campaign based on CTR and conversion rate.
- Spend Optimization: Recommend how to reallocate the Google Ads budget to maximize ROI.
- Lead Analysis: Show which lead source (Google Ads, Organic Search, Email Campaigns) delivers the best MQL-to-SQL conversion rates.
- Revenue Forecasting: Predict revenue for the next quarter for each source if current trends continue.

Output Format:
Deliver insights in a summarized table and include a list of recommended actions for the marketing team to optimize campaigns and revenue growth."`
    },
    {
      name: 'Intro Rewrite',
      content: `Context:
You are a professional technical content writer with a deep understanding about what engages a technical audience.

Instruction:
Rewrite the blog introduction below to be more technical and engaging. Keep the writing concise, direct, and free of jargon. Make it sound like a human wrote it and not produced by marketing.

Blog Introduction:
Integrating Salesforce with Snowflake enables businesses to combine CRM data with data warehousing capabilities. This integration centralizes data, providing opportunities for analysis and improved decision-making. In a data-driven environment, consolidating information is increasingly important.

This guide outlines the steps to set up the integration and provides recommendations for managing and analyzing data within Salesforce and Snowflake to maximize their combined utility.`
    },
    {
      name: 'SEO Evaluation',
      content: `Context:
You are an SEO expert. You know how to evaluate and rework content so that it ranks well on Google, keeps readers engaged, and maximizes reach.

Instruction:
Provide a detailed and professional evaluation of the provided blog post from an SEO perspective, grading it on a scale from 0-100. Your evaluation should focus on the blog's ability to achieve strong search engine optimization while remaining engaging and relevant to the target audience.

Assess the blog post's strengths and weaknesses in areas such as keyword usage, meta descriptions, headings structure, internal and external linking, content readability, and overall alignment with SEO best practices. Evaluate its effectiveness in balancing technical SEO elements with audience engagement. Additionally, analyze the writing quality to determine its ability to capture and hold the audience's interest, thereby increasing dwell time and reducing bounce rates.

Offer specific examples of areas that excel or need improvement, including actionable suggestions to enhance search visibility, user experience, and audience retention. Provide recommendations on how many images to include (e.g., at least one image every 300-400 words) and where to place them for maximum impact, such as near key sections or to break up lengthy text.

If key components of the post are missing like the metadescription, provide suggestions about what to include.

If no blog post is provided below, instruct the user to include the content to enable evaluation.

Blog Post:
<< INSERT HERE >>`
    },
    {
      name: 'Cold Outbound Email',
      content: `Context:
You are the lead copywriter for ScaleSecure, a cutting-edge data security platform that provides automated privacy compliance and risk mitigation for enterprises.

Our brand voice is professional, knowledgeable, and solution-oriented. Keep all communication direct, concise, and free of jargon.

We are launching a campaign to introduce ScaleSecure’s new SmartShield API, which simplifies sensitive data tokenization, accelerates compliance workflows, and integrates seamlessly into existing systems.

Target Audience:
Technical executives at B2B companies, such as CTOs, CIOs, and Heads of Engineering. They are focused on improving system reliability, meeting compliance requirements, and reducing security risks. Their pain points include the complexity of data privacy regulations, potential fines from non-compliance, and time wasted on custom solutions for sensitive data handling.

Campaign Goal:
Generate interest in ScaleSecure’s SmartShield API and schedule product demo calls with qualified leads.

Competitive Landscape:
Competitors include VaultPro and SecureFlow. VaultPro offers robust compliance features but requires significant setup time and lacks flexibility. SecureFlow is lightweight but doesn’t scale well for enterprise needs.

Instruction:
Write a concise, compelling cold outbound email (max 150 words) introducing SmartShield to a technical executive. The email should:

Address the recipient's pain points.
Highlight SmartShield’s key USPs, such as seamless integration, automated tokenization, and accelerated compliance workflows.
Include a short, impactful testimonial from an existing customer to build credibility.
End with a clear, actionable call-to-action to schedule a demo or conversation.
Input:
Product USPs:

Automated tokenization of sensitive data across systems.
Pre-built compliance workflows for regulations like GDPR, CCPA, and HIPAA.
Lightning-fast integration with popular tech stacks.
Scalable, enterprise-grade security features with low operational overhead.
Customer Testimonial:
"With ScaleSecure, we reduced compliance-related incidents by 70% and saved weeks of engineering effort on data tokenization. It just works." – John Smith, CTO of DataFlow Inc.`
    },
    {
      name: 'Lookalike Lead List',
      content: `Context:
You are a data researcher tasked with generating a lead list for a B2B technology company. The goal is to identify potential customers that closely resemble an existing list of 10 key customers.

The lead list should include companies with similar industries, revenue sizes, technology needs, or challenges. Use the provided list of companies as a reference to identify lookalike businesses.

Target Audience:
The target companies are mid-to-large enterprises in the B2B technology space. They are focused on innovation, leveraging cloud infrastructure, enhancing data security, scaling operations, and integrating AI into their workflows.

Instruction:
Based on the following list of 10 real companies, identify 20 similar companies that match their profile. Consider attributes like industry, company size, geographic location, and technology priorities.

For each company in the lead list, provide the following details:

- Company name
- Industry
- Headquarters location
- Estimated annual revenue
- Technology focus or relevant challenges

Input:
Existing Customer List:

- Snowflake (Cloud Data Platforms)
- Databricks (Data Engineering and AI)
- MongoDB (Database as a Service)
- HashiCorp (Infrastructure Automation)
- Confluent (Event Streaming Platforms)
- Okta (Identity and Access Management)
- Palantir (Enterprise AI and Data Analytics)
- Twilio (Communication APIs)
- Splunk (Data Observability and Security)
- Atlassian (Collaboration and Developer Tools)

Output:
A lead list of 20 companies with a similar profile to the above, formatted with the requested details for each company.`
    }
  ];

  const sortedPrompts = prompts.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  res.status(200).json(sortedPrompts);
}
