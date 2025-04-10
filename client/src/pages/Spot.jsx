import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import TradingViewWidget from "../components/TradingViewWidget";
import toast from "react-hot-toast";
import {
    getConversionRate,
    getAllCurrencies,
    getWalletByCurrencyId,
    updateWallet,
    createTransaction,
    getAllTransactions,
    createWallet,
} from "../api/app.api";

export function Spot() {
    const params = useParams();
    const [currency, setCurrency] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [transactionType, setTransactionType] = useState("buy");
    const [conversionRate, setConversionRate] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [walletBalance, setWalletBalance] = useState(null);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const amount = watch("amount");
    const currencyFrom = watch("currency_from");

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const currenciesData = await getAllCurrencies();
                setCurrencies(currenciesData);
                toast.success("Monedas obtenidas correctamente");
                console.log("Monedas obtenidas:", currenciesData);

                const selectedCurrency = currenciesData.find(
                    (curr) => curr.symbol === params.symbol
                );
                setCurrency(selectedCurrency);
                toast.success(`Moneda seleccionada: ${selectedCurrency.symbol}`);
                console.log("Moneda seleccionada:", selectedCurrency);
            } catch (error) {
                toast.error("Error al obtener las monedas");
                console.error("Error al obtener las monedas:", error);
            }
        };

        fetchCurrencies();

        handleTransactionChange("buy");
    }, [params.symbol]);

    useEffect(() => {
        if (currencies) {
            const fetchTransactions = async () => {
                try {
                    const transactionsData = await getAllTransactions();
                    const transactionsDataWithDetails = transactionsData.map(
                        (transaction) => {
                            const currencyFrom = currencies.find(
                                (currency) =>
                                    currency.id == transaction.currency_from
                            );
                            const currencyTo = currencies.find(
                                (currency) =>
                                    currency.id == transaction.currency_to
                            );
                            return {
                                ...transaction,
                                currency_from: currencyFrom
                                    ? currencyFrom
                                    : { symbol: "Unknown" },
                                currency_to: currencyTo
                                    ? currencyTo
                                    : { symbol: "Unknown" },
                            };
                        }
                    );
                    setTransactions(transactionsDataWithDetails);
                    toast.success("Transacciones cargadas correctamente");
                    console.log(transactions);
                } catch (error) {
                    toast.error("Error al obtener las transacciones");
                    console.error("Error al obtener las transacciones:", error);
                }
            };
            fetchTransactions();
        }
    }, [currencies]);

    useEffect(() => {
        if (currency) {
            const fetchRate = async (symbol) => {
                try {
                    const rate = await getConversionRate(symbol);
                    setConversionRate(rate);
                    toast.success("Tasa de conversión obtenida correctamente");
                    console.log("Factor de conversión obtenido", rate);
                } catch (error) {
                    toast.error("Error al obtener la tasa de conversión");
                    console.error("Error al obtener la tasa de conversión", error);
                }
            };
            fetchRate(currency.symbol);
        }
    }, [currency]);

    useEffect(() => {
        if (currencyFrom) {
            const fetchWalletBalance = async () => {
                try {
                    const currencyData = currencies.find(
                        (c) => c.symbol === currencyFrom
                    );
                    if (currencyData) {
                        const wallet = await getWalletByCurrencyId(currencyData.id);
                        if (wallet) {
                            setWalletBalance(wallet.balance);
                        } else {
                            setWalletBalance(0);
                        }
                    }
                } catch (error) {
                    console.error("Error al obtener el balance de la wallet:", error);
                    setWalletBalance(0);
                }
            };

            fetchWalletBalance();
        }
    }, [currencyFrom, currencies]);

    useEffect(() => {
        if (amount && !isNaN(amount) && conversionRate) {
            const calc =
                currencyFrom === params.symbol
                    ? parseFloat(amount) / conversionRate
                    : parseFloat(amount) * conversionRate;

            setValue("total_value", calc.toFixed(8));
        } else {
            setValue("total_value", "");
        }
    }, [amount, currencyFrom, conversionRate, setValue]);

    const handleTransactionChange = (type) => {
        setTransactionType(type);
        setValue("transactionType", type);
        setValue("currency_from", type === "buy" ? "USDT" : params.symbol);
        setValue("currency_to", type === "buy" ? params.symbol : "USDT");
    };

    const onSubmit = async (data) => {
        try {
            console.log("Datos del formulario:", data);
            const { currency_from, currency_to, amount, total_value } = data;

            const currencyFrom = currencies.find(
                (c) => c.symbol === currency_from
            );
            const currencyTo = currencies.find((c) => c.symbol === currency_to);

            if (!currencyFrom || !currencyTo) {
                toast.error("Una de las monedas no fue encontrada.");
                return;
            }

            console.log(currencyFrom);
            console.log(currencyTo);

            const walletFrom = await getWalletByCurrencyId(currencyFrom.id);
            const walletTo = await getWalletByCurrencyId(currencyTo.id);

            console.log("WalletFrom", walletFrom);
            console.log("WalletTo", walletTo);

            if (!walletFrom) {
                toast.error(
                    `No tienes una wallet de ${currencyFrom.symbol} para operar.`
                );
                return;
            }

            if (parseFloat(walletFrom.balance) < parseFloat(amount)) {
                toast.error("Saldo insuficiente en la wallet de origen.");
                return;
            }

            let updatedWalletTo = walletTo;
            if (!walletTo) {
                const newWalletData = {
                    currency: currencyTo.id,
                    balance: parseFloat(total_value),
                };
                updatedWalletTo = await createWallet(newWalletData);
                toast.success("Wallet destino creada correctamente");
                console.log("Wallet destino creada:", updatedWalletTo);
            } else {
                const updatedBalanceTo =
                    parseFloat(walletTo.balance) + parseFloat(total_value);
                updatedWalletTo = await updateWallet(walletTo.id, {
                    ...walletTo,
                    balance: updatedBalanceTo,
                });
                toast.success("Wallet destino actualizada correctamente");
                console.log("Wallet destino actualizada:", updatedWalletTo);
            }

            const updatedBalanceFrom =
                parseFloat(walletFrom.balance) - parseFloat(amount);
            const updatedWalletFrom = await updateWallet(walletFrom.id, {
                ...walletFrom,
                balance: updatedBalanceFrom,
            });
            toast.success("Wallet origen actualizada correctamente");
            console.log("Wallet origen actualizada:", updatedWalletFrom);

            const transactionData = {
                transaction_type: "CONVERSION",
                amount: parseFloat(amount),
                total_value: parseFloat(total_value),
                currency_from: currencyFrom.id,
                currency_to: currencyTo.id,
                exchange_rate: conversionRate,
                wallet: updatedWalletTo.id,
            };

            const createdTransaction = await createTransaction(transactionData);
            toast.success("Transacción creada correctamente");
            console.log("Transacción creada:", createdTransaction);

        } catch (error) {
            toast.error("Error al procesar el formulario");
            console.error("Error al procesar el formulario:", error);
        }
    };

    return (
        <div className="grid grid-cols-7 grid-rows-4 gap-4 p-6 w-10/12 mx-auto grow">
            {/* A: Lista de monedas */}
            <section className="col-span-1 row-span-4 bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Monedas
                </h2>
                <ul className="space-y-2">
                    {currencies
                        .filter(
                            (currency) =>
                                currency.symbol !== "USDT" &&
                                currency.symbol !== "PEN"
                        )
                        .map((currency) => (
                            <li
                                key={currency.id}
                                onClick={() => {
                                    navigate(`/spot/${currency.symbol}`);
                                }}
                                className={`cursor-pointer p-2 rounded-md border hover:bg-red-800 hover:text-white transition ${
                                    params.symbol === currency.symbol
                                        ? "bg-red-100 border-red-500"
                                        : "bg-white"
                                }`}
                            >
                                <strong>{currency.symbol}</strong> -{" "}
                                {currency.name}
                            </li>
                        ))}
                </ul>
            </section>

            {/* B: Gráfico de moneda */}
            <section className="flex flex-col col-span-4 row-span-3 bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Gráfico - {params.symbol}
                </h2>
                <div className="flex items-center justify-center text-gray-400 grow">
                    <div className="w-full h-full overflow-hidden">
                        <TradingViewWidget symbol={params.symbol} />
                    </div>
                </div>
            </section>

            {/* C: Transacciones */}
            <section className="flex flex-col col-start-2 col-span-4 row-start-4 bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Transacciones - {params.symbol}
                </h2>
                <ul className="divide-y divide-gray-200 grow overflow-auto max-h-30">
                    {transactions
                        .filter(
                            (tx) =>
                                tx.currency_from.symbol === params.symbol ||
                                tx.currency_to.symbol === params.symbol
                        )
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((tx) => (
                            <li
                                key={tx.id}
                                className="py-3 border-b border-gray-200"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-gray-700">
                                        {tx.transaction_type}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(tx.date).toLocaleString()}
                                    </span>
                                </div>
                                <div className="text-gray-600">
                                    {tx.amount} {tx.currency_from.symbol} →{" "}
                                    {tx.total_value} {tx.currency_to.symbol}
                                </div>
                            </li>
                        ))}
                </ul>
            </section>

            {/* D: Formulario de compra/venta */}
            <section className="col-span-2 row-span-4 bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Comprar / Vender {params.symbol}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Botones */}
                    <div className="flex mb-4">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-lg font-medium ${
                                transactionType === "buy"
                                    ? "bg-red-800 text-white"
                                    : "bg-gray-200 text-gray-700"
                            } rounded-l-md transition-all duration-300`}
                            onClick={() => handleTransactionChange("buy")}
                        >
                            Comprar
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-lg font-medium ${
                                transactionType === "sell"
                                    ? "bg-red-800 text-white"
                                    : "bg-gray-200 text-gray-700"
                            } rounded-r-md transition-all duration-300`}
                            onClick={() => handleTransactionChange("sell")}
                        >
                            Vender
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {transactionType === "buy"
                                ? "Cantidad de USDT"
                                : `Cantidad de ${params.symbol}`}
                        </label>
                        <input
                            type="number"
                            step="any"
                            {...register("amount", {
                                required: "Este campo es obligatorio",
                            })}
                            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                            placeholder="Ingrese cantidad"
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-sm">
                                {errors.amount.message}
                            </p>
                        )}

                        {/* Mostrar balance debajo del input */}
                        {walletBalance !== null && (
                            <p className="mt-2 text-sm text-gray-600">
                                Balance disponible: {walletBalance}{" "}
                                {currencyFrom}
                            </p>
                        )}
                    </div>

                    {/* Total value (calculado) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {transactionType === "buy"
                                ? `Cantidad de ${params.symbol}`
                                : "Cantidad de USDT"}
                        </label>
                        <input
                            type="number"
                            step="any"
                            {...register("total_value", { required: true })}
                            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
                            disabled
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-800 text-white p-2 rounded-md hover:bg-red-900 transition"
                    >
                        {transactionType === "buy"
                            ? `Comprar ${params.symbol}`
                            : `Vender ${params.symbol}`}
                    </button>
                </form>
            </section>
        </div>
    );
}
