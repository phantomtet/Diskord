import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { deleteDM } from '../../api/api'

const LeaveChannelConfirmDialog = ({ dm, onClose }) => {
    const handleLeave = async () => {
        await deleteDM(dm._id)
        onClose()
    }
    if (dm) return (
        <Dialog open={Boolean(dm)} onClose={onClose} maxWidth='xs'>
            <DialogTitle style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#36393f' }}>Leave '{dm.name}'</DialogTitle>
            <DialogContent style={{ backgroundColor: '#36393f', }}>
                Are you sure you want to leave <b>{dm.name}</b>? You won't be able to rejoin this group unless you are re-invited.
            </DialogContent>
            <DialogActions style={{ backgroundColor: '#2f3136', padding: 16 }}>
                <div onClick={onClose} style={{ cursor: 'pointer', padding: '10px 28px' }}>Cancel</div>
                <Button onClick={handleLeave} style={{ color: 'white', backgroundColor: '#d83c3e', textTransform: 'capitalize' }}>Leave Group</Button>
            </DialogActions>
        </Dialog>
    )
    return ''
}
export default LeaveChannelConfirmDialog