import React from "react";

const styles = {
  header: { display: "inherit", width: "100%" },
  table: {
    display: "block",
    height: "200px",
    overflow: "scroll",
    width: "100%",
  },
};
const Table = ({ header, children, isLoading }) => {
  return (
    !isLoading && (
      <table className="table">
        <thead style={styles.header}>
          <tr>
            <th scope="col">#</th>
            <th scope="col">{header}</th>
            <th scope="col">Select</th>
          </tr>
        </thead>
        <tbody style={styles.table}>{children}</tbody>
      </table>
    )
  );
};
export default Table;
