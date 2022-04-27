
import { IconButton, Paper, TextField } from '@mui/material';
import React, { useState, useRef, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const MessageInput = ({onSubmit}) => {
    const ref = useRef()
    const [state, setState] = useState({
        content: '',
        files: [],
    })
    const isFileChosen = Boolean(state.files.length)
    // method
    const handleChangeFile = e => {
        e.preventDefault()
        setState(prev => ({...prev, files: [...prev.files, ...Object.values(e.target.files)]}))
        ref.current.value = ''
    }
    return (
        <div>
            {
                isFileChosen &&
                <div style={{ display: 'flex', padding: '20px 10px 10px 10px', backgroundColor: '#40444b', borderRadius: '10px 10px 0 0', margin: '0 1px', overflow: 'auto hidden'}}>
                    {
                        state.files.map((item, index) =>
                            <FilePreview
                            key={index}
                            data={item}
                            onClose={() => setState(prev => ({...prev, files: prev.files.filter((_, sub_index) => index !== sub_index)}))}
                            />
                        )
                    }
                </div>
            }
            <TextField
            placeholder={`Message`}
            autoComplete='new-password'
            multiline
            maxRows={5}
            size='small'
            InputProps={{
                startAdornment: <IconButton onClick={() => ref.current.click()} style={{marginRight: 10, backgroundColor: 'darkgray', width: 24, height: 24}}><AddIcon style={{fill: '#40444b'}}/></IconButton>,
                style: { color: 'lightgray', backgroundColor: '#40444b', borderRadius: isFileChosen ? '0 0 10px 10px' : 10, maxHeight: '50vh',  overflow: 'auto'}
            }}
            value={state.content}
            onChange={e => setState(prev => ({...prev, content: e.target.value}))}
            fullWidth
            onKeyPress={e => {
                if (e.key !== 'Enter') return
                e.preventDefault()
                if (state.content || state.files.length) {
                    onSubmit(state)
                    setState({
                        content: '',
                        files: []
                    })
                }
            }}
            />
            {/* hidden stuff */}
            <input ref={ref} type='file' multiple hidden onChange={handleChangeFile}/>
        </div>
    )
}
export default React.memo(MessageInput)

const FilePreview = ({data, onClose}) => {
    const url = useMemo(() => {
        if (!data || !data.type.includes('image/')) return undefined
        return URL.createObjectURL(data)
    }, [data])
    return (
        <Paper 
        style={{
            minWidth: 200, width: 200, maxWidth: 200, minHeight: 200, maxHeight: 200, margin: '5px', position: 'relative', backgroundColor: '', color: 'lightgray', display: 'flex', padding: '10px 5px 20px 5px', backgroundColor: '#2f3136'
        }}>
            {
                url ?
                <img src={url} style={{maxWidth: '100%', height: '100%', objectFit: 'contain', margin: 'auto', borderRadius: '3px'}}/>
                :
                <InsertDriveFileIcon style={{margin: 'auto', fontSize: 100}}/>
            }
            <div style={{position: 'absolute', bottom: 0, left: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%'}}>{data.name}</div>
            <IconButton color='error' onClick={onClose} style={{position: 'absolute', top: 0, right: 0}}><CloseIcon/></IconButton>
            
        </Paper>
    )
}