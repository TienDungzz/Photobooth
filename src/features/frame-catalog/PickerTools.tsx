import { useTranslation } from 'react-i18next';
import { Dropdown, type DropdownOption } from '../../shared/components/Dropdown';

export function PickerTools({
  controls,
}: {
  controls: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly DropdownOption[];
  }[];
}) {
  const { t } = useTranslation();
  return (
    <div className="picker-tools">
      <div className="picker-tools__controls">
        {controls.map((control) => (
          <Dropdown
            key={control.label}
            label={t(control.label)}
            value={control.value}
            onChange={control.onChange}
            options={control.options}
          />
        ))}
      </div>
    </div>
  );
}
