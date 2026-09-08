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
      { id: 'data-warehouse', title: 'DATA WAREHOUSE', entries: [
        entry('Data Warehouse', 'It is storage of information over time by a business or other organization. New data is periodically added by people in various key departments. It becomes a library of historical data that can be retrieved and analyzed for decision-making. Key factors include defining critical information to the organization and identifying its sources. It is designed to supply real-time information. A data warehouse is designed as an archive of historical information.'),
      ] },
      { id: 'use-in-data-mining', title: 'USE IN DATA MINING', entries: [
        entry('Use of Data Warehouse in Data Mining', 'Businesses warehouse data primarily for data mining, looking for patterns of information that will help them improve their business processes. A good data warehousing system makes it easier for different departments within a company to access each other\'s data. Marketing team can assess the sales team\'s data in order to make decisions about how to adjust their sales campaigns.'),
      ] },
      { id: 'warehouse-vs-database', title: 'DATA WAREHOUSE VS. DATABASE', entries: [
        entry('Data Warehouse', 'It is programmed to aggregate structured data over time.'),
        entry('Database', 'It is a transactional system that monitors and updates real-time data in order to have only the most recent data available.'),
      ] },
      { id: 'warehouse-vs-lake', title: 'DATA WAREHOUSE VS. DATA LAKE', entries: [
        entry('Data Warehouse', 'It holds refined data that has been filtered to be used for a specific purpose. It is most often used by business professionals. It is more structured and any changes are more costly.'),
        entry('Data Lake', 'It holds raw data of which the goal has not yet been determined. It is primarily used by data scientists. It is more easily accessible and easier to update.'),
      ] },
      { id: 'warehouse-vs-mart', title: 'DATA WAREHOUSE VS. DATA MART', entries: [
        entry('Data Warehouse', 'It holds refined data that has been filtered to be used for a specific purpose. It is most often used by business professionals. It is more structured and any changes are more costly.'),
        entry('Data Mart', 'It is just a smaller (subset) and faster version of a data warehouse. It collects data from a small number of sources and focuses on one subject area. It focuses on one area for analytical purposes, such as a specific department within an organization. It is used to help make business decisions by helping with analysis and reporting.'),
      ] },
      { id: 'warehouse-operations', title: 'DATA WAREHOUSE OPERATIONS', entries: [
        entry('Data Warehouse Operations', 'Any data warehouse will consist of random data which will surely be in unstructured manner with a lot of unwanted and dirty data. To make this data structured and noise free, dirty data needs to be removed, converting data into useful information and can be achieved using certain data warehouse operations.'),
        entry('Data Cleaning', 'Inconsistencies are removed. Also, noisy data containing errors are also rectified.'),
        entry('Data Refresh', 'Data is refreshed by broadcasting the data from multiple sources and updating it on timely basis. This is done because, data inside data bases are updated every minute and to get this same data on data warehouse, the process of refreshing is performed.'),
        entry('Extraction of Data', 'Data obtained after cleaning and refresh is still unstructured and unorganized. To make it organized and enable user to extract and retrieve relevant data is done through data extraction process. This is helpful, if any user wants to mine the data.'),
        entry('Transformation of Data', 'Data obtained through heterogeneous data bases have native structure of their respective databases that might be different from that structure of data warehouse. So, transformation of data is done to organize data in the structure similar to that of the data warehouse.'),
        entry('Data Loading', 'It is responsible for loading the data to its respective target data repository that might include data bases, data marts data warehouses etc.'),
        entry('ETL', 'Extraction, Transformation, Loading.'),
      ] },
      { id: 'warehouse-architecture', title: 'DATA WAREHOUSE ARCHITECTURE', entries: [
        entry('Single-tier Architecture', 'Operational Data → Middleware → Reporting Tools / OLAP Tools.'),
        entry('Two-tier Architecture', 'Operational Data and External Data → ETL Tools → Data Warehouse → Data Marts → Reporting Tools / OLAP Tools / Data Mining Tools / What-if analysis tools.'),
        entry('Three-Tier Architecture', 'It has a top, middle, and bottom tier (source layer, the reconciled layer, and the data warehouse layer). It is suited for systems with long life cycles. An extra layer of review and analysis of the data is completed when changing data to ensure there have been no errors.'),
      ] },
      { id: 'warehouse-layers', title: 'LAYERS OF DATA WAREHOUSE ARCHITECTURE', entries: [
        entry('Source Layer', 'It feeds data into the warehouse. Point-of-sale, marketing automation, CRM, or ERP systems. It has a specific data format and may require a different data capture method based on that data format.'),
        entry('Staging Layer', 'It is a landing area for data from the source. It ingests data from the SOR without applying business logic or transformations. It is not used in production data analysis. Data in the staging area has yet to be cleansed, standardized, modeled, governed, and verified.'),
        entry('Warehouse Layer', 'It is where all of the data is stored. Warehouse data is now subject-oriented, integrated, time-variant, and non-volatile. It will have the physical schemas, tables, views, stored procedures, and functions needed to access the warehouse-modeled data.'),
        entry('Consumption Layer', 'It is the analytics layer, where you model data for consumption using analytics tools like ThoughtSpot, data analysts, data scientists, and business users.'),
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
