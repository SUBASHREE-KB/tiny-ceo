const crypto = require('crypto');

// Password hashing
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

// Text extraction helpers
const extractKeywords = (text) => {
  // Simple keyword extraction (in production, use NLP library)
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

// Extract sentences containing keywords
const extractSentencesWithKeywords = (text, keywords) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const relevantSentences = [];

  keywords.forEach(keyword => {
    const sentence = sentences.find(s =>
      s.toLowerCase().includes(keyword.toLowerCase())
    );
    if (sentence && !relevantSentences.includes(sentence)) {
      relevantSentences.push(sentence.trim());
    }
  });

  return relevantSentences;
};

// Detect industry from text
const detectIndustry = (text) => {
  const lowerText = text.toLowerCase();

  const industryKeywords = {
    saas: ['saas', 'software', 'platform', 'cloud', 'subscription'],
    fintech: ['finance', 'financial', 'payment', 'banking', 'investment', 'money'],
    healthcare: ['health', 'medical', 'patient', 'doctor', 'hospital', 'wellness'],
    ecommerce: ['ecommerce', 'e-commerce', 'marketplace', 'retail', 'shop', 'store'],
    ai: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural'],
    edtech: ['education', 'learning', 'student', 'teacher', 'course', 'training'],
    martech: ['marketing', 'advertising', 'campaign', 'analytics', 'seo']
  };

  let maxScore = 0;
  let detectedIndustry = 'saas'; // Default

  Object.entries(industryKeywords).forEach(([industry, keywords]) => {
    const score = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedIndustry = industry;
    }
  });

  return detectedIndustry;
};

// Detect target audience
const detectTargetAudience = (text) => {
  const lowerText = text.toLowerCase();

  const audienceKeywords = {
    'Small businesses': ['small business', 'smb', 'small company'],
    'Enterprise companies': ['enterprise', 'large company', 'corporation'],
    'Individual consumers': ['consumer', 'individual', 'personal use'],
    'Developers': ['developer', 'engineer', 'programmer', 'coder'],
    'Startups': ['startup', 'early-stage', 'founder'],
    'Students': ['student', 'university', 'college', 'education'],
    'Professionals': ['professional', 'working', 'employee']
  };

  for (const [audience, keywords] of Object.entries(audienceKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return audience;
    }
  }

  return 'Small to medium-sized businesses';
};

// Extract problem statement
const extractProblem = (text) => {
  const lowerText = text.toLowerCase();
  const sentences = text.split(/[.!?]+/);

  // Look for sentences with problem keywords
  const problemKeywords = ['problem', 'issue', 'challenge', 'pain', 'difficult', 'struggle'];

  for (const sentence of sentences) {
    if (problemKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      return sentence.trim();
    }
  }

  // Fallback to first substantial sentence
  return sentences.find(s => s.trim().length > 20)?.trim() || 'Solving a key market challenge';
};

// Extract solution description
const extractSolution = (text) => {
  const sentences = text.split(/[.!?]+/);
  const solutionKeywords = ['solution', 'platform', 'product', 'service', 'app', 'tool'];

  for (const sentence of sentences) {
    if (solutionKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      return sentence.trim();
    }
  }

  return sentences.find(s => s.trim().length > 20)?.trim() || 'An innovative solution';
};

// Detect business model
const detectBusinessModel = (text) => {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('subscription') || lowerText.includes('saas') || lowerText.includes('monthly')) {
    return 'Subscription-based (SaaS)';
  }
  if (lowerText.includes('marketplace') || lowerText.includes('commission')) {
    return 'Marketplace (Commission-based)';
  }
  if (lowerText.includes('free') && lowerText.includes('premium')) {
    return 'Freemium';
  }
  if (lowerText.includes('transaction') || lowerText.includes('fee')) {
    return 'Transaction fees';
  }

  return 'Subscription-based';
};

// Generate unique identifier
const generateId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Sleep utility for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Truncate text
const truncate = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate percentage
const calculatePercentage = (part, whole) => {
  if (whole === 0) return 0;
  return Math.round((part / whole) * 100);
};

module.exports = {
  hashPassword,
  verifyPassword,
  extractKeywords,
  extractSentencesWithKeywords,
  detectIndustry,
  detectTargetAudience,
  extractProblem,
  extractSolution,
  detectBusinessModel,
  generateId,
  sleep,
  truncate,
  formatCurrency,
  calculatePercentage
};
