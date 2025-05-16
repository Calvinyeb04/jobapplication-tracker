import Link from 'next/link';
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 max-w-6xl">
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">About AstroTracker</h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Your all-in-one solution for organizing your job search journey with precision and ease.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-10 sm:mb-16">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            AstroTracker was built with one mission in mind: to help job seekers organize, track, and optimize their job search process.
            We believe that finding your dream job shouldn't be hindered by disorganization or lack of tools.
          </p>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            Our platform brings together all the essential tools you need in one place - from application tracking and interview management
            to AI-powered cover letter generation and personalized job recommendations.
          </p>
          <p className="text-sm sm:text-base text-gray-700">
            We're committed to continually improving and expanding our features to make your job search more efficient and successful.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-5 sm:p-8 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Key Features</h2>
          <ul className="space-y-2 sm:space-y-3">
            <li className="flex items-start">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 mt-0.5 sm:mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="font-medium text-gray-900 text-sm sm:text-base">Application Tracker</span>
                <p className="text-xs sm:text-sm text-gray-700">Keep all your job applications organized in one place</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 mt-0.5 sm:mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="font-medium text-gray-900 text-sm sm:text-base">Interview Management</span>
                <p className="text-xs sm:text-sm text-gray-700">Schedule and prepare for interviews effectively</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 mt-0.5 sm:mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="font-medium text-gray-900 text-sm sm:text-base">AI Cover Letter Generator</span>
                <p className="text-xs sm:text-sm text-gray-700">Create tailored cover letters with our advanced AI</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 mt-0.5 sm:mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="font-medium text-gray-900 text-sm sm:text-base">Job Recommendations</span>
                <p className="text-xs sm:text-sm text-gray-700">Discover personalized job opportunities</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10 sm:mb-16">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-6 sm:py-8 px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Meet the Developer</h2>
        </div>
        <div className="p-4 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="md:w-1/3">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 sm:p-6 rounded-lg text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
                  CY
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Calvin Yeboah</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Full Stack Developer</p>
                <div className="flex justify-center space-x-3">
                  <a href="https://www.linkedin.com/in/calyeb/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                    <FaLinkedin size={20} className="sm:w-6 sm:h-6" />
                  </a>
                  <a href="https://github.com/Calvinyeb04" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                    <FaGithub size={20} className="sm:w-6 sm:h-6" />
                  </a>
                  <a href="mailto:yeboahcalvin04@gmail.com" className="text-indigo-600 hover:text-indigo-800">
                    <FaEnvelope size={20} className="sm:w-6 sm:h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">About Me</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                I'm a driven Information Technology student at the University of Cincinnati, combining a strong foundation in software engineering principles from my Computer Science minor with hands-on experience in full-stack development.
              </p>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                My technical skills include proficiency in Java Spring Boot, ASP.NET Core, and C#, with experience in architecting and implementing scalable microservices, RESTful APIs, and enterprise-level solutions. I also have advanced database management skills, including SQL expertise, MongoDB proficiency, and experience with Microsoft SQL Server Management Studio.
              </p>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                AstroTracker is one of my passion projects, designed to help job seekers streamline their application process and increase their chances of landing their dream job.
              </p>
              
              <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Contact Information</h4>
                  <ul className="space-y-1 sm:space-y-2">
                    <li className="flex items-center">
                      <FaEnvelope className="text-indigo-600 mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      <a href="mailto:yeboahcalvin04@gmail.com" className="text-sm sm:text-base text-gray-700 hover:text-indigo-600">
                        yeboahcalvin04@gmail.com
                      </a>
                    </li>
                    <li className="flex items-center">
                      <FaPhone className="text-indigo-600 mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      <a href="tel:5133685646" className="text-sm sm:text-base text-gray-700 hover:text-indigo-600">
                        (513) 368-5646
                      </a>
                    </li>
                    <li className="flex items-center">
                      <FaLinkedin className="text-indigo-600 mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      <a href="https://www.linkedin.com/in/calyeb/" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-700 hover:text-indigo-600">
                        linkedin.com/in/calyeb
                      </a>
                    </li>
                    <li className="flex items-center">
                      <FaGithub className="text-indigo-600 mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      <a href="https://github.com/Calvinyeb04" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-700 hover:text-indigo-600">
                        github.com/Calvinyeb04
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Education</h4>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">University of Cincinnati</p>
                    <p className="text-xs sm:text-sm text-gray-700">BS in Information Technology</p>
                    <p className="text-xs sm:text-sm text-gray-700">Minor in Computer Science</p>
                    <p className="text-xs sm:text-sm text-gray-700">Aug 2022 - May 2027</p>
                    <p className="text-xs sm:text-sm text-gray-700">GPA: 3.8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-xl p-5 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Get In Touch</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6 max-w-2xl mx-auto">
          Have questions, suggestions, or want to collaborate? I'd love to hear from you! Feel free to reach out through any of the channels below.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <a 
            href="mailto:yeboahcalvin04@gmail.com" 
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <FaEnvelope className="mr-1 sm:mr-2" /> Email Me
          </a>
          <a 
            href="https://www.linkedin.com/in/calyeb/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <FaLinkedin className="mr-1 sm:mr-2" /> Connect on LinkedIn
          </a>
          <a 
            href="https://github.com/Calvinyeb04" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <FaGithub className="mr-1 sm:mr-2" /> View GitHub
          </a>
        </div>
      </div>
    </div>
  );
} 