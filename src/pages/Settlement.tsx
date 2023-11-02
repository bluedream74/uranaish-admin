import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
  const [state, setState] = useState({
    checking: true,
    fail: true,
    double: true,
    success: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { checking, fail, double, success } = state;

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

  const processRowUpdate = (newRow: SettlementType) => {
    const payload: UpdateSettlementType = {
      id: newRow.id,
      status: newRow.status
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
        { label: '入金なし', value: 3 },
        { label: '重複', value: 5 },
        { label: '処理済み', value: 9 },
      ], 
    },
    { field: 'price', headerName: '入金金額', width: 130 },
    { field: 'payment_at', headerName: '振込日時', width: 130, type: 'date' },
    { field: 'create_at', headerName: '申請日時', width: 130, type: 'date' },
    { field: 'update_at', headerName: '更新日時', width: 130, type: 'date' },
    { field: 'name', headerName: '振込名義', width: 130 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
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
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ fontSize: 24, fontWeight: 'bold' }}>ステータス</FormLabel>
        <FormGroup row={true}>
          <FormControlLabel
            control={
              <Checkbox checked={checking} onChange={handleChange} name="checking" />
            }
            label="確認待ち"
          />
          <FormControlLabel
            control={
              <Checkbox checked={fail} onChange={handleChange} name="fail" />
            }
            label="入金なし"
          />
          <FormControlLabel
            control={
              <Checkbox checked={double} onChange={handleChange} name="double" />
            }
            label="重複"
          />
          <FormControlLabel
            control={
              <Checkbox checked={success} onChange={handleChange} name="success" />
            }
            label="処理済み"
          />
        </FormGroup>
      </FormControl>
      <div style={{ minHeight: 600, height: '80%',  width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
        />
      </div>
    </Box>
  );
};

export default Settlement;