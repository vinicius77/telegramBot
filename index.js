require('dotenv').config();
const ObjectsToCsv = require('objects-to-csv');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');
const bot = new TelegramBot(process.env.token, { polling: true });
const fastcsv = require('fast-csv');
/**bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  if (match[1].toLowerCase().includes('kako')) {
    bot.sendMessage(chatId, 'That is it');
  } else {
    bot.sendMessage(chatId, resp);
  }
});*/
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

const createAndWriteCSVFile = (data) => {
  const csvPath = path.join(
    __dirname,
    `./csv/${data[0].name}(${data[0].ticker}).csv`
  );

  // if the ticker files don't exist yet create them
  fs.access(csvPath, fs.F_OK, async (error) => {
    if (error) {
      // Save File To Path
      const csv = new ObjectsToCsv(data);
      await csv.toDisk(csvPath);
      return;
    } else {
      //const ws = fs.createWriteStream(csvPath);
      //const res = fastcsv.write(data, { headers: true }).pipe(ws);
      //console.log(res.data);
      // Should increase its mentions by one
      // Load the CSV records from the file:
    }
  });
};

for (cryptoCurr of cryptocurrencyNames) {
  // destructuring the cryptoCurrency object
  const { name, mentions } = cryptoCurr;
  // destructuring name and ticker
  const [currName, ticker] = name.split(' ');

  // standarizing data
  const cryptoObj = {
    name: currName.toLowerCase(),
    ticker: ticker.toLowerCase(),
    mentions,
  };

  // Creates the csv files for each ticker
  createAndWriteCSVFile([cryptoObj]);
}

bot.on('message', async (msg) => {
  const chatID = msg.chat.id;

  for (cryptoCurr of cryptocurrencyNames) {
    // destructuring name and ticker
    const [currName, ticker] = cryptoCurr.name.split(' ');
    const { mentions } = cryptoCurr;

    console.log(currName, ticker, mentions);

    // helper function
    //const isIncluded = (tickerOrName) => {
    //  return msg.text.toLowerCase().includes(tickerOrName.toLowerCase());
    //};

    //if (isIncluded(currName) || isIncluded(ticker)) {
    //console.log(currName, ticker);

    // TODO
    // When it is included it should check in the csv file
    // if the ticker already exists
    // if not, creates a new entry using the Ticker (to avoid duplicated)
    // else should increase the value for example BTC: 22 after the mention should be 23
    //  console.log('Yeah');
    //} else {
    // console.log('Should Do Nothing');
    //}
  }
  bot.sendMessage(chatID, 'not include');
});
