require("dotenv").config();
const express = require("express");
const { query } = require("./db");
const { getIndex } = require("./meili");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/listings", async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      category,
      tags,
      city,
      price,
      rating,
      is_active
    } = req.body;

    const result = await query(
      `INSERT INTO listings
       (id, title, description, category, tags, city, price, rating, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         category = EXCLUDED.category,
         tags = EXCLUDED.tags,
         city = EXCLUDED.city,
         price = EXCLUDED.price,
         rating = EXCLUDED.rating,
         is_active = EXCLUDED.is_active
       RETURNING *`,
      [
        id,
        title,
        description,
        category,
        tags || [],
        city,
        price,
        rating,
        is_active ?? true
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const { q, city, category, min_price, max_price, sort } = req.query;

    const index = await getIndex();

    const filters = [];

    if (city) filters.push(`city = "${city}"`);
    if (category) filters.push(`category = "${category}"`);
    if (min_price) filters.push(`price >= ${Number(min_price)}`);
    if (max_price) filters.push(`price <= ${Number(max_price)}`);
    filters.push(`is_active = true`);

    const options = {
      filter: filters.length ? filters.join(" AND ") : undefined,
      limit: 20
    };

    if (sort === "price_asc") {
      options.sort = ["price:asc"];
    } else if (sort === "price_desc") {
      options.sort = ["price:desc"];
    } else if (sort === "rating_desc") {
      options.sort = ["rating:desc"];
    }

    const result = await index.search(q || "", options);
    res.json(result);
  } catch (err) {
    console.error("Error in /search:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
