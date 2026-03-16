import { Link } from 'react-router-dom';
import { FiLinkedin, FiTwitter, FiMail, FiYoutube, FiInstagram, FiFacebook, FiPhone, FiMapPin } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1E2A38] text-white pt-8 pb-6 md:pt-16 md:pb-12 px-6 lg:px-12 border-t border-[#B9975B]/20">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid: Responsive 1 column on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-12">
          
          {/* Column 1: Logo & Copyright (Centered on Mobile) */}
          <div className="flex flex-col items-center md:items-start space-y-2 md:space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight" style={{ color: '#ffffff' }}>
                Prof. Bodhibrata Nag
              </h3>
            </div>
            <div className="text-gray-400 text-sm md:text-base space-y-2">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <FiMail className="w-4 h-4" />
                <a href="mailto:nag@iimcal.ac.in" className="hover:text-white transition-colors">
                  nag@iimcal.ac.in
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <FiPhone className="w-4 h-4" />
                <span>+91-33-2467-8300</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <FiMapPin className="w-4 h-4" />
                <span>IIM Calcutta, Joka, Kolkata 700104, India</span>
              </p>
              <p className="text-gray-500 text-sm md:text-base font-medium">Dept. of Operations Management</p>
            </div>
            <div className="text-gray-500 text-sm md:text-base font-medium space-y-1">
              <p>© {currentYear} Prof. Bodhibrata Nag.</p>
              <p>All rights reserved.</p>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 Columns always, but centered on mobile) */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 py-3 md:py-0 border-y md:border-none border-white/5">
            <ul className="space-y-2 text-center md:text-left">
              <li><a href="/#home" className="text-base md:text-lg hover:underline opacity-80 hover:opacity-100 transition-all">Home</a></li>
              <li><Link to="/about" className="text-base md:text-lg hover:underline opacity-80 hover:opacity-100 transition-all">About</Link></li>
              <li><Link to="/courses" className="text-base md:text-lg hover:underline opacity-80 hover:opacity-100 transition-all">Courses</Link></li>
            </ul>
            <ul className="space-y-2 text-center md:text-left">
              <li><Link to="/research" className="text-base md:text-lg hover:underline opacity-80 hover:opacity-100 transition-all">Research</Link></li>
              <li><Link to="/book" className="text-base md:text-lg hover:underline opacity-80 hover:opacity-100 transition-all">Books</Link></li>
            </ul>
          </div>

          {/* Column 3: Socials & Newsletter (Centered on Mobile) */}
          <div className="flex flex-col items-center md:items-start space-y-3 md:space-y-6 pt-2 md:pt-0">
            {/* Social Icons Row */}
            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              {[
                { icon: <FiLinkedin />, href: "https://www.linkedin.com/" }
              ].map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="space-y-2 md:space-y-4 text-center md:text-left w-full">
              <h4 className="font-bold uppercase tracking-[0.2em] text-[10px] text-gray-500">Newsletter</h4>
              <a href="/#newsletter" className="inline-block text-lg md:text-xl border-b border-white pb-1 hover:text-gray-400 hover:border-gray-400 transition-all font-medium">
                Subscribe for the latest
              </a>
            </div>
            
            <Link to="/admin" className="text-[10px] uppercase tracking-widest text-gray-700 hover:text-white transition-all">
              Admin Access
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}