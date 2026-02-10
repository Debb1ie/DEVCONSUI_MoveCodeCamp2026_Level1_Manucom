import { useState, useEffect } from "react"

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================
const NETWORKS = {
  testnet: {
    name: "Testnet",
    fullnode: "https://fullnode.testnet.sui.io",
    explorer: "https://suiscan.xyz/testnet",
  },
  mainnet: {
    name: "Mainnet",
    fullnode: "https://fullnode.mainnet.sui.io",
    explorer: "https://suiscan.xyz/mainnet",
  }
};

// ============================================================================
// PORTFOLIO DATA CONFIGURATION
// ============================================================================
// Edit this section to update your personal information
const defaultPortfolioData = {
  name: "PRECIOUS GRACE DEBORAH S. MANUCOM",
  course: "BS in Computer Science",
  school: "Polytechnic University of the Philippines",
  about: "Organized and results-driven Computer Science student with proven leadership in tech communities and event execution. Currently serving as President of DEVCON Manila, focused on scaling initiatives and bridging the gender gap in tech. Former COO and Director of Programs of AWS Cloud Club PUP Manila, Former Ambassador of AWSUG BuildHers+ Philippines, Alumni Data Science Fellow Lead at GDSC PUP Manila, Former Executive Auditor at PUP Sandiwa, DOST Lodi Intern, and Tutorials Dojo Intern Developer. DOST Scholar, AWS Certified Cloud Practitioner, and DataCamp Scholar.",
  skills: [
    "Python",
    "Java",
    "C/C++",
    "JavaScript",
    "SQL",
    "R",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Machine Learning",
    "AI & Predictive Modeling",
    "Data Analysis",
    "Power BI",
    "Excel",
    "AWS (Certified)",
    "Google Cloud",
    "BigQuery",
    "Git & GitHub",
    "Notion",
    "Slack",
    "WordPress",
    "Canva",
    "Move Smart Contracts",
    "ICP Motoko",
    "Public Speaking",
    "Team Building",
    "Event Management",
    "Community Building",
    "Project Management",
    "Technical Presentation"
  ],
  linkedin: "https://www.linkedin.com/in/precious-grace-deborah-manucom-6774b3253/",
  github: "https://github.com/Debb1ie"
}

const PortfolioView = () => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const objectId = "0x6f96421c82277b14cf6f0bd7479f12e1bdcc5f96aa1f28d4d36f43ea7689d37d";
  
  // Network state - default to mainnet
  const [currentNetwork, setCurrentNetwork] = useState<"testnet" | "mainnet">("mainnet");
  
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================================
  // FETCH DATA FROM BLOCKCHAIN
  // ==========================================================================
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);
        
        const network = NETWORKS[currentNetwork];
        
        const response = await fetch(
          network.fullnode,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'sui_getObject',
              params: [
                objectId,
                {
                  showContent: true,
                  showOwner: true,
                  showPreviousTransaction: true,
                  showStorageRebate: true,
                  showDisplay: false,
                  showBcs: false,
                  showType: true
                }
              ]
            })
          }
        );
        const result = await response.json();
       
        if (result.error) {
          throw new Error(result.error.message || "Failed to fetch from blockchain");
        }
        
        if (result.result?.data?.content?.fields) {
          const fields = result.result.data.content.fields;
         
          const newPortfolioData = {
            name: fields.name || defaultPortfolioData.name,
            course: fields.course || defaultPortfolioData.course,
            school: fields.school || defaultPortfolioData.school,
            about: fields.about || defaultPortfolioData.about,
            linkedin: fields.linkedin_url || defaultPortfolioData.linkedin,
            github: fields.github_url || defaultPortfolioData.github,
            skills: fields.skills ? fields.skills.split(",").map((s: string) => s.trim()) : defaultPortfolioData.skills,
          };
          
          setPortfolioData(newPortfolioData);
        } else {
          throw new Error("No portfolio data found in object");
        }
      } catch (err) {
        console.log("Using default data. Blockchain fetch failed:", err);
        setError(`Note: Using default data (blockchain fetch failed: ${err instanceof Error ? err.message : 'Unknown error'})`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolioData();
  }, [objectId, currentNetwork]);

  // Network toggle handler (optional - you can remove if you don't need network switching)
  const toggleNetwork = () => {
    setCurrentNetwork(prev => prev === "testnet" ? "mainnet" : "testnet");
  };

  // ==========================================================================
  // COMPONENT RENDER - MAIN PORTFOLIO LAYOUT
  // ==========================================================================
  return (
    <>
      {/* ===================================================================== */}
      {/* HERO SECTION - Profile and Introduction */}
      {/* ===================================================================== */}
      <div className="hero-wrapper">
        <div className="hero">
          {/* Profile Image */}
          <div className="avatar">
            <img 
              src="/profile.png"
              alt="Precious Grace Deborah S. Manucom"
              // Fallback image if profile.png fails to load
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/180x180?text=PGM'
              }}
            />
          </div>

          {/* Personal Information */}
          <div className="hero-content">
            <small style={{ fontSize: '1.1rem', fontWeight: '600', letterSpacing: '0.5px' }}>Hello! My name is</small>
            <h1 className="gradient-name">{portfolioData.name}</h1>
            <p><span className="degree">{portfolioData.course}, {portfolioData.school}</span></p>

            {/* Additional Title/Role */}
            <p className="role-title">
              <strong>DEVCON Manila President | Full Stack Developer - Data Science & Blockchain | UI/UX Designer</strong>
            </p>

            {/* Social Media Links */}
            <div className="socials">
              <a 
                href={portfolioData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-linkedin"></i> LinkedIn
              </a>
              <a 
                href={portfolioData.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-github"></i> GitHub
              </a>
              <a 
                href="mailto:pmanucom@devcon.ph"
                rel="noopener noreferrer"
              >
                <i className="fa-solid fa-envelope"></i> Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ABOUT ME & SKILLS SECTION */}
      {/* ===================================================================== */}
      <section className="solid-section">
        <h2>About Me</h2>
        
        <p style={{ 
          background: 'rgba(96, 165, 250, 0.1)', 
          border: '2px solid rgba(96, 165, 250, 0.5)', 
          borderLeft: '4px solid #60A5FA',
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          lineHeight: '1.8',
          fontSize: '1rem',
          maxWidth: '100%'
        }}>
          {portfolioData.about}
        </p>

        {/* Key Achievements */}
        <div className="achievements" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div className="achievement-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-medal"></i>
            <span><strong>Top 3</strong> - Overall in Batch 2020-2022 (TNHS)</span>
          </div>
          <div className="achievement-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-graduation-cap"></i>
            <span><strong>DOST Scholar</strong> - RA 7687</span>
          </div>
          <div className="achievement-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-award"></i>
            <span><strong>AWS Certified</strong> - Cloud Practitioner</span>
          </div>
          <div className="achievement-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-certificate"></i>
            <span><strong>DataCamp Scholar</strong></span>
          </div>
          <div className="achievement-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-brands fa-google"></i>
            <span><strong>GCP INAS Completer</strong> - Tier 1</span>
          </div>
        </div>

        <h2>Skills & Expertise</h2>
        {/* Skills Grid - Maps through skills array */}
        <div className="skills">
          {portfolioData.skills.map((skill, index) => (
            <div key={index} className="skill">{skill}</div>
          ))}
        </div>

        {/* Leadership Roles Section */}
        <h2 style={{ marginTop: '3rem' }}>Leadership & Experience</h2>
        <div className="experience-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-solid fa-users" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#60A5FA' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>DEVCON Manila</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#93C5FD' }}>President</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>Leading initiatives to foster collaboration, innovation, and inclusive tech growth</p>
          </div>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-brands fa-aws" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#FF9900' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>AWS Cloud Club PUP</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#FCD34D' }}>Former COO & Director of Programs</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>First AWS Club in the Philippines, managed programs and operations</p>
          </div>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-brands fa-aws" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#FF9900' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>AWSUG BuildHers+ PH</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#FCD34D' }}>Former Ambassador</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>Promoted AWS community initiatives and bridged the gender gap in tech</p>
          </div>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-solid fa-chart-line" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#34D399' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>GDSC PUP Main</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#6EE7B7' }}>Former Data Science Fellow Lead</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>Led data science initiatives and ML projects</p>
          </div>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-solid fa-hand-holding-heart" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#A78BFA' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>PUP Sandiwa</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#C4B5FD' }}>Former Executive Auditor</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>CCIS Representative, handled transparency and audits</p>
          </div>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-solid fa-flask" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#F472B6' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>DOST</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#FBCFE8' }}>Former Lodi Intern</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>Contributed to science and technology initiatives</p>
          </div>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-solid fa-code" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#22D3EE' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Tutorials Dojo</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#67E8F9' }}>Former Intern Developer</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>Developed educational content and technical solutions</p>
          </div>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-solid fa-users-gear" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#A855F7' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>PUP ASCII</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#C084FC' }}>Former Member</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>Association of Students for Computer Intelligence Integration</p>
          </div>
          <div className="experience-card" style={{ padding: '1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="fa-solid fa-rainbow" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', color: '#EC4899' }}></i>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>ARK - AcademiTech Research and Knowledge</h3>
            <p className="role" style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#F9A8D4' }}>UI/UX Head</p>
            <p className="description" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: '0' }}>Coordinates the work of designers and developers to deliver functional interfaces to clients.</p>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* MOVE SMART CONTRACTS - Educational Section */}
      {/* ===================================================================== */}
      <div className="move-wrapper">
        <div className="move-card">
          <div className="move-title">
            <img src="/sui-logo.png" alt="Move Logo" className="move-logo" />
            <strong>Move Smart Contracts</strong>
          </div>

          {/* Educational Content about Move Language */}
          <p>
            Move smart contracts are programs written in the Move language and deployed on blockchains like Sui, enabling secure asset management and high scalability. As a secure and efficient language designed for apps that scale, Move ushers in a new era of smart contract programming by offering significant advancements in security and productivity. Move drastically reduces the Web3 learning curve and enables a developer experience of unprecedented ease, serving as the foundation for Sui, a high-performance Layer 1 blockchain that utilizes an object-centric data model to achieve industry-leading transaction speeds.
          </p>

          {/* External Link to Official Sui Documentation */}
          <a href="https://www.sui.io/move" target="_blank" className="learn-more-btn" rel="noopener noreferrer">
            Learn More About Sui →
          </a>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FOOTER - Attribution and Logos */}
      {/* ===================================================================== */}
      <div className="custom-footer">
        <div className="footer-container">
          {/* Organization Logos */}
          <div className="footer-logos">
            <img src="/devcon.png" alt="DEVCON" className="logo-img" />
            <img src="/sui.png" alt="SUI" className="logo-img" />
          </div>
          
          {/* Code Camp Attribution Text */}
          <div className="footer-text">
            <p>
              Portfolio project published during <strong>Move Smart Contracts Code Camp</strong> by DEVCON Philippines & SUI Foundation
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              © 2026 Precious Grace Deborah S. Manucom. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PortfolioView