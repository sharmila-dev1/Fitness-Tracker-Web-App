import {useEffect} from 'react'

export default function Modal({ show, onClose, title ,children, size = 'md'}){
    useEffect(() => {
        if(show) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = ''}
    }, [show])

    if (!show) return null ;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-box modal-${size}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    )
}
