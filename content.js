/* ============================================================
   ALL YOUR TEXT LIVES HERE. Edit this file, not the HTML.
   ============================================================ */

export const hero = {
  role: "AI & ML Engineer",
  headline: "An engineer who builds AI that works.",
  accentWord: "works",                 // set in the serif accent
  intro: "Hi, I'm Dhruv. Final-year CSE (AI&ML) student building computer vision, robotics and real-world ML.",
  name: "Dhruv Mistry",
  place: "Pune, India",
  status: "Open to ML roles and internships",
  line1: "Final-year CSE (AI&ML) student focused on building practical web, IoT, and AI-powered systems, with experience in computer vision, autonomous robotics, and real-world machine learning applications.",
  github: "https://github.com/Dhruvvv13",
  linkedin: "https://www.linkedin.com/in/dhruv-mistry-1bb53728a/",
  resume: "https://drive.google.com/file/d/1-HKrgOS3n5kwlJidHrzLoE5r5biNR2Ww/preview",
  email: "dhruvmistry3377@gmail.com"
};

/* Skills, grouped. `used` is optional — only say where a skill was really used. */
export const skills = [
  { group: "ML & Vision", items: ["PyTorch", "TensorFlow", "scikit-learn", "OpenCV"],
    used: "scikit-learn in Fraud Detection · OpenCV in RaySense" },
  { group: "Data", items: ["NumPy", "Pandas", "Matplotlib", "Jupyter"] },
  { group: "Languages", items: ["Python", "C++", "JavaScript"],
    used: "Python in every project above" },
  { group: "Hardware & tools", items: ["Raspberry Pi", "Git", "MongoDB"] }
];

export const experience = {
  role: "AIML Intern",
  company: "GreenCashX",
  cards: [
    {
      stat: "7 Days",
      label: "Forecast horizon",
      horizon: 7,
      title: "7-Day Forecasting",
      text: "Built the system to generate future weather predictions up to 7 days out, with a focus on earlier and more useful forecasts."
    },
    {
      visual: "alert",
      title: "Early Weather Alerts",
      text: "Designed the prediction workflow with early-warning capability for severe conditions — useful for agriculture and weather-risk management."
    },
    {
      title: "Model Training",
      text: "Trained a machine-learning model to predict upcoming weather conditions using historical and real-time weather data.",
      /* Replace values with your real validation accuracy per epoch (%), then set sample: false. */
      chart: { label: "Validation accuracy", unit: "%", values: [61, 66, 70, 72, 75, 77, 78, 80, 81, 82], sample: true }
    },
    {
      title: "Data Preprocessing",
      text: "Cleaned and prepared weather datasets, handled missing values, transformed relevant features, and structured the data for effective model training.",
      steps: ["Raw data", "Clean", "Fill missing", "Transform", "Model-ready"]
    },
    {
      title: "Feature Engineering",
      text: "Worked with key weather features — temperature, humidity, pressure, wind speed, rainfall, and other atmospheric conditions — to improve prediction quality.",
      features: ["Temperature", "Humidity", "Pressure", "Wind Speed", "Rainfall"]
    }
  ]
};

/* Big numbers shown above the achievements list. */
export const awardStats = [
  { value: "4", label: "competition results" },
  { value: "1st", label: "BizQuest" },
  { value: "2×", label: "SIH finalist" }
];

export const awards = [
  { year: "2026", rank: "1st", event: "BizQuest", note: "Won among 50+ participants in the Entrepreneurship & Business Quiz Competition.", cred: null },
  { year: "2026", rank: "2nd", event: "PCU Ideathon", note: "Secured 2nd place among 100+ teams at a 24-hour national hackathon.", cred: null },
  { year: "2025–26", rank: "Finalist", event: "Smart India Hackathon", note: "College-level finalist among 100+ teams, two years running.", cred: null }
];

export const projects = [
  {
    featured: true,
    tags: "Computer Vision · Robotics · Agriculture",
    name: "RaySense — Autonomous Precision Farming Rover",
    blurb: "An autonomous rover that combines hardware and software to watch crops on its own, cutting manual field inspection by 40%. OpenCV models detect weeds and crop disease in real time, and image processing with anomaly detection turns what the rover sees into clear decisions for the farmer.",
    metric: { label: "Detection Accuracy", value: "90%" },
    metric2: { label: "less manual field inspection", value: "40%" },
    image: "img/raysense.jpg",
    imageAlt: "Wireframe render of the RaySense rover beside a laptop",
    stack: "Python · OpenCV · Embedded Hardware",
    code: null
  },
  {
    tags: "Machine Learning · FinTech",
    name: "Fraud Detection System",
    blurb: "Flags fraudulent transactions across 50,000+ records using Logistic Regression and Random Forest. SMOTE, feature engineering and scaling handle the heavy class imbalance, and models were tuned on precision, recall and F1 to keep false positives down.",
    metric: { label: "Accuracy", value: "94%" },
    metric2: { label: "transactions screened", value: "50,000+" },
    stack: "Python · scikit-learn · FastAPI · Gradio",
    code: "https://github.com/Dhruvvv13/Fraud-detection-"
  }
];

export const contact = {
  closing: "Let's build something useful.",
  closingAccent: "useful",
  blurb: "Open to ML roles and internships. I’ve spent enough time teaching machines to learn — now I’m looking for someone willing to teach me how to get paid for it.\n\nIf you’re building something interesting, I’m probably interested."
};
