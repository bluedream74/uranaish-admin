import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import WarningIcon from '@mui/icons-material/Warning';
import { useAppDispatch, useAppSelector } from '../store';
import { useMemo } from 'react';
import { changeStatus } from '../store/counter/settlementSlice';

export default function AlertDialog() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(state => state.settlement.status)

  const open = useMemo(() => {
    return status === "failed" ? true : false
  }, [status])

  const handleClose = () => {
    dispatch(changeStatus("idle"))
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className='flex justify-center items-center'>
          <WarningIcon color={"error"} />
          <p className="pl-4 text-2xl font-bold">変更操作が失敗しました。</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
