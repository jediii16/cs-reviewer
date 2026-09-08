import type { LessonTopic, SubjectManifest } from '../types';
import { cs412TheoryTopics } from './terms';

export { cs412Terms, cs412TheoryTopics } from './terms';

const theoryTopics: LessonTopic[] = cs412TheoryTopics.map((topic) => ({
  id: topic.module,
  title: topic.title,
  description: 'Study each term from its definition, matching the format used in the exam.',
  sections: topic.subtopics.map((subtopic) => ({
    id: subtopic.id,
    title: subtopic.title,
    summary: 'Read the definition, then practice recalling the term in the left column.',
    terms: [...subtopic.entries],
    recallPrompt: subtopic.entries[0].definition,
    recallAnswer: subtopic.entries[0].term,
  })),
}));

const preprocessingTopic: LessonTopic = {
  id: 'preprocessing',
  title: 'Data Preprocessing Techniques',
  description: 'Formulas and step-by-step rules for all six problem types.',
  sections: [
    { id: 'equal-frequency-study', title: 'Equal-frequency binning', summary: 'Sort the data, then place the same requested number of values in each bin.', bullets: ['Bin depth means the number of values per bin.', 'Keep the original sorted order.', 'If values remain, put them in a smaller final bin.'], examples: ['For 4, 8, 15, 21, 21, 24 with depth 3: [4, 8, 15] | [21, 21, 24].'], recallPrompt: 'What does a bin depth of 4 mean?', recallAnswer: 'Each full bin contains four sorted values.' },
    { id: 'bin-means-study', title: 'Smoothing by bin means', summary: 'Replace every value in a bin with that bin’s arithmetic mean.', bullets: ['First create equal-frequency bins.', 'For each bin, add its values and divide by the count.', 'Repeat that mean for every position in the bin.'], examples: ['[4, 8, 15] has mean 9, so it becomes [9, 9, 9].'], recallPrompt: 'How do you smooth one bin by its mean?', recallAnswer: 'Compute the arithmetic mean and replace every value in that bin with it.' },
    { id: 'boundaries-study', title: 'Smoothing by bin boundaries', summary: 'Replace each value by the closest endpoint of its own bin.', bullets: ['The smallest value is the lower boundary.', 'The largest value is the upper boundary.', 'Compare each value’s distance to both; this reviewer sends exact ties to the lower boundary.'], examples: ['[4, 8, 15] becomes [4, 4, 15] because 8 is closer to 4 than 15.'], recallPrompt: 'Which two values are the boundaries of a bin?', recallAnswer: 'The smallest and largest values in that bin.' },
    { id: 'minmax-study', title: 'Min-max normalization', summary: 'Rescale a value from its old range to a chosen new range.', bullets: ['Formula: newMin + ((v − min) / (max − min)) × (newMax − newMin).', 'For [0, 1], this simplifies to (v − min) / (max − min).', 'Subtract first, divide by the old range, then scale to the new range.'], examples: ['For v=33 in [8,48]: (33−8)/(48−8)=25/40=0.625.'], recallPrompt: 'What is the min-max formula for a new range [0, 1]?', recallAnswer: '(v − min) / (max − min).' },
    { id: 'zscore-study', title: 'Z-score normalization', summary: 'Express how many standard deviations a value lies above or below the mean.', bullets: ['Formula: z = (v − mean) / standard deviation.', 'A positive result is above the mean; a negative result is below it.', 'Use the supplied population standard deviation unless the problem asks you to calculate one.'], examples: ['For v=74, mean=54, and SD=16: (74−54)/16=1.25.'], recallPrompt: 'What does a z-score of −2 mean?', recallAnswer: 'The value is two standard deviations below the mean.' },
    { id: 'decimal-study', title: 'Decimal scaling', summary: 'Move the decimal point until every absolute transformed value is less than 1.', bullets: ['Formula: v′ = v / 10ʲ.', 'Choose the smallest integer j that makes max(|v′|) < 1.', 'Use the largest absolute value when choosing j, including negative data.'], examples: ['For range [−986, 917], j=3; 547 becomes 0.547.'], recallPrompt: 'How is j chosen in decimal scaling?', recallAnswer: 'Use the smallest integer j that makes every transformed absolute value less than 1.' },
  ],
};

export const cs412Subject: SubjectManifest = {
  id: 'cs412', code: 'CS.412', title: 'Data Mining',
  description: 'Crossword-ready concepts and hands-on data preprocessing.',
  topics: [...theoryTopics, preprocessingTopic],
  mccumber: { goals: [], states: [], safeguards: [] },
};
