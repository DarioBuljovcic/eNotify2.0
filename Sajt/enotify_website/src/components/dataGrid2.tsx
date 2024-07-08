import React, {
    createContext,
    useContext,
    useCallback,
    useReducer,
    useState,
    Fragment,
    useEffect,
  } from 'react';
  import {
    EuiDataGrid,
    EuiAvatar,
    EuiCheckbox,
    EuiButtonIcon,
    EuiPopover,
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPopoverTitle,
    EuiSpacer,
    EuiPortal,
    EuiFlyout,
    EuiFlyoutBody,
    EuiFlyoutHeader,
    EuiTitle,
    EuiDescriptionList,
    EuiDescriptionListTitle,
    EuiDescriptionListDescription,
    EuiContextMenuItem,
    EuiContextMenuPanel,
    EuiText,
    EuiCode,
    EuiModal,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiModalBody,
    EuiModalFooter,
    EuiButton,
    EuiScreenReaderOnly,
    EuiFlyoutFooter,
    EuiConfirmModal,
    EuiFormLabel,
    EuiFieldText,
    EuiDatePicker,
    EuiTextArea,
  } from '@elastic/eui';
  import { faker } from '@faker-js/faker';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
  const columns = [
    {
        id: "UserID",
        initialWidth: 120,
      },
      {
        id: "Name",
      },
      {
        id: "Email",
      },
      {
        id: "Class",
      },
  ];
  
  const SelectionContext = createContext();
  const DataContext = createContext();

  const SelectionButton = () => {
    const [selectedRows] = useContext(SelectionContext);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const alertAndClosePopover = () => {
      setIsPopoverOpen(false);
      window.alert('This is not a real control.');
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
              {selectedRows.size} {selectedRows.size > 1 ? 'items' : 'item'}{' '}
              selected
            </EuiButtonEmpty>
          }
          closePopover={() => setIsPopoverOpen(false)}
        >
          <EuiPopoverTitle>
            {selectedRows.size} {selectedRows.size > 1 ? 'items' : 'item'}
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
    const {data} = useContext(DataContext);
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
            updateSelectedRows({ action: 'clear' });
          } else {
            if (e.target.checked) {
              // select everything
              updateSelectedRows({ action: 'selectAll' });
            } else {
              // clear selection
              updateSelectedRows({ action: 'clear' });
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
              updateSelectedRows({ action: 'add', rowIndex });
            } else {
              updateSelectedRows({ action: 'delete', rowIndex });
            }
          }}
        />
      </div>
    );
  };
  const FlyoutRowCell = (rowIndex) => {
    let flyout;
    const {data,setData} = useContext(DataContext);
    const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
    if (isFlyoutOpen) {
        
      const rowData = data[rowIndex.rowIndex];
      const details = Object.entries(rowData).map(([key, value]) => {
        return (
          <Fragment>
            <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
            <EuiDescriptionListDescription>{value}</EuiDescriptionListDescription>
          </Fragment>
        );
      });
      flyout = (
        <EuiPortal>
          <EuiFlyout ownFocus onClose={() => setIsFlyoutOpen(!isFlyoutOpen)}>
            <EuiFlyoutHeader hasBorder>
              <EuiTitle size="m">
                <h2>Cao</h2>
              </EuiTitle>
            </EuiFlyoutHeader>
            <EuiFlyoutBody>
              <EuiDescriptionList>{details}</EuiDescriptionList>
            </EuiFlyoutBody>
          </EuiFlyout>
        </EuiPortal>
      );
    }
    return (
      <Fragment>
        <EuiButtonIcon
          color="text"
          iconType="eye"
          iconSize="s"
          aria-label="View details"
          onClick={() => setIsFlyoutOpen(!isFlyoutOpen)}
        />
        {flyout}
      </Fragment>
    );
  };
  const leadingControlColumns = [
    {
      id: 'selection',
      width: 32,
      headerCellRender: SelectionHeaderCell,
      rowCellRender: SelectionRowCell,
    },
    {
      id: 'View',
      width: 36,
      headerCellRender: () => null,
      rowCellRender: FlyoutRowCell,
    },
  ];
  const trailingControlColumns = [
    {
      id: 'actions',
      width: 40,
      headerCellRender: () => (
        <EuiScreenReaderOnly>
          <span>Opcije</span>
        </EuiScreenReaderOnly>
      ),
      rowCellRender: function RowCellRender({ rowIndex, colIndex }) {
        const [isPopoverVisible, setIsPopoverVisible] = useState(false);
        const {data}=useContext(DataContext);
        const closePopover = () => setIsPopoverVisible(false);
  
        const [isModalVisible, setIsModalVisible] = useState(false);
        const closeModal = () => {
          setIsModalVisible(false);
          
        };
        const showModal = () => {
          closePopover();
          setIsModalVisible(true);
        };
  
        let modal;
  
        if (isModalVisible) {
          modal = (
            <EuiConfirmModal onCancel={closeModal} onConfirm={()=>{}} title='Brisanje' cancelButtonText='Ne' confirmButtonText='Da'>
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
        const body = Object.entries(data[rowIndex]).map(([key, value]) => {
            if (key === "Date") {
              const timestamp: Timestamp = value as Timestamp;
              let date: Timestamp = new Timestamp(
                timestamp.seconds,
                timestamp.nanoseconds
              );
              
              return (
                <>
                  <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
                  <EuiDescriptionListDescription style={{maxWidth:300}}>
                    <EuiDatePicker selected={moment(date.toDate())} disabled={true} />
                  </EuiDescriptionListDescription>
                </>
              );
            }else if(key==='Text'){
              return (
                <>
                  <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
                  <EuiDescriptionListDescription style={{maxWidth:300}}>
                    <EuiTextArea value={value as string}  />
                  </EuiDescriptionListDescription>
                </>
              );
            }
            console.log();
            return (
              <>
                <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
                <EuiDescriptionListDescription style={{maxWidth:300}}>
                  <EuiFieldText value={value as string} disabled={(['NotificationId','UserID','From'].includes(key)?true:false)} />
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
          <EuiContextMenuItem icon="apmTrace" key="modal" onClick={showModal}>
            Izbriši
          </EuiContextMenuItem>,
          <EuiContextMenuItem
            icon="tableOfContents"
            key="flyout"
            onClick={showFlyout}
          >
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
              <EuiContextMenuPanel items={actions} size="s" title="Actions" />
            </EuiPopover>
  
            {modal}
  
            {flyout}
          </>
        );
      },
    },
  ];
  export default function DataGrid({getData}) {
    const [pagination, setPagination] = useState({ pageIndex: 0 });
    const [data, setData] = useState([]);
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
    const rowSelection = useReducer((rowSelection, { action, rowIndex }) => {
      if (action === 'add') {
        const nextRowSelection = new Set(rowSelection);
        nextRowSelection.add(rowIndex);
        return nextRowSelection;
      } else if (action === 'delete') {
        const nextRowSelection = new Set(rowSelection);
        nextRowSelection.delete(rowIndex);
        return nextRowSelection;
      } else if (action === 'clear') {
        return new Set();
      } else if (action === 'selectAll') {
        return new Set(data.map((_, index) => index));
      }
      return rowSelection;
    }, new Set());
    const renderCellValue = useCallback(
      ({ rowIndex, columnId }) => data[rowIndex][columnId],
      [data]
    );

    if(data.length>10){
        return (

            <DataContext.Provider value={{data}}>
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
    
  }