# Marketplace Search with PostgreSQL + MeiliSearch

This repository contains a minimal example of a marketplace-style search architecture using:

- PostgreSQL as the source of truth
- MeiliSearch as the search engine
- Node.js (Express) as the API layer
- A background worker to keep the search index in sync using Postgres LISTEN/NOTIFY

It accompanies the article:
**"How to Design a Scalable Marketplace Search Architecture Using MeiliSearch and PostgreSQL"**

## Prerequisites

- Node.js (v18+ recommended)
- Docker and docker-compose

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/marketplace-search-meilisearch-postgres.git
   cd marketplace-search-meilisearch-postgres
   ```

2. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

3. Start Postgres and MeiliSearch:

   ```bash
   docker-compose up -d
   ```

4. Initialize the database:

   ```bash
   cat sql/schema.sql | docker exec -i marketplace_postgres psql -U postgres -d marketplace
   cat sql/seed.sql   | docker exec -i marketplace_postgres psql -U postgres -d marketplace
   ```

5. Install dependencies:

   ```bash
   npm install
   ```

6. Start the worker in one terminal:

   ```bash
   npm run worker
   ```

7. Start the API server in another terminal:

   ```bash
   npm run dev
   ```

8. Test the API:

   - Health check:

     ```bash
     curl http://localhost:3000/health
     ```

   - Search (example):

     ```bash
     curl "http://localhost:3000/search?q=saree&city=Hyderabad"
     ```

## Notes

- All writes go to PostgreSQL. The worker listens for changes and updates MeiliSearch.
- MeiliSearch is treated purely as a search index, not a primary store.
- This is a minimal example intended for learning and demonstration; in production, you would add authentication, stricter validation, logging, metrics, and better error handling.

Maintained by: Nivedha Palani
GitHub: https://github.com/nivedhapalani96
