import React, { useState, useEffect } from 'react';
import { Quote, GraduationCap, Award, TrendingUp, CheckCircle, MessageSquarePlus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  studentName: string;
  parentName: string;
  location: string;
  subject: string;
  gradeImprovement: string;
  text: string;
  year: string;
}

const defaultReviews: Review[] = [
  {
    id: '1',
    studentName: 'Brenda M.',
    parentName: 'Mrs. Wanjiku M.',
    location: 'Utawala / Mihango, Nairobi',
    subject: 'English & Literature (CBC / 8-4-4)',
    gradeImprovement: 'Grade C+ to A-',
    text: "Teacher Brigid Bwari completely turned around my daughter's English Paper 3 creative writing and set book analysis. Her structured approach and patience boosted Brenda's confidence immensely.",
    year: 'KCSE Candidate'
  },
  {
    id: '2',
    studentName: 'Collins K.',
    parentName: 'Dr. Kiprop K.',
    location: 'Parklands, Nairobi',
    subject: 'Conversational English & Grammar',
    gradeImprovement: 'Fluency & Speech Mastery',
    text: "Her dedication is unmatched. Collins improved his pronunciation, public speaking, and essay structure significantly within two months of 1-on-1 online sessions with Teacher Brigid.",
    year: 'Learner Class'
  },
  {
    id: '3',
    studentName: 'Ashley W.',
    parentName: 'Eng. Kamau W.',
    location: 'Embakasi, Nairobi',
    subject: 'Literature Set Books & Prose',
    gradeImprovement: 'Grade D+ to B+',
    text: "Teacher Brigid's experience from Saint Triza Mutalia and Sameta High shows in her teaching depth. She breaks down complex prose and poetry into easy-to-understand themes and character traits.",
    year: 'KCSE Candidate'
  },
  {
    id: '4',
    studentName: 'Brian N.',
    parentName: 'Mrs. Florence N.',
    location: 'Kisii / Online',
    subject: 'English Language & Comprehension',
    gradeImprovement: 'Grade B- to A',
    text: "Teacher Brigid provides regular progress logs and attendance updates. Brian went from struggling with comprehension analysis to scoring top marks. Highly recommended private teacher!",
    year: 'Candidate Class'
  }
];

export default function Testimonials() {
  const [reviewsList, setReviewsList] = useState<Review[]>(defaultReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // New review form fields
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('English & Literature');
  const [gradeImprovement, setGradeImprovement] = useState('Grade C to A');
  const [reviewText, setReviewText] = useState('');

  // Load reviews from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('brigid_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviewsList([...defaultReviews, ...parsed]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviewsList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviewsList.length - 1 ? 0 : prev + 1));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !studentName || !reviewText) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      parentName,
      studentName,
      location: location || "Nairobi / Kisii",
      subject,
      gradeImprovement: gradeImprovement || 'Grade C to A',
      text: reviewText,
      year: 'Parent Review'
    };

    const existingUserReviews = JSON.parse(localStorage.getItem('brigid_reviews') || '[]');
    const updatedUserReviews = [newReview, ...existingUserReviews];
    localStorage.setItem('brigid_reviews', JSON.stringify(updatedUserReviews));

    const updatedList = [newReview, ...reviewsList];
    setReviewsList(updatedList);
    setCurrentIndex(0);
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsReviewModalOpen(false);
      setParentName('');
      setStudentName('');
      setLocation('');
      setReviewText('');
    }, 2000);
  };

  const currentReview = reviewsList[currentIndex] || reviewsList[0];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2 relative max-w-4xl mx-auto px-4">
        <span className="text-xs font-mono tracking-widest text-amber-900 uppercase block font-bold">
          Verified Academic Results & Parent Testimonials
        </span>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-sans text-stone-950 tracking-tight font-bold">
            VERIFIED LEARNER OUTCOMES
          </h2>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer font-bold shadow-xs"
          >
            <MessageSquarePlus className="h-3.5 w-3.5 text-rose-700" />
            <span>Leave a Parent Review</span>
          </button>
        </div>
        <div className="h-0.5 w-12 bg-amber-600 mx-auto mt-2"></div>
      </div>

      {/* SINGLE HORIZONTAL METRICS STRIP */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-[#0F1B2E] border border-stone-800 shadow-md rounded-2xl p-5 flex flex-row items-center justify-between overflow-x-auto gap-3 sm:gap-6 divide-x divide-stone-800/80 scrollbar-none text-white">
          {[
            { icon: Award, value: "96%", label: "English Pass & Distinction Rate" },
            { icon: TrendingUp, value: "+2.8", label: "Average Grade Shift" },
            { icon: GraduationCap, value: "180+", label: "Guided Learners" },
            { icon: CheckCircle, value: "100%", label: "CBC & 8-4-4 Curriculum Alignment" }
          ].map((stat, idx) => (
            <div key={idx} className={`flex-1 min-w-[130px] text-center space-y-1 ${idx > 0 ? 'pl-3 sm:pl-6' : ''}`}>
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400 mx-auto mb-1 stroke-[2.2]" />
              <div className="text-lg sm:text-2xl font-serif font-black text-amber-400 whitespace-nowrap">{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-stone-300 uppercase whitespace-nowrap">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEW CARD WITH ARROWS */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white border border-stone-200 hover:border-amber-400/80 p-6 sm:p-8 rounded-2xl relative shadow-sm">
          <Quote className="absolute right-6 top-6 h-10 w-10 text-stone-200 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Badge & Subject */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 bg-rose-100 border border-rose-200 text-rose-900 text-xs font-mono px-3 py-1 rounded-full font-bold">
                  <span className="h-1.5 w-1.5 bg-rose-700 rounded-full" />
                  {currentReview.gradeImprovement}
                </span>
                <span className="text-amber-900 font-mono text-xs font-bold">
                  {currentReview.subject}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-sm sm:text-base text-stone-800 font-sans leading-relaxed italic pt-2">
                "{currentReview.text}"
              </p>

              {/* Parent Author Details */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap justify-between items-end gap-2 text-xs">
                <div>
                  <div className="font-serif text-stone-950 font-bold text-sm sm:text-base">{currentReview.parentName}</div>
                  <div className="text-stone-600 font-mono text-[11px]">Parent of {currentReview.studentName}</div>
                </div>
                <div className="text-right">
                  <div className="text-stone-600 font-mono text-[11px]">{currentReview.location}</div>
                  <div className="text-amber-900 font-mono text-[10px] font-bold">{currentReview.year}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ARROW NAVIGATION & DOTS */}
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-stone-200">
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 hover:text-amber-900 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
              title="Previous Review"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Dots + Count Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-stone-600 font-medium mr-1">
                {currentIndex + 1} / {reviewsList.length}
              </span>
              <div className="flex gap-1.5">
                {reviewsList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-6 bg-rose-700' : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 hover:text-amber-900 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer"
              title="Next Review"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Leave a Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl z-10 overflow-hidden text-stone-900"
            >
              <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                <div>
                  <span className="text-[10px] font-mono text-amber-900 uppercase tracking-wider block font-bold">Parent Feedback</span>
                  <h3 className="text-base font-serif font-bold text-stone-950">Submit a Parent Review</h3>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-1 rounded-lg text-stone-500 hover:bg-stone-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="p-8 text-center space-y-3 font-sans">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mx-auto">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-950">Review Published!</h4>
                  <p className="text-xs text-stone-600">Thank you for sharing your experience. Your review is now live on Teacher Brigid Bwari's official profile.</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="p-6 space-y-4 font-sans">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-700 block font-bold">Parent Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mrs. Wanjiku M."
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-700 block font-bold">Student Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Brenda M."
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-700 block font-bold">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Utawala / Nairobi"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-700 block font-bold">Grade Improvement</label>
                      <input
                        type="text"
                        placeholder="e.g. Grade C+ to A-"
                        value={gradeImprovement}
                        onChange={(e) => setGradeImprovement(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-700 block font-bold">Subject Track</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                    >
                      <option value="English & Literature">English & Literature</option>
                      <option value="English Grammar & Vocab">English Grammar & Vocab</option>
                      <option value="Literature Set Books">Literature Set Books</option>
                      <option value="Conversational English">Conversational English</option>
                      <option value="Candidate Exam Prep">Candidate Exam Prep</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-700 block font-bold">Your Review *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your child's experience and progress with Teacher Brigid Bwari..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-sans font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Post Review to Profile
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
