'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Users, Zap, Award, Target } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function LandingPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-32">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[var(--color-accent-purple)] rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] shadow-sm mb-10 group hover:border-[var(--color-primary-base)] transition-colors cursor-pointer"
          >
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-primary-base)] mr-2 animate-pulse"></span>
            <span className="text-[var(--color-primary-base)] mr-2 font-black">NEW</span>
            <span>The #1 Study Platform for Sri Lankan A/L Students</span>
            <SparklesIcon className="w-4 h-4 ml-2 text-yellow-500 group-hover:rotate-12 transition-transform" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black font-display tracking-tighter text-[var(--color-text-primary)] mb-8 leading-tight"
          >
            Master Your A/Ls with <br />
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-[var(--color-primary-light)] via-[var(--color-accent-teal)] to-[var(--color-accent-purple)] blur-2xl opacity-20"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-base)] via-[var(--color-accent-teal)] to-[var(--color-accent-purple)]">
                AI-Powered Learning
              </span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 leading-relaxed font-medium"
          >
            Join thousands of students achieving their dream university goals with <strong className="text-[var(--color-text-primary)]">personalized study plans</strong>, interactive quizzes, and collaborative study groups.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link 
              href="/register" 
              className={buttonVariants({ 
                size: "lg", 
                className: "text-lg px-10 py-7 rounded-2xl shadow-glow-primary hover:-translate-y-1 transition-all duration-300 font-bold bg-[var(--color-primary-base)]" 
              })}
            >
              Start Learning for Free
            </Link>
            <Link 
              href="#features" 
              className={buttonVariants({ 
                variant: "outline", 
                size: "lg", 
                className: "text-lg px-10 py-7 rounded-2xl bg-[var(--color-bg-secondary)]/50 backdrop-blur-md border-[var(--color-border-medium)] hover:bg-[var(--color-bg-tertiary)] hover:-translate-y-1 transition-all duration-300 font-bold" 
              })}
            >
              Explore Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 border-y border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[var(--color-border-subtle)]/50"
          >
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} className="group">
              <div className="text-5xl font-black font-display text-[var(--color-text-primary)] mb-2 group-hover:scale-110 transition-transform text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-primary-light)]">10k+</div>
              <div className="text-sm text-[var(--color-text-secondary)] font-bold uppercase tracking-widest">Active Students</div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} className="group">
              <div className="text-5xl font-black font-display text-[var(--color-text-primary)] mb-2 group-hover:scale-110 transition-transform text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-accent-teal)]">50k+</div>
              <div className="text-sm text-[var(--color-text-secondary)] font-bold uppercase tracking-widest">Quizzes Completed</div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} className="group">
              <div className="text-5xl font-black font-display text-[var(--color-text-primary)] mb-2 group-hover:scale-110 transition-transform text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-status-success)]">95%</div>
              <div className="text-sm text-[var(--color-text-secondary)] font-bold uppercase tracking-widest">University Pass Rate</div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} className="group">
              <div className="text-5xl font-black font-display text-[var(--color-text-primary)] mb-2 group-hover:scale-110 transition-transform text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-accent-purple)]">24/7</div>
              <div className="text-sm text-[var(--color-text-secondary)] font-bold uppercase tracking-widest">AI Support</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-[var(--color-text-primary)] mb-4">Everything you need to excel</h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">We provide a comprehensive suite of tools designed specifically for the Sri Lankan A/L syllabus.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<Target className="w-6 h-6 text-[var(--color-primary-light)]" />}
            title="AI Task Prioritization"
            description="Our smart algorithms analyze your exam date and syllabus to create the perfect daily study schedule."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Interactive Quizzes"
            description="Test your knowledge with past papers and model questions, featuring instant detailed explanations."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-[var(--color-accent-light)]" />}
            title="Study Groups & Zoom"
            description="Create virtual study rooms, share notes, and join integrated Zoom sessions seamlessly."
          />
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-emerald-400" />}
            title="Resource Hub"
            description="Access a massive library of verified short notes, tutorials, and past papers organized by subject."
          />
          <FeatureCard 
            icon={<Award className="w-6 h-6 text-purple-400" />}
            title="Gamified Learning"
            description="Earn XP, unlock badges, and maintain streaks to keep yourself motivated throughout your journey."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-blue-400" />}
            title="Performance Analytics"
            description="Track your weak points and see your predicted grades based on our advanced analytics engine."
          />
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative z-20 border-t border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-secondary)]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[var(--color-text-primary)] mb-4">Simple, transparent pricing</h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <motion.div 
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.1 }}
            >
              <Card className="premium-card bg-[var(--color-bg-secondary)]/80 h-full flex flex-col relative overflow-hidden border-[var(--color-border-subtle)]">
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-bold font-display text-[var(--color-text-primary)] mb-2">Free</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-black text-[var(--color-text-primary)]">Rs.0</span>
                    <span className="text-[var(--color-text-secondary)] font-medium">/ forever</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {['Access to basic study materials', 'Up to 5 active tasks', 'Join up to 2 study groups', 'Standard Pomodoro timer'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0 mt-auto">
                  <Link 
                    href="/register" 
                    className={buttonVariants({ 
                      variant: "outline", 
                      className: "w-full h-12 text-lg font-bold rounded-xl border-[var(--color-border-medium)] hover:bg-[var(--color-bg-tertiary)]" 
                    })}
                  >
                    Get Started Free
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Premium Tier */}
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.2 }}
            >
              <Card className="premium-card bg-[var(--color-bg-secondary)]/80 h-full flex flex-col relative overflow-hidden border-[var(--color-primary-base)]/50 shadow-glow-primary">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] text-white text-xs font-bold px-4 py-1 rounded-bl-xl z-10">MOST POPULAR</div>
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary-base)]/10 to-transparent pointer-events-none"></div>
                <div className="p-8 flex-1 relative z-10">
                  <h3 className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] mb-2">Premium</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-black text-[var(--color-text-primary)]">Rs.1500</span>
                    <span className="text-[var(--color-text-secondary)] font-medium">/ month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {['Unlimited premium study materials', 'Unlimited AI-prioritized tasks', 'Unlimited study groups & Zoom', 'Detailed performance analytics', 'Priority AI support'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0 mt-auto relative z-10">
                  <Link 
                    href="/register" 
                    className={buttonVariants({ 
                      className: "w-full h-12 text-lg font-bold rounded-xl shadow-glow-primary bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] text-white hover:scale-[1.02] transition-transform" 
                    })}
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-mesh-gradient rounded-3xl p-12 text-center relative overflow-hidden shadow-glow-primary border border-[var(--color-border-subtle)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-base)]/20 to-transparent pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-bold font-display text-[var(--color-text-primary)] mb-6 relative z-10 tracking-tight">Ready to transform your results?</h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto relative z-10">Join Edu Hub today and take the first step towards your dream university.</p>
          <Link 
            href="/register" 
            className={buttonVariants({ 
              size: "lg", 
              className: "text-lg px-10 py-6 rounded-full relative z-10 shadow-glow-accent hover:scale-105 transition-transform duration-300 font-bold bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)]" 
            })}
          >
            Create Free Account
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9, y: 30 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } } }}>
      <Card className="premium-card bg-[var(--color-bg-secondary)]/50 transition-all duration-300 overflow-hidden group h-full">
        <div className="p-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-tertiary)] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative">
            <div className="absolute inset-0 bg-[var(--color-primary-light)] blur-md opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
            <div className="relative z-10">{icon}</div>
          </div>
          <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)] mb-3">{title}</h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
