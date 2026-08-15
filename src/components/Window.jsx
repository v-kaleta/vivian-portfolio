import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Draggable from 'react-draggable';

export default function Window({ id, title, isOpen, zIndex, position, onClose, onFocus, onDrag, className = '', children }) {
  const nodeRef = useRef(null);
  const previouslyFocused = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouchDevice(mq.matches);
    const handler = (e) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // on mobile, open every window centered on the actual viewport instead of
  // using the desktop cascade offsets (which are fixed pixel values tuned
  // for wide screens and push windows off-screen on a phone)
  useLayoutEffect(() => {
    if (!isOpen) return;
    const isMobile = window.innerWidth < 700;
    if (!isMobile) return;
    const node = nodeRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const centeredLeft = Math.max(8, (window.innerWidth - rect.width) / 2);
    const centeredTop = Math.max(16, (window.innerHeight - rect.height) / 2);
    onDrag(id, { left: centeredLeft, top: centeredTop });
  }, [isOpen, id, onDrag]);

  useEffect(() => {
    if (!isOpen) return;

    // remember what had focus so we can restore it when the window closes
    previouslyFocused.current = document.activeElement;

    // move focus into the window
    const node = nodeRef.current;
    const focusable = node?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    (focusable?.[0] || node)?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose(id);
        return;
      }

      if (e.key === 'Tab' && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, id, onClose]);

  if (!isOpen) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      handle={isTouchDevice ? '.window-titlebar' : undefined}
      cancel=".close-btn, a, button, input, textarea, select"
      position={{ x: position.left, y: position.top }}
      onStart={() => onFocus(id)}
      onDrag={(e, data) => onDrag(id, { top: data.y, left: data.x })}
    >
      <div
        ref={nodeRef}
        className={`window ${className}`}
        style={{ zIndex }}
        onMouseDown={() => onFocus(id)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`window-title-${id}`}
        tabIndex={-1}
      >
        <div className="window-titlebar">
          <span className="window-title" id={`window-title-${id}`}>{title}</span>
          <button className="close-btn" onClick={() => onClose(id)} aria-label={`Close ${title} window`}>
            [ x ]
          </button>
        </div>
        <div className="window-body">{children}</div>
      </div>
    </Draggable>
  );
}