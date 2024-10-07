import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import styles from "./purchases.module.scss";
import { useDispatch, useSelector } from "react-redux";
import useGet from "../../services/useGet";
import { DateTemplate } from "../../utils/templates/dateTemplate";
import { authorTemplate } from "../../utils/templates/authorTmeplate";
import LoadingOverlay from "../../components/Modals/LoadingOverlay";

function Purchases() {
  const userDetails = useSelector((state) => state.user.userDetails);
  const { getData, isLoading, success } = useGet(
    `/purchase/user/${userDetails.id}`
  );
  const [purchases, setPurchases] = useState([]);
  const dispatch = useDispatch();

  const handleFetchData = async () => {
    await getData(true);
  };
  useEffect(() => {
    if (success) {
      setPurchases(success?.data);
    } else {
      handleFetchData();
    }
  }, [success, dispatch]);
  return (
    <div className={styles.container}>
      {isLoading && <LoadingOverlay/>}
      <h1>Content Purchases</h1>
      <DataTable
        value={purchases}
        className={styles.dataTable}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
        emptyMessage="No List found."
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
      >
        <Column field="content.title" header="Title"></Column>
        <Column field="content.description" header="Description"></Column>
        <Column body={authorTemplate} header="Author"></Column>
        <Column field="content.amount" header="Amount"></Column>
        <Column body={DateTemplate} header="Payment Date"></Column>
      </DataTable>
    </div>
  );
}

export default Purchases;
