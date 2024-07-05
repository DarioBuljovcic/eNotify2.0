import React, { useState, useCallback, useEffect, createContext, useContext, useReducer } from 'react';
import { EuiDataGrid, EuiAvatar,EuiPageHeader, EuiPageTemplate, EuiProvider, EuiText, EuiPageTemplateProps,EuiTabProps,EuiButton,EuiSpacer, EuiFlexGrid,EuiTab, EuiTabs, EuiIcon, EuiPageBody, EuiPopover, EuiButtonEmpty, EuiPopoverTitle, EuiContextMenuPanel, EuiContextMenuItem, EuiCheckbox, EuiDescriptionListTitle, EuiDescriptionListDescription, EuiPortal, EuiFlyout, EuiFlyoutHeader, EuiTitle, EuiDescriptionList, EuiFlyoutBody, EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';






const DataGridStyle =  ({columns,getData}) => {
    const [data,setData] = useState([]);
    
    useEffect(() => {
        const func = async () => {
          const d:any = await getData();
          setData(d);
        };
        func();
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
    const renderCellValue = (rowIndex,columnId)=>{
        if(columnId==="Date"){
            
            const timestamp:Timestamp = data[rowIndex][columnId];
            let date:Timestamp = new Timestamp(timestamp.seconds,timestamp.nanoseconds);
            return <div>{format(date.toDate(), 'dd/MM/yyyy') }</div>;
        }
        else 
            return <div>{data[rowIndex][columnId]}</div>
    }
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
      const footerCellValues = {
        name: '5 accounts',
      };
      const renderFooterCellValue = ({ columnId }) =>
        footerCellValues[columnId] || null;
      const SelectionContext = createContext();
      
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
              aria-label={`Select row ${rowIndex}, ${data[rowIndex].name}`}
              checked={isChecked}
              onChange={(e) => {
                
                if (e.target.checked) {
                  updateSelectedRows({ action: 'add', rowIndex });
                  console.log(data);
                } else {
                    console.log(data);
                    updateSelectedRows({ action: 'delete', rowIndex });
                    console.log(data);
                }
                
              }}
            />
          </div>
        );
      };
      
      const FlyoutRowCell = (rowIndex) => {
        let flyout;
        const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
        if (isFlyoutOpen) {
          const rowData = data[rowIndex.rowIndex];
          const details = Object.entries(rowData).map(([key, value]) => {
            if(key==="Date"){
                const timestamp:Timestamp = value;
                let date:Timestamp = new Timestamp(timestamp.seconds,timestamp.nanoseconds);
                return (
                    <>
                      <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
                      <EuiDescriptionListDescription>{format(date.toDate(), 'dd/MM/yyyy') }</EuiDescriptionListDescription>
                    </>
                  );
            }
            return (
              <>
                <EuiDescriptionListTitle>{key}</EuiDescriptionListTitle>
                <EuiDescriptionListDescription>{value}</EuiDescriptionListDescription>
              </>
            );
          });
      
          flyout = (
            <EuiPortal>
              <EuiFlyout ownFocus onClose={() => setIsFlyoutOpen(!isFlyoutOpen)} maxWidth="200px">
                <EuiFlyoutHeader hasBorder>
                  <EuiTitle size="m">
                    <h2>{rowData.name}</h2>
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
          <>
            <EuiButtonIcon
              color="text"
              iconType="eye"
              iconSize="s"
              aria-label="View details"
              onClick={() => setIsFlyoutOpen(!isFlyoutOpen)}
            />
            {flyout}
          </>
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
          headerCellRender: () => null,
          rowCellRender: function RowCellRender() {
            const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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
                    <button onClick={() => {}} component="span">
                      <EuiFlexGroup
                        alignItems="center"
                        component="span"
                        gutterSize="s"
                      >
                        <EuiFlexItem grow={false}>
                          <EuiButtonIcon
                            aria-label="Pin selected items"
                            iconType="pin"
                            color="text"
                          />
                        </EuiFlexItem>
                        <EuiFlexItem>Pin</EuiFlexItem>
                      </EuiFlexGroup>
                    </button>
                    <EuiSpacer size="s" />
                    <button onClick={() => {}}>
                      <EuiFlexGroup
                        alignItems="center"
                        component="span"
                        gutterSize="s"
                      >
                        <EuiFlexItem grow={false}>
                          <EuiButtonIcon
                            aria-label="Delete selected items"
                            iconType="trash"
                            color="text"
                          />
                        </EuiFlexItem>
                        <EuiFlexItem>Delete</EuiFlexItem>
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
            {data.length>0  && <SelectionContext.Provider value={rowSelection}><EuiDataGrid
                aria-label="Data grid styling demo"
                columns={columns}
                columnVisibility={{
                    visibleColumns: visibleColumns,
                    setVisibleColumns: handleVisibleColumns,
                }}
                sorting={{ columns: sortingColumns, onSort }}
                inMemory={{ level: 'sorting' }}
                rowCount={data.length}
                gridStyle={{
                    border : 'none',
                    fontSize : 'm',
                    cellPadding : 'm',
                    stripes : true,
                    rowHover : 'highlight',
                    header : 'underline',
                    footer : 'overline',
                }}
                leadingControlColumns={leadingControlColumns}
                trailingControlColumns={trailingControlColumns}
                renderCellValue={({ rowIndex, columnId }) => renderCellValue(rowIndex,columnId)}
                renderFooterCellValue={renderFooterCellValue}
                pagination={{
                    ...pagination,
                    onChangeItemsPerPage: setPageSize,
                    onChangePage: setPageIndex,
                }}
                toolbarVisibility={{
                    additionalControls: <SelectionButton />,
                  }}
            /></SelectionContext.Provider>}
        </>
        
        
    );
};
export default DataGridStyle;


