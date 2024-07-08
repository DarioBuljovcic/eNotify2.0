import React, {
  createContext,
  useContext,
  useCallback,
  useReducer,
  useState,
  useEffect,
} from "react";
import {
  EuiDataGrid,
  EuiCheckbox,
  EuiButtonIcon,
  EuiPopover,
  EuiButtonEmpty,
  EuiPopoverTitle,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiScreenReaderOnly,
  EuiFlyoutFooter,
  EuiConfirmModal,
  EuiFieldText,
  EuiDatePicker,
  EuiTextArea,
  EuiButton,
  EuiSpacer,
} from "@elastic/eui";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import {
  dataUsers,
  dataNotification,
  gridDataContext,
  RowSelection,
  RowSelectionAction,
} from "../types/types";

const defaultValueData: gridDataContext = {
  data: [],
  deleteData: ([]) => {},
  setData: () => {},
  editUser: () => {},
};
const defaultRowSelection: RowSelection = {
  rowSelection: new Set<number>(),
  dispatch: () => {},
  [Symbol.iterator]: function* () {
    let properties = Object.keys(this);
    for (let i of properties) {
      yield [i, this[i]];
    }
  },
};
const SelectionContext = createContext<RowSelection>(defaultRowSelection);
const DataContext = createContext<gridDataContext>(defaultValueData);

const SelectionButton = () => {
  const [selectedRows] = useContext(SelectionContext);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const alertAndClosePopover = () => {
    setIsPopoverOpen(false);
    window.alert("This is not a real control.");
  };
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
            <EuiContextMenuItem
              key="pin"
              icon="pin"
              onClick={alertAndClosePopover}
            >
              Pin items
            </EuiContextMenuItem>,
            <EuiContextMenuItem
              key="delete"
              icon="trash"
              onClick={alertAndClosePopover}
            >
              Delete item
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
  const { data } = useContext(DataContext);
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
        aria-label={`Select row `}
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
    headerCellRender: () => (
      <EuiScreenReaderOnly>
        <span>Opcije</span>
      </EuiScreenReaderOnly>
    ),
    rowCellRender: function RowCellRender({ rowIndex, colIndex }) {
      const [isPopoverVisible, setIsPopoverVisible] = useState(false);
      const { data, deleteData, setData, editUser } = useContext(DataContext);
      const closePopover = () => setIsPopoverVisible(false);
      const [newValue, setNewValue] = useState(data[0]);

      const [isModalVisible, setIsModalVisible] = useState(false);
      // const [modalText, setModalText] = useState("");
      // const [modalTitle, setModalTitle] = useState("");

      const closeModal = () => {
        setIsModalVisible(false);
      };
      const showModal = () => {
        closePopover();
        setIsModalVisible(true);
      };
      const handleDelete = async () => {
        deleteData([data[rowIndex]]);
        closeModal();
        setData(data.filter((d) => d !== data[rowIndex]));
      };
      const handleEdit = async () => {
        editUser(data[rowIndex], newValue);
        closeModal();
        setData((prevItems: dataUsers[]) => {
          return prevItems.map((item) =>
            item.UserID === data[rowIndex]?.UserID
              ? {
                  ...item,
                  Name: newValue.Name,
                  Email: newValue.Email,
                  Class: newValue.Class,
                }
              : item
          );
        });
      };
      let modal;

      if (isModalVisible) {
        modal = (
          <EuiConfirmModal
            onCancel={closeModal}
            onConfirm={handleDelete}
            title="Brisanje"
            cancelButtonText="Ne"
            confirmButtonText="Da"
          >
            <p>Da li ste sigurni da želite da obrišete?</p>
          </EuiConfirmModal>
        );
      }

      const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
      const closeFlyout = () => {
        setIsFlyoutVisible(false);
      };
      const showFlyout = () => {
        closePopover();
        setIsFlyoutVisible(true);
      };
      const handleChange = (value, key) => {
        setNewValue((prev) => ({ ...prev, [key]: value }));
        console.log(value);
      };
      const body = Object.entries(data[rowIndex]).map(([key, value]) => {
        if (key === "Date") {
          return (
            <>
              <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
              <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
                <EuiDatePicker
                  selected={moment(newValue.Date.toDate())}
                  disabled={true}
                  onChange={(e) => handleChange(e, key)}
                />
              </EuiDescriptionListDescription>
            </>
          );
        } else if (key === "Text") {
          return (
            <>
              <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
              <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
                <EuiTextArea
                  value={newValue[key]}
                  onChange={(e) => handleChange(e.target.value, key)}
                />
              </EuiDescriptionListDescription>
            </>
          );
        }
        return (
          <>
            <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue[key]}
                disabled={
                  ["NotificationId", "UserID", "From"].includes(key)
                    ? true
                    : false
                }
                onChange={(e) => handleChange(e.target.value, key)}
              />
            </EuiDescriptionListDescription>
          </>
        );
      });

      let flyout;

      if (isFlyoutVisible) {
        flyout = (
          <EuiFlyout
            aria-labelledby="flyoutTitle"
            onClose={closeFlyout}
            ownFocus
            size="s"
          >
            <EuiFlyoutHeader hasBorder>
              <EuiTitle size="m">
                <h2 id="flyoutTitle">Izmena</h2>
              </EuiTitle>
            </EuiFlyoutHeader>

            <EuiFlyoutBody>
              {body}
              <EuiSpacer />
              <EuiButton onClick={handleEdit}>Izmeni</EuiButton>
            </EuiFlyoutBody>

            <EuiFlyoutFooter>
              <EuiButtonEmpty
                flush="left"
                iconType="cross"
                onClick={closeFlyout}
              >
                Spusti
              </EuiButtonEmpty>
            </EuiFlyoutFooter>
          </EuiFlyout>
        );
      }

      const actions = [
        <EuiContextMenuItem icon="trash" key="modal" onClick={showModal}>
          Izbriši
        </EuiContextMenuItem>,
        <EuiContextMenuItem icon="pencil" key="flyout" onClick={showFlyout}>
          Izmeni
        </EuiContextMenuItem>,
      ];

      return (
        <>
          <EuiPopover
            isOpen={isPopoverVisible}
            panelPaddingSize="none"
            anchorPosition="upCenter"
            button={
              <EuiButtonIcon
                aria-label="Show actions"
                iconType="boxesHorizontal"
                color="text"
                onClick={() => setIsPopoverVisible(!isPopoverVisible)}
              />
            }
            closePopover={closePopover}
          >
            <EuiContextMenuPanel items={actions} size="s" title="Opcije" />
          </EuiPopover>

          {modal}

          {flyout}
        </>
      );
    },
  },
];
export default function DataGrid({ getData, deleteData, columns, editUser }) {
  const [pagination, setPagination] = useState({ pageIndex: 0 });
  const [data, setData] = useState<dataUsers[] | dataNotification[]>([]);
  const GetSetData = async () => {
    const d: any = await getData();
    setData(d);
  };
  useEffect(() => {
    GetSetData();
  }, []);

  const setPageIndex = useCallback(
    (pageIndex) =>
      setPagination((pagination) => ({ ...pagination, pageIndex })),
    []
  );
  const setPageSize = useCallback(
    (pageSize) =>
      setPagination((pagination) => ({
        ...pagination,
        pageSize,
        pageIndex: 0,
      })),
    []
  );
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map(({ id }) => id)
  );
  const rowSelection = useReducer(
    (rowSelection: Set<number>, { action, rowIndex }: RowSelectionAction) => {
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
        return new Set(data.map((_: any, index) => index));
      }
      return rowSelection;
    },
    new Set()
  );
  const renderCellValue = useCallback(
    ({ rowIndex, columnId }) => data[rowIndex][columnId],
    [data]
  );
  if (data.length > 0)
    return (
      <DataContext.Provider value={{ data, deleteData, setData, editUser }}>
        <SelectionContext.Provider value={rowSelection}>
          <div>
            <EuiDataGrid
              aria-label="Top EUI contributors"
              leadingControlColumns={leadingControlColumns}
              trailingControlColumns={trailingControlColumns}
              columns={columns}
              columnVisibility={{
                visibleColumns,
                setVisibleColumns,
              }}
              rowCount={data.length}
              renderCellValue={renderCellValue}
              pagination={{
                ...pagination,
                onChangeItemsPerPage: setPageSize,
                onChangePage: setPageIndex,
              }}
              toolbarVisibility={{
                additionalControls: <SelectionButton />,
              }}
            />
          </div>
        </SelectionContext.Provider>
      </DataContext.Provider>
    );
}
