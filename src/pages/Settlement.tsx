import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  jaJP
} from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '../store';
import { getSettlementList, updateSettlementStatus, UpdateSettlementType } from '../store/counter/settlementSlice';

export interface SettlementType {
  id: number
  status: number;
  price: number;
  payment_at: Date;
  create_at: Date;
  update_at: Date;
  name: string;
  user: number;
}

const Settlement = () => {
  const rows: SettlementType[] = useAppSelector((state) => state.settlement.settlementList);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSettlementList());
  }, [dispatch]);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow: SettlementType) => {
    const payload: UpdateSettlementType = {
      id: newRow.id,
      status: newRow.status,
      price: newRow.price
    };
    dispatch(updateSettlementStatus(payload));
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { 
      field: 'status', 
      headerName: 'ステータス', 
      width: 100, 
      editable: true, 
      type: 'singleSelect', 
      valueOptions: [
        { label: '確認待ち', value: 0 },
        { label: '入金なし', value: 5 },
        { label: '重複', value: 9 },
        { label: '処理済み', value: 3 },
      ], 
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'price', headerName: '入金金額', width: 150, editable: true, align: 'right', headerAlign: 'center' },
    { field: 'payment_at', headerName: '振込日時', width: 130, type: 'date', headerAlign: 'center', align: 'center' },
    { field: 'create_at', headerName: '申請日時', width: 130, type: 'date', headerAlign: 'center', align: 'center' },
    { field: 'update_at', headerName: '更新日時', width: 130, type: 'date', headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: '振込名義', width: 200, headerAlign: 'center', align: 'center' },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
  
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return(
    <Box className="w-full m-3">
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
        pageSizeOptions={[25, 50, 100, 200]}
      />
    </Box>
  );
};

export default Settlement;