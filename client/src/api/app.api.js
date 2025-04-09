import axios from "axios";

// Obtener todas las monedas
export const getAllCurrencies = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/app/api/currencies/"
    );
    return response.data; // Suponemos que la API devuelve un arreglo de monedas
  } catch (error) {
    console.error("Error al obtener las monedas:", error);
    throw error;
  }
};

// Obtener la moneda por su symbol
export const getCurrencyBySymbol = async (symbol) => {
  try {
    const currencies = await getAllCurrencies(); // Obtener todas las monedas

    if (!Array.isArray(currencies)) {
      console.error("La respuesta no es un arreglo");
      return null;
    }

    // Filtrar la moneda con el símbolo proporcionado
    const currency = currencies.find((currency) => currency.symbol === symbol);

    if (!currency) {
      console.error(`Moneda con símbolo ${symbol} no encontrada`);
      return null;
    }

    return currency; // Retornamos el objeto de la moneda encontrada
  } catch (error) {
    console.error("Error al obtener la moneda por symbol:", error);
    throw error;
  }
};

export const getAllWallets = async () => {
  try {
    const response = await axios.get("http://localhost:8000/app/api/wallets/");
    return response.data; // Suponemos que la API devuelve un arreglo de wallets
  } catch (error) {
    console.error("Error al obtener las wallets:", error);
    throw error;
  }
};

// Obtener la wallet por su currency id
export const getWalletByCurrencyId = async (currencyId) => {
  try {
    const wallets = await getAllWallets(); // Obtener todas las wallets

    if (!Array.isArray(wallets)) {
      console.error("La respuesta no es un arreglo");
      return null;
    }

    // Buscar la wallet cuyo currency.id coincida con el id proporcionado
    const wallet = wallets.find((wallet) => wallet.currency === currencyId);

    if (!wallet) {
      console.error(`Wallet para la moneda con id ${currencyId} no encontrada`);
      return null;
    }

    return wallet; // Retornamos la wallet encontrada
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
    return response.data; // La wallet recién creada
  } catch (error) {
    console.error("Error al crear la wallet:", error);
    throw error;
  }
};

// Actualizar una wallet existente
export const updateWallet = async (walletId, walletData) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/app/api/wallets/${walletId}/`,
      walletData
    );
    return response.data; // La wallet actualizada
  } catch (error) {
    console.error("Error al actualizar la wallet:", error);
    throw error;
  }
};


// Crear una transacción
export const createTransaction = async (transactionData) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/app/api/transactions/",
      transactionData
    );
    return response.data; // La transacción recién creada
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    throw error;
  }
};

// Función para obtener la tasa de conversión
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
