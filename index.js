require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ObjectsToCsv = require('objects-to-csv');
const path = require('path');
const fs = require('fs');
const createCSVWriter = require('csv-writer').createObjectCsvWriter;

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

// Helper Functions
const isIncluded = (tickerOrName, text) => {
  return text.toLowerCase().includes(tickerOrName.toLowerCase());
};

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
    } else {
      // TODO
      // When there is files already updates the harcoded array with the number of mentions because
      // if the system downs for any reason it will get back top zero and will overwrite the already
      // counted mentions
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

  // BOT config 🤖
  const bot = new TelegramBot(process.env.token, { polling: true });

  bot.on('message', async (msg) => {
    // For loop that goes through every ticker and compares if the
    // message sent includes it
    for (cryptoCurr of cryptocurrencyNames) {
      // destructuring name and ticker
      const [currName, ticker] = cryptoCurr.name.split(' ');
      const text = msg.text;

      if (isIncluded(currName, text) || isIncluded(ticker, text)) {
        // Increases the metions counter
        cryptoCurr.mentions += 1;
        const filePath = path.join(
          __dirname,
          `./csv/${currName.toLowerCase()}(${ticker.toLowerCase()}).csv`
        );

        const csvWriter = createCSVWriter({
          path: filePath,
          // mentions is the cell that will be updated
          // title is the equivalent of column name
          header: [
            {
              id: 'name',
              title: 'Name',
            },
            { id: 'ticker', title: 'Ticker' },
            { id: 'mentions', title: 'Mentions' },
            ,
          ],
        });
        // updating the cell "mentions" with the increased value
        const records = [
          {
            name: currName.toLowerCase(),
            ticker: ticker.toLowerCase(),
            mentions: cryptoCurr.mentions,
          },
        ];
        await csvWriter.writeRecords(records);
        return;
      }
    }
  });
};

main();
