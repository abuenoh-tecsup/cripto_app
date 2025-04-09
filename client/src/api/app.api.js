import axios from "axios";

export const getAllCurrencies = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/app/api/currencies/"
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener las monedas:", error);
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/app/api/transactions/"
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener las monedas:", error);
    throw error;
  }
};

export const getCurrencyBySymbol = async (symbol) => {
  try {
    const currencies = await getAllCurrencies();

    if (!Array.isArray(currencies)) {
      console.error("La respuesta no es un arreglo");
      return null;
    }

    const currency = currencies.find((currency) => currency.symbol === symbol);

    if (!currency) {
      console.error(`Moneda con símbolo ${symbol} no encontrada`);
      return null;
    }

    return currency;
  } catch (error) {
    console.error("Error al obtener la moneda por symbol:", error);
    throw error;
  }
};

export const getAllWallets = async () => {
  try {
    const response = await axios.get("http://localhost:8000/app/api/wallets/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las wallets:", error);
    throw error;
  }
};

export const getWalletByCurrencyId = async (currencyId) => {
  try {
    const wallets = await getAllWallets();

    if (!Array.isArray(wallets)) {
      console.error("La respuesta no es un arreglo");
      return null;
    }

    const wallet = wallets.find((wallet) => wallet.currency === currencyId);

    if (!wallet) {
      console.error(`Wallet para la moneda con id ${currencyId} no encontrada`);
      return null;
    }

    return wallet;
  } catch (error) {
    console.error("Error al obtener la wallet por currency id:", error);
    throw error;
  }
};

export const createWallet = async (walletData) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/app/api/wallets/",
      walletData
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear la wallet:", error);
    throw error;
  }
};

export const updateWallet = async (walletId, walletData) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/app/api/wallets/${walletId}/`,
      walletData
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la wallet:", error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/app/api/transactions/",
      transactionData
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    throw error;
  }
};

export const getConversionRate = async (currency) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${currency.toLowerCase()}`
    );
    return response.data.tether[currency.toLowerCase()];
  } catch (error) {
    console.error("Error al obtener la tasa de conversión:", error);
    throw error;
  }
};

export const getConversionRatesFromUSDT = async (symbols) => {
  try {
    const vsCurrencies = symbols.map((s) => s.toLowerCase()).join(",");
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${vsCurrencies}`
    );

    const rates = response.data.tether;

    const formatted = {};
    for (const [symbol, rate] of Object.entries(rates)) {
      formatted[symbol.toUpperCase()] = rate;
    }

    return formatted;
  } catch (error) {
    console.error("Error al obtener tasas de conversión:", error);
    return {};
  }
};
