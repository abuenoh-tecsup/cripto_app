import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getConversionRate,
  getCurrencyBySymbol,
  getWalletByCurrencyId,
  createWallet,
  updateWallet,
  createTransaction,
} from "../api/app.api";

export function DepositForm() {
  const [transactionType, setTransactionType] = useState("deposit"); // Cambiar 'buy' a 'deposit'
  const [conversionRate, setConversionRate] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const amount = watch("amount");
  const currencyFrom = watch("currency_from");

  useEffect(() => {
    async function fetchRate() {
      try {
        const rate = await getConversionRate("PEN");
        setConversionRate(rate);
        console.log("Factor de conversión obtenido");
      } catch (error) {
        console.error("Error al obtener la tasa de conversión", error);
      }
    }

    const fetchCurrency = async (symbol) => {
      try {
        const currencyData = await getCurrencyBySymbol(symbol);
        console.log(currencyData);
      } catch (error) {
        console.error("Error al obtener la moneda:", error);
      }
    };

    fetchRate();
    handleTransactionChange("deposit"); // Cambiar 'buy' a 'deposit'
  }, []);

  useEffect(() => {
    if (amount && !isNaN(amount) && conversionRate) {
      const calc =
        currencyFrom === "PEN"
          ? parseFloat(amount) / conversionRate
          : parseFloat(amount) * conversionRate;

      setValue("total_value", calc.toFixed(2));
    } else {
      setValue("total_value", "");
    }
  }, [amount, currencyFrom, conversionRate, setValue]);

  const handleTransactionChange = (type) => {
    setTransactionType(type);
    setValue("transactionType", type);
    setValue("currency_from", type === "deposit" ? "PEN" : "USDT");
    setValue("currency_to", type === "deposit" ? "USDT" : "PEN");
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const { currency_from, currency_to, total_value } = data;

      const currencyFrom = await getCurrencyBySymbol(currency_from);
      const currencyTo = await getCurrencyBySymbol(currency_to);

      if (!currencyFrom || !currencyTo) {
        console.error("Una de las monedas no fue encontrada.");
        return;
      }

      console.log("currencyFrom:", currencyFrom);
      console.log("currencyTo:", currencyTo);

      const targetCurrency =
        transactionType === "deposit" ? currencyTo : currencyFrom;
      const wallet = await getWalletByCurrencyId(targetCurrency.id);
      let updatedWallet = wallet;

      if (!wallet) {
        // Cuando NO EXISTE wallet
        if (transactionType === "withdrawal") {
          // Queremos RETIRAR cuando NO EXISTE wallet
          console.error(
            `No existe wallet de ${targetCurrency.symbol} para retirar.`
          );
          return;
        }
        // Queremos DEPOSITAR cuando NO EXISTE wallet
        const newWalletData = {
          currency: targetCurrency.id,
          balance: parseFloat(data.total_value),
        };
        updatedWallet = await createWallet(newWalletData);
        console.log(updatedWallet);
      } else {
        // Cuando SI EXISTE wallet
        console.log("Wallet encontrada", wallet);
        const newBalance =
          transactionType === "deposit"
            ? parseFloat(wallet.balance) + parseFloat(total_value)
            : parseFloat(wallet.balance) - parseFloat(total_value);

        if (newBalance < 0) {
          console.error("No hay suficiente balance para el retiro.");
          return;
        }

        const updatedData = {
          ...wallet,
          balance: newBalance,
        };
        updatedWallet = await updateWallet(wallet.id, updatedData);
        console.log("Wallet actualizada", updatedWallet);

        const transactionData = {
          transaction_type: transactionType.toUpperCase(), // Tipo de transacción: 'DEPOSIT' o 'WITHDRAWAL'
          amount: parseFloat(data.amount), // Monto en la moneda origen
          total_value: parseFloat(data.total_value), // Total en la moneda de destino
          currency_from: currencyFrom.id, // ID de la moneda de origen
          currency_to: currencyTo.id, // ID de la moneda de destino
          exchange_rate: conversionRate, // Tipo de cambio entre las monedas
          wallet: updatedWallet.id, // ID de la wallet asociada a la transacción
        };
        const createdTransaction = await createTransaction(transactionData);
        console.log("Transacción creada:", createdTransaction);
      }
    } catch {
      console.error("Error al procesar el formulario:", errors);
    }
  };

  return (
    <div className="container mx-auto p-8 w-2/3">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center space-y-4 max-w-md">
          <h1 className="text-4xl font-bold">
            {transactionType === "deposit"
              ? "Depositar USDT con PEN"
              : "Retirar USDT por PEN"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg"
        >
          {/* Botones */}
          <div className="flex mb-4">
            <button
              type="button"
              className={`flex-1 py-2 text-lg font-medium ${
                transactionType === "deposit"
                  ? "bg-red-800 text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded-l-md transition-all duration-300`}
              onClick={() => handleTransactionChange("deposit")}
            >
              Depositar
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-lg font-medium ${
                transactionType === "withdrawal"
                  ? "bg-red-800 text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded-r-md transition-all duration-300`}
              onClick={() => handleTransactionChange("withdrawal")} // Cambiar 'sell' a 'withdrawal'
            >
              Retirar
            </button>
          </div>

          {/* Campos ocultos */}
          <input type="hidden" {...register("transactionType")} />
          <input type="hidden" {...register("currency_from")} />
          <input type="hidden" {...register("currency_to")} />

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {transactionType === "deposit"
                ? "Cantidad de PEN"
                : "Cantidad de USDT"}{" "}
              {/* Cambiar 'buy'/'sell' a 'deposit'/'withdrawal' */}
            </label>
            <input
              type="number"
              step="any"
              {...register("amount", { required: "Este campo es obligatorio" })}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Ingrese cantidad"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          {/* Total value (calculado) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {transactionType === "deposit"
                ? "Cantidad de USDT"
                : "Cantidad de PEN"}{" "}
              {/* Cambiar 'buy'/'sell' a 'deposit'/'withdrawal' */}
            </label>
            <input
              type="number"
              step="any"
              {...register("total_value", { required: true })}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
              disabled
            />
          </div>

          {/* Tasa de conversión */}
          <div className="mb-4 text-sm text-gray-600">
            {conversionRate
              ? `Factor de conversión: 1 USDT = ${conversionRate} PEN`
              : "Cargando tasa de conversión..."}
          </div>

          <button
            type="submit"
            className="w-full bg-red-800 text-white p-2 rounded-md hover:bg-red-900 transition"
            disabled={!conversionRate}
          >
            {transactionType === "deposit" ? "Depositar USDT" : "Retirar USDT"}{" "}
            {/* Cambiar 'buy'/'sell' a 'deposit'/'withdrawal' */}
          </button>
        </form>
      </div>
    </div>
  );
}
