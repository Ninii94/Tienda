const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-7806538510261573-072923-e25f3169c0b53591b2af7d4f13bb81ec-613424466'
});

app.post('/create_preference', async (req, res) => {
  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: req.body.items,
        payer: req.body.payer,
        back_urls: {
          "success": "http://localhost:3000/success",
          "failure": "http://localhost:3000/failure",
          "pending": "http://localhost:3000/pending"
        },
        auto_return: "approved",
      }
    });

    res.json({
      id: result.id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});