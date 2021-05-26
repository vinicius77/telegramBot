require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ObjectsToCsv = require('objects-to-csv');
const path = require('path');
const fs = require('fs');
const fastcsv = require('fast-csv');

// Mock Data
const cryptocurrencyNames = [
  { name: 'Litecoin LTC', mentions: 0 },
  { name: 'Ethereum ETH', mentions: 0 },
  { name: 'Polkadot DOT', mentions: 0 },
  { name: 'Cardano ADA', mentions: 0 },
  { name: 'Bitcoin BTC', mentions: 0 },
  { name: 'Stellar XLM', mentions: 0 },
  { name: 'Chainlink LINK', mentions: 0 },
  { name: 'Tether USDT', mentions: 0 },
  { name: 'Monero XMR', mentions: 0 },
  { name: 'BinanceCoin BNB', mentions: 0 },
  { name: 'Dogecoin DOGE', mentions: 0 },
];

// Creates the path where the CSV file will be stored under the cryptocurrency name
const createCSVPath = (data) => {
  // Captalized given some CSV format issues
  const { Name, Ticker } = data;

  return path.join(__dirname, `./csv/${Name}(${Ticker}).csv`);
};

// This function creates one file for every cryptocurrency ticker
// only if they dont exist yet
// e.g. `./csv/dogecoin(doge).csv`
const createInitialCSVFiles = (data) => {
  const csvPath = createCSVPath(data[0]);
  fs.access(csvPath, fs.F_OK, async (error) => {
    // If there is an error it means there are no csv file yet
    if (error) {
      // data is an array containing an individual object (cryptocurrency)
      const csv = new ObjectsToCsv(data);
      // the path where the file will be stored
      await csv.toDisk(csvPath);
      return;
    }
  });
};

const main = () => {
  // creating the initial CSV files on start
  for (cryptoCurr of cryptocurrencyNames) {
    const { name, mentions } = cryptoCurr;
    const [currName, ticker] = name.split(' ');

    // standarizing data
    // Captalized given csv format issues
    const cryptoObj = {
      Name: currName.toLowerCase(),
      Ticker: ticker.toLowerCase(),
      Mentions: mentions,
    };

    // Creates the csv files for each ticker
    createInitialCSVFiles([cryptoObj]);
  }

  const bot = new TelegramBot(process.env.token, { polling: true });
};

main();
