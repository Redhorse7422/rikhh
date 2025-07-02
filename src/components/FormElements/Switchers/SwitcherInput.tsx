import React from 'react'

type SwitcherInputProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  refInput?: React.Ref<HTMLInputElement>
  name?: string
  id?: string
}

const SwitcherInput: React.FC<SwitcherInputProps> = ({ checked, onChange, disabled, refInput, name, id }) => {
  return (
    <label htmlFor={id || name} className='flex cursor-pointer select-none items-center'>
      <div className='relative'>
        <input
          type='checkbox'
          id={id || name}
          name={name}
          className='sr-only'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          ref={refInput}
        />
        <div
          className={`block h-8 w-14 rounded-full bg-gray-3 dark:bg-[#5A616B] ${disabled ? 'opacity-50' : ''}`}
        ></div>
        <div
          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-switch-1 transition ${
            checked && '!right-1 !translate-x-full !bg-primary dark:!bg-white'
          }`}
        ></div>
      </div>
    </label>
  )
}

export default SwitcherInput
