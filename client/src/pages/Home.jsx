import { useState, useEffect } from "react";
import {
    getAllCurrencies,
    getAllTransactions,
    getAllWallets,
    getConversionRatesFromUSDT,
} from "../api/app.api";

export function Home() {
    const [currencies, setCurrencies] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [conversionRates, setConversionRates] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currenciesdata = await getAllCurrencies();
                setCurrencies(currenciesdata);

                const walletsData = await getAllWallets();
                const walletsDataWithDetails = walletsData.map((wallet) => {
                    const currency = currenciesdata.find(
                        (currency) => currency.id == wallet.currency
                    );
                    return {
                        ...wallet,
                        currency: currency
                            ? currency
                            : { symbol: "Unknown", name: "Unknown" },
                    };
                });
                setWallets(walletsDataWithDetails);

                // Obtener símbolos únicos que no sean USDT
                const uniqueSymbols = [
                    ...new Set(
                        walletsDataWithDetails
                            .map((w) => w.currency.symbol)
                            .filter((sym) => sym !== "USDT")
                    ),
                ];

                // Obtener tasas de conversión desde USDT
                const rates = await getConversionRatesFromUSDT(uniqueSymbols);
                setConversionRates(rates);

                const transactionsData = await getAllTransactions();
                const transactionsDataWithDetails = transactionsData.map(
                    (transaction) => {
                        const currencyFrom = currenciesdata.find(
                            (currency) =>
                                currency.id == transaction.currency_from
                        );
                        const currencyTo = currenciesdata.find(
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
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Calcular total estimado en USDT
    const totalUSDT = wallets.reduce((total, wallet) => {
        const symbol = wallet.currency.symbol;
        const balance = parseFloat(wallet.balance);

        if (symbol === "USDT") return total + balance;

        const rate = conversionRates[symbol];
        if (!rate) return total;

        return total + balance / rate;
    }, 0);

    return (
        <div className="grid grid-cols-5 grid-rows-5 gap-4 p-6 max-w-7xl mx-auto">
            {/* A: Total estimado */}
            <section className="col-span-3 row-span-1 bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 mb-2">
                    Resumen general
                </h1>
                <div className="flex items-baseline">
                    <p className="text-5xl font-semibold text-gray-600 mr-2">
                        {totalUSDT.toFixed(2)}
                    </p>
                    <p className="text-lg text-gray-500">USDT</p>
                </div>
            </section>

            {/* C: Monedas */}
            <section className="col-span-2 row-span-3 bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Monedas disponibles
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    {currencies.map((currency) => (
                        <div
                            key={currency.id}
                            className="bg-gray-50 cursor-pointer text-center border border-gray-200 rounded-xl p-3 hover:bg-red-800 hover:text-white transition-all duration-200"
                        >
                            <h3 className="font-bold text-inherit select-none">
                                {currency.symbol}
                            </h3>
                            <p className="text-sm text-inherit select-none">
                                {currency.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* B: Wallets */}
            <section className="col-span-3 row-span-4 bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Tus Wallets
                </h2>
                <div className="overflow-y-scroll max-h-96">
                    <div className="space-y-4">
                        {wallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="bg-white text-gray-800 rounded-xl p-4 border-b border-gray-200"
                            >
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold">
                                        {wallet.currency.symbol}
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {wallet.balance}{" "}
                                        {wallet.currency.symbol}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* D: Transacciones */}
            <section className="col-span-2 row-span-2 bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Últimas transacciones
                </h2>
                <div className="max-h-52 overflow-y-auto">
                    <ul>
                        {transactions.map((tx) => (
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
                </div>
            </section>
        </div>
    );
}
