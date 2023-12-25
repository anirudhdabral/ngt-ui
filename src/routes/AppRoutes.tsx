import { Route, Routes } from "react-router-dom";
import { Header } from "../components/Header";
import { TableView } from "../pages/TableView";

export const AppRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<TableView />} />
      </Routes>
    </>
  );
};
