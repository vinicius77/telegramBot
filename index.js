require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.token, { polling: true });

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
  'Litecoin LTC',
  'Ethereum ETH',
  'Polkadot DOT',
  'Cardano ADA',
  'Bitcoin BTC',
  'Stellar XLM',
  'Chainlink LINK',
  'Tether USDT',
  'Monero XMR',
  'BinanceCoin BNB',
  'Dogecoin DOGE',
];

bot.on('message', async (msg) => {
  const chatID = msg.chat.id;

  for (cryptoCurr of cryptocurrencyNames) {
    // destructuring name and ticker
    const [name, ticker] = cryptoCurr.split(' ');

    // helper function
    const isIncluded = (tickerOrName) => {
      return msg.text.toLowerCase().includes(tickerOrName.toLowerCase());
    };

    if (isIncluded(name) || isIncluded(ticker)) {
      console.log(name, ticker);

      // TODO
      // When it is included it should check in the csv file
      // if the ticker already exists
      // if not, creates a new entry using the Ticker (to avoid duplicated)
      // else should increase the value for example BTC: 22 after the mention should be 23
      console.log('Yeah');
    } else {
      console.log('Should Do Nothing');
    }
  }
  bot.sendMessage(chatID, 'not include');
});
