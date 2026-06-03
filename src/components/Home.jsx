import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStethoscope, FaAmbulance, FaMicroscope, FaHeartbeat, FaPills, FaBrain,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaCalendarCheck, FaUserMd, FaUsers, FaAward, FaClock, FaStar,
  FaTrophy, FaHandHoldingHeart, FaQuoteLeft, FaArrowRight, FaCheckCircle,
  FaFire, FaRocket, FaGem, FaCrown, FaProcedures, FaCoffee, FaEye,
  FaTimes, FaInfoCircle, FaChartLine, FaUserPlus, FaRegHospital
} from 'react-icons/fa';
import { doctorAPI } from '../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Custom scroll observer
const useScrollObserver = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
};

const AnimatedSection = ({ children, delay = 0 }) => {
  const { ref, isVisible } = useScrollObserver();
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({ patients: 0, doctors: 0, years: 0, awards: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState('service');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  // Fetch doctors from backend
  const loadDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      const allDoctors = response.data?.data || response.data || [];
      if (allDoctors.length > 0) {
        const doctorsWithImages = allDoctors.slice(0, 8).map(doc => ({
          ...doc,
          image: doc.image || `https://randomuser.me/api/portraits/${doc.id % 2 === 0 ? 'women' : 'men'}/${doc.id}.jpg`
        }));
        setDoctors(doctorsWithImages);
      } else {
        // Sample fallback
        const sampleDoctors = [
          { id: 1, firstName: 'Sarah', lastName: 'Johnson', specialization: 'Cardiologist', experience: 15, consultationFee: 500, image: 'https://randomuser.me/api/portraits/women/68.jpg' },
          { id: 2, firstName: 'Michael', lastName: 'Chen', specialization: 'Neurologist', experience: 12, consultationFee: 600, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
          { id: 3, firstName: 'Emily', lastName: 'Davis', specialization: 'Pediatrician', experience: 10, consultationFee: 400, image: 'https://randomuser.me/api/portraits/women/23.jpg' },
          { id: 4, firstName: 'Robert', lastName: 'Wilson', specialization: 'Orthopedic', experience: 8, consultationFee: 450, image: 'https://randomuser.me/api/portraits/men/45.jpg' }
        ];
        setDoctors(sampleDoctors);
      }
    } catch (err) {
      console.error('Failed to load doctors from API', err);
      toast.error('Could not load doctors. Using sample data.');
      const sampleDoctors = [
        { id: 1, firstName: 'Sarah', lastName: 'Johnson', specialization: 'Cardiologist', experience: 15, consultationFee: 500, image: 'https://randomuser.me/api/portraits/women/68.jpg' },
        { id: 2, firstName: 'Michael', lastName: 'Chen', specialization: 'Neurologist', experience: 12, consultationFee: 600, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 3, firstName: 'Emily', lastName: 'Davis', specialization: 'Pediatrician', experience: 10, consultationFee: 400, image: 'https://randomuser.me/api/portraits/women/23.jpg' },
        { id: 4, firstName: 'Robert', lastName: 'Wilson', specialization: 'Orthopedic', experience: 8, consultationFee: 450, image: 'https://randomuser.me/api/portraits/men/45.jpg' }
      ];
      setDoctors(sampleDoctors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Counter animation
  useEffect(() => {
    const targets = { patients: 5000, doctors: 50, years: 15, awards: 25 };
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setCounters({
        patients: Math.min(targets.patients, Math.floor((currentStep / steps) * targets.patients)),
        doctors: Math.min(targets.doctors, Math.floor((currentStep / steps) * targets.doctors)),
        years: Math.min(targets.years, Math.floor((currentStep / steps) * targets.years)),
        awards: Math.min(targets.awards, Math.floor((currentStep / steps) * targets.awards))
      });
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSending(true);
    try {
      const response = await axios.post('http://localhost:8080/api/contact/submit', contactForm);
      if (response.data.success) {
        toast.success('Thank you! We will get back to you soon.');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  // Detailed descriptions for services
  const serviceDetails = {
    Cardiology: {
      fullDescription: "Our Cardiology department provides comprehensive heart care including diagnostic tests, interventional procedures, cardiac rehabilitation, and preventive cardiology. We use state-of-the-art equipment like 3D echocardiography, CT coronary angiography, and cardiac MRI.",
      technologies: "3D Echo, CT Angiography, Cardiac MRI, Holter Monitoring, Stress Tests",
      doctorsCount: 12,
      successRate: "98%",
      icon: <FaHeartbeat />
    },
    Neurology: {
      fullDescription: "The Neurology department specializes in diagnosing and treating disorders of the nervous system, including stroke, epilepsy, Parkinson's disease, multiple sclerosis, and migraines.",
      technologies: "MRI, CT Scan, EEG, EMG, Neuro-navigation",
      doctorsCount: 8,
      successRate: "96%",
      icon: <FaBrain />
    },
    Orthopedics: {
      fullDescription: "Our Orthopedics team provides comprehensive care for bones, joints, ligaments, tendons, and muscles. We perform joint replacements, arthroscopic surgeries, sports medicine, and fracture management.",
      technologies: "Arthroscopy, Joint Replacement, Bone Densitometry, Physiotherapy",
      doctorsCount: 10,
      successRate: "97%",
      icon: <FaStethoscope />
    },
    Pediatrics: {
      fullDescription: "Pediatrics offers complete healthcare for children from birth to adolescence. We provide vaccinations, growth monitoring, treatment of common childhood illnesses, and specialized care for pediatric emergencies.",
      technologies: "Neonatal ICU, Pediatric Vaccination, Developmental Screening",
      doctorsCount: 6,
      successRate: "99%",
      icon: <FaHandHoldingHeart />
    },
    Gynecology: {
      fullDescription: "Our Gynecology department offers comprehensive women's health services including routine checkups, prenatal care, fertility treatments, and minimally invasive surgeries.",
      technologies: "Laparoscopy, Hysteroscopy, Ultrasound, Fertility Lab",
      doctorsCount: 7,
      successRate: "95%",
      icon: <FaUserMd />
    },
    Dermatology: {
      fullDescription: "Dermatology provides diagnosis and treatment for skin, hair, and nail conditions. We offer cosmetic dermatology, laser treatments, acne management, and skin cancer screening.",
      technologies: "Laser Therapy, Cryotherapy, Dermoscopy, Chemical Peels",
      doctorsCount: 5,
      successRate: "94%",
      icon: <FaStethoscope />
    },
    Ophthalmology: {
      fullDescription: "Our Ophthalmology department offers complete eye care including cataract surgery, LASIK, glaucoma management, and retinal treatments.",
      technologies: "LASIK, Phacoemulsification, OCT, Slit Lamp, Retinal Laser",
      doctorsCount: 4,
      successRate: "98%",
      icon: <FaEye />
    },
    Psychiatry: {
      fullDescription: "Psychiatry provides compassionate care for mental health conditions including depression, anxiety, bipolar disorder, and addiction.",
      technologies: "Telepsychiatry, Cognitive Behavioral Therapy, Group Therapy",
      doctorsCount: 6,
      successRate: "92%",
      icon: <FaBrain />
    }
  };

  // Services (first 6)
  const services = [
    { name: 'Cardiology', icon: <FaHeartbeat />, doctors: 12, color: '#FF6B6B', image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=250&fit=crop' },
    { name: 'Neurology', icon: <FaBrain />, doctors: 8, color: '#4ECDC4', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop' },
    { name: 'Orthopedics', icon: <FaStethoscope />, doctors: 10, color: '#45B7D1', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=250&fit=crop' },
    { name: 'Pediatrics', icon: <FaHandHoldingHeart />, doctors: 6, color: '#F7B731', image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400&h=250&fit=crop' },
    { name: 'Gynecology', icon: <FaUserMd />, doctors: 7, color: '#E74C3C', image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=250&fit=crop' },
    { name: 'Dermatology', icon: <FaStethoscope />, doctors: 5, color: '#9B59B6', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop' }
  ];

  // Departments (all 8)
  const departments = [
    { name: 'Cardiology', icon: <FaHeartbeat />, doctors: 12, color: '#FF6B6B', image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=250&fit=crop' },
    { name: 'Neurology', icon: <FaBrain />, doctors: 8, color: '#4ECDC4', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop' },
    { name: 'Orthopedics', icon: <FaStethoscope />, doctors: 10, color: '#45B7D1', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=250&fit=crop' },
    { name: 'Pediatrics', icon: <FaHandHoldingHeart />, doctors: 6, color: '#F7B731', image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400&h=250&fit=crop' },
    { name: 'Gynecology', icon: <FaUserMd />, doctors: 7, color: '#E74C3C', image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=250&fit=crop' },
    { name: 'Dermatology', icon: <FaStethoscope />, doctors: 5, color: '#9B59B6', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop' },
    { name: 'Ophthalmology', icon: <FaEye />, doctors: 4, color: '#3498DB', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop' },
    { name: 'Psychiatry', icon: <FaBrain />, doctors: 6, color: '#E67E22', image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop' }
  ];

  // Facilities
  const facilities = [
    { name: '24/7 Emergency', icon: <FaAmbulance />, desc: 'Round-the-clock emergency care' },
    { name: 'Modern Labs', icon: <FaMicroscope />, desc: 'Advanced diagnostic equipment' },
    { name: 'ICU Facility', icon: <FaProcedures />, desc: 'Intensive care units' },
    { name: '24/7 Pharmacy', icon: <FaPills />, desc: 'Medicine availability' },
    { name: 'Free Ambulance', icon: <FaAmbulance />, desc: 'Free ambulance service' },
    { name: 'Cafeteria', icon: <FaCoffee />, desc: 'Healthy food options' }
  ];

  // Achievements
  const achievements = [
    { icon: <FaTrophy />, title: 'Best Hospital Award', year: '2023', desc: 'Recognized for excellence in patient care' },
    { icon: <FaGem />, title: 'NABH Accredited', year: '2022', desc: 'National accreditation board for hospitals' },
    { icon: <FaRocket />, title: 'Innovation Award', year: '2023', desc: 'For telemedicine initiatives' },
    { icon: <FaCrown />, title: 'Patient Choice', year: '2024', desc: 'Voted by patients' }
  ];

  const testimonials = [
    { name: 'Rajesh Sharma', text: 'Excellent service! The doctors are very caring and professional. Highly recommended!', rating: 5, location: 'Mumbai', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Priya Patel', text: 'Best hospital in the city. Quick appointment booking and great facilities.', rating: 5, location: 'Delhi', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Amit Kumar', text: 'Very satisfied with the treatment. The staff is very cooperative and helpful.', rating: 5, location: 'Bangalore', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Sneha Reddy', text: 'Wonderful experience! The doctors explained everything clearly.', rating: 5, location: 'Hyderabad', image: 'https://randomuser.me/api/portraits/women/23.jpg' },
    { name: 'Vikram Singh', text: 'State-of-the-art facilities and excellent care. Thank you!', rating: 5, location: 'Pune', image: 'https://randomuser.me/api/portraits/men/77.jpg' }
  ];

  const insurancePartners = [
    'Star Health', 'ICICI Lombard', 'HDFC Ergo', 'Bajaj Allianz', 'New India', 'Oriental'
  ];

  const openModal = (item, type) => {
    setModalType(type);
    setModalData(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const gradientLight = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
  const gradientDark = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
  const primaryColor = '#11998e';
  const heroBgImage = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop';

  const styles = {
    container: { fontFamily: "'Inter', 'Poppins', sans-serif", overflowX: 'hidden' },
    navbar: { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 30px rgba(0,0,0,0.05)', padding: '15px 40px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
    logo: { fontSize: '28px', fontWeight: '800', background: gradientLight, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    navLinks: { display: 'flex', gap: '30px', alignItems: 'center' },
    navLink: { textDecoration: 'none', color: '#333', fontWeight: '500', transition: 'color 0.3s' },
    hero: { 
      position: 'relative',
      backgroundImage: `url(${heroBgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '100px 40px',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
        zIndex: 1
      }
    },
    heroContent: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 2 },
    heroTitle: { fontSize: '52px', fontWeight: '800', marginBottom: '20px', color: 'white', lineHeight: '1.2' },
    heroHighlight: { color: '#FFD700', textDecoration: 'underline' },
    heroSubtitle: { fontSize: '18px', marginBottom: '30px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' },
    statsContainer: { display: 'flex', gap: '40px', marginTop: '40px', flexWrap: 'wrap' },
    statCard: { textAlign: 'center', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px 30px', borderRadius: '20px', minWidth: '120px' },
    statValue: { fontSize: '36px', fontWeight: '800', color: '#FFD700' },
    statLabel: { fontSize: '14px', color: 'white', marginTop: '5px' },
    section: { padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' },
    sectionAlt: { background: '#f0f9f5', padding: '80px 40px' },
    sectionTitle: { fontSize: '36px', textAlign: 'center', marginBottom: '15px', fontWeight: '700', color: '#1e3c72' },
    sectionSubtitle: { textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '18px' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', marginTop: '20px' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' },
    card: { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' },
    cardImage: { width: '100%', height: '200px', objectFit: 'cover' },
    cardContent: { padding: '20px' },
    doctorImage: { width: '100%', height: '250px', objectFit: 'cover' },
    testimonialSection: { background: gradientDark, padding: '80px 40px', borderRadius: '40px', margin: '40px', position: 'relative' },
    testimonialCard: { textAlign: 'center', maxWidth: '800px', margin: '0 auto', color: 'white' },
    testimonialText: { fontSize: '24px', fontStyle: 'italic', lineHeight: '1.5', marginBottom: '30px' },
    ctaSection: { background: gradientLight, padding: '80px 40px', borderRadius: '40px', textAlign: 'center', margin: '40px' },
    ctaTitle: { fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '20px' },
    ctaButton: { padding: '15px 40px', background: '#FFD700', color: '#333', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.3s' },
    footer: { background: '#1a1a2e', color: 'white', padding: '60px 40px 30px', marginTop: '60px' },
    footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' },
    footerLink: { color: '#ccc', textDecoration: 'none', display: 'block', marginBottom: '10px', transition: 'color 0.3s' },
    floatingBtn: { position: 'fixed', bottom: '30px', right: '30px', background: primaryColor, width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 999, animation: 'pulse 2s infinite' },
    whatsappBtn: { position: 'fixed', bottom: '30px', left: '30px', background: '#25D366', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 999, animation: 'bounce 2s infinite' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    modalContent: { background: 'white', borderRadius: '24px', maxWidth: '600px', width: '90%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    modalHeader: { padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: '22px', fontWeight: '700', color: '#1e3c72', margin: 0 },
    modalBody: { padding: '24px' },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', transition: 'color 0.2s' },
    detailRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
        100% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animated-card:hover {
        transform: translateY(-10px) !important;
        box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>CarePlus Hospital</div>
        <div style={styles.navLinks}>
          {['Home', 'Services', 'Doctors', 'Departments', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={styles.navLink}>{item}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/login" style={{ padding: '8px 24px', border: `2px solid ${primaryColor}`, borderRadius: '25px', textDecoration: 'none', color: primaryColor, fontWeight: '500' }}>Login</Link>
          <Link to="/register" style={{ padding: '8px 24px', background: gradientLight, borderRadius: '25px', textDecoration: 'none', color: 'white', fontWeight: '500' }}>Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroContent}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 style={styles.heroTitle}>
              Your Health, <span style={styles.heroHighlight}>Our Priority</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Experience world-class healthcare with advanced technology, expert doctors, 
              and compassionate care. Book appointments online and get treated at home.
            </p>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
              <Link to="/register" style={{ padding: '14px 35px', background: '#FFD700', color: '#333', borderRadius: '50px', textDecoration: 'none', fontWeight: '600' }}>Book Appointment →</Link>
              <a href="#doctors" style={{ padding: '14px 35px', border: '2px solid white', color: 'white', borderRadius: '50px', textDecoration: 'none', fontWeight: '600' }}>Find Doctor</a>
            </div>
            <div style={styles.statsContainer}>
              {[
                { label: 'Happy Patients', value: counters.patients },
                { label: 'Expert Doctors', value: counters.doctors },
                { label: 'Years of Trust', value: counters.years },
                { label: 'Awards Won', value: counters.awards }
              ].map((stat, idx) => (
                <motion.div key={idx} style={styles.statCard} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.1 }}>
                  <div style={styles.statValue}>{stat.value}+</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div></div>
        </div>
      </section>

      {/* Services Section */}
      <AnimatedSection>
        <section id="services" style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Medical Services</h2>
          <p style={styles.sectionSubtitle}>Comprehensive healthcare solutions for every need</p>
          <div style={styles.grid3}>
            {services.map((dept, idx) => (
              <motion.div key={idx} style={styles.card} className="animated-card" whileHover={{ y: -10 }}>
                <img src={dept.image} alt={dept.name} style={styles.cardImage} />
                <div style={styles.cardContent}>
                  <div style={{ fontSize: '32px', color: dept.color, marginBottom: '10px' }}>{dept.icon}</div>
                  <h3>{dept.name}</h3>
                  <p style={{ color: '#666' }}>{dept.doctors}+ specialists</p>
                  <button onClick={() => openModal(dept, 'service')} style={{ color: primaryColor, textDecoration: 'none', marginTop: '15px', display: 'inline-block', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Learn More →</button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Departments Section */}
      <AnimatedSection>
        <section id="departments" style={styles.sectionAlt}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={styles.sectionTitle}>Our Departments</h2>
            <p style={styles.sectionSubtitle}>Specialized care across multiple disciplines</p>
            <div style={styles.grid4}>
              {departments.map((dept, idx) => (
                <motion.div key={idx} style={styles.card} className="animated-card" whileHover={{ y: -5 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <img src={dept.image} alt={dept.name} style={styles.cardImage} />
                  <div style={styles.cardContent}>
                    <div style={{ fontSize: '32px', color: dept.color, marginBottom: '10px' }}>{dept.icon}</div>
                    <h3>{dept.name}</h3>
                    <p style={{ color: '#666', margin: '10px 0' }}>{dept.doctors} Expert Doctors</p>
                    <button onClick={() => openModal(dept, 'department')} style={{ color: dept.color, fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>View Details →</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Doctors Section */}
      <AnimatedSection>
        <section id="doctors" style={styles.section}>
          <h2 style={styles.sectionTitle}>Meet Our Expert Doctors</h2>
          <p style={styles.sectionSubtitle}>Our team of highly qualified medical professionals</p>
          <div style={styles.grid3}>
            {doctors.map((doctor, idx) => (
              <motion.div key={doctor.id} style={styles.card} className="animated-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -5 }}>
                <img src={doctor.image} alt={doctor.firstName} style={styles.doctorImage} />
                <div style={styles.cardContent}>
                  <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                  <p style={{ color: primaryColor, fontWeight: '500', margin: '10px 0' }}>{doctor.specialization}</p>
                  <p style={{ color: '#666' }}>{doctor.experience || 0}+ years experience</p>
                  <p style={{ color: '#28C76F', fontWeight: 'bold', margin: '10px 0' }}>₹{doctor.consultationFee}</p>
                  <Link to="/register" style={{ display: 'inline-block', padding: '10px 25px', background: primaryColor, color: 'white', borderRadius: '25px', textDecoration: 'none', marginTop: '10px' }}>Book Now</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Facilities Section */}
      <AnimatedSection>
        <section style={styles.sectionAlt}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={styles.sectionTitle}>World-Class Facilities</h2>
            <p style={styles.sectionSubtitle}>State-of-the-art infrastructure for better care</p>
            <div style={styles.grid3}>
              {facilities.map((facility, idx) => (
                <motion.div key={idx} style={styles.card} className="animated-card" whileHover={{ y: -5 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <div style={styles.cardContent}>
                    <div style={{ fontSize: '32px', color: primaryColor, marginBottom: '10px' }}>{facility.icon}</div>
                    <h3>{facility.name}</h3>
                    <p style={{ color: '#666' }}>{facility.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Achievements Section */}
      <AnimatedSection>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Achievements</h2>
          <p style={styles.sectionSubtitle}>Recognized for excellence in healthcare</p>
          <div style={styles.grid4}>
            {achievements.map((achievement, idx) => (
              <motion.div key={idx} style={styles.card} className="animated-card" whileHover={{ y: -5 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <div style={styles.cardContent}>
                  <div style={{ fontSize: '32px', color: '#FFD700', marginBottom: '10px' }}>{achievement.icon}</div>
                  <h3>{achievement.title}</h3>
                  <p style={{ color: primaryColor, fontWeight: 'bold' }}>{achievement.year}</p>
                  <p style={{ color: '#666', marginTop: '10px' }}>{achievement.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Insurance Partners */}
      <AnimatedSection>
        <section style={styles.sectionAlt}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={styles.sectionTitle}>Insurance Partners</h2>
            <p style={styles.sectionSubtitle}>Cashless treatment available</p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
              {insurancePartners.map((partner, idx) => (
                <motion.div key={idx} style={{ background: 'white', padding: '12px 24px', borderRadius: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', fontWeight: '500' }} whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}>
                  {partner}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials Section */}
      <motion.div style={styles.testimonialSection} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div style={styles.testimonialCard}>
          <FaQuoteLeft style={{ fontSize: '40px', opacity: 0.5, marginBottom: '20px' }} />
          <p style={styles.testimonialText}>"{testimonials[currentTestimonial]?.text}"</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <img src={testimonials[currentTestimonial]?.image} alt="patient" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <h4 style={{ marginBottom: '5px' }}>{testimonials[currentTestimonial]?.name}</h4>
              <p style={{ opacity: 0.8 }}>{testimonials[currentTestimonial]?.location}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
          {testimonials.map((_, idx) => (
            <div key={idx} onClick={() => setCurrentTestimonial(idx)} style={{ width: '10px', height: '10px', borderRadius: '50%', background: currentTestimonial === idx ? '#FFD700' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} />
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div style={styles.ctaSection} initial={{ scale: 0.95 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 style={styles.ctaTitle}>Need Emergency Help?</h2>
        <p style={{ color: 'white', fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>We're available 24/7. Call us anytime.</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={styles.ctaButton} onClick={() => window.location.href = 'tel:+919325732084'}>📞 Call Emergency: +91 93257 32084</button>
          <Link to="/register" style={{ ...styles.ctaButton, background: 'white', color: primaryColor, textDecoration: 'none' }}>Book Appointment →</Link>
        </div>
      </motion.div>

      {/* Contact Section with Database Saving */}
      <AnimatedSection>
        <section id="contact" style={styles.section}>
          <h2 style={styles.sectionTitle}>Get in Touch</h2>
          <p style={styles.sectionSubtitle}>We're here to help and answer any questions</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <FaMapMarkerAlt style={{ fontSize: '24px', color: primaryColor }} />
                <div><strong>Address</strong><br />123 Healthcare Street, Mumbai - 400001</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <FaPhone style={{ fontSize: '24px', color: primaryColor }} />
                <div><strong>Phone</strong><br />+91 93257 32084 | Emergency: +91 93257 32084</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <FaEnvelope style={{ fontSize: '24px', color: primaryColor }} />
                <div><strong>Email</strong><br />info@careplus.com</div>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '10px' }}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '10px' }}
                required
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '10px' }}
                required
              />
              <motion.button
                type="submit"
                disabled={sending}
                style={{ padding: '12px', background: gradientLight, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {sending ? 'Sending...' : 'Send Message →'}
              </motion.button>
            </form>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div><h3 style={{ marginBottom: '15px' }}>CarePlus Hospital</h3><p style={{ color: '#ccc' }}>Excellence in healthcare since 2010</p></div>
          <div><h4>Quick Links</h4><a href="#home" style={styles.footerLink}>Home</a><a href="#services" style={styles.footerLink}>Services</a><a href="#doctors" style={styles.footerLink}>Doctors</a><a href="#contact" style={styles.footerLink}>Contact</a></div>
          <div><h4>Working Hours</h4><p style={{ color: '#ccc' }}>Mon-Fri: 9AM - 9PM</p><p style={{ color: '#ccc' }}>Sat: 9AM - 6PM</p><p style={{ color: '#ccc' }}>Sun: 10AM - 4PM</p></div>
          <div><h4>Follow Us</h4><div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}><FaFacebook /><FaTwitter /><FaInstagram /><FaLinkedin /></div></div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '30px', marginTop: '30px', borderTop: '1px solid #333', color: '#888' }}>© 2025 CarePlus Hospital. All rights reserved.</div>
      </footer>

      {/* Floating Buttons */}
      <div style={styles.floatingBtn} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</div>
      <div style={styles.whatsappBtn} onClick={() => window.open('https://wa.me/919325732084', '_blank')}>💬</div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && modalData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={closeModal}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} transition={{ type: 'spring', damping: 25 }} style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}><span style={{ marginRight: '10px' }}>{modalData.icon}</span> {modalData.name}</h2>
                <button onClick={closeModal} style={styles.closeBtn}><FaTimes /></button>
              </div>
              <div style={styles.modalBody}>
                <img src={modalData.image} alt={modalData.name} style={{ width: '100%', borderRadius: '16px', marginBottom: '20px' }} />
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', marginBottom: '20px' }}>
                  {serviceDetails[modalData.name]?.fullDescription || `Our ${modalData.name} department offers comprehensive medical care with a team of ${modalData.doctors} specialist doctors.`}
                </p>
                <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                  <div style={styles.detailRow}><span><strong>👨‍⚕️ Doctors:</strong></span><span>{modalData.doctors}+ specialists</span></div>
                  <div style={styles.detailRow}><span><strong>📊 Success Rate:</strong></span><span>{serviceDetails[modalData.name]?.successRate || '95%'}</span></div>
                  <div style={styles.detailRow}><span><strong>🛠️ Advanced Technologies:</strong></span><span>{serviceDetails[modalData.name]?.technologies || 'MRI, CT Scan, Ultrasound, Laser Technology'}</span></div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Link to="/register" style={{ display: 'inline-block', padding: '12px 28px', background: primaryColor, color: 'white', borderRadius: '40px', textDecoration: 'none', fontWeight: '600' }}>Book an Appointment →</Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;