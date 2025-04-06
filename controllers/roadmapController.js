// const Groq = require("groq-sdk");
// require('dotenv').config();

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// exports.generateRoadmap = async (req, res) => {
//     const { topic } = req.body;

//     if (!topic) {
//         return res.status(400).json({ error: 'Topic is required' });
//     }

//     const prompt = `Generate a detailed roadmap for ${topic} in a hierarchical JSON format. The structure should start with a root node having a title, and each topic should be represented as a title with an optional children array containing subtopics. The format should match this structure: { title: string, children?: [ ...same structure ] }. The JSON should be deeply nested to reflect the roadmap hierarchy, and formatted as a clean JavaScript object. Do not include any explanations or extra text, only return the JSON object.`;

//     try {
//         const completion = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "user",
//                     content: prompt,
//                 },
//             ],
//             model: "qwen-2.5-32b", 
//         });

//         const roadmap = JSON.parse(completion.choices[0].message.content); 
//         res.json(roadmap);
//     } catch (error) {
//         console.error('Error calling Groq API:', error);
//         res.status(500).json({ error: 'Failed to generate roadmap' });
//     }
// };

const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper Function: Clean Up Response
function cleanResponse(rawResponse) {
    // Remove Markdown-style backticks and "json" keyword
    let cleaned = rawResponse.replace(/```json|```/g, '').trim();
    return cleaned;
}

exports.generateRoadmap = async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    // Detailed Prompt
    const prompt = `Generate a detailed roadmap for ${topic} in a hierarchical JSON format. The structure should start with a root node having a "title" property, and each topic should be represented as an object with a "title" property and an optional "children" array containing subtopics. Ensure the output is strictly valid JSON without any additional explanations or text.

    The roadmap should include the following:
    1. **Major Categories**: Break down the topic into high-level categories (e.g., "Basics", "Tools", "Frameworks").
    2. **Subtopics**: Each category should have subtopics that provide more specific details.
    3. **Actionable Steps**: Include actionable steps or tasks under each subtopic (e.g., "Learn HTML Basics", "Practice CSS Flexbox").
    4. **Prerequisites**: If applicable, mention prerequisites for each category or subtopic (e.g., "Basic knowledge of JavaScript").
    5. **Tools and Resources**: Suggest tools, libraries, frameworks, or resources for each subtopic (e.g., "VS Code", "React DevTools").
    6. **Milestones**: Include milestones or checkpoints to track progress (e.g., "Build a simple website", "Deploy your first app").
    
    Example format:
    {
      "title": "Frontend Development Roadmap",
      "children": [
        {
          "title": "1. Basics of Web Development",
          "children": [
            {
              "title": "HTML",
              "children": [
                { "title": "Learn Semantic Elements" },
                { "title": "Understand Forms and Input Validation" },
                { "title": "Explore Accessibility Standards" }
              ],
              "tools": ["VS Code", "HTML Validator"],
              "prerequisites": ["Basic understanding of web browsers"]
            },
            {
              "title": "CSS",
              "children": [
                { "title": "Master Selectors & Specificity" },
                { "title": "Understand the Box Model" },
                { "title": "Learn Flexbox & Grid Layouts" }
              ],
              "tools": ["Chrome DevTools", "Sass Compiler"],
              "milestones": ["Build a responsive layout", "Style a landing page"]
            }
          ]
        },
        {
          "title": "2. JavaScript Fundamentals",
          "children": [
            {
              "title": "Core Concepts",
              "children": [
                { "title": "Variables and Data Types" },
                { "title": "Control Flow (if/else, loops)" },
                { "title": "Functions and Scope" }
              ],
              "resources": ["MDN Web Docs", "JavaScript.info"],
              "prerequisites": ["Basic programming knowledge"]
            },
            {
              "title": "DOM Manipulation",
              "children": [
                { "title": "Select and Modify Elements" },
                { "title": "Handle Events (click, hover, etc.)" }
              ],
              "tools": ["Browser Console", "jQuery (optional)"],
              "milestones": ["Create an interactive button", "Build a dynamic form"]
            }
          ]
        }
      ]
    }`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile", 
        });

        console.log("Raw Groq API Response:", completion.choices[0].message.content);

        // Clean up the response
        const rawResponse = completion.choices[0].message.content;
        const cleanedResponse = cleanResponse(rawResponse);

        // Validate and parse the response
        let roadmap;
        try {
            roadmap = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("Failed to parse JSON response:", parseError);
            return res.status(500).json({ error: "Invalid JSON response from Groq API" });
        }

        res.json(roadmap);
    } catch (error) {
        console.error('Error calling Groq API:', error);
        res.status(500).json({ error: 'Failed to generate roadmap' });
    }
};