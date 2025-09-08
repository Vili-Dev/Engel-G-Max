// Similarity and recommendation algorithms for EngelGMax platform
// These algorithms are used for product recommendations and content matching

/**
 * Calculate cosine similarity between two vectors
 * Used for content-based recommendations
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Calculate Jaccard similarity between two sets
 * Used for comparing user preferences, tags, etc.
 */
export function jaccardSimilarity<T>(setA: Set<T>, setB: Set<T>): number {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  if (union.size === 0) {
    return 0;
  }
  
  return intersection.size / union.size;
}

/**
 * Calculate Euclidean distance between two points
 * Used for measuring differences in numerical features
 */
export function euclideanDistance(pointA: number[], pointB: number[]): number {
  if (pointA.length !== pointB.length) {
    throw new Error('Points must have the same dimensions');
  }

  let sumSquaredDifferences = 0;
  for (let i = 0; i < pointA.length; i++) {
    const difference = pointA[i] - pointB[i];
    sumSquaredDifferences += difference * difference;
  }

  return Math.sqrt(sumSquaredDifferences);
}

/**
 * Calculate Manhattan distance between two points
 * Alternative distance metric for sparse data
 */
export function manhattanDistance(pointA: number[], pointB: number[]): number {
  if (pointA.length !== pointB.length) {
    throw new Error('Points must have the same dimensions');
  }

  let sumAbsoluteDifferences = 0;
  for (let i = 0; i < pointA.length; i++) {
    sumAbsoluteDifferences += Math.abs(pointA[i] - pointB[i]);
  }

  return sumAbsoluteDifferences;
}

/**
 * Calculate Pearson correlation coefficient
 * Used for measuring linear correlation between two variables
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) {
    return 0;
  }

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

/**
 * Calculate TF-IDF (Term Frequency-Inverse Document Frequency)
 * Used for text similarity in content recommendations
 */
export class TFIDFCalculator {
  private documents: string[] = [];
  private vocabulary: Map<string, number> = new Map();
  private idf: Map<string, number> = new Map();

  constructor(documents: string[]) {
    this.documents = documents.map(doc => doc.toLowerCase());
    this.buildVocabulary();
    this.calculateIDF();
  }

  private buildVocabulary(): void {
    const words = new Set<string>();
    
    this.documents.forEach(doc => {
      const docWords = this.tokenize(doc);
      docWords.forEach(word => words.add(word));
    });

    Array.from(words).forEach((word, index) => {
      this.vocabulary.set(word, index);
    });
  }

  private calculateIDF(): void {
    const totalDocs = this.documents.length;
    
    this.vocabulary.forEach((_, word) => {
      const docsWithWord = this.documents.filter(doc => 
        this.tokenize(doc).includes(word)
      ).length;
      
      const idf = Math.log(totalDocs / (docsWithWord + 1));
      this.idf.set(word, idf);
    });
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  private calculateTF(text: string): Map<string, number> {
    const words = this.tokenize(text);
    const tf = new Map<string, number>();
    
    words.forEach(word => {
      tf.set(word, (tf.get(word) || 0) + 1);
    });

    // Normalize by document length
    words.forEach(word => {
      tf.set(word, (tf.get(word) || 0) / words.length);
    });

    return tf;
  }

  public getVector(text: string): number[] {
    const tf = this.calculateTF(text);
    const vector: number[] = [];

    this.vocabulary.forEach((index, word) => {
      const tfScore = tf.get(word) || 0;
      const idfScore = this.idf.get(word) || 0;
      vector[index] = tfScore * idfScore;
    });

    return vector;
  }

  public similarity(textA: string, textB: string): number {
    const vectorA = this.getVector(textA);
    const vectorB = this.getVector(textB);
    return cosineSimilarity(vectorA, vectorB);
  }
}

/**
 * User-based collaborative filtering similarity
 * Calculate similarity between users based on their ratings/interactions
 */
export function userBasedSimilarity(
  userA: Record<string, number>,
  userB: Record<string, number>
): number {
  const commonItems = Object.keys(userA).filter(item => item in userB);
  
  if (commonItems.length === 0) {
    return 0;
  }

  // Get ratings for common items
  const ratingsA = commonItems.map(item => userA[item]);
  const ratingsB = commonItems.map(item => userB[item]);

  return pearsonCorrelation(ratingsA, ratingsB);
}

/**
 * Item-based collaborative filtering similarity
 * Calculate similarity between items based on user ratings
 */
export function itemBasedSimilarity(
  itemA: Record<string, number>,
  itemB: Record<string, number>
): number {
  const commonUsers = Object.keys(itemA).filter(user => user in itemB);
  
  if (commonUsers.length === 0) {
    return 0;
  }

  const ratingsA = commonUsers.map(user => itemA[user]);
  const ratingsB = commonUsers.map(user => itemB[user]);

  return pearsonCorrelation(ratingsA, ratingsB);
}

/**
 * Content-based similarity for products
 * Compare products based on their features and attributes
 */
export interface ProductFeatures {
  categories: string[];
  tags: string[];
  price: number;
  difficulty: number;
  duration?: number;
  gmaxingLevel: string;
  goals: string[];
}

export function productSimilarity(
  productA: ProductFeatures,
  productB: ProductFeatures,
  weights: {
    categories: number;
    tags: number;
    price: number;
    difficulty: number;
    duration: number;
    level: number;
    goals: number;
  } = {
    categories: 0.25,
    tags: 0.20,
    price: 0.10,
    difficulty: 0.15,
    duration: 0.10,
    level: 0.10,
    goals: 0.10,
  }
): number {
  let totalSimilarity = 0;
  let totalWeight = 0;

  // Category similarity
  const categorySetA = new Set(productA.categories);
  const categorySetB = new Set(productB.categories);
  const categorySim = jaccardSimilarity(categorySetA, categorySetB);
  totalSimilarity += categorySim * weights.categories;
  totalWeight += weights.categories;

  // Tags similarity
  const tagSetA = new Set(productA.tags);
  const tagSetB = new Set(productB.tags);
  const tagSim = jaccardSimilarity(tagSetA, tagSetB);
  totalSimilarity += tagSim * weights.tags;
  totalWeight += weights.tags;

  // Price similarity (inverse of normalized difference)
  const maxPrice = Math.max(productA.price, productB.price);
  const priceDiff = Math.abs(productA.price - productB.price);
  const priceSim = maxPrice > 0 ? 1 - (priceDiff / maxPrice) : 1;
  totalSimilarity += priceSim * weights.price;
  totalWeight += weights.price;

  // Difficulty similarity
  const difficultyDiff = Math.abs(productA.difficulty - productB.difficulty);
  const difficultySim = 1 - (difficultyDiff / 4); // Max difference is 4 (1 to 5)
  totalSimilarity += difficultySim * weights.difficulty;
  totalWeight += weights.difficulty;

  // Duration similarity (if both have duration)
  if (productA.duration && productB.duration) {
    const maxDuration = Math.max(productA.duration, productB.duration);
    const durationDiff = Math.abs(productA.duration - productB.duration);
    const durationSim = maxDuration > 0 ? 1 - (durationDiff / maxDuration) : 1;
    totalSimilarity += durationSim * weights.duration;
    totalWeight += weights.duration;
  }

  // G-Maxing level similarity
  const levelSim = productA.gmaxingLevel === productB.gmaxingLevel ? 1 : 0;
  totalSimilarity += levelSim * weights.level;
  totalWeight += weights.level;

  // Goals similarity
  const goalSetA = new Set(productA.goals);
  const goalSetB = new Set(productB.goals);
  const goalSim = jaccardSimilarity(goalSetA, goalSetB);
  totalSimilarity += goalSim * weights.goals;
  totalWeight += weights.goals;

  return totalWeight > 0 ? totalSimilarity / totalWeight : 0;
}

/**
 * Advanced similarity calculation with decay factor
 * Apply time decay to reduce impact of older interactions
 */
export function timeDecayedSimilarity(
  similarity: number,
  daysSince: number,
  decayFactor: number = 0.95
): number {
  return similarity * Math.pow(decayFactor, daysSince);
}

/**
 * Calculate demographic similarity between users
 * Used for demographic-based recommendations
 */
export interface UserDemographics {
  age?: number;
  gender?: string;
  location?: string;
  experience: string;
  goals: string[];
  equipment: string[];
}

export function demographicSimilarity(
  userA: UserDemographics,
  userB: UserDemographics
): number {
  let similarities: number[] = [];

  // Age similarity
  if (userA.age && userB.age) {
    const ageDiff = Math.abs(userA.age - userB.age);
    const ageSim = Math.max(0, 1 - ageDiff / 50); // Normalize by 50 years
    similarities.push(ageSim);
  }

  // Gender similarity
  if (userA.gender && userB.gender) {
    similarities.push(userA.gender === userB.gender ? 1 : 0);
  }

  // Location similarity
  if (userA.location && userB.location) {
    similarities.push(userA.location === userB.location ? 1 : 0);
  }

  // Experience similarity
  const experienceLevels = ['beginner', 'novice', 'intermediate', 'advanced', 'expert'];
  const experienceA = experienceLevels.indexOf(userA.experience);
  const experienceB = experienceLevels.indexOf(userB.experience);
  const experienceDiff = Math.abs(experienceA - experienceB);
  const experienceSim = Math.max(0, 1 - experienceDiff / 4);
  similarities.push(experienceSim);

  // Goals similarity
  const goalSetA = new Set(userA.goals);
  const goalSetB = new Set(userB.goals);
  const goalSim = jaccardSimilarity(goalSetA, goalSetB);
  similarities.push(goalSim);

  // Equipment similarity
  const equipmentSetA = new Set(userA.equipment);
  const equipmentSetB = new Set(userB.equipment);
  const equipmentSim = jaccardSimilarity(equipmentSetA, equipmentSetB);
  similarities.push(equipmentSim);

  // Return average similarity
  return similarities.length > 0 
    ? similarities.reduce((a, b) => a + b, 0) / similarities.length 
    : 0;
}

/**
 * Fuzzy string matching for search functionality
 * Levenshtein distance with normalization
 */
export function fuzzyStringMatch(strA: string, strB: string): number {
  const a = strA.toLowerCase().trim();
  const b = strB.toLowerCase().trim();

  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const matrix: number[][] = [];
  const aLen = a.length;
  const bLen = b.length;

  // Initialize matrix
  for (let i = 0; i <= aLen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bLen; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const maxLen = Math.max(aLen, bLen);
  const distance = matrix[aLen][bLen];
  
  return (maxLen - distance) / maxLen;
}

/**
 * N-gram similarity for partial string matching
 * Useful for search autocomplete and typo tolerance
 */
export function nGramSimilarity(strA: string, strB: string, n: number = 2): number {
  const a = strA.toLowerCase().trim();
  const b = strB.toLowerCase().trim();

  if (a === b) return 1;
  if (a.length < n || b.length < n) return 0;

  const nGramsA = new Set<string>();
  const nGramsB = new Set<string>();

  // Generate n-grams for string A
  for (let i = 0; i <= a.length - n; i++) {
    nGramsA.add(a.substring(i, i + n));
  }

  // Generate n-grams for string B
  for (let i = 0; i <= b.length - n; i++) {
    nGramsB.add(b.substring(i, i + n));
  }

  return jaccardSimilarity(nGramsA, nGramsB);
}