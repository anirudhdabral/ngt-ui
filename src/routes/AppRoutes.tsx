import { Route, Routes } from "react-router-dom";
import { TableView } from "../pages/TableView";

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<TableView />} />
      </Routes>
    </>
  );
};
