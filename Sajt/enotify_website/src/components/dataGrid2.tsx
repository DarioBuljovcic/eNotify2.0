import React, {
  createContext,
  useContext,
  useCallback,
  useReducer,
  useState,
  useEffect,
  useMemo,
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
import {
  dataUsers,
  dataNotification,
  gridDataContext,
  RowSelection,
  RowSelectionAction,
} from "../types/types";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { FlyoutNotification, FlyoutUser } from "./flyout.tsx";
import { DataGridSearchUser } from "./dataGridSearch.tsx";

const defaultValueData: gridDataContext = {
  data: [],
  deleteData: ([]) => {},
  setData: () => {},
  editData: () => {},
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

const handleDelete = async (
  data,
  dataForDelete,
  deleteData,
  setData,
  handleUpdate?,
  closeModal?
) => {
  if (dataForDelete instanceof Set) {
    const newData = data.filter((_, index) => dataForDelete.has(index));
    console.log(newData);
    deleteData(newData);
    setData(data.filter((_, index) => !dataForDelete.has(index)));
    handleUpdate();
  } else {
    deleteData([dataForDelete]);
    setData(data.filter((d) => d !== dataForDelete));
  }
  closeModal?.();
};

const SelectionButton = () => {
  const [selectedRows, updateSelectedRows] = useContext(SelectionContext);
  const { searchData, deleteData, setData } = useContext(DataContext);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleUpdate = () => updateSelectedRows({ action: "clear" });
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
              key="delete"
              icon="trash"
              onClick={() =>
                handleDelete(
                  searchData,
                  selectedRows,
                  deleteData,
                  setData,
                  handleUpdate
                )
              }
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
  const { searchData } = useContext(DataContext);
  const isIndeterminate =
    selectedRows.size > 0 && selectedRows.size < searchData.length;
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
const Modal = ({
  onConfirm,
  onCancel,
  modalVisible,
  Title,
  Text,
  CancelBtn,
  ConfrimBtn,
}) => {
  if (modalVisible) {
    return (
      <EuiConfirmModal
        onCancel={onCancel}
        onConfirm={onConfirm}
        title={Title}
        cancelButtonText={CancelBtn}
        confirmButtonText={ConfrimBtn}
      >
        <p>{Text}</p>
      </EuiConfirmModal>
    );
  }
  return <></>;
};

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
      const { searchData, deleteData, setData, editData, dataType } =
        useContext(DataContext);
      const closePopover = () => setIsPopoverVisible(false);
      const [newValue, setNewValue] = useState(searchData[0]);

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

      let modal;

      const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
      const closeFlyout = () => {
        setIsFlyoutVisible(false);
      };
      const showFlyout = () => {
        closePopover();
        setIsFlyoutVisible(true);
        setNewValue(searchData[rowIndex]);
      };

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

          <Modal
            Title="Brisanje"
            Text="Da li ste sigurni da želite da obrišete?"
            ConfrimBtn="Da"
            CancelBtn="Ne"
            modalVisible={isModalVisible}
            onCancel={closeModal}
            onConfirm={() => {
              handleDelete(
                searchData,
                searchData[rowIndex],
                deleteData,
                setData,
                closeModal
              );
              closeModal();
            }}
          />
          {dataType === "User" && (
            <FlyoutUser
              newValue={newValue}
              rowIndex={rowIndex}
              setNewValue={setNewValue}
              closeFlyout={closeFlyout}
              isFlyoutVisible={isFlyoutVisible}
              DataContext={DataContext}
            />
          )}

          {dataType === "Notification" && (
            <FlyoutNotification
              newValue={newValue}
              rowIndex={rowIndex}
              setNewValue={setNewValue}
              closeFlyout={closeFlyout}
              isFlyoutVisible={isFlyoutVisible}
              DataContext={DataContext}
            />
          )}
        </>
      );
    },
  },
];
export default function DataGrid({
  getData,
  deleteData,
  columns,
  editData,
  dataType,
  getAddition,
}) {
  const [pagination, setPagination] = useState({ pageIndex: 0 });
  const [data, setData] = useState<dataUsers[] | dataNotification[]>([]);
  const [addition, setAddition] = useState([]);
  const [search, setSearch] = useState("");
  const searchData = useMemo(() => {
    if (data) {
      console.log(data);
      let newData: (dataUsers | dataNotification)[] = [];
      if (dataType === "User")
        newData = data.filter(
          (obj) =>
            obj["Name"].includes(search) ||
            obj["Class"].includes(search) ||
            obj["Email"].includes(search)
        );

      return newData;
    }
    return [];
  }, [search, data]);

  const GetSetData = async () => {
    const d: any = await getData();
    const a: any = await getAddition?.();
    setAddition(a);
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
        return new Set(searchData.map((_: any, index) => index));
      }
      return rowSelection;
    },
    new Set()
  );
  const renderCellValue = useCallback(
    ({ rowIndex, columnId }) => {
      if (columnId === "Date") {
        const timestamp: Timestamp = searchData[rowIndex][columnId];
        let date: Timestamp = new Timestamp(
          timestamp.seconds,
          timestamp.nanoseconds
        );
        return <div>{format(date.toDate(), "dd/MM/yyyy")}</div>;
      } else return <div>{searchData[rowIndex][columnId]}</div>;
    },
    [searchData]
  );

  if (searchData.length > 0)
    return (
      <DataContext.Provider
        value={{
          searchData,
          deleteData,
          setData,
          editData,
          dataType,
          addition,
        }}
      >
        <SelectionContext.Provider value={rowSelection}>
          <div>
            <DataGridSearchUser search={search} setSearch={setSearch} />
            <EuiDataGrid
              aria-label="Lista"
              leadingControlColumns={leadingControlColumns}
              trailingControlColumns={trailingControlColumns}
              columns={columns}
              columnVisibility={{
                visibleColumns,
                setVisibleColumns,
              }}
              rowCount={searchData.length}
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
  return <DataGridSearchUser search={search} setSearch={setSearch} />;
}
