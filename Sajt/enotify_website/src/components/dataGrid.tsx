import React, {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useReducer,
} from "react";
import {
  EuiDataGrid,
  EuiAvatar,
  EuiPageHeader,
  EuiPageTemplate,
  EuiProvider,
  EuiText,
  EuiPageTemplateProps,
  EuiTabProps,
  EuiButton,
  EuiSpacer,
  EuiFlexGrid,
  EuiTab,
  EuiTabs,
  EuiIcon,
  EuiPageBody,
  EuiPopover,
  EuiButtonEmpty,
  EuiPopoverTitle,
  EuiContextMenuPanel,
  EuiContextMenuItem,
  EuiCheckbox,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiPortal,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiDescriptionList,
  EuiFlyoutBody,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiConfirmModal,
  EuiDatePicker,
  EuiFieldText,
  EuiTextArea,
} from "@elastic/eui";

import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import moment from "moment";

type Inputs = {
  NotificationId: string;
  Title: string;
  Text: string;
  From: string;
  Date: string;
  UserID: string;
  Name: string;
  Email: string;
  Class: string;
};

//onChange={()=>setNewValue(prev=>({...prev,[key]:value as string}))}
//const rowData = data[rowIndex];
const Flyout = (isFlyoutOpen, setIsFlyoutOpen, rowData, setNewValue) => {
  const details = Object.entries(rowData).map(([key, value]) => {
    if (key === "Date") {
      const timestamp: Timestamp = value as Timestamp;
      let date: Timestamp = new Timestamp(
        timestamp.seconds,
        timestamp.nanoseconds
      );

      return (
        <>
          <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
          <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
            <EuiDatePicker selected={moment(date.toDate())} disabled={true} />
          </EuiDescriptionListDescription>
        </>
      );
    } else if (key === "Text") {
      return (
        <>
          <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
          <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
            <EuiTextArea value={value as string} />
          </EuiDescriptionListDescription>
        </>
      );
    }
    return (
      <>
        <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
        <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
          <EuiFieldText
            value={value as string}
            disabled={key === "NotificationId" || key === "From" ? true : false}
          />
        </EuiDescriptionListDescription>
      </>
    );
  });

  return (
    <EuiPortal>
      <EuiFlyout
        ownFocus
        onClose={() => {
          setIsFlyoutOpen(!isFlyoutOpen);
          console.log(isFlyoutOpen);
        }}
        maxWidth={100}
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2>{rowData.name}</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiDescriptionList>{details}</EuiDescriptionList>
          <EuiSpacer />
          <EuiButton fill={true} onClick={handleEdit}>
            Izmeni
          </EuiButton>
        </EuiFlyoutBody>
      </EuiFlyout>
    </EuiPortal>
  );
};

const DataGridStyle = ({ columns, getData, deleteData }) => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [handlers, setHandlers] = useState({
    handleConfirm: () => {},
    handleClose: () => {},
  });
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  const GetSetData = async () => {
    const d: any = await getData();
    setData(d);
  };
  useEffect(() => {
    GetSetData();
  }, []);

  const [pagination, setPagination] = useState({ pageIndex: 0 });
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map(({ id }) => id)
  );

  const setPageIndex = useCallback((pageIndex) => {
    setPagination((pagination) => ({ ...pagination, pageIndex }));
  }, []);

  const setPageSize = useCallback((pageSize) => {
    setPagination((pagination) => ({
      ...pagination,
      pageSize,
      pageIndex: 0,
    }));
  }, []);

  const handleVisibleColumns = (visibleColumns) =>
    setVisibleColumns(visibleColumns);

  const [sortingColumns, setSortingColumns] = useState([]);

  const onSort = useCallback(
    (sortingColumns) => {
      console.log(sortingColumns);
      setSortingColumns(sortingColumns);
    },
    [setSortingColumns]
  );
  const renderCellValue = (rowIndex, columnId) => {
    if (columnId === "Date") {
      const timestamp: Timestamp = data[rowIndex][columnId];
      let date: Timestamp = new Timestamp(
        timestamp.seconds,
        timestamp.nanoseconds
      );
      return <div>{format(date.toDate(), "dd/MM/yyyy")}</div>;
    } else return <div>{data[rowIndex][columnId]}</div>;
  };
  const rowSelection = useReducer((rowSelection, { action, rowIndex }) => {
    if (action === "add") {
      const nextRowSelection = new Set(rowSelection);
      nextRowSelection.add(rowIndex);
      return nextRowSelection;
    } else if (action === "delete") {
      const nextRowSelection = new Set(rowSelection);
      nextRowSelection.delete(rowIndex);
      return nextRowSelection;
    } else if (action === "clear") {
      return new Set();
    } else if (action === "selectAll") {
      return new Set(data.map((_, index) => index));
    }
    return rowSelection;
  }, new Set());
  const footerCellValues = {
    name: "5 accounts",
  };

  const renderFooterCellValue = ({ columnId }) =>
    footerCellValues[columnId] || null;

  const [flyout, setFlyout] = useState(<></>);
  const [rowIndex, setRowIndex] = useState(0);
  const [newValue, setNewValue] = useState(data[0]);

  const SelectionContext = createContext(rowSelection);

  const handleDelete = async (
    selectedRows,
    updateSelectedRows?,
    setIsPopoverOpen?
  ) => {
    setIsPopoverOpen?.(false);
    const handleOpenModal = () => {
      setIsOpen(true);
      return new Promise((resolve, reject) => {
        const handleConfirm = () => {
          setIsOpen(false);
          resolve(true);
        };

        const handleClose = () => {
          setIsOpen(false);
          resolve(false);
        };

        setHandlers({ handleConfirm, handleClose });
      });
    };
    const result = await handleOpenModal();

    if (result) {
      const users = [];
      selectedRows.forEach((row) => {
        users.push(data[row]);
      });
      await deleteData(users);
      GetSetData();
      updateSelectedRows?.({ action: "clear" });
    }
  };

  const SelectionButton = () => {
    const [selectedRows, updateSelectedRows] = useContext(SelectionContext);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    if (selectedRows.size > 0) {
      return (
        <EuiPopover
          isOpen={isPopoverOpen}
          anchorPosition="upCenter"
          panelPaddingSize="s"
          button={
            <EuiButtonEmpty
              size="xs"
              iconType="arrowDown"
              iconSide="right"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              {selectedRows.size} {selectedRows.size > 1 ? "items" : "item"}{" "}
              selected
            </EuiButtonEmpty>
          }
          closePopover={() => setIsPopoverOpen(false)}
        >
          <EuiPopoverTitle>
            {selectedRows.size} {selectedRows.size > 1 ? "items" : "item"}
          </EuiPopoverTitle>
          <EuiContextMenuPanel
            size="s"
            items={[
              <EuiContextMenuItem key="pencil" icon="pencil" onClick={() => {}}>
                Izmeni redove
              </EuiContextMenuItem>,
              <EuiContextMenuItem
                key="delete"
                icon="trash"
                onClick={() =>
                  handleDelete(
                    selectedRows,
                    updateSelectedRows,
                    setIsPopoverOpen
                  )
                }
              >
                Obriši redove
              </EuiContextMenuItem>,
            ]}
          />
        </EuiPopover>
      );
    } else {
      return null;
    }
  };

  const SelectionHeaderCell = () => {
    const [selectedRows, updateSelectedRows] = useContext(SelectionContext);
    const isIndeterminate =
      selectedRows.size > 0 && selectedRows.size < data.length;
    return (
      <EuiCheckbox
        id="selection-toggle"
        aria-label="Select all rows"
        indeterminate={isIndeterminate}
        checked={selectedRows.size > 0}
        onChange={(e) => {
          if (isIndeterminate) {
            // clear selection
            updateSelectedRows({ action: "clear" });
          } else {
            if (e.target.checked) {
              // select everything
              updateSelectedRows({ action: "selectAll" });
            } else {
              // clear selection
              updateSelectedRows({ action: "clear" });
            }
          }
        }}
      />
    );
  };

  const SelectionRowCell = ({ rowIndex }) => {
    const [selectedRows, updateSelectedRows] = useContext(SelectionContext);
    const isChecked = selectedRows.has(rowIndex);

    return (
      <div>
        <EuiCheckbox
          id={`${rowIndex}`}
          aria-label={`Select row ${rowIndex}, ${data[rowIndex]?.name}`}
          checked={isChecked}
          onChange={(e) => {
            if (e.target.checked) {
              updateSelectedRows({ action: "add", rowIndex });
            } else {
              updateSelectedRows({ action: "delete", rowIndex });
            }
          }}
        />
      </div>
    );
  };

  const leadingControlColumns = [
    {
      id: "selection",
      width: 32,
      headerCellRender: SelectionHeaderCell,
      rowCellRender: SelectionRowCell,
    },
  ];

  const trailingControlColumns = [
    {
      id: "actions",
      width: 40,
      headerCellRender: () => null,
      rowCellRender: function RowCellRender(row) {
        const [isPopoverOpen, setIsPopoverOpen] = useState(false);
        const user = row.rowIndex;

        return (
          <div>
            <EuiPopover
              isOpen={isPopoverOpen}
              anchorPosition="upCenter"
              panelPaddingSize="s"
              button={
                <EuiButtonIcon
                  aria-label="show actions"
                  iconType="boxesHorizontal"
                  color="text"
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                />
              }
              closePopover={() => setIsPopoverOpen(false)}
            >
              <EuiPopoverTitle>Actions</EuiPopoverTitle>
              <div style={{ width: 150 }}>
                <button
                  onClick={() => {
                    setIsFlyoutOpen(true);
                    setRowIndex(user);
                    setNewValue(data[user]);
                  }}
                  component="span"
                >
                  <EuiFlexGroup
                    alignItems="center"
                    component="span"
                    gutterSize="s"
                  >
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon
                        color="text"
                        iconType="pencil"
                        aria-label="View details"
                      />
                    </EuiFlexItem>
                    <EuiFlexItem>Izmeni</EuiFlexItem>
                  </EuiFlexGroup>
                </button>
                <EuiSpacer size="s" />
                <button
                  onClick={() => {
                    handleDelete([user]);
                  }}
                >
                  <EuiFlexGroup
                    alignItems="center"
                    component="span"
                    gutterSize="s"
                  >
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon
                        aria-label="Obriši"
                        iconType="trash"
                        color="text"
                      />
                    </EuiFlexItem>
                    <EuiFlexItem>Obriši</EuiFlexItem>
                  </EuiFlexGroup>
                </button>
              </div>
            </EuiPopover>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {data.length > 0 && (
        <SelectionContext.Provider value={rowSelection}>
          {isFlyoutOpen && flyout}
          {isOpen && (
            <EuiConfirmModal
              style={{ width: 300 }}
              title="Brisanje"
              onCancel={handlers.handleClose}
              onConfirm={handlers.handleConfirm}
              cancelButtonText="Ne"
              confirmButtonText="Da"
              defaultFocusedButton="confirm"
            >
              <p>Da li ste sigurni da želite da obrišete?</p>
            </EuiConfirmModal>
          )}

          <EuiDataGrid
            aria-label="Data grid styling"
            columns={columns}
            columnVisibility={{
              visibleColumns: visibleColumns,
              setVisibleColumns: handleVisibleColumns,
            }}
            sorting={{ columns: sortingColumns, onSort }}
            inMemory={{ level: "sorting" }}
            rowCount={data.length}
            gridStyle={{
              border: "none",
              fontSize: "m",
              cellPadding: "m",
              stripes: true,
              rowHover: "highlight",
              header: "underline",
              footer: "overline",
            }}
            leadingControlColumns={leadingControlColumns}
            trailingControlColumns={trailingControlColumns}
            renderCellValue={({ rowIndex, columnId }) =>
              renderCellValue(rowIndex, columnId)
            }
            renderFooterCellValue={renderFooterCellValue}
            pagination={{
              ...pagination,
              onChangeItemsPerPage: setPageSize,
              onChangePage: setPageIndex,
            }}
            toolbarVisibility={{
              additionalControls: <SelectionButton />,
            }}
          />
        </SelectionContext.Provider>
      )}
    </>
  );
};
export default DataGridStyle;
