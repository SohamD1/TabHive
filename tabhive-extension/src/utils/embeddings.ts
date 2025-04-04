/**
 * Embeddings utility for TabHive - provides semantic matching capabilities
 * This uses a simplified vector-based approach for extension compatibility
 */

// Simple vector type
type Vector = number[];

// Define predefined subject categories with related terms
interface SubjectCategory {
  name: string;
  terms: string[];
  embedding: Vector;
}

// Predefined subject categories with related terms
const SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    name: 'Computer Science',
    terms: [
      'programming', 'coding', 'algorithm', 'data structure', 'software', 'development',
      'javascript', 'python', 'java', 'c++', 'html', 'css', 'react', 'angular', 'vue',
      'node.js', 'database', 'sql', 'nosql', 'mongodb', 'api', 'git', 'github',
      'web development', 'app development', 'machine learning', 'artificial intelligence'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Linear Algebra',
    terms: [
      'linear algebra', 'matrix', 'vector', 'vector space', 'eigenvalue', 'eigenvector',
      'linear transformation', 'determinant', 'rank', 'nullity', 'basis', 'dimension',
      'linear independence', 'span', 'orthogonal', 'projection', 'least squares',
      'inner product', 'matrix multiplication', 'inverse matrix', 'singular value',
      'diagonalization', 'jordan form', 'linear equation', 'system of equations',
      'gaussian elimination', 'matrix factorization', 'LU decomposition'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Calculus',
    terms: [
      'calculus', 'derivative', 'integral', 'limit', 'continuity', 'differentiation',
      'integration', 'fundamental theorem', 'differential equation', 'gradient',
      'partial derivative', 'multiple integral', 'vector calculus', 'divergence',
      'curl', 'laplacian', 'taylor series', 'maclaurin series', 'power series',
      'convergence', 'maxima', 'minima', 'optimization', 'chain rule', 'product rule',
      'quotient rule', 'l\'hospital rule', 'riemann sum', 'improper integral'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Circuits',
    terms: [
      'circuits', 'electric circuit', 'electronic circuit', 'voltage', 'current',
      'resistance', 'capacitance', 'inductance', 'impedance', 'ohm\'s law',
      'kirchhoff\'s law', 'node', 'mesh', 'resistor', 'capacitor', 'inductor',
      'transistor', 'diode', 'operational amplifier', 'logic gate', 'digital circuit',
      'analog circuit', 'integrated circuit', 'microcontroller', 'power supply',
      'filter', 'oscillator', 'amplifier', 'frequency response', 'transfer function'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Mechanics',
    terms: [
      'mechanics', 'kinematics', 'dynamics', 'statics', 'newton\'s laws', 'motion',
      'force', 'torque', 'momentum', 'angular momentum', 'work', 'energy', 'power',
      'conservation', 'friction', 'gravity', 'projectile', 'collision', 'rigid body',
      'rotation', 'equilibrium', 'inertia', 'moment of inertia', 'elasticity',
      'stress', 'strain', 'fluid mechanics', 'pressure', 'bernoulli principle',
      'harmonic oscillator', 'wave mechanics'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Chemistry',
    terms: [
      'organic chemistry', 'inorganic chemistry', 'biochemistry', 'physical chemistry',
      'analytical chemistry', 'polymer chemistry', 'chemical reaction', 'molecule',
      'atom', 'element', 'compound', 'acid', 'base', 'salt', 'solution', 'periodic table',
      'bond', 'isotope', 'electron', 'proton', 'neutron', 'ion', 'catalyst'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Biology',
    terms: [
      'cell biology', 'genetics', 'ecology', 'evolution', 'microbiology', 'botany',
      'zoology', 'physiology', 'anatomy', 'taxonomy', 'biotechnology', 'dna', 'rna',
      'protein', 'enzyme', 'cell', 'tissue', 'organ', 'organism', 'species', 'ecosystem',
      'photosynthesis', 'respiration', 'metabolism', 'heredity', 'natural selection'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'History',
    terms: [
      'ancient history', 'medieval history', 'modern history', 'world history',
      'us history', 'european history', 'asian history', 'african history',
      'civilization', 'empire', 'revolution', 'war', 'monarchy', 'democracy',
      'archaeology', 'anthropology', 'cultural history', 'economic history',
      'political history', 'social history', 'historiography'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Literature',
    terms: [
      'fiction', 'non-fiction', 'poetry', 'drama', 'prose', 'novel', 'short story',
      'essay', 'biography', 'autobiography', 'memoir', 'literary criticism',
      'literary theory', 'rhetoric', 'narrative', 'character', 'plot', 'setting',
      'theme', 'symbolism', 'metaphor', 'genre', 'author', 'reader'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Economics',
    terms: [
      'microeconomics', 'macroeconomics', 'econometrics', 'economic theory',
      'economic policy', 'international economics', 'development economics',
      'labor economics', 'financial economics', 'public economics', 'monetary economics',
      'market', 'supply', 'demand', 'price', 'competition', 'monopoly', 'inflation',
      'deflation', 'recession', 'gdp', 'unemployment', 'interest rate', 'currency'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Psychology',
    terms: [
      'cognitive psychology', 'developmental psychology', 'social psychology',
      'clinical psychology', 'abnormal psychology', 'personality psychology',
      'educational psychology', 'health psychology', 'industrial psychology',
      'experimental psychology', 'behavior', 'cognition', 'emotion', 'motivation',
      'perception', 'memory', 'learning', 'intelligence', 'consciousness'
    ],
    embedding: [] // Will be computed during initialization
  },
  {
    name: 'Philosophy',
    terms: [
      'metaphysics', 'epistemology', 'ethics', 'logic', 'aesthetics', 'existentialism',
      'rationalism', 'empiricism', 'idealism', 'materialism', 'phenomenology',
      'pragmatism', 'positivism', 'postmodernism', 'philosophy of mind',
      'philosophy of language', 'political philosophy', 'moral philosophy'
    ],
    embedding: [] // Will be computed during initialization
  }
];

// Initialize the system and compute embeddings for categories
export function initializeEmbeddingSystem(): void {
  // Compute embeddings for each category
  SUBJECT_CATEGORIES.forEach(category => {
    // Create a combined text of all terms for this category
    const combinedText = category.terms.join(' ');
    // Generate embedding for this category
    category.embedding = generateSimpleEmbedding(combinedText);
  });
  
  console.log('Embedding system initialized with predefined subject categories');
}

/**
 * Generate a simplified word embedding for text
 * This is a basic implementation that can be replaced with a more sophisticated one
 * @param text - Text to generate embedding for
 * @returns Vector representation
 */
export function generateSimpleEmbedding(text: string): Vector {
  // Lowercase and remove punctuation
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words
  const words = cleanText.split(/\s+/).filter(word => word.length > 2);
  
  // Define a fixed vocabulary (can be expanded)
  const vocabulary = new Set([
    // Common academic words
    'study', 'research', 'theory', 'analysis', 'concept', 'data', 'method',
    'result', 'process', 'system', 'function', 'structure', 'model', 'factor',
    'value', 'effect', 'role', 'form', 'level', 'case', 'group', 'number',
    'example', 'point', 'state', 'problem', 'issue', 'approach', 'development',
    // Plus all words from all category terms
    ...SUBJECT_CATEGORIES.flatMap(category => 
      category.terms.flatMap(term => term.toLowerCase().split(/\s+/))
    )
  ]);
  
  // Convert vocabulary to array for indexing
  const vocabArray = Array.from(vocabulary);
  
  // Initialize a zero vector with the vocabulary size
  const vector = new Array(vocabArray.length).fill(0);
  
  // Count occurrences of each word in the text
  words.forEach(word => {
    const index = vocabArray.indexOf(word);
    if (index !== -1) {
      vector[index] += 1;
    }
  });
  
  // Normalize the vector (L2 norm)
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 
    ? vector.map(val => val / magnitude) 
    : vector;
}

/**
 * Generate embeddings for a tab based on its title and URL
 * @param tab - Chrome tab object
 * @returns Embedding vector
 */
export function generateTabEmbedding(tab: chrome.tabs.Tab): Vector {
  const title = tab.title || '';
  const url = tab.url || '';
  
  // Extract keywords from URL (remove common parts)
  const urlKeywords = url
    .replace(/https?:\/\/(www\.)?/i, '')
    .replace(/\.(com|org|net|edu|gov)/, ' ')
    .replace(/[\/\-_#?&=]/g, ' ')
    .toLowerCase();
  
  // Combine title and URL keywords
  const combinedText = `${title} ${urlKeywords}`;
  
  // Generate and return embedding
  return generateSimpleEmbedding(combinedText);
}

/**
 * Calculate cosine similarity between two vectors
 * @param vec1 - First vector
 * @param vec2 - Second vector
 * @returns Similarity score (0-1)
 */
export function cosineSimilarity(vec1: Vector, vec2: Vector): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }
  
  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
  }
  
  // Calculate magnitudes
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  
  // Handle zero vectors
  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }
  
  // Return cosine similarity
  return dotProduct / (mag1 * mag2);
}

/**
 * Find the most similar subject category for a tab
 * @param tab - Chrome tab
 * @returns Best matching category and similarity score
 */
export function findMostSimilarSubject(tab: chrome.tabs.Tab): 
  { categoryName: string; similarity: number } {
  
  // Generate embedding for the tab
  const tabEmbedding = generateTabEmbedding(tab);
  
  // Find the most similar category
  let bestMatch = { categoryName: '', similarity: -1 };
  
  SUBJECT_CATEGORIES.forEach(category => {
    const similarity = cosineSimilarity(tabEmbedding, category.embedding);
    if (similarity > bestMatch.similarity) {
      bestMatch = { categoryName: category.name, similarity: similarity };
    }
  });
  
  return bestMatch;
}

/**
 * Calculate semantic similarity between two tabs
 * @param tab1 - First tab
 * @param tab2 - Second tab
 * @returns Similarity score (0-1)
 */
export function calculateTabSemanticSimilarity(tab1: chrome.tabs.Tab, tab2: chrome.tabs.Tab): number {
  const embedding1 = generateTabEmbedding(tab1);
  const embedding2 = generateTabEmbedding(tab2);
  
  return cosineSimilarity(embedding1, embedding2);
}

// Initialize the embedding system when this module is imported
initializeEmbeddingSystem(); 