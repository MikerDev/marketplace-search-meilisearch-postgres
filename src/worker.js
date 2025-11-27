require("dotenv").config();
const { createListenerClient, query } = require("./db");
const { getIndex } = require("./meili");

async function mapRowToDocument(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    tags: row.tags,
    city: row.city,
    price: row.price !== null ? Number(row.price) : null,
    rating: row.rating ? Number(row.rating) : null,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

async function startWorker() {
  const client = await createListenerClient();
  const index = await getIndex();

  await client.query("LISTEN listing_changes");
  console.log("Worker: listening on channel 'listing_changes'");

  client.on("notification", async (msg) => {
    try {
      const payload = JSON.parse(msg.payload);
      const { id, operation } = payload;

      if (operation === "DELETE") {
        console.log(`Worker: deleting document ${id} from MeiliSearch`);
        await index.deleteDocument(id);
        return;
      }

      const { rows } = await query("SELECT * FROM listings WHERE id = $1", [id]);

      if (!rows.length) {
        console.log(`Worker: no row found for id ${id}, skipping`);
        return;
      }

      const doc = await mapRowToDocument(rows[0]);
      console.log(`Worker: upserting document ${id} to MeiliSearch`);
      await index.addDocuments([doc]);
    } catch (err) {
      console.error("Worker error processing notification:", err);
    }
  });

  client.on("error", (err) => {
    console.error("Postgres listener error:", err);
  });
}

startWorker().catch((err) => {
  console.error("Worker failed to start:", err);
  process.exit(1);
});
