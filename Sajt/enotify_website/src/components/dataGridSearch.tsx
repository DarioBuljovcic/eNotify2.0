import {
  EuiFieldSearch,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSelect,
  EuiSpacer,
} from "@elastic/eui";
import React from "react";

export const DataGridSearchUser = ({ search, setSearch }) => {
  return (
    <>
      <div style={{ maxWidth: 320 }}>
        <EuiFieldSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          isClearable={true}
          autoFocus={true}
        />
      </div>
      <EuiSpacer />
    </>
  );
};
