import elephant from "../images/ele.png";
import fawn from "../images/gi.png";
import grass from "../images/grass.png";
import { ArrowRight, ArrowUp, MapPin, Mail, Facebook, Linkedin, Instagram, X } from "lucide-react"

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="relative bg-white pb-0 pt-12 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Logo and Mission Column */}
          <div className="lg:col-span-1">
            <h2 className="mb-6 text-3xl font-black text-[#1E3A5F]">LOGO</h2>
            <p className="mb-6 text-sm text-[#07758D] text-justify">
              Our most important goal is to provide your child with an environment that encourages children to grow
              intellectually, emotionally, socially, and physically.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-3">
             {[
                { id: 'facebook', Icon: Facebook },
                { id: 'twitter', Icon: X }, 
                { id: 'instagram', Icon: Instagram },
                { id: 'linkedin', Icon: Linkedin },
              ].map((social) => (       
                <a key={social} href="#" aria-label={social.id} className="group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCEAE2] text-[#F07A4A] hover:bg-[#F07A4A] hover:text-white transition-all">
                    <social.Icon size={16} strokeWidth={2.5} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-[#F07A4A]">EDUCATION</h3>
            <ul className="space-y-3">
              {["Our Curriculum", "Our Educators", "School Readiness", "Story Time"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#07758D] hover:text-[#3AA4AC] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Column */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-[#F07A4A]">OUR PROGRAMS</h3>
            <ul className="space-y-3">
              {["Infants", "Toddlers", "Twos", "Early Preschool" , "Preschool", "Pre-k", "Junior Kindergarten", "Summer Camp"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#07758D] hover:text-[#3AA4AC] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms Column */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-[#F07A4A]">TERMS</h3>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service","Copyright Policy" , "FAQs"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#07758D] hover:text-[#3AA4AC] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-[#3AA4AC]">Stay Updated!</h3>
            <p className="mb-4 text-sm text-[#3AA4AC]">Subscribe to our newsletter to receive the latest updates and informations</p>
            <div className="flex mb-8">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-l-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AA4AC]"
              />
              <button className="rounded-r-2xl bg-[#F07A4A] px-4 text-white hover:bg-[#d9693d] transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F07A4A] shrink-0" />
                <p className="text-xs text-[#07758D]">Knowledge Park, Indore, MP</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#F07A4A] shrink-0" />
                <a href="mailto:info@preschool.com" className="text-xs text-[#07758D] hover:text-[#3AA4AC]">
                  info@preschool.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <div className="absolute right-10 bottom-40 z-50 flex flex-col items-center">
        <button
          onClick={scrollToTop}
          className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#3AA4AC] text-white shadow-lg hover:scale-110 transition-transform"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
        <p className="mt-2 text-[10px] font-bold text-[#3AA4AC] uppercase tracking-tighter">Top</p>
      </div>

      {/* Animals and Grass Illustration */}
      <div className="relative h-64 w-full mt-12">
        {/* Fawn */}
        <div className="absolute bottom-10 left-32 z-20 md:w-80 lg:w-80 h-80">
          <img src={fawn} alt="fawn" className="w-full h-full object-cover" />
        </div>

        {/* Elephant */}
        <div className="absolute bottom-10 right-44 z-20 w-40 md:w-56 lg:w-80">
          <img src={elephant} alt="elephant" className="w-full h-auto object-contain" />
        </div>

        {/* Grass */}
        <div className="absolute bottom-32 left-0 w-full h-32 z-10">
          <img src={grass} alt="grass" fill className="object-cover object-top" />
        </div>

        {/* Copyright text inside grass area */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full text-center px-4">
          <p className="text-[10px] md:text-xs text-[#1E3A5F] font-medium bg-white/40 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
            © 2026 Designed by <span className="font-bold">Beangate IT Solutions</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer