import { useEffect, useId, useRef, type RefObject } from 'react';
import { CircleAlert, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './ConfirmDialog.css';

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  returnFocus,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  returnFocus?: RefObject<HTMLElement | null>;
}) {
  const { t } = useTranslation();
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement;
    const fallback = returnFocus?.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const node = dialog.current;
    node?.showModal();
    cancel.current?.focus();
    return () => {
      node?.close();
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
      else if (fallback?.isConnected) fallback.focus();
    };
  }, [returnFocus]);
  return (
    <dialog
      ref={dialog}
      className="confirm-dialog"
      role="alertdialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <div className="confirm-dialog__heading">
        <span className="confirm-dialog__icon">
          <CircleAlert size={23} />
        </span>
        <button className="icon-button" aria-label={t('close')} onClick={onCancel}>
          <X size={20} />
        </button>
      </div>
      <h2 id={`${id}-title`} className="confirm-dialog__title">
        {title}
      </h2>
      <p id={`${id}-description`} className="confirm-dialog__description">
        {description}
      </p>
      <div className="confirm-dialog__actions">
        <button ref={cancel} className="button" onClick={onCancel}>
          {t('cancelAction')}
        </button>
        <button className="button confirm-dialog__confirm" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
