// pages/api/get-prompts.js
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Prompt ideas: have 3-5 good prompts, task is to try them out and then team up to try modifying them to apply to Confluent
  // or you can try to come up with your own thing

  // Hardcoded list of prompts
  const prompts = [
    {
      name: 'Cold Email',
      content: 'Write a concise, professional cold email introducing our product and how it can solve a key problem for the recipient. Keep it under 150 words.',
    },
    {
      name: 'LinkedIn Post',
      content: 'Compose a LinkedIn post discussing the importance of real-time data streaming in modern applications. Highlight key benefits and use cases.',
    },
    {
      name: 'Blog Post Titles',
      content: 'Generate three compelling blog post titles about event-driven architectures and their impact on scalable, real-time systems.',
    },
    {
      name: 'Ad Campaign',
      content: `Context:

You are the lead copywriter for GreenLeaf, an eco-friendly home cleaning products company.

Our brand voice is friendly, informative, and empowering.

We’re launching a new line of biodegradable cleaning wipes.

Target Audience:

Environmentally conscious millennials and Gen Z consumers, aged 25–40, living in urban areas. They value sustainability but also convenience in their busy lives.

Campaign Goal:

Increase awareness of our new product line and drive online sales through social media advertising.

Competitive Landscape:

Our main competitors are BigClean and EcoShine. BigClean is known for strong cleaning power but uses harsh chemicals. EcoShine is eco-friendly but perceived as less effective.

Instruction:

Create a series of three short, compelling ad copies (max 50 words each) for Instagram that highlight the convenience and eco-friendliness of our new biodegradable cleaning wipes. Each ad should include a clear call-to-action.

Input:

Product USPs:

100% biodegradable, plastic-free packaging, effective against 99.9% of bacteria, pleasant lavender scent.`
    }
  ];

  res.status(200).json(prompts);
}
