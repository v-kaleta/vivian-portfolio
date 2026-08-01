import { useRef } from 'react';
import Draggable from 'react-draggable';

export default function Window({ id, title, isOpen, zIndex, position, onClose, onFocus, onDrag, className = '', children }) {
  const nodeRef = useRef(null);

  if (!isOpen) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-titlebar"
      cancel=".close-btn"
      position={{ x: position.left, y: position.top }}
      onStart={() => onFocus(id)}
      onDrag={(e, data) => onDrag(id, { top: data.y, left: data.x })}
    >
      <div
        ref={nodeRef}
        className={`window ${className}`}
        style={{ zIndex }}
        onMouseDown={() => onFocus(id)}
      >
        <div className="window-titlebar">
          <span className="window-title">{title}</span>
          <button className="close-btn" onClick={() => onClose(id)}>[ x ]</button>
        </div>
        <div className="window-body">{children}</div>
      </div>
    </Draggable>
  );
}

