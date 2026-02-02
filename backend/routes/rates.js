const express = require('express');
const axios = require('axios');

const router = express.Router();

const NBP_BASE_URL = 'https://api.nbp.pl/api/exchangerates';

// Get current rates (Table A)
router.get('/current', async (req, res) => {
  try {
    const { code } = req.query;

    if (code) {
      // Single currency
      const response = await axios.get(`${NBP_BASE_URL}/rates/a/${code.toLowerCase()}/?format=json`);
      const rate = response.data.rates[0];
      res.json({
        code: code.toUpperCase(),
        currency: response.data.currency,
        mid: rate.mid,
        rate: rate.mid, // Also include 'rate' for backward compatibility
        effectiveDate: rate.effectiveDate
      });
    } else {
      // All rates from Table A
      const response = await axios.get(`${NBP_BASE_URL}/tables/a/?format=json`);
      const table = response.data[0];
      res.json({
        table: table.table,
        no: table.no,
        effectiveDate: table.effectiveDate,
        rates: table.rates.map(r => ({
          code: r.code,
          currency: r.currency,
          mid: r.mid,
          effectiveDate: r.effectiveDate || table.effectiveDate
        }))
      });
    }
  } catch (error) {
    console.error('Rates error:', error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Currency not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
  }
});

// Get historical rates
router.get('/history', async (req, res) => {
  try {
    const { code, days = 30 } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Currency code is required' });
    }

    const response = await axios.get(
      `${NBP_BASE_URL}/rates/a/${code.toLowerCase()}/last/${days}/?format=json`
    );

    res.json({
      code: code.toUpperCase(),
      currency: response.data.currency,
      rates: response.data.rates.map(r => ({
        effectiveDate: r.effectiveDate,
        mid: r.mid
      }))
    });
  } catch (error) {
    console.error('History error:', error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Currency not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch historical rates' });
    }
  }
});

// Get buy/sell rates (Table C)
router.get('/buy-sell', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Currency code is required' });
    }

    const response = await axios.get(`${NBP_BASE_URL}/rates/c/${code.toLowerCase()}/?format=json`);
    const rate = response.data.rates[0];
    res.json({
      code: code.toUpperCase(),
      bid: rate.bid,
      ask: rate.ask,
      effectiveDate: rate.effectiveDate
    });
  } catch (error) {
    console.error('Buy/sell rates error:', error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Currency not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch buy/sell rates' });
    }
  }
});

// Get available currencies (Table C - currencies with buy/sell rates)
router.get('/available', async (req, res) => {
  try {
    const response = await axios.get(`${NBP_BASE_URL}/tables/c/?format=json`);
    const table = response.data[0];
    res.json({
      currencies: table.rates.map(r => ({
        code: r.code,
        currency: r.currency
      }))
    });
  } catch (error) {
    console.error('Available currencies error:', error.message);
    res.status(500).json({ error: 'Failed to fetch available currencies' });
  }
});

module.exports = router;
