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
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiScreenReaderOnly,
  EuiConfirmModal,
  EuiIcon,
  EuiPageSection,
  EuiFlexGroup,
  EuiText,
} from "@elastic/eui";
import {
  dataUsers,
  dataNotification,
  gridDataContext,
  RowSelection,
  RowSelectionAction,
  dataClass,
  gridDataProps,
} from "../types/types";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import {
  FlyoutClasses,
  FlyoutNotification,
  FlyoutProfessor,
  FlyoutStudent,
} from "./flyout.tsx";
import { DataGridSearchUser } from "./dataGridSearch.tsx";
import { nextYear } from "../lib/firebase.js";
import { DataGridText } from "../Text/Text.js";

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

const defaultValueData: gridDataContext = {
  data: [],
  deleteData: ([]) => {},
  GetSetData: () => {},
  editData: () => {},
  searchData: [],
  dataType: "",
  addition: [],
  ToastContext: undefined,
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

const deleteUsers = async (
  searchData,
  dataForDelete,
  deleteData,
  GetSetData,
  closeModal?
) => {
  if (dataForDelete instanceof Set) {
    const newData = searchData.filter((_, index) => dataForDelete.has(index));

    await deleteData(newData);
    GetSetData();
  } else {
    await deleteData([dataForDelete]);
    GetSetData();
  }
  closeModal?.();
};

const SelectionButton = () => {
  const [selectedRows, updateSelectedRows] = useContext(SelectionContext);
  const { searchData, deleteData, GetSetData, ToastContext, dataType } =
    useContext(DataContext);
  const { setToasts, toastId, setToastId } = useContext(ToastContext);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [option, setOption] = useState(0);
  const text =
    dataType === "Student" || dataType === "Professor"
      ? "korisnike"
      : dataType === "Class"
      ? "razrede"
      : "notifikacije";

  const handleDelete = () => {
    deleteUsers(searchData, selectedRows, deleteData, GetSetData);
    updateSelectedRows({ action: "clear" });
    let toast;
    toast = {
      id: `toast${toastId}`,
      title: "Uspeh",
      color: "success",
      text: (
        <>
          <p>Uspešno ste obrisali sve izabrane {text}!</p>
        </>
      ),
    };
    setToasts((prev) => [...prev, toast]);
    setToastId(toastId + 1);
    setIsModalVisible(false);
    setIsPopoverOpen(false);
  };
  const handleUpdate = async () => {
    const newData = searchData.filter((_, index) => selectedRows.has(index));
    try {
      await nextYear(newData);
      setIsModalVisible(false);
      updateSelectedRows({ action: "clear" });
      let toast;
      toast = {
        id: `toast${toastId}`,
        title: "Uspeh",
        color: "success",
        text: (
          <>
            <p>Uspešno ste prebacili učenike u sledeći razred!</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      GetSetData();
      setIsPopoverOpen(false);
    } catch (error) {
      updateSelectedRows({ action: "clear" });
      let toast;
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            <p>{error.message}</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      setIsModalVisible(false);
      setIsPopoverOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const showModal = (num: number) => {
    setIsModalVisible(true);
    setOption(num);
  };
  const items = () => {
    if (dataType === "Student")
      return (
        <EuiContextMenuItem
          key="update"
          icon="arrowUp"
          onClick={() => showModal(2)}
        >
          Sledeći razred
        </EuiContextMenuItem>
      );
    return <></>;
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
            {selectedRows.size + " "}izabrano
          </EuiButtonEmpty>
        }
        closePopover={() => setIsPopoverOpen(false)}
      >
        <Modal
          Title={
            option === 1
              ? DataGridText.onDeleteStudentM.Title
              : DataGridText.onNextYear.Title
          }
          Text={
            option === 1
              ? DataGridText.onDeleteStudentM.Text
              : DataGridText.onNextYear.Text
          }
          ConfrimBtn="Da"
          CancelBtn="Ne"
          modalVisible={isModalVisible}
          onCancel={closeModal}
          onConfirm={option === 1 ? handleDelete : handleUpdate}
        />
        <EuiPopoverTitle>
          {selectedRows.size} {selectedRows.size > 1 ? "items" : "item"}
        </EuiPopoverTitle>
        <EuiContextMenuPanel
          size="s"
          items={[
            <EuiContextMenuItem
              key="delete"
              icon="trash"
              onClick={() => showModal(1)}
            >
              Obriši {text}
            </EuiContextMenuItem>,
            items(),
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
      const {
        data,
        searchData,
        deleteData,
        GetSetData,
        ToastContext,
        dataType,
      } = useContext(DataContext);
      const closePopover = () => setIsPopoverVisible(false);
      const [newValue, setNewValue] = useState(searchData[rowIndex]);

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

      const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
      const closeFlyout = () => {
        setIsFlyoutVisible(false);
      };
      const showFlyout = () => {
        closePopover();
        setIsFlyoutVisible(true);
        setNewValue(data[rowIndex]);
      };
      const { setToasts, toastId, setToastId } = useContext(ToastContext);

      const handleDelete = () => {
        deleteUsers(
          searchData,
          searchData[rowIndex],
          deleteData,
          GetSetData,
          closeModal
        );
        closeModal();
        let toast;
        toast = {
          id: `toast${toastId}`,
          title: "Uspeh",
          color: "success",
          text: (
            <>
              <p>
                Uspešno ste obrisali korisnika '{searchData[rowIndex].Name}'
              </p>
            </>
          ),
        };
        setToasts((prev) => [...prev, toast]);
        setToastId(toastId + 1);
      };

      const actions = [
        <EuiContextMenuItem icon="trash" key="modal" onClick={showModal}>
          Izbriši
        </EuiContextMenuItem>,
        <EuiContextMenuItem icon="pencil" key="flyout" onClick={showFlyout}>
          Izmeni
        </EuiContextMenuItem>,
      ];
      const text = () => {
        let Title, Text;
        switch (dataType) {
          case "Student":
            Title = DataGridText.onDeleteStudentM.Title;
            Text = DataGridText.onDeleteStudentM.Text;
          case "Professor":
            Title = DataGridText.onDeleteProfessorM.Title;
            Text = DataGridText.onDeleteProfessorM.Text;
          case "Notification":
            Title = DataGridText.onDeleteNotificationM.Title;
            Text = DataGridText.onDeleteNotificationM.Text;
          case "Class":
            Title = DataGridText.onDeleteClassM.Title;
            Text = DataGridText.onDeleteClassM.Text;
        }
        return { Title: Title, Text: Text };
      };

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
            Title={text()?.Title}
            Text={text()?.Text}
            ConfrimBtn="Da"
            CancelBtn="Ne"
            modalVisible={isModalVisible}
            onCancel={closeModal}
            onConfirm={handleDelete}
          />
          {(dataType === "Student" || dataType === "Professor") && (
            <FlyoutStudent
              newValue={newValue}
              rowIndex={rowIndex}
              setNewValue={setNewValue}
              closeFlyout={closeFlyout}
              isFlyoutVisible={isFlyoutVisible}
              DataContext={DataContext}
              ToastContext={ToastContext}
            />
          )}
          {dataType === "Professor" && (
            <FlyoutProfessor
              newValue={newValue}
              rowIndex={rowIndex}
              setNewValue={setNewValue}
              closeFlyout={closeFlyout}
              isFlyoutVisible={isFlyoutVisible}
              DataContext={DataContext}
              ToastContext={ToastContext}
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
              ToastContext={ToastContext}
            />
          )}

          {dataType === "Class" && (
            <FlyoutClasses
              newValue={newValue}
              rowIndex={rowIndex}
              setNewValue={setNewValue}
              closeFlyout={closeFlyout}
              isFlyoutVisible={isFlyoutVisible}
              DataContext={DataContext}
              ToastContext={ToastContext}
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
  ToastContext,
}: gridDataProps) {
  const [pagination, setPagination] = useState({ pageIndex: 0 });
  const [data, setData] = useState<
    dataUsers[] | dataNotification[] | dataClass[]
  >([]);
  const [addition, setAddition] = useState([]);
  const [search, setSearch] = useState("");
  const searchData = useMemo(() => {
    if (data) {
      let newData: (dataUsers | dataNotification | dataClass)[] = [];
      if (dataType === "Student" || dataType === "Professor")
        newData = data.filter(
          (obj) =>
            obj["Name"].toLowerCase().includes(search.toLowerCase()) ||
            obj["Class"].toLowerCase().includes(search.toLowerCase()) ||
            obj["Email"].toLowerCase().includes(search.toLowerCase())
        );
      else if (dataType === "Notification")
        newData = data.filter((obj) => {
          console.log();
          return (
            obj["Text"].toLowerCase().includes(search.toLowerCase()) ||
            obj["Title"].toLowerCase().includes(search.toLowerCase()) ||
            format(obj["Date"].toDate(), "dd/MM/yyyy").includes(search)
          );
        });
      else if (dataType === "Class")
        newData = data.filter(
          (obj) =>
            obj["Class"].toLowerCase().includes(search.toLowerCase()) ||
            obj["ProfessorsList"]
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            obj["Professor"].toLowerCase().includes(search.toLowerCase())
        );
      return newData;
    }
    return [] as (dataUsers | dataNotification | dataClass)[];
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
      <EuiPageSection>
        <DataContext.Provider
          value={{
            data,
            searchData,
            setData,
            deleteData,
            GetSetData,
            editData,
            dataType,
            addition,
            ToastContext,
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
                style={{ maxHeight: 470 }}
                gridStyle={{
                  border: "none",
                  stripes: true,
                  rowHover: "highlight",
                  header: "underline",
                  cellPadding: "m",
                  fontSize: "l",
                  footer: "overline",
                }}
              />
            </div>
          </SelectionContext.Provider>
        </DataContext.Provider>
      </EuiPageSection>
    );
  else if (search.length > 0)
    return (
      <>
        <div>
          <EuiPageSection
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DataGridSearchUser search={search} setSearch={setSearch} />
            <EuiFlexGroup
              justifyContent="center"
              alignItems="center"
              direction="column"
              style={{ height: 470 }}
            >
              <EuiIcon type={"faceSad"} size="xxl" />
              <EuiText>Nismo uspeli da nađemo to što tražite</EuiText>
            </EuiFlexGroup>
          </EuiPageSection>
        </div>
      </>
    );
}
