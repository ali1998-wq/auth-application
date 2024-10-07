export const authorTemplate = (rowData) => {
  return (
    <p>
      {rowData?.author?.firstName}{" "}
      {rowData?.author?.lastName}
    </p>
  );
};
