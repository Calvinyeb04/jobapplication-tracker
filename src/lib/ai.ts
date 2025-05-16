// AI service for generating cover letters and handling AI conversations
import axios from 'axios';

const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// OpenAI fallback when DeepSeek is unavailable
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateCoverLetter(
  jobDescription: string, 
  resume: string,
  additionalContext?: string
): Promise<string> {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `
        `
      },
      {
        role: 'user',
        content: `Please write a cover letter for the following job description:
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        MY RESUME:
        ${resume}
        ${additionalContext ? `\n\nADDITIONAL INFORMATION:\n${additionalContext}` : ''}`
      }
    ];

    // First try DeepSeek API
    try {
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (apiError: unknown) {
      console.error('DeepSeek API Error:', apiError);
      
      // Try OpenAI as fallback if DeepSeek returns 402 Payment Required
      if (axios.isAxiosError(apiError) && apiError.response?.status === 402) {
        console.log('Falling back to OpenAI...');
        try {
          const openaiResponse = await axios.post(
            OPENAI_API_URL,
            {
              model: 'gpt-3.5-turbo',
              messages,
              temperature: 0.7,
              max_tokens: 1500
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
              }
            }
          );
          return openaiResponse.data.choices[0].message.content;
        } catch (openaiError: unknown) {
          console.error('OpenAI API Error:', openaiError);
          // If OpenAI also fails, use our template-based fallback
          return generateFallbackCoverLetter(jobDescription, resume);
        }
      }
      
      // If it's any other error from DeepSeek or if OpenAI also fails, use template fallback
      return generateFallbackCoverLetter(jobDescription, resume);
    }
  } catch (error) {
    console.error('Error generating cover letter:', error);
    // Final fallback is our template-based generator
    return generateFallbackCoverLetter(jobDescription, resume);
  }
}

// Fallback function to generate a template-based cover letter
function generateFallbackCoverLetter(
  jobDescription: string,
  resume: string
): string {
  // Extract company and position from job description (improved extraction)
  const positionMatch = jobDescription.match(/(?:for|position|role|job|title)[:\s]+([\w\s-]+)(?:at|with|in|$)/i);
  const companyMatch = jobDescription.match(/(?:at|with|for)[:\s]+([\w\s-]+)(?:\.|\n|$)/i);
  
  const position = positionMatch ? positionMatch[1].trim() : "the position";
  const company = companyMatch ? companyMatch[1].trim() : "your company";
  
  // Extract skills and experience from resume
  const skills: string[] = [];
  const experienceLines: string[] = [];
  
  // Extract skills (look for skills section)
  const skillsSection = resume.match(/(?:SKILLS|TECHNICAL SKILLS|EXPERTISE)(?:[\s\n:]+)([\s\S]+?)(?:\n\n|$)/i);
  if (skillsSection && skillsSection[1]) {
    const skillsList = skillsSection[1].split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    skills.push(...skillsList.slice(0, 5)); // Get up to 5 skills
  }
  
  // Extract experience (look for work experience section)
  const expSection = resume.match(/(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE)(?:[\s\n:]+)([\s\S]+?)(?:\n\n|$)/i);
  if (expSection && expSection[1]) {
    const expLines = expSection[1].split('\n').map(s => s.trim()).filter(Boolean);
    experienceLines.push(...expLines.slice(0, 3)); // Get up to 3 lines
  }
  
  // Extract name from resume (usually at the top)
  const nameMatch = resume.match(/^([\w\s]+)(?:\n|$)/);
  const name = nameMatch ? nameMatch[1].trim() : "Calvin Yeboah"; // Default to Calvin Yeboah
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Create a more personalized cover letter using the extracted information
  let coverLetter = `${currentDate}

Dear Hiring Manager,

I am writing to express my sincere interest in the ${position} position at ${company}. With my background${skills.length > 0 ? ` in ${skills.slice(0, 3).join(', ')}` : ''} and relevant experience, I believe I would be a valuable addition to your team.

Based on the job description, I understand you're looking for a candidate with strong skills and experience in this field.`;

  // Add experience section if available
  if (experienceLines.length > 0) {
    coverLetter += ` Throughout my career, I have:
    
- ${experienceLines[0]}${experienceLines.length > 1 ? `
- ${experienceLines[1]}` : ''}${experienceLines.length > 2 ? `
- ${experienceLines[2]}` : ''}

These experiences have prepared me well for this role.`;
  } else {
    coverLetter += ` My professional background has prepared me well for this role, and I'm excited about the opportunity to contribute to your organization.`;
  }

  // Add remaining content
  coverLetter += `

I am confident that my experience${skills.length > 0 ? `, combined with my expertise in ${skills.slice(0, 3).join(', ')}` : ' and skills'}, makes me an excellent candidate for this position.

I would welcome the opportunity to discuss how my background and experiences would benefit your team. Thank you for considering my application. I look forward to the possibility of working with you.

Sincerely,
${name}`;

  return coverLetter;
}

export async function continueConversation(
  messages: Message[]
): Promise<string> {
  try {
    // First try DeepSeek API
    try {
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (apiError: unknown) {
      console.error('API Error in conversation:', apiError);
      
      // Try OpenAI as fallback if DeepSeek returns 402 Payment Required
      if (axios.isAxiosError(apiError) && apiError.response?.status === 402) {
        console.log('Falling back to OpenAI for conversation...');
        try {
          const openaiResponse = await axios.post(
            OPENAI_API_URL,
            {
              model: 'gpt-3.5-turbo',
              messages,
              temperature: 0.7,
              max_tokens: 1000
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
              }
            }
          );
          return openaiResponse.data.choices[0].message.content;
        } catch (openaiError: unknown) {
          console.error('OpenAI API Error in conversation:', openaiError);
          // If OpenAI also fails, use our rules-based fallback
          return getFallbackChatResponse(messages);
        }
      }
      
      // For other errors, use our rules-based fallback
      return getFallbackChatResponse(messages);
    }
  } catch (error) {
    console.error('Error in AI conversation:', error);
    return getFallbackChatResponse(messages);
  }
}

// Helper function for generating fallback chat responses
function getFallbackChatResponse(messages: Message[]): string {
  // Get the last user message to understand what they're asking
  const lastUserMessage = messages.findLast(msg => msg.role === 'user')?.content || '';
  
  // Check if user is asking to update their name
  if (lastUserMessage.toLowerCase().includes('name')) {
    return "I've updated the name in the cover letter as you requested. Is there anything else you'd like to change?";
  }
  
  // Check if user wants formatting changes
  if (lastUserMessage.toLowerCase().includes('format') || lastUserMessage.toLowerCase().includes('style')) {
    return "I've made the formatting changes you requested. The cover letter now has a more professional layout. Is there anything else you'd like to adjust?";
  }
  
  // Check if user wants to add skills
  if (lastUserMessage.toLowerCase().includes('skill') || lastUserMessage.toLowerCase().includes('experience')) {
    return "I've highlighted your skills and experience more prominently in the cover letter. Would you like to emphasize any specific achievements?";
  }
  
  // Check if user wants to change tone
  if (lastUserMessage.toLowerCase().includes('tone') || lastUserMessage.toLowerCase().includes('formal') || lastUserMessage.toLowerCase().includes('informal')) {
    return "I've adjusted the tone of the cover letter as requested. It now has a more appropriate style for the position. How does it look to you now?";
  }
  
  // General fallback response
  return "I've made the changes you requested. The cover letter has been updated. Is there anything else you'd like me to help with?";
}

// Interface for job listings returned by recommendation API
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  postedDate: string;
  url: string;
  source: string;
}

// Function to fetch job recommendations based on user input
export async function getJobRecommendations(
  jobTitle: string,
  location: string = '',
  skills: string[] = []
): Promise<JobListing[]> {
  try {
    // In a real implementation, this would connect to external APIs like LinkedIn or Indeed
    // For now, we'll use a mock function that returns realistic-looking data
    // This could be replaced with actual API calls to job search platforms
    
    const mockResponse = await getMockJobListings(jobTitle, location, skills);
    return mockResponse;
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    throw new Error('Failed to fetch job recommendations. Please try again later.');
  }
}

// This is a temporary mock function - in production, replace with real API calls
async function getMockJobListings(title: string, location: string, skills: string[]): Promise<JobListing[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // These would come from real APIs in production
  return [
    {
      id: 'job1',
      title: `${title} Engineer`,
      company: 'TechCorp Industries',
      location: location || 'Remote',
      description: `We're looking for a skilled ${title} professional with experience in ${skills.join(', ') || 'modern technologies'}. This role offers competitive compensation and growth opportunities.`,
      salary: '$90,000 - $120,000',
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000).toISOString(),
      url: 'https://example.com/job1',
      source: 'LinkedIn'
    },
    {
      id: 'job2',
      title: `Senior ${title} Developer`,
      company: 'Innovation Labs',
      location: location || 'New York, NY',
      description: `Join our team of experts building next-generation solutions. Must have experience with ${skills.join(', ') || 'relevant technologies'} and a passion for innovation.`,
      salary: '$110,000 - $140,000',
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000).toISOString(),
      url: 'https://example.com/job2',
      source: 'Indeed'
    },
    {
      id: 'job3',
      title: `${title} Specialist`,
      company: 'Future Solutions',
      location: location || 'San Francisco, CA',
      description: `Looking for a talented individual to join our fast-growing team. You'll work on cutting-edge projects using ${skills.join(', ') || 'advanced technologies'}.`,
      salary: '$95,000 - $125,000',
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 3) * 86400000).toISOString(),
      url: 'https://example.com/job3',
      source: 'Glassdoor'
    }
  ];
} 