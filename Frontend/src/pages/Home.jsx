import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import EditableText from '../components/EditableText';
import { FiArrowRight, FiCalendar, FiCheck } from 'react-icons/fi';
import { useFirestoreDoc } from '../hooks/useFirestoreDoc';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { subscribeToNewsletter } from '../utils/newsletter';
import { where, orderBy, limit } from 'firebase/firestore';

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const viewportOptions = { once: true, margin: '0px 0px -70px 0px', amount: 0.15 };

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]{11})/);
    return match ? match[1] : null;
  };

  const { data, loading } = useFirestoreDoc('content', 'home', {
    hero_greeting: 'PROFESSOR • STRATEGIST • ACADEMIC LEADER',
    hero_title: 'Prof. Bodhibrata Nag',
    hero_name: 'Professor of Operations Management',
    hero_subtitle: 'Indian Institute of Management Calcutta',
    hero_description:
      'Professor Bodhibrata Nag works across operations research, transportation, energy systems, sustainable supply chains, and cybersecurity, with leadership experience spanning academia, public systems, and executive education.',
    hero_image: '/prof-nag.jpg',

    blog_heading: 'Selected Writing',
    blog1_title: 'Analytical thinking for complex systems',
    blog1_excerpt: 'Perspectives on public systems, analytics, and management.',
    blog1_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    blog2_title: 'Infrastructure, policy, and execution',
    blog2_excerpt: 'Linking strategic thinking with operational delivery.',
    blog2_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
    blog3_title: 'Management, systems, and impact',
    blog3_excerpt: 'How institutions can think better at scale.',
    blog3_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',

    books_heading: 'Selected Books',
    book1_title: 'Business Applications of Operations Research',
    book1_description: 'A practical and analytical introduction to operations research and managerial applications.',
    book1_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    book2_title: 'Introduction to Operations Research',
    book2_description: 'Special Indian edition contribution to the classic operations research text.',
    book2_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    book3_title: 'Optimal Design of Timetables for Large Railways',
    book3_description: 'Research-led work on scheduling, railways, and optimization systems.',
    book3_image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',

    speaking_heading: 'Executive Learning & Consulting',
    speaking_description:
      'Explore executive education, applied teaching, consulting work, and broader institutional engagement.',

    newsletter_heading: 'Stay connected',
    newsletter_description:
      'Receive updates on publications, insights, talks, and new work.'
  });

  const { data: blogs, loading: blogsLoading } = useFirestoreCollection('blogs', [
    where('published', '==', true),
    orderBy('date', 'desc'),
    limit(6)
  ]);

  const { data: booksData, loading: booksLoading } = useFirestoreCollection('books', [
    where('published', '==', true)
  ]);

  const { data: courses, loading: coursesLoading } = useFirestoreCollection('courses', [
    where('published', '==', true),
    limit(6)
  ]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNewsletterStatus({ message: '', type: '' });

    const result = await subscribeToNewsletter(newsletterEmail);

    setNewsletterStatus({
      message: result.message,
      type: result.success ? 'success' : 'error'
    });

    if (result.success) setNewsletterEmail('');
    setTimeout(() => setNewsletterStatus({ message: '', type: '' }), 5000);
    setIsSubmitting(false);
  };

  if (loading || blogsLoading || booksLoading || coursesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f1e8]">
        <div className="w-16 h-16 rounded-full border-4 border-[#d9d2c5] border-t-[#1E2A38] animate-spin" />
      </div>
    );
  }

  const homeBlogs = (blogs || []).filter((b) => b.showOnHome);
  const recentBlogs =
    homeBlogs.length > 0
      ? homeBlogs
      : (blogs || []).length > 0
      ? blogs
      : [
          {
            id: 'b1',
            title: data.blog1_title,
            excerpt: data.blog1_excerpt,
            imageUrl: data.blog1_image,
            date: '2026-02-01',
            slug: 'blog-1'
          },
          {
            id: 'b2',
            title: data.blog2_title,
            excerpt: data.blog2_excerpt,
            imageUrl: data.blog2_image,
            date: '2026-01-20',
            slug: 'blog-2'
          },
          {
            id: 'b3',
            title: data.blog3_title,
            excerpt: data.blog3_excerpt,
            imageUrl: data.blog3_image,
            date: '2026-01-05',
            slug: 'blog-3'
          }
        ];

  const homeBooksList = (booksData || []).filter((b) => b.showOnHome);

  const staticBooksList = [
    {
      tf: 'book1_title',
      df: 'book1_description',
      imgf: 'book1_image',
      linkf: 'book1_link',
      fb: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
    },
    {
      tf: 'book2_title',
      df: 'book2_description',
      imgf: 'book2_image',
      linkf: 'book2_link',
      fb: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'
    },
    {
      tf: 'book3_title',
      df: 'book3_description',
      imgf: 'book3_image',
      linkf: 'book3_link',
      fb: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop'
    }
  ];

  const topCourse = (courses || []).find((c) => c.showOnHome) || (courses || [])[0];
  const videoId = topCourse?.youtubeUrl ? extractVideoId(topCourse.youtubeUrl) : null;
  const thumbnailUrl =
    topCourse?.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null);

  return (
    <div className="bg-[#f5f1e8] text-[#1E2A38] overflow-hidden">
      <section className="relative overflow-hidden bg-[#f6f1e8]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 w-[1100px] h-[1100px] rounded-full border border-[#ddd3c3]/40" />
          <div className="absolute left-[8%] top-[20%] w-52 h-52 rounded-full bg-[#c6a76a]/10 blur-3xl" />
          <div className="absolute right-[10%] bottom-[12%] w-64 h-64 rounded-full bg-[#1E2A38]/[0.05] blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          {/* Mobile: stacked (text → image), Desktop: side-by-side (image | text) */}
          <div className="flex flex-col lg:grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-16 lg:items-center">

            {/* Text — appears first on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <EditableText
                field="hero_greeting"
                defaultValue={data.hero_greeting || 'PROFESSOR • STRATEGIST • ACADEMIC LEADER'}
                className="block text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#b08b47] font-semibold mb-4 sm:mb-6"
              />

              <EditableText
                field="hero_title"
                defaultValue={data.hero_title || 'Prof. Bodhibrata Nag'}
                className="block text-[2.8rem] sm:text-[4rem] lg:text-[6.6rem] leading-[0.88] tracking-[-0.04em] font-['Cormorant_Garamond','Playfair_Display'] font-semibold text-[#132033]"
              />

              <EditableText
                field="hero_name"
                defaultValue={data.hero_name || 'Professor of Operations Management, IIM Calcutta'}
                className="block mt-4 sm:mt-6 text-[1.15rem] sm:text-[1.5rem] lg:text-[2.2rem] leading-snug font-['Cormorant_Garamond','Playfair_Display'] text-[#1E2A38]"
              />

              <EditableText
                field="hero_description"
                defaultValue={
                  data.hero_description ||
                  'Professor Bodhibrata Nag is a distinguished academic with extensive experience in operations management, transportation, energy systems, sustainable supply chains, and cybersecurity at IIM Calcutta.'
                }
                className="block mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-[#58616c] font-['Inter'] max-w-2xl mx-auto lg:mx-0"
                multiline
              />

              <div className="mt-7 sm:mt-9 flex flex-col xs:flex-row flex-wrap justify-center lg:justify-start gap-3">
                <Link to="/about" className="w-full xs:w-auto">
                  <button className="w-full xs:w-auto bg-[#1E2A38] text-white px-7 py-3.5 rounded-md text-sm font-semibold hover:bg-[#2d4055] transition-colors">
                    View Profile
                  </button>
                </Link>

                <Link to="/research" className="w-full xs:w-auto">
                  <button className="w-full xs:w-auto border border-[#d7cebf] text-[#1E2A38] px-7 py-3.5 rounded-md text-sm font-semibold hover:bg-white/60 transition-colors">
                    Explore Research
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Image — appears second on mobile, first column on desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 flex justify-center lg:justify-start mt-8 lg:mt-0 pb-8 lg:pb-12"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full border border-[#d9cfbf] scale-[1.08]" />
                <div className="absolute inset-0 rounded-full border border-[#e7dece] scale-[1.16]" />

                <div className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden bg-[#e8decd] border-[8px] sm:border-[10px] border-white shadow-[0_20px_60px_rgba(30,42,56,0.12)] relative z-10">
                  <img
                    src={data.hero_image || '/prof-nag.jpg'}
                    alt="Prof. Bodhibrata Nag"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/800x800/1E2A38/FFFFFF';
                    }}
                  />
                </div>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-0 bg-white/92 backdrop-blur-md border border-[#e2d8c8] rounded-2xl px-4 py-3 shadow-[0_15px_40px_rgba(30,42,56,0.08)] z-20 whitespace-nowrap">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b08b47] font-semibold mb-1">
                    IIM Calcutta
                  </p>
                  <p className="text-sm text-[#1E2A38] font-medium">
                    Operations Management
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-16 py-12 sm:py-14 lg:py-16 bg-white border-y border-[#e7dfd2]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-start sm:items-end justify-between gap-4 flex-wrap mb-8 sm:mb-10">
              <div>
                <EditableText
                  field="blog_heading"
                  defaultValue={data.blog_heading}
                  className="block text-2xl sm:text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold mb-2"
                />
                <p className="text-sm text-[#5c6571] font-['Inter']">
                  Writing on management, systems, technology, and public institutions.
                </p>
              </div>

              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E2A38] hover:text-[#b08b47] transition-colors shrink-0"
              >
                View All <FiArrowRight />
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {recentBlogs.slice(0, 3).map((blog, index) => (
                <motion.div
                  key={blog.id || index}
                  variants={fadeInUp}
                  className="bg-[#f5f1e8] rounded-[24px] overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-[#e7dfd2] overflow-hidden">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://placehold.co/800x600/e8e1d7/1E2A38';
                      }}
                    />
                  </div>

                  <div className="p-6">
                    {blog.date ? (
                      <div className="flex items-center gap-2 text-[#7a8390] text-xs uppercase tracking-[0.18em] mb-3">
                        <FiCalendar size={12} />
                        <span>{formatDate(blog.date)}</span>
                      </div>
                    ) : null}

                    <h3 className="text-2xl font-['Cormorant_Garamond','Playfair_Display'] font-bold leading-snug mb-3">
                      {blog.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#55606d] leading-relaxed font-['Inter'] mb-5">
                      {blog.excerpt}
                    </p>

                    <Link
                      to={blog.slug ? `/blog/${blog.slug}` : '/blog'}
                      className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#b08b47] transition-colors"
                    >
                      Read Article <FiArrowRight />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-16 py-12 sm:py-14 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-start sm:items-end justify-between gap-4 flex-wrap mb-8 sm:mb-10">
              <div>
                <EditableText
                  field="books_heading"
                  defaultValue={data.books_heading}
                  className="block text-2xl sm:text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold mb-2"
                />
                <p className="text-sm text-[#5c6571] font-['Inter']">
                  Selected publications and foundational works.
                </p>
              </div>

              <Link
                to="/book"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E2A38] hover:text-[#b08b47] transition-colors shrink-0"
              >
                View All <FiArrowRight />
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {(homeBooksList.length > 0 ? homeBooksList.slice(0, 3) : staticBooksList).map((book, i) => {
                const isStatic = !homeBooksList.length;
                const image = isStatic ? data[book.imgf] || book.fb : book.coverUrl;
                const title = isStatic ? data[book.tf] : book.title;
                const desc = isStatic ? data[book.df] : book.description || book.subtitle || '';
                const link = isStatic ? data[book.linkf] || '/book' : book.amazonLink || '/book';

                return (
                  <motion.div
                    key={isStatic ? i : book.id}
                    variants={fadeInUp}
                    className="bg-white rounded-[24px] p-5 sm:p-6"
                  >
                    <div className="aspect-[3/4] rounded-[20px] overflow-hidden bg-[#e6ddd0] mb-5">
                      <img
                        src={image}
                        alt={title || 'Book cover'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://placehold.co/600x800/e6e0d5/1E2A38';
                        }}
                      />
                    </div>

                    <h3 className="text-2xl font-['Cormorant_Garamond','Playfair_Display'] font-bold leading-snug mb-3">
                      {title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#55606d] leading-relaxed font-['Inter'] mb-5">
                      {desc}
                    </p>

                    <a
                      href={link}
                      target={link?.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#b08b47] transition-colors"
                    >
                      View Book <FiArrowRight />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-16 py-12 sm:py-14 lg:py-16 bg-[#1E2A38] text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={staggerContainer}
            className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="max-w-2xl">
              <EditableText
                field="speaking_heading"
                defaultValue={data.speaking_heading}
                className="block text-3xl sm:text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold leading-tight mb-5"
              />
              <EditableText
                field="speaking_description"
                defaultValue={data.speaking_description}
                className="block text-sm sm:text-base text-white/75 leading-relaxed font-['Inter'] mb-8"
                multiline
              />

              <div className="flex flex-wrap gap-3">
                <Link to="/courses">
                  <button className="bg-[#b08b47] text-[#1E2A38] px-6 py-3 rounded-md text-sm font-semibold hover:bg-[#d2b073] transition-colors">
                    Explore Courses
                  </button>
                </Link>
                <Link to="/consulting">
                  <button className="bg-transparent text-white px-6 py-3 rounded-md text-sm font-semibold border border-white/20 hover:bg-white/5 transition-colors">
                    Consulting
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              {topCourse && thumbnailUrl ? (
                <div className="bg-white/5 rounded-[24px] overflow-hidden">
                  <div className="aspect-video bg-white/10 overflow-hidden">
                    <img
                      src={thumbnailUrl}
                      alt={topCourse.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (videoId) e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#d5b477] font-semibold mb-3">
                      Featured Learning
                    </p>

                    <h3 className="text-2xl sm:text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold mb-3" style={{ color: 'rgba(255,255,255,0.88)' }}>
                      Courses and executive programs
                    </h3>

                    <p className="text-sm sm:text-base text-white/75 leading-relaxed font-['Inter'] mb-5">
                      Explore teaching, applied learning, and professional development offerings.
                    </p>

                    <a
                      href={topCourse.youtubeUrl || '/courses'}
                      target={topCourse.youtubeUrl ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0d59b] hover:text-white transition-colors"
                    >
                      Open Course <FiArrowRight />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-[24px] p-8 sm:p-10">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#d5b477] font-semibold mb-3">
                    Featured Learning
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold mb-3" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    Courses and executive programs
                  </h3>

                  <p className="text-sm sm:text-base text-white/75 leading-relaxed font-['Inter'] mb-5">
                    Explore teaching, applied learning, and professional development offerings.
                  </p>

                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0d59b] hover:text-white transition-colors"
                  >
                    Explore Courses <FiArrowRight />
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-16 py-12 sm:py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={staggerContainer}
            className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-start"
          >
            <motion.div variants={fadeInUp}>
              <EditableText
                field="newsletter_heading"
                defaultValue={data.newsletter_heading}
                className="block text-3xl sm:text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold mb-4"
              />
              <EditableText
                field="newsletter_description"
                defaultValue={data.newsletter_description}
                className="block text-sm sm:text-base text-[#55606d] leading-relaxed font-['Inter'] mb-8 max-w-xl"
                multiline
              />

              <form onSubmit={handleNewsletterSubmit} className="max-w-xl space-y-4">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={isSubmitting}
                  className="w-full px-5 py-4 rounded-md border border-[#d8d0c3] bg-[#faf7f1] focus:outline-none focus:border-[#1E2A38] text-[#1E2A38]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1E2A38] text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-[#2d4055] transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              {newsletterStatus.message ? (
                <div
                  className={`mt-5 p-4 rounded-xl border text-sm flex items-start gap-3 max-w-xl ${
                    newsletterStatus.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {newsletterStatus.type === 'success' ? <FiCheck className="mt-0.5" /> : null}
                  <span>{newsletterStatus.message}</span>
                </div>
              ) : null}
            </motion.div>

            <motion.div variants={fadeInUp} className="lg:pl-10">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#b08b47] font-semibold mb-4">
                Direct Access
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold leading-tight mb-5">
                Research, books, executive learning, and institutional engagement
              </h2>

              <p className="text-sm sm:text-base text-[#55606d] leading-relaxed font-['Inter'] max-w-xl mb-8">
                Use the homepage as a clear gateway into his academic work, published writing, consulting, and teaching.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/research">
                  <button className="bg-[#1E2A38] text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-[#2d4055] transition-colors">
                    Research
                  </button>
                </Link>
                <Link to="/book">
                  <button className="bg-transparent text-[#1E2A38] px-6 py-3 rounded-md text-sm font-semibold border border-[#d8d0c3] hover:bg-[#faf7f1] transition-colors">
                    Books
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="bg-transparent text-[#1E2A38] px-6 py-3 rounded-md text-sm font-semibold border border-[#d8d0c3] hover:bg-[#faf7f1] transition-colors">
                    Contact
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
