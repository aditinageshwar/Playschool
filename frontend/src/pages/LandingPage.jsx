import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { Mail, Phone, MapPin, Send, Sparkles, Facebook, Baby, Instagram, 
  Youtube, Menu, X, LogIn, Bus, Quote, Rocket, Paintbrush, Heart
} from "lucide-react";

import child from "../images/children.png";
import cloud from "../images/cloud.png";
import butterfly from "../images/butterfly.png";
import secondSection from "../images/secondSection.png";
import park from "../images/park.png";
import pencil from "../images/pencil.png";
import train from "../images/train.png";
import tree from "../images/tree.png";
import bee from "../images/bee.png";
import img1 from "../images/1.png";
import img2 from "../images/2.png";
import img3 from "../images/3.png";
import img4 from "../images/4.png";
import img5 from "../images/5.png";
import img6 from "../images/6.png";
import img7 from "../images/7.png";
import img8 from "../images/8.png";
import rainbow from "../images/Faculty/rainbow.jpeg";
import sun from "../images/Faculty/sun.jpeg";
import tech1 from "../images/Faculty/1.png";
import tech2 from "../images/Faculty/2.png";
import tech3 from "../images/Faculty/3.png";
import tech4 from "../images/Faculty/4.png";

const
 socialLinks = [
  { Icon: Instagram, href: "#" },
  { Icon: Youtube, href: "#" },
  { Icon: Facebook, href: "#" },
];

const programData = [
  {title: "Infants", image:img1, description: "We've created environments, secure spaces for your baby to explore and grow."},
  {title: "Toddlers", image:img2, description: "This age group has all the space they need to move, explore, and develop their independence."},
  {title: "Twos", image:img3, description: "The energetic group is always on the move as they achieve new developmental milestones."},
  {title: "Early Preschool", image:img4, description: "As children prepare for Preschool, they continue to grow both academically and socially with independence."},
  {title: "Preschool", image:img5, description: "Active play, social skills, and an learning experiences to get ready for Kindergarten."},
  {title: "Pre-K", image:img6, description: "As they build a solid foundation for Kindergarten, children lay the groundwork for future success and development."},
  {title: "Before & After School", image:img7, description: "Productive and engaging mornings and afternoons spent with your school-age children."},
  {title: "Summer Camp", image:img8, description: "Your child will have a blast spending the summer at Camp Horizons."},
];

const techImage = [
  {image: tech1, name: "Aarav Sharma", position:"Director"},
  {image: tech2, name: "Vikram Singh", position:"Activity Coordinator"},
  {image: tech3, name: "Sanya Mehra", position:"Child Psychologist"},
  {image: tech4, name: "Priya Soni", position:"Lead Educator"},
];

// ------ ANIMATION CONFIGURATION -------
const floatingAnimation = {
  animate: {
    y: [0, -10, 0], 
    transition: {
      duration: 5,
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

const textFadeIn = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const butterflyAnimation = {
  animate: {
    x: [0, 15, -10, 0], 
    y: [0, -15, 10, 0],
    rotate: [0, 5, -5, 0], 
    transition: {
      duration: 6, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const trainMovement = {
  animate: {
    x: [0, 20, -20, 0], 
    transition: {
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

const beeAnimation = {
  animate: {
    x: [0, -20, 10, -25, 0], 
    y: [0, -20, 15, 10, 0], 
    rotate: [0, 10, -5, 15, 0], 
    transition: {
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

// ==========================================
// 1. DYNAMIC NAVBAR COMPONENT
// ==========================================
const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Facilities", href: "#facilities" },
    { name: "Programs", href: "#programs" },
    { name: "Faculties", href: "#faculties" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  // Effect to handle sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // Fixed navigation bar with dynamic background based on scroll state
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? "bg-white backdrop-blur-xl shadow-lg py-3" : "bg-white py-5"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* School Logo Section */}
        <div className="flex items-center gap-2 text-orange-500 font-black text-2xl tracking-tighter">
          <div className="p-1.5 bg-orange-400 rounded-lg shadow-lg shadow-blue-500/30">
            <Baby size={28} className="text-white" />
          </div>
          <span>Play School</span>
        </div>

        {/* Desktop Links with hover animations */}
        <div className="hidden lg:flex items-center space-x-7">
          <div className="flex space-x-6 font-bold">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="relative text-gray-600 hover:text-orange-500 transition-colors group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* ERP Access Action Button */}
          <div className="flex items-center gap-4 pl-6 border-l border-slate-700">
            <button onClick={() => navigate('/login')} className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-slate-200">
              <LogIn size={16} /> Login
            </button>
          </div>
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex items-center gap-4 lg:hidden">
            <button className="text-slate-200 p-1" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
        </div>
      </div>

      {/* Animated Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-slate-800 overflow-hidden shadow-2xl">
            <div className="container mx-auto px-6 py-8 flex flex-col space-y-5">
              {navLinks.map((link, i) => (
                <motion.a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-xl text-gray-600 hover:text-orange-500 transition-colors flex justify-between items-center">
                  {link.name}
                </motion.a>
              ))}
              <div className="pt-6 border-t border-slate-800 flex flex-col gap-4">
                 <button onClick={() => navigate('/login')} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                   <LogIn size={18} /> ERP Login
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ==========================================
// 2. MAIN LANDING PAGE COMPONENT
// ==========================================
const LandingPage = () => {
  const navigate = useNavigate();
  const form = useRef(null); 
  const [loading, setLoading] = useState(false);

  return (
    <div className="scroll-smooth bg-white text-slate-200 font-sans antialiased pt-20">
      <LandingNavbar />

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        {/* Yellow background */}
        <div className="absolute inset-0 bg-[#FFDE7A] z-0"></div>
  
        {/* Content container */}
        <div className="relative z-10 container mx-auto  pt-12 pb-0 flex flex-col min-h-screen">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 flex-1 ">
            {/* Text content */}
            <motion.div 
              variants={textFadeIn}
              initial="initial"
              animate="animate"
              className="max-w-xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-[#F26B34]">Achieve your</span>
                <br />
                <span className="text-[#00B2E3]">future With</span>
                <br />
                <span className="text-[#F26B34]">Smart Academy</span>
              </h1>
              <p className="text-[#007BA7] mb-8 max-w-md">
                Kindergarten is an early childhood educational environment where most young children engage in learning
                experiences
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(242, 107, 52, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  href="#enroll"
                  className="bg-[#F26B34] hover:bg-[#e05a25] text-white font-medium py-3 px-6 rounded-full transition-colors"
                >
                  Enroll your kids
                </motion.a>
              </div>
            </motion.div>
  
            {/* Children image */}
            <div className="relative">
              <motion.img 
                src={child} 
                width={500} height={500} 
                className="z-50 relative"
                variants={floatingAnimation}
                animate="animate"
              />
  
              {/* Decorative elements */}
              <motion.div 
                className="absolute -top-16 -right-32 z-10"
                variants={butterflyAnimation}
                animate="animate"
              >
                <img src={butterfly} width={500} height={500} className="relative" />
              </motion.div>
            </div>
          </div>
  
          {/* Cloud image at bottom */}
          <div className="relative -mb-1 mt-auto">
            <motion.img 
              src={cloud} 
              width={1920} height={200} 
              className="w-full z-50 object-cover origin-bottom"
              animate={{ 
                y: [0, 8, 0], 
              }} 
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.img 
              src={cloud} 
              className="absolute bottom-0 left-0 w-full z-40 opacity-40 blur-[1px]"
              animate={{ 
                x: [-5, 5, -5],
                y: [3, 10, 3] 
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
       <section id="about" className="relative w-full py-12 px-4 md:px-8 lg:px-12 xl:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 relative">
            <img src={secondSection} width={700} height={700} className="w-full h-auto object-contain" priority/>
          </div>
  
          {/* Right side - Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-4 md:gap-5">
            <div className="leading-tight">
              <h6 className="text-[#FA6616] text-xl font-bold">Learning is an Adventure!</h6>
              <h1 className="text-[#07758D] text-3xl md:text-4xl lg:text-5xl font-bold leading-14">
                Where Little Hands<br/> Create Big Dreams!
              </h1>
              <p className="text-[#07758D] text-sm md:text-base py-3 text-justify">
                Kindergarten is an early childhood educational environment where most young children, typically aged 4 to 6,
                engage in foundational learning experiences. The focus is on fostering social, emotional, cognitive, and
                physical development through a mix of structured activities and play.
              </p>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 w-full">
              {/* Feature 1 */}
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 relative mb-2">
                  <img src={park} alt="Home Environment" width={64} height={64} className="w-full h-auto" />
                </div>
                <h3 className="text-[#07758D] font-bold text-lg">Fully Home Like <br/> Environment</h3>
              </div>
  
              {/* Feature 2 */}
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 relative mb-2">
                  <img src={pencil} alt="Safety and Security" width={64} height={64} className="w-full h-auto" />
                </div>
                <h3 className="text-[#07758D] font-bold text-lg ">100% Quality Safety <br/> and Security</h3>
              </div>
  
              {/* Button */}
              <div className="mt-2">
                <button className="bg-[#FA6616] hover:bg-[#e55a0e] text-white font-bold text-lg py-2 px-10 rounded-md transition-colors">
                  More about Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FACILITIES SECTION --- */}
      <section id="facilities" className="py-10 bg-[#FEF7E6] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          
        {/* Header with Image to the right */}
          <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
            <div className="text-left flex-1">
              <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-sm">
                Where Fun Meets Learning
              </span>
              <h2 className="text-4xl md:text-4xl font-black text-[#1E3A5F] mt-4">
                Kid-Friendly <span className="text-[#F07A4A]">Facilities</span>
              </h2>
              <p className="text-slate-500 mt-4 max-w-lg">
                We provide a nurturing environment where your children can grow, play, and learn safely.
              </p>
            </div>

            {/* The Image to the right of the heading */}
            <div className="flex-shrink-0">
              <motion.img 
                src={train} 
                className="min-w-72 h-52 md:h-64 object-contain" 
                variants={trainMovement}
                animate="animate"
              />
            </div>
          </div>

          {/* Facilities Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Rocket size={32} />, 
                title: "Play Zone", 
                desc: "Safe and colorful indoor play area with soft flooring and slides.",
                accent: "text-[#F07A4A]",
                bg: "bg-[#FCEAE2]" 
              },
              { 
                icon: <Bus size={32} />, 
                title: "Safe Transport", 
                desc: "Van facilities with female attendants and GPS for parents.",
                accent: "text-[#3AA4AC]",
                bg: "bg-[#E6F4F5]" 
              },
              { 
                icon: <Paintbrush size={32} />, 
                title: "Creative Arts", 
                desc: "Messy play, finger painting, and clay modeling for tiny hands.",
                accent: "text-[#F07A4A]",
                bg: "bg-[#FCEAE2]" 
              },
              { 
                icon: <Heart size={32} />, 
                title: "Personal Care", 
                desc: "Trained nannies and clean, hygienic nap rooms for toddlers.",
                accent: "text-[#3AA4AC]",
                bg: "bg-[#E6F4F5]" 
              },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }} 
                className="p-10 bg-white border border-slate-100 rounded-[32px] shadow-xl shadow-slate-200/40 transition-all duration-500 group"
              >
                {/* Circular Icon Container matching Image 2 style */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-8 ${item.bg} ${item.accent} transition-all duration-500`}>
                  {item.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-[#1E3A5F] mb-4 tracking-tight group-hover:text-[#F07A4A] transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROGRAMS SECTION --- */}
      <section id="programs" className="relative w-full py-16 px-4 md:px-8 lg:px-12 xl:px-20 overflow-hidden">
        <div className="absolute left-0 top-1 w-24 md:w-32 lg:w-60 h-auto z-0">
          <img src={tree} width={160} height={200} className="w-full h-auto"/>
        </div>
  
        {/* Decorative Bee */}
        <motion.div 
          className="absolute right-24 top-20 w-16 md:w-20 lg:w-32 h-auto z-0"
          variants={beeAnimation}
          animate="animate"
        >
          <img src={bee} width={110} height={110} className="w-full h-auto" />
        </motion.div>
  
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h6 className="text-[#FA6616] text-lg md:text-xl font-bold mb-2">
              Learning is an Adventure!
            </h6>
            <h2 className="text-[#07758D] text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              Enrol Your Child In
              <br className="hidden sm:block" /> A Session Now!
            </h2>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {programData.map((program, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow flex flex-col">
                <div className="aspect-square relative mb-[-24px]">
                  <img
                    src={program.image}
                    className="w-full object-cover"
                  />
                </div>
                <div className="px-2 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                    {program.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4 flex-grow text-center">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>       
        </div>
      </section>

      {/* --- FACULTY SECTION --- */}
       <section id="faculties" className="relative w-full py-16 px-4 md:px-8 lg:px-12 xl:px-20 overflow-hidden">
        <div className="absolute left-[-14px] top-0 w-24 md:w-24 lg:w-52 h-auto z-0">
          <img src={sun} width={1000} height={1000} className="w-full h-auto"/>
        </div>
        <h1 className="text-4xl font-bold text-[#07758D] text-center">Our Faculty</h1>
        <p className="text-orange-500 mt-4 text-lg font-semibold text-center">
          Dedicated Mentors for Early Excellence
        </p>
        {/* Decorative */}
        <div className="absolute right-0 top-0 w-24 md:w-24 lg:w-52 h-auto z-0">
          <img src={rainbow} width={1000} height={1000} className="w-full h-auto"/>
        </div>
        <div className="flex justify-evenly items-center  my-20 ">
          {techImage.map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center">
            <div  className="w-full md:w-64 relative">
              <img
                src={item.image}
                width={110}
                height={110}
                className="w-full h-auto"
              />
            </div>
            <h6 className="font-semibold text-xl text-[#04162F] mt-4">{item.name}</h6>
            <p className="text-[#868686] font-normal text-xl">{item.position}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-3xl font-black text-[#1E3A5F]">What Our<span className="text-orange-600"> Parents</span> Say</h2>
          </div>
          {/* Testimonial Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul Verma", role: "Parent", quote: "Seeing my son run into school with a smile every day is the best feeling. The teachers truly care!" },
              { name: "Aarav Patel", role: "Parent", quote: "The play-based learning here is incredible. My daughter has become so much more confident and social." },
               { name: "Shivani Sharma", role: "Parent", quote: "The safest environment I could find. It feels like a second home where every child is treated with love." }
            ].map((test, i) => (
              <motion.div key={i} className="p-8 rounded-3xl border border-pink-400 border-2 border-dashed shadow-xl space-y-6">
                <Quote className="text-orange-500 rotate-180" size={28} />
                <p className="text-lg font-medium text-slate-500 leading-relaxed">"{test.quote}"</p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center font-black text-white text-xl">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-lg">{test.name}</p>
                    <p className="text-slate-600 text-sm">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Side: Contact Information Module */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#07758D]-900/30 text-[#07758D] rounded-lg text-xs font-bold uppercase tracking-widest mb-6 border border-blue-800">
                <Sparkles size={14} /> Contact Us
              </div>
              <h2 className="text-4xl md:text-4xl font-black text-white leading-tight">
                Let’s Start <br /> <span className="text-[#07758D]">A Conversation.</span>
              </h2>
            </div>
            <div className="space-y-6">
              {[
                { icon: <Phone />, title: "Call Us", detail: "+91 98765 43210", iconColor: "text-[#F07A4A]", bgColor: "bg-[#FCEAE2]" },
                { icon: <Mail />, title: "Email", detail: "contact@sps.edu", iconColor: "text-[#3AA4AC]", bgColor: "bg-[#E6F4F5]" },
                { icon: <MapPin />, title: "Visit Campus", detail: "Knowledge Park, MP, India", iconColor: "text-[#F59E0B]", bgColor: "bg-[#FEF3C7]"}
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className={`w-14 h-14 ${item.bgColor} ${item.iconColor} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>{item.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">{item.title}</p>
                    <p className="text-lg font-bold text-[#1E3A5F]">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: modern contact form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-slate-100 p-8 md:p-12 rounded-[40px] shadow-xl shadow-slate-200/60 border border-slate-100">
            <h3 className="text-2xl font-black text-[#1E3A5F] mb-8 italic">Send a Message</h3>
            <form ref={form} action="https://formspree.io/f/xgonbben" method="POST" className="space-y-6">
              <input type="text" name="full_name" placeholder="Full Name" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-[#3AA4AC] font-medium text-[#1E3A5F] placeholder:text-slate-400" required/>
              <input type="email" name="email" placeholder="Email Address" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-[#3AA4AC] font-medium text-[#1E3A5F] placeholder:text-slate-400" required/>
              <textarea name="message" placeholder="Your Message" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-[#3AA4AC] font-medium h-32 resize-none text-[#1E3A5F] placeholder:text-slate-400" required></textarea>
              <button type="submit" disabled={loading} className="w-full bg-[#F07A4A] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-orange-200 hover:bg-[#d9693d] hover:shadow-orange-300 transition-all">
               {loading ? "Sending..." : "Submit Inquiry"} <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer/>
    </div>
  );
};

export default LandingPage;