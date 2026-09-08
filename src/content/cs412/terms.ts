import type { TheoryModule, TheoryTerm } from '../types';

export interface CS412StudyEntry { term: string; definition: string }
export interface CS412StudySubtopic { id: string; title: string; entries: readonly CS412StudyEntry[] }
export interface CS412TheoryTopic { module: TheoryModule; title: string; subtopics: readonly CS412StudySubtopic[] }

const entry = (term: string, definition: string): CS412StudyEntry => ({ term, definition });

export const cs412TheoryTopics: readonly CS412TheoryTopic[] = [
  {
    module: 'introduction', title: 'INTRODUCTION TO DATA MINING AND KNOWLEDGE DISCOVERY', subtopics: [
      { id: 'what-is-data-mining', title: 'WHAT IS DATA MINING?', entries: [
        entry('Data Mining', 'It is the process of sorting through large data sets to identify patterns and relationships that can help solve business problems through data analysis.'),
      ] },
      { id: 'uses-of-data-mining', title: 'USES OF DATA MINING', entries: [
        entry('Telecommunications and Media', 'Telecommunication companies can use customer data to predict customer behavior and offer targeted ads and campaigns.'),
        entry('Insurance', 'Insurance companies can create complex models for detecting fraudulent claims, risk management, and customer compliance.'),
        entry('Finance', 'Financial companies makes use of data mining for better market risk evaluation and maximize stock market returns.'),
        entry('Retail', 'Supermarkets use joint purchasing patterns to identify product associations and decide how to place them in aisles and shelves.'),
        entry('Healthcare', 'Data mining helps doctors create more accurate diagnoses using patient medical history, physical examination results, medications, and treatment patterns.'),
        entry('Manufacturing', 'Implement just-in-time fulfillment by predicting when new supplies should be ordered or when equipment is likely to fail.'),
      ] },
      { id: 'common-data-mining-techniques', title: 'COMMON DATA MINING TECHNIQUES / TYPES OF DATA MINING', entries: [
        entry('Classification', 'It is a process in which data points from large data sets are assigned to categories based on how they’re being used.'),
        entry('Clustering', 'It refers to the process of grouping a series of different data points based on their characteristics.'),
        entry('Regression', 'It is used to identify and analyze the relationship between variables because of the presence of the other factor.'),
        entry('Prediction', 'It examine data sets to find patterns and trends, then calculate the probabilities of a future outcome.'),
        entry('Association Rules', 'They are used to find correlations, or associations, between points in a data set.'),
      ] },
    ],
  },
  {
    module: 'crisp-dm', title: 'CRISP-DM', subtopics: [
      { id: 'crisp-dm-overview', title: 'CRISP-DM', entries: [
        entry('CRISP-DM', 'CRoss Industry Standard Process for Data Mining. It is a process model that serves as the base for a data science process. As a methodology, it includes descriptions of the typical phases of a project, the tasks involved with each phase, and an explanation of the relationships between these tasks.'),
      ] },
      { id: 'six-step-process', title: '6-STEP PROCESS', entries: [
        entry('Business/Project Understanding', 'Comprehensive data mining projects start by first identifying project objectives and scope. The business stakeholders will ask a question or state a problem that data mining can answer or solve.'),
        entry('Data Understanding', 'Relevant data is then collected once the business problem is understood. The data to be used in the project may come from multiple source.'),
        entry('Data Preparation', 'It involves preparing the final data set, which includes all the relevant data needed to answer the business question. Stakeholders will identify the dimensions and variables to explore and prepare the final data set for model creation.'),
        entry('Modelling', 'In this phase, the analyst selects the appropriate modeling techniques for the given data. These techniques can include clustering, predictive models, classification, estimation, or a combination.'),
        entry('Evaluation', 'After creating the models, the analyst need to test them and measure their success at answering the question identified in the first phase. This phase is designed to allow the analyst to look at the progress so far and ensure it’s on the right track for meeting the business goals.'),
        entry('Deployment', 'It can take place within the organization, be shared with customers, or be used to generate a report for stakeholders to prove its reliability.'),
      ] },
    ],
  },
  {
    module: 'warehousing', title: 'DATA WAREHOUSING', subtopics: [
      { id: 'storage-systems', title: 'DATA STORAGE SYSTEMS', entries: [
        entry('Data Warehouse', 'Storage of information over time by a business or other organization. It becomes a library of historical data that can be retrieved and analyzed for decision-making.'),
        entry('Database', 'A transactional system that monitors and updates real-time data in order to have only the most recent data available.'),
        entry('Data Lake', 'Holds raw data of which the goal has not yet been determined. It is primarily used by data scientists and is more easily accessible and easier to update.'),
        entry('Data Mart', 'A smaller (subset) and faster version of a data warehouse that collects data from a small number of sources and focuses on one subject area.'),
      ] },
      { id: 'warehouse-operations', title: 'DATA WAREHOUSE OPERATIONS', entries: [
        entry('Data Cleaning', 'Inconsistencies are removed. Also, noisy data containing errors are also rectified.'),
        entry('Data Refresh', 'Data is refreshed by broadcasting the data from multiple sources and updating it on timely basis.'),
        entry('Extraction of Data', 'Data obtained after cleaning and refresh is still unstructured and unorganized. It is organized to enable the user to extract and retrieve relevant data.'),
        entry('Transformation of Data', 'Data is organized into a structure similar to that of the data warehouse because heterogeneous databases may have different native structures.'),
        entry('Data Loading', 'Responsible for loading the data to its respective target data repository, which might include databases, data marts, data warehouses, etc.'),
      ] },
      { id: 'warehouse-layers', title: 'LAYERS OF DATA WAREHOUSE ARCHITECTURE', entries: [
        entry('Source Layer', 'Feeds data into the warehouse. Sources can include point-of-sale, marketing automation, CRM, or ERP systems.'),
        entry('Staging Layer', 'A landing area for data from the source where data is ingested without applying business logic or transformations.'),
        entry('Warehouse Layer', 'Where all of the data is stored. The data is subject-oriented, integrated, time-variant, and non-volatile.'),
        entry('Consumption Layer', 'The analytics layer where data is modeled for consumption using analytics tools, data analysts, data scientists, and business users.'),
      ] },
    ],
  },
] as const;

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const crosswordTerms: TheoryTerm[] = [];
const seen = new Set<string>();

for (const topic of cs412TheoryTopics) {
  for (const subtopic of topic.subtopics) {
    for (const item of subtopic.entries) {
      const answer = item.term.toUpperCase().replace('CRISP-DM', 'CRISP DM');
      const identity = `${topic.module}:${answer}`;
      if (seen.has(identity)) continue;
      seen.add(identity);
      crosswordTerms.push({ id: `${topic.module}-${slug(item.term)}`, module: topic.module, answer, displayAnswer: item.term, clue: item.definition });
    }
  }
}

export const cs412Terms: readonly TheoryTerm[] = crosswordTerms;
