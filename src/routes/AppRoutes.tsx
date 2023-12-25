import { Route, Routes } from "react-router-dom";
import { TableView } from "../pages/TableView";
import { Header } from "../components/Header";

export const AppRoutes = () => {
  return (
    <>
    <Header/>
      <Routes>
        <Route path="/" element={<TableView />} />
      </Routes>
    </>
    
  );
};
