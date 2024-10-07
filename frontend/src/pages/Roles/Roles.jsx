import React, { useEffect, useState } from "react";
import styles from "./roles.module.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch} from "react-redux";
import useGet from "../../services/useGet";
import LoadingOverlay from "../../components/Modals/LoadingOverlay";
import Switch from "react-switch";
import usePut from "../../services/usePut";

function Roles() {
  const { getData, isLoading, success } = useGet("/user/all");
  const {putData}=usePut("/author/access")
  const [users,setUsers] = useState([]);
  const dispatch = useDispatch();

  const handleFetchData = async () => {
    await getData(true);
  };

  useEffect(() => {
    if (success) {
      const filteredUsers=success?.data.filter(user=>user.role.name==="author");
      setUsers(filteredUsers);
    } else {
      handleFetchData();
    }
  }, [success, dispatch]);

  const handleAccess=async (user)=>{
    await putData({id:user._id},true);
    handleFetchData();
  }

  const actionTemplate=(rowData)=>{
    return (
      <div className={styles.buttonDiv}>
        <Switch checked={rowData?.status==="verified"} disabled={rowData?.status==="verified"} onChange={()=>handleAccess(rowData)}></Switch>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <h1>Roles management (author)</h1>
        {isLoading && <LoadingOverlay />}
        <DataTable
            value={users}
            className={styles.dataTable}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
            emptyMessage="No List found."
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 30]}
        >
            <Column field="firstName" header="FirstName" sortable></Column>
            <Column field="lastName" header="LastName" sortable></Column>
            <Column body={actionTemplate} header="Access Actions" sortable></Column>
        </DataTable>
    </div>
  );
}

export default Roles;
