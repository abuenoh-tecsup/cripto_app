import { useEffect, useState } from "react";
import { getAllCurrencies } from "../api/app.api";

export function Home() {
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
    console.log("Page loaded");

    async function getCurrencies() {
        const res = await getAllCurrencies();
        setCurrencies(res.data);
        }
        getCurrencies();
    }, []);

    return (
        <>
            <h1 className="text-3xl font-bold underline bg-amber-400 w-full">
                Lista de criptos
            </h1>
            {currencies.map((currency) => (
                <div key={currency.id}>
                    <h1>{currency.symbol}</h1>
                    <p>{currency.name}</p>
                </div>
            ))}
        </>
    );
}
