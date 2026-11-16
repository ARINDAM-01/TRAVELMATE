import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 30;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore', href: '/#destinations' },
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Travel Graph', href: '/#graph' },
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(href);
  };

  return (
    <motion.nav
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-secondary/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/[0.06] border border-white/10 rounded-xl flex items-center justify-center shadow-md group-hover:bg-white/[0.1] transition-all">
              <Plane className="text-white" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Travel<span className="text-neutral-400">Mate</span>
              </span>
              <span className="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold">
                Expedition Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <button className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 text-sm font-semibold rounded-xl shadow-md flex items-center gap-2 transition-all">
                  <User size={16} />
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    Log in
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 text-sm font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition-all">
                    <span>Get Started</span>
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-secondary/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-base font-medium text-white/80 hover:text-white py-1 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <button className="w-full py-3 bg-electric-blue text-white font-semibold rounded-xl text-center">
                      Go to Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-2.5 border border-white/15 text-white font-medium rounded-xl text-center">
                        Log in
                      </button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-2.5 bg-gradient-to-r from-electric-blue to-electric-cyan text-white font-semibold rounded-xl text-center shadow-lg shadow-blue-500/25">
                        Get Started Free
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
