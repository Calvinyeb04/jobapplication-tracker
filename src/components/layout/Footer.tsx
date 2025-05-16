import Link from 'next/link';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-1">
            <Logo size="sm" showText={true} slogan={false} />
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              Your all-in-one solution for organizing your job search journey with precision and ease.
            </p>
          </div>
          
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 tracking-wider uppercase">Features</h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <li>
                <Link href="/applications" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  Applications
                </Link>
              </li>
              <li>
                <Link href="/interviews" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  Interviews
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  Recommendations
                </Link>
              </li>
              <li>
                <Link href="/cover-letter" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  Cover Letter Generator
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <li>
                <Link href="/dashboard" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="text-indigo-600 mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <a href="mailto:yeboahcalvin04@gmail.com" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 break-all">
                  yeboahcalvin04@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <FaLinkedin className="text-indigo-600 mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <a href="https://www.linkedin.com/in/calyeb/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  linkedin.com/in/calyeb
                </a>
              </li>
              <li className="flex items-center">
                <FaGithub className="text-indigo-600 mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <a href="https://github.com/Calvinyeb04" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">
                  github.com/Calvinyeb04
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            &copy; {currentYear} AstroTracker. All rights reserved.
          </p>
          <div className="mt-3 sm:mt-4 flex justify-center space-x-4 sm:space-x-6">
            <a href="https://www.linkedin.com/in/calyeb/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
              <FaLinkedin className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a href="https://github.com/Calvinyeb04" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
              <FaGithub className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a href="mailto:yeboahcalvin04@gmail.com" className="text-gray-400 hover:text-indigo-600">
              <FaEnvelope className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 