import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import './Dropdown.css';

export type DropdownOption = { value: string; label: string };

/** Select-only combobox; the popup is portalled so scrolling sidebars cannot clip it. */
export function Dropdown({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: readonly DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: '', time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0, maxHeight: 300 });
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const close = useCallback(() => {
    setOpen(false);
    typeahead.current = { text: '', time: 0 };
  }, []);
  const locate = useCallback(() => {
    if (!trigger.current) return false;
    const box = trigger.current.getBoundingClientRect(),
      gap = 6,
      margin = 8;
    if (!box.height || box.bottom < margin || box.top > innerHeight - margin) {
      close();
      return false;
    }
    const below = innerHeight - box.bottom - gap - margin;
    const above = box.top - gap - margin;
    const upwards = below < 180 && above > below;
    const maxHeight = Math.max(
      60,
      Math.min(300, options.length * 44 + 12, upwards ? above : below),
    );
    const width = Math.min(Math.max(box.width, 190), innerWidth - margin * 2);
    setPosition({
      left: Math.max(margin, Math.min(box.left, innerWidth - width - margin)),
      top: upwards ? Math.max(margin, box.top - gap - maxHeight) : box.bottom + gap,
      width,
      maxHeight,
    });
    return true;
  }, [options.length, close]);
  const show = (index = selected) => {
    if (disabled || !options.length || !locate()) return;
    setActive(index);
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close();
    trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !popup.current?.contains(target)) close();
    };
    const scroll = (event: Event) => {
      if (!popup.current?.contains(event.target as Node)) locate();
    };
    const resize = () => {
      locate();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    window.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      window.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', resize);
    };
  }, [open, close, locate]);
  useEffect(() => {
    if (!open || !popup.current) return;
    const option = document.getElementById(`${id}-option-${active}`);
    if (!option) return;
    const menu = popup.current;
    const top = option.offsetTop,
      bottom = top + option.offsetHeight;
    if (top < menu.scrollTop + 5) menu.scrollTop = Math.max(0, top - 5);
    else if (bottom > menu.scrollTop + menu.clientHeight - 5)
      menu.scrollTop = bottom - menu.clientHeight + 5;
  }, [open, active, id]);

  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key === 'Tab') {
      close();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) choose(active);
      else show();
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const index =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? options.length - 1
            : open
              ? (active + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length
              : selected;
      if (open) setActive(index);
      else show(index);
      return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const now = Date.now();
    typeahead.current = {
      text: now - typeahead.current.time > 700 ? event.key : typeahead.current.text + event.key,
      time: now,
    };
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .toLowerCase();
    const query = normalize(typeahead.current.text);
    const index = options.findIndex((option) => normalize(option.label).startsWith(query));
    if (index >= 0) {
      if (open) setActive(index);
      else show(index);
    }
  };

  return (
    <div className="dropdown">
      <span className="dropdown__label">{label}</span>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        disabled={disabled}
        className="dropdown__trigger"
        onKeyDown={keyDown}
        onClick={() => {
          if (open) close();
          else show();
        }}
      >
        <span>{options[selected]?.label}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <div
            ref={popup}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            className="dropdown__menu"
            style={position}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={value === option.value}
                className={
                  'dropdown__option' + (active === index ? ' dropdown__option--active' : '')
                }
                onMouseDown={(event) => event.preventDefault()}
                onPointerMove={() => setActive(index)}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={14} aria-hidden="true" />}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
