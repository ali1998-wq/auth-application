import React, { useEffect, useState } from "react";
import styles from "./permissions.module.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import useGet from "../../services/useGet";
import LoadingOverlay from "../../components/Modals/LoadingOverlay";
import {
  openContentModal,
  openPermissionModal,
} from "../../stateManagement/slices/modalslice";
import { setPermission } from "../../stateManagement/slices/permissionslice";
import Usepost from "../../services/Usepost";
import { toast } from "react-toastify";
import { setContentDetail } from "../../stateManagement/slices/contentDetailSlice";

function Permissions() {
  const userDetails = useSelector((state) => state.user.userDetails);
  const { getData, isLoading, success } = useGet(
    `${
      userDetails?.role === "admin"
        ? "/content/all"
        : `/content/author/${userDetails?.id}`
    }`
  );
  const { postData } = Usepost("/permission/delete");
  const { postData: postContentData } = Usepost("/content/delete");
  const [content, setContent] = useState([]);
  const dispatch = useDispatch();

  const handleFetchData = async () => {
    await getData(true);
  };

  useEffect(() => {
    if (success) {
      setContent(success?.data);
    } else {
      handleFetchData();
    }
  }, [success, dispatch]);

  const handleDelete = async (rowData) => {
    await postData({ id: rowData._id }, true);
    handleFetchData();
  };
  const actionTemplate = (rowData) => {
    return (
      <div className={styles.buttonDiv}>
        {!rowData?.permission && (
          <button
            onClick={() => {
              dispatch(
                setPermission({
                  content: rowData?._id,
                })
              );
              dispatch(openPermissionModal());
            }}
          >
            Create
          </button>
        )}
        <button
          onClick={() => {
            dispatch(
              setPermission({
                name: rowData?.permission?.name,
                content: rowData?.permission?.content,
                usersWithAccess: rowData?.permission?.usersWithAccess,
                groupsWithAccess: rowData?.permission?.groupsWithAccess,
                id: rowData.permission._id,
              })
            );
            dispatch(openPermissionModal());
          }}
        >
          Edit
        </button>
        <button onClick={() => handleDelete(rowData)}>Delete</button>
      </div>
    );
  };

  const handleContentDelete = async (rowData) => {
    await postContentData({ id: rowData._id }, true);
    handleFetchData();
  }

  const ContentActionTemplate=(rowData)=>{
    return (
      <div className={styles.buttonDiv}>
        <button
          onClick={() => {
            dispatch(
              setContentDetail({
                title: rowData.title,
                description: rowData.description,
                body: rowData.body,
                type: rowData.type,
                amount: rowData.amount,
                id: rowData._id,
              })
            );
            dispatch(openContentModal());
          }}
        >
          Edit
        </button>
        <button onClick={() => handleContentDelete(rowData)}>Delete</button>
      </div>
    );
  }

  const handleCreate = () => {
    if (userDetails?.status === "verified") {
      dispatch(openContentModal());
    } else {
      toast.error(
        "You are not verified yet. Please contact admin for verification."
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1>Content management</h1>
      {isLoading && <LoadingOverlay />}
      {userDetails?.role === "author" && (
        <button className={styles.button} onClick={handleCreate}>
          Create Content
        </button>
      )}
      <DataTable
        value={content}
        className={styles.dataTable}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
        emptyMessage="No List found."
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
      >
        <Column field="title" header="Title" sortable></Column>
        <Column field="description" header="Description" sortable></Column>
        <Column field="body" header="Content" sortable></Column>
        {userDetails?.role === "author" && (
          <Column
            body={ContentActionTemplate}
            header="Content Actions"
            sortable
          ></Column>
        )}
        <Column
          body={actionTemplate}
          header="Permission Actions"
          sortable
        ></Column>
      </DataTable>
    </div>
  );
}

export default Permissions;
