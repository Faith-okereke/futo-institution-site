import { Category } from "../types/content";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Staff", href: "/staff" },
  { label: "Schools", href: "/schools" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
];

export const stats = [
  { value: "25k+", label: "active students" },
  { value: "15:1", label: "student-staff ratio" },
  { value: "100+", label: "industry partners" },
  { value: "40+", label: "years of excellence" },
];

export const news = [
  {
    category: "Research",
    title: "Breakthrough in renewable energy storage",
    excerpt:
      "Faculty of Engineering researchers are developing longer-lasting carbon-based battery systems for resilient local grids.",
    date: "June 18, 2026",
    image: "/design/student-lab.png",
  },
  {
    category: "Academics",
    title: "Preparation for convocation begins",
    excerpt:
      "The registrar's office has released guidance for ceremony logistics, academic clearance, and faculty requirements.",
    date: "June 10, 2026",
    image: "/design/lecture-hall.png",
  },
  {
    category: "Campus Life",
    title: "New digital library resources launched",
    excerpt:
      "Students can now access expanded journals, technical standards, and research archives through the institutional repository.",
    date: "May 29, 2026",
    image: "/design/professor-office.png",
  },
];

export const schools = [
  {
    code: "SAAT",
    name: "School of Agriculture and Agricultural Technology",
    summary:
      "Sustainable food systems, biotechnology, mechanized farming, and agro-management.",
    departments: ["Crop Science", "Soil Science", "Agricultural Economics"],
    image: "/design/campus-courtyard.png",
  },
  {
    code: "SICT",
    name: "School of Information and Communication Technology",
    summary:
      "Computer science, cyber systems, data infrastructure, and digital economy leadership.",
    departments: ["Computer Science", "Information Technology", "Cyber Security"],
    image: "/design/student-lab.png",
  },
  {
    code: "SEET",
    name: "School of Engineering and Engineering Technology",
    summary:
      "Industrial design, production systems, materials, energy, and manufacturing.",
    departments: ["Mechanical Engineering", "Civil Engineering", "Mechatronics"],
    image: "/design/student-lab.png",
  },
  {
    code: "SOPS",
    name: "School of Physical Sciences",
    summary:
      "Physics, chemistry, mathematics, statistics, and scientific computing.",
    departments: ["Physics", "Chemistry", "Mathematics"],
    image: "/design/professor-office.png",
  },
  {
    code: "SOES",
    name: "School of Environmental Sciences",
    summary:
      "Built environment resilience, architecture, surveying, and urban planning.",
    departments: ["Architecture", "Quantity Surveying", "Urban Planning"],
    image: "/design/campus-courtyard.png",
  },
  {
    code: "SOHT",
    name: "School of Health Technology",
    summary:
      "Biomedical technology, public health systems, diagnostics, and health innovation.",
    departments: ["Biomedical Technology", "Public Health", "Optometry"],
    image: "/design/lecture-hall.png",
  },
  {
    code: "SBMS",
    name: "School of Basic Medical Sciences",
    summary:
      "Human anatomy, physiology, pharmacology, and foundational clinical science.",
    departments: ["Anatomy", "Physiology", "Pharmacology"],
    image: "/design/graduate.png",
  },
  {
    code: "SOBS",
    name: "School of Biological Sciences",
    summary:
      "Biochemistry, microbiology, biotechnology, and environmental biology.",
    departments: ["Biochemistry", "Microbiology", "Biotechnology"],
    image: "/design/student-lab.png",
  },
  {
    code: "SESET",
    name: "School of Electrical Systems Engineering Technology",
    summary:
      "Power systems, electronics, embedded infrastructure, and intelligent automation.",
    departments: ["Electrical Engineering", "Electronics", "Control Systems"],
    image: "/design/professor-office.png",
  },
];

export const events = [
  {
    title: "International Workshop on Applied AI",
    date: "Jul 12",
    day: "12",
    month: "Jul",
    time: "09:00 AM",
    location: "Hall of Excellence",
    status: "Registration Open",
    type: "Featured",
    image: "/design/lecture-hall.png",
  },
  {
    title: "FUTO Annual Research Expo",
    date: "Jul 21",
    day: "21",
    month: "Jul",
    time: "10:00 AM",
    location: "Multi-purpose Hall",
    status: "Live",
    type: "Research",
    image: "/design/student-lab.png",
  },
  {
    title: "Inter-Faculty Debate Finals",
    date: "Aug 05",
    day: "05",
    month: "Aug",
    time: "02:00 PM",
    location: "Science Auditorium",
    status: "Academic",
    type: "Student Life",
    image: "/design/campus-courtyard.png",
  },
  {
    title: "Founders' Day Gala",
    date: "Aug 18",
    day: "18",
    month: "Aug",
    time: "05:00 PM",
    location: "Campus-wide",
    status: "Alumni",
    type: "Ceremony",
    image: "/design/graduate.png",
  },
];

export const researchAreas = [
  "Renewable energy systems",
  "Robotics and intelligent automation",
  "Agricultural processing technology",
  "Materials and manufacturing",
  "Public health technology",
  "Built environment resilience",
];

export const pageContent = {
  about: {
    eyebrow: "About FUTO",
    title: "A technology university built for practical invention.",
    intro:
      "Federal University of Technology, Owerri advances science, engineering, and applied research for Nigeria and the wider world. The institution combines rigorous teaching with laboratories, studios, fieldwork, and industry partnerships.",
    highlights: [
      "Founded in 1980 as one of Nigeria's specialist universities of technology.",
      "Located in Owerri, Imo State, with a mandate to train inventive technical leaders.",
      "Organised around schools that connect theory, field practice, entrepreneurship, and research.",
    ],
  },
  admissions: {
    eyebrow: "Admissions",
    title: "Begin your path into a practical technology education.",
    intro:
      "Explore undergraduate and postgraduate entry routes, review requirements, and prepare for screening with clear guidance for each stage of the process.",
    highlights: [
      "Check programme requirements before starting your application.",
      "Prepare transcripts, identification, examination records, and contact details.",
      "Follow official admission announcements for screening dates and faculty updates.",
    ],
  },
  history: {
    eyebrow: "History",
    title: "Four decades of technological education and public value.",
    intro:
      "FUTO was established to deepen Nigeria's technical capacity through focused teaching, research, and service. Its growth reflects a sustained belief that universities should solve practical problems.",
    highlights: [
      "1980: Established as a federal technology university.",
      "1990s-2000s: Expanded schools, laboratories, and postgraduate training.",
      "Today: A national hub for applied science, engineering, and technology enterprise.",
    ],
  },
  leadership: {
    eyebrow: "Leadership",
    title: "Stewardship focused on academic quality and institutional trust.",
    intro:
      "University leadership coordinates academic planning, research priorities, student services, infrastructure, and external partnerships across the institution.",
    highlights: [
      "Senate-led academic governance for teaching and standards.",
      "School and department leadership close to programme delivery.",
      "Administrative units supporting student success and institutional operations.",
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Responsible handling of institutional information.",
    intro:
      "This site is designed to collect only the information needed to support admissions, enquiries, communication, and service improvement.",
    highlights: [
      "Use official channels for sensitive student or staff records.",
      "Search and enquiry information should be handled only for stated institutional purposes.",
      "Personal information should not be shared through unofficial forms or links.",
    ],
  },
};
type BlogPost = {
  title: string;
  slug: string;
  category: Category[];
  excerpt: string;
  body: string[];
  coverImageUrl: string;
  coverImageTitle: string;
  datePublished: string;
  featured: boolean;
};

export const posts: BlogPost[] = [
  {
    title: "FUTO Researchers Develop Smart Irrigation System for Smallholder Farmers",
    slug: "futo-smart-irrigation-system-smallholder-farmers",
    category: ["Research", "Innovation"],
    excerpt:
      "A multidisciplinary research team at FUTO is developing an affordable smart irrigation system designed to help smallholder farmers make better water-use decisions and improve crop productivity.",
    body: [
      "Researchers at the Federal University of Technology Owerri are advancing a smart irrigation project that combines soil-moisture sensors, weather data, and mobile alerts. The goal is to help farmers understand when crops need water instead of relying only on guesswork or fixed watering schedules.",
      "The system is being designed with affordability in mind. By using accessible hardware and a simple monitoring dashboard, the project aims to support farms that may not have access to expensive commercial agricultural technology.",
      "The research team believes the project can reduce water waste while helping farmers protect crops during periods of irregular rainfall. Field testing will help the team evaluate the system under real farming conditions and improve its recommendations over time.",
      "The initiative reflects FUTO's commitment to practical research that connects engineering, agriculture, technology, and community development.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "Smart agriculture field research",
    datePublished: "2026-07-02T09:00:00.000Z",
    featured: true,
  },
  {
    title: "New Academic Session: What Returning Students Need to Know",
    slug: "new-academic-session-returning-students-guide",
    category: ["Academics", "Announcements"],
    excerpt:
      "A practical guide for returning students preparing for the new academic session, including registration, course planning, academic support, and important campus expectations.",
    body: [
      "The beginning of a new academic session is an opportunity for students to review their goals, organize their schedules, and prepare for a productive semester. Returning students are encouraged to complete registration early and confirm that their academic records are up to date.",
      "Students should review available courses carefully before registration. A balanced course load can make it easier to manage lectures, assignments, laboratory work, group projects, and personal responsibilities.",
      "Academic support remains available through departments, lecturers, course advisers, libraries, and student-focused services. Students who need help should seek guidance early rather than waiting until assessments are close.",
      "The university encourages every returning student to approach the new session with discipline, curiosity, and a commitment to academic excellence.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "University students on campus",
    datePublished: "2026-06-29T09:00:00.000Z",
    featured: true,
  },
  {
    title: "How FUTO Supports Students Through Practical Learning",
    slug: "futo-practical-learning-student-support",
    category: ["Academics", "Innovation"],
    excerpt:
      "Practical learning helps students connect classroom knowledge with real-world challenges through laboratories, projects, fieldwork, and collaborative problem-solving.",
    body: [
      "Technology education becomes more meaningful when students can apply what they learn. Practical learning gives students opportunities to test ideas, build prototypes, analyze results, and understand how theory works in real situations.",
      "Laboratories, workshops, studio sessions, fieldwork, and project-based courses create environments where students can develop technical confidence. These experiences also encourage teamwork, communication, and critical thinking.",
      "Students are encouraged to use practical assignments as opportunities to explore new interests and build portfolios that demonstrate their skills beyond examination results.",
      "By combining academic foundations with hands-on experience, FUTO continues to prepare graduates for professional challenges and opportunities in a changing world.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "Students working in a science laboratory",
    datePublished: "2026-06-25T09:00:00.000Z",
    featured: false,
  },
  {
    title: "Admissions Guide: Preparing a Strong Application to FUTO",
    slug: "admissions-guide-preparing-strong-futo-application",
    category: ["Admissions"],
    excerpt:
      "Prospective students can prepare for admission by understanding requirements, organizing documents early, and following official university announcements closely.",
    body: [
      "Applying to university is an important step, and preparation can make the process easier. Prospective students should begin by reviewing official admission requirements for their intended programme.",
      "Applicants are advised to keep academic records, identification documents, examination information, and other required materials organized before application periods begin.",
      "It is important to rely on official university communication channels for updates. Admission information can change, and applicants should avoid relying on unverified social-media posts or unofficial agents.",
      "Students should also consider their academic interests, strengths, and long-term goals when choosing a programme. A thoughtful choice can help create a stronger and more rewarding university experience.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "Students discussing university admission",
    datePublished: "2026-06-20T09:00:00.000Z",
    featured: true,
  },
  {
    title: "Campus Life: Building Community Beyond the Lecture Hall",
    slug: "campus-life-building-community-beyond-lecture-hall",
    category: ["Campus Life"],
    excerpt:
      "University life includes more than lectures and examinations. Student communities, clubs, sports, volunteering, and friendships all contribute to personal growth.",
    body: [
      "Campus life gives students opportunities to meet people from different backgrounds, discover new interests, and build relationships that can last beyond graduation.",
      "Student organizations, academic societies, sports teams, cultural groups, and volunteer initiatives allow students to contribute to campus life while developing leadership and collaboration skills.",
      "Balancing social activities with academic responsibilities is important. Students can benefit from choosing activities that support their interests without affecting their study time and wellbeing.",
      "A strong campus community helps students feel connected, supported, and motivated throughout their academic journey.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "Students spending time together on campus",
    datePublished: "2026-06-16T09:00:00.000Z",
    featured: false,
  },
  {
    title: "Student Innovators Present Renewable Energy Solutions",
    slug: "student-innovators-renewable-energy-solutions",
    category: ["Innovation", "Research"],
    excerpt:
      "Student innovators are exploring renewable energy ideas that address power reliability, sustainability, and energy access for communities and businesses.",
    body: [
      "Students across technology-related disciplines are developing renewable energy concepts that respond to everyday energy challenges. Their work includes solar systems, energy monitoring tools, battery-storage ideas, and efficient power-management designs.",
      "Innovation projects provide an opportunity for students to move from identifying a problem to designing and testing a possible solution. This process often requires research, teamwork, experimentation, and feedback.",
      "Renewable energy remains an important area for innovation because it connects environmental responsibility with economic opportunity and improved access to electricity.",
      "The university continues to encourage students to pursue ideas that can grow from classroom projects into solutions with real social and commercial value.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "Solar energy innovation project",
    datePublished: "2026-06-12T09:00:00.000Z",
    featured: true,
  },
  {
    title: "FUTO Hosts Technology and Entrepreneurship Showcase",
    slug: "futo-technology-entrepreneurship-showcase",
    category: ["Events", "Innovation"],
    excerpt:
      "The technology and entrepreneurship showcase brings students, researchers, industry professionals, and emerging founders together to share ideas and explore opportunities.",
    body: [
      "The technology and entrepreneurship showcase is designed to create conversations between students, innovators, researchers, and industry professionals. Participants can present projects, learn from experts, and connect with people working in different sectors.",
      "Events like this help students understand how technical knowledge can be transformed into products, services, research opportunities, and businesses.",
      "The showcase will feature project demonstrations, panel discussions, networking sessions, and opportunities for participants to receive feedback on early-stage ideas.",
      "By encouraging collaboration between the university and the wider innovation ecosystem, the event supports a culture of creativity, enterprise, and problem-solving.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "Technology conference audience",
    datePublished: "2026-06-08T09:00:00.000Z",
    featured: false,
  },
  {
    title: "Library Services and Study Resources for the Semester",
    slug: "library-services-study-resources-semester",
    category: ["Academics", "Announcements"],
    excerpt:
      "Students are encouraged to make full use of library services, digital resources, quiet study spaces, and research support throughout the semester.",
    body: [
      "The library remains one of the most valuable academic resources available to students. It provides access to books, journals, research materials, digital databases, and spaces for focused study.",
      "Students can improve their research skills by learning how to search academic sources, evaluate information, cite references correctly, and organize notes for assignments and projects.",
      "Study spaces can also help students create routines. Setting aside regular time for reading, revision, and project work can reduce pressure during examination periods.",
      "Students are encouraged to explore available resources early in the semester so they can use them effectively when assignments and research projects become more demanding.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "University library study resources",
    datePublished: "2026-06-04T09:00:00.000Z",
    featured: false,
  },
  {
    title: "Research Spotlight: Using Data to Improve Urban Mobility",
    slug: "research-spotlight-data-improve-urban-mobility",
    category: ["Research"],
    excerpt:
      "A research initiative is examining how data can support better transport planning, reduce congestion, and improve mobility in growing urban communities.",
    body: [
      "Urban mobility affects how people access work, education, healthcare, and essential services. Researchers are exploring how data can help planners understand traffic patterns and identify areas where transport systems can improve.",
      "The project considers information such as travel times, road usage, public transport availability, and the movement of people during peak periods.",
      "Data-driven research can support better decisions by showing where congestion is most severe and where targeted improvements may have the greatest impact.",
      "The initiative demonstrates how computing, engineering, planning, and social research can work together to address complex challenges in modern cities.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "Urban transportation research",
    datePublished: "2026-05-30T09:00:00.000Z",
    featured: false,
  },
  {
    title: "University Announces New Student Support Initiatives",
    slug: "university-announces-new-student-support-initiatives",
    category: ["Announcements", "Campus Life"],
    excerpt:
      "New student support initiatives are focused on helping students access guidance, wellbeing resources, academic assistance, and campus information more easily.",
    body: [
      "The university is strengthening student support initiatives to make it easier for students to find guidance throughout their academic journey.",
      "The initiatives focus on improving access to academic advice, orientation information, wellbeing support, career guidance, and communication about important campus services.",
      "Students are encouraged to ask questions early when they need help. Reaching out to departments, advisers, lecturers, and student-support teams can prevent small challenges from becoming larger problems.",
      "These initiatives reflect a commitment to creating a learning environment where students can focus on growth, achievement, and participation in university life.",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80",
    coverImageTitle: "Student support and university community",
    datePublished: "2026-05-25T09:00:00.000Z",
    featured: true,
  },
];