const pool = require("../db.js")

class ProductController {
  async getAllProducts(req, res) {
    try {
      const { rows } = await pool.query("SELECT * FROM products;")
      res.json(rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

module.exports = new ProductController()
