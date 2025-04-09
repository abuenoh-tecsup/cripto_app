import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DepositForm } from "./pages/DepositForm";
import { Home } from "./pages/Home";
import { Spot } from "./pages/Spot";
import { Nav } from "./components/Nav";

function App() {
    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path="/" element={<Navigate to="/home" />}></Route>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/deposit" element={<DepositForm />}></Route>
				<Route path="/spot/:symbol" element={<Spot />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
