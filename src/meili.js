require("dotenv").config();
const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_MASTER_KEY
});

const indexName = process.env.MEILI_INDEX || "listings";

async function getIndex() {
  const index = await client.getOrCreateIndex(indexName, {
    primaryKey: "id"
  });

  await index.updateSearchableAttributes([
    "title",
    "description",
    "category",
    "tags",
    "city"
  ]);

  await index.updateFilterableAttributes([
    "city",
    "category",
    "price",
    "rating",
    "is_active"
  ]);

  await index.updateSortableAttributes([
    "price",
    "rating",
    "created_at"
  ]);

  return index;
}

module.exports = {
  client,
  getIndex
};
