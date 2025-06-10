import Footer from "./Footer";
import { Link } from "react-router-dom";
import { Phone, Clock, MapPin, Star } from "lucide-react";
import logo from "../assets/Images/logo.png";
import xray from "../assets/Images/xray.png";
import ultra from "../assets/Images/ultra.jpg";
import Ster from "../assets/Images/Ster.png";
import intra from "../assets/Images/intra.png";
import led from "../assets/Images/led.jpg";
import braces from "../assets/Images/braces.png";

// Reusable Button Component
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center font-medium rounded-lg transition duration-200 ${className}`}
  >
    {children}
  </button>
);

const testimonials = [
  {
    name: "Emily R.",
    quote:
      "From the moment I walked in, I felt welcomed. The staff is incredibly kind, and Dr. Patel explained everything with such clarity.",
    rating: 5,
  },
  {
    name: "Michael T.",
    quote:
      "Had a dental emergency and they accommodated me within an hour. Professional, fast, and truly caring!",
    rating: 5,
  },
  {
    name: "Sophia L.",
    quote:
      "My kids actually enjoy going to the dentist now. The team is wonderful with children!",
    rating: 4,
  },
];

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-teal-700 text-white py-24 px-6 overflow-hidden">
        {/* Logo Watermark */}
        <img
          src={logo}
          alt="Smile Dental Care Logo"
          className="absolute opacity-10 brightness-125 w-64 sm:w-80 lg:w-[480px] pointer-events-none select-none
            left-1/2 -translate-x-1/2 sm:left-auto sm:right-10 sm:translate-x-0 bottom-0"
          style={{ zIndex: 0 }}
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Brighten Your Smile <br /> with Smile Dental Care
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Trusted by families for preventive, cosmetic, and emergency
            dentistry. Let us help you achieve a healthy, confident smile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-white text-teal-700 px-6 py-3 text-md hover:bg-teal-100">
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-white text-center">
        <h3 className="text-3xl font-bold text-teal-700 mb-10">
          Our Dental Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            "Preventive Care",
            "Cosmetic Dentistry",
            "Emergency Services",
            "Dental Implants",
            "Orthodontics",
            "Teeth Whitening",
          ].map((service) => (
            <div
              key={service}
              className="p-6 border rounded-2xl shadow hover:shadow-lg transition hover:scale-105 bg-teal-50"
            >
              <h4 className="text-xl font-semibold text-teal-800 mb-2">
                {service}
              </h4>
              <p className="text-gray-600 text-sm">
                Learn more about our expert approach to {service.toLowerCase()}{" "}
                that ensures optimal results and patient comfort.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Instruments Section */}
      <section className="bg-gradient-to-r from-white to-teal-50 py-16 px-4 text-center">
        <h3 className="text-3xl font-bold text-teal-700 mb-6">
          Equipped with Modern Dental Instruments
        </h3>
        <p className="text-gray-700 max-w-2xl mx-auto mb-10">
          We use state-of-the-art dental equipment to ensure precision, comfort,
          and faster recovery times for our patients.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { src: xray, title: "Digital X-Ray Machine" },
            { src: Ster, title: "Sterilization Unit" },
            { src: led, title: "LED Dental Chair" },
            { src: ultra, title: "Ultrasonic Scaler" },
            { src: intra, title: "Intraoral Camera" },
            { src: braces, title: "Braces" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden shadow hover:shadow-xl transition bg-white border"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h4 className="text-teal-800 font-semibold text-lg">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 px-4 text-center">
        <h3 className="text-3xl font-bold text-teal-700 mb-6">Meet Our Team</h3>
        <p className="text-gray-700 max-w-3xl mx-auto mb-12">
          Our experienced team of dentists, hygienists, and staff are dedicated
          to providing compassionate, personalized dental care. We combine
          clinical excellence with genuine care.
        </p>

        {/* Team Members */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto mb-12">
          {[
            {
              name: "Dr. Sarah Thompson",
              role: "Lead Dentist",
              img: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
              name: "Dr. James Patel",
              role: "Orthodontist",
              img: "https://randomuser.me/api/portraits/men/46.jpg",
            },
            {
              name: "Dr. Emily Nguyen",
              role: "Pediatric Dentist",
              img: "https://randomuser.me/api/portraits/women/47.jpg",
            },
            {
              name: "Dr. Michael Lee",
              role: "Oral Surgeon",
              img: "https://randomuser.me/api/portraits/men/45.jpg",
            },
            {
              name: "Dr. Aisha Rahman",
              role: "Periodontist",
              img: "https://randomuser.me/api/portraits/women/49.jpg",
            },
            {
              name: "Dr. Daniel Kim",
              role: "Cosmetic Dentist",
              img: "https://randomuser.me/api/portraits/men/47.jpg",
            },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.img}
                alt={`Photo of ${member.name}`}
                className="mx-auto rounded-full w-32 h-32 object-cover mb-4 shadow-lg transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <h4 className="text-lg font-semibold text-teal-800">
                {member.name}
              </h4>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>

        <Link to="/">
          <Button className="text-teal-700 hover:underline bg-transparent">
            Read More About Us
          </Button>
        </Link>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 text-center bg-teal-50">
        <h3 className="text-3xl font-bold text-teal-700 mb-6">
          What Our Patients Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow border hover:shadow-md transition"
            >
              <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
              <div className="flex items-center justify-center text-yellow-500 mb-2">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-teal-900 font-semibold">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Appointment */}
      <section className="bg-teal-700 text-white py-16 px-4 text-center">
        <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
        <p className="mb-6">
          We're here to help you schedule your visit or answer your questions.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-sm">
          <a
            href="tel:+1000000000"
            className="flex items-center gap-2 hover:underline"
          >
            <Phone size={16} /> +91 111 0000 111
          </a>
          <span className="flex items-center gap-2">
            <MapPin size={16} /> 123 Dental St, City
          </span>
          <a
            href="mailto:smiledental@gmail.com"
            className="flex items-center gap-2 hover:underline"
          >
            <Clock size={16} /> Mon–Sat: 9am – 6pm
          </a>
        </div>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <a href="mailto:smiledental@gmail.com">
            <Button className="bg-white text-teal-700 hover:bg-teal-100 px-6 py-3">
              Contact Us
            </Button>
          </a>
          <Link to="/login">
            <Button className="border border-white text-white hover:bg-white hover:text-teal-700 px-6 py-3">
              Login
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
