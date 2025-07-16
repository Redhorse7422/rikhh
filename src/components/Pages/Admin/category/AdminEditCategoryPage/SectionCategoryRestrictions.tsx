'use client'

import type { FC } from 'react'
import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { CheckboxField } from '@/components/FormElements/CheckboxInput'
import { TextAreaField } from '@/components/FormElements/Fields/TextAreaField'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { US_STATES } from '@/constants/states'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { Grid } from '@/libs/pureTailwind'

interface CategoryRestriction {
  id?: string
  categoryId: string
  states: string[]
  reason: string
  customMessage: string
  isActive: boolean
  notes: string
}

interface SectionCategoryRestrictionsProps {
  categoryId: string
}

const defaultValues: Omit<CategoryRestriction, 'categoryId'> = {
  states: [],
  reason: '',
  customMessage: '',
  isActive: true,
  notes: '',
}

export const SectionCategoryRestrictions: FC<SectionCategoryRestrictionsProps> = ({ categoryId }) => {
  const { showToast } = useToast()
  const { getDataSource, createDataSource, updateDataSource } = useApi()
  const [isLoading, setIsLoading] = useState(false)
  const [existingRestriction, setExistingRestriction] = useState<CategoryRestriction | null>(null)
  const [selectedStates, setSelectedStates] = useState<string[]>([])

  const { control, handleSubmit, setValue, reset, watch } = useForm<Omit<CategoryRestriction, 'categoryId'>>({
    defaultValues,
  })

  const watchedStates = watch('states')

  // Fetch existing restrictions for this category
  const { data: restrictions, refetch } = getDataSource<{ data: CategoryRestriction[] }>({
    path: '/v1/category-restrictions',
    query: { categoryId },
    enabled: !!categoryId,
  })

  useEffect(() => {
    if (restrictions?.data && restrictions.data.length > 0) {
      const restriction = restrictions.data[0] // Assuming one restriction per category
      setExistingRestriction(restriction)
      setSelectedStates(restriction.states || [])

      // Populate form with existing data
      setValue('states', restriction.states || [])
      setValue('reason', restriction.reason || '')
      setValue('customMessage', restriction.customMessage || '')
      setValue('isActive', restriction.isActive ?? true)
      setValue('notes', restriction.notes || '')
    }
  }, [restrictions, setValue])

  const handleStateToggle = (stateCode: string) => {
    const newStates = selectedStates.includes(stateCode)
      ? selectedStates.filter((state) => state !== stateCode)
      : [...selectedStates, stateCode]

    setSelectedStates(newStates)
    setValue('states', newStates)
  }

  const handleSelectAllStates = () => {
    const allStateCodes = US_STATES.map((state) => state.value)
    setSelectedStates(allStateCodes)
    setValue('states', allStateCodes)
  }

  const handleClearAllStates = () => {
    setSelectedStates([])
    setValue('states', [])
  }

  const onSubmit = async (data: Omit<CategoryRestriction, 'categoryId'>) => {
    if (!categoryId) {
      showToast('Category ID is required', 'error')
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        categoryId,
        states: data.states,
        reason: data.reason.trim(),
        customMessage: data.customMessage.trim(),
        isActive: data.isActive,
        notes: data.notes.trim(),
      }

      if (existingRestriction?.id) {
        // Update existing restriction
        await updateDataSource.mutateAsync({
          path: `/v1/category-restrictions/${existingRestriction.id}`,
          body: payload,
        })
        showToast('Category restrictions updated successfully!', 'success')
      } else {
        // Create new restriction
        await createDataSource.mutateAsync({
          path: '/v1/category-restrictions',
          body: payload,
        })
        showToast('Category restrictions created successfully!', 'success')
      }

      refetch()
    } catch (error) {
      logger.error('Failed to save category restrictions:', error)
      showToast('Failed to save category restrictions. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (existingRestriction) {
      setSelectedStates(existingRestriction.states || [])
      setValue('states', existingRestriction.states || [])
      setValue('reason', existingRestriction.reason || '')
      setValue('customMessage', existingRestriction.customMessage || '')
      setValue('isActive', existingRestriction.isActive ?? true)
      setValue('notes', existingRestriction.notes || '')
    } else {
      reset(defaultValues)
      setSelectedStates([])
    }
  }

  return (
    <Card className='pt-10'>
      <div className='mb-6'>
        <h3 className='mb-2 text-lg font-semibold text-dark dark:text-white'>Category Restrictions</h3>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Configure which states this category cannot be shipped to due to legal or business restrictions.
        </p>
      </div>

      <div>
        <Grid rowGap={6} className='max-w-4xl'>
          {/* States Selection */}
          <div>
            <div className='mb-4'>
              <label className='mb-2 block text-sm font-medium text-dark dark:text-white'>
                Restricted States <span className='text-red-500'>*</span>
              </label>
              <div className='mb-4 flex gap-2'>
                <Button
                  type='button'
                  label='Select All'
                  variant='outlinePrimary'
                  size='small'
                  onClick={handleSelectAllStates}
                />
                <Button
                  type='button'
                  label='Clear All'
                  variant='outlineDark'
                  size='small'
                  onClick={handleClearAllStates}
                />
              </div>
            </div>

            <div className='grid max-h-60 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
              {US_STATES.map((state) => (
                <label
                  key={state.value}
                  className='flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-100 dark:hover:bg-dark-3'
                >
                  <input
                    type='checkbox'
                    checked={selectedStates.includes(state.value)}
                    onChange={() => handleStateToggle(state.value)}
                    className='rounded border-gray-300 text-primary focus:ring-primary'
                  />
                  <span className='truncate text-sm text-dark dark:text-white' title={state.label}>
                    {state.value}
                  </span>
                </label>
              ))}
            </div>

            {selectedStates.length > 0 && (
              <div className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                Selected: {selectedStates.length} state{selectedStates.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Reason */}
          <TextField
            control={control}
            name='reason'
            rules={{ required: 'Reason is required' }}
            label='Restriction Reason'
            placeholder='e.g., Legal cannabis restrictions'
            labelAxis='horizontal'
            labelWidth={160}
            maxLength={255}
            helperText='Brief explanation of why this category is restricted'
          />

          {/* Custom Message */}
          <TextAreaField
            control={control}
            name='customMessage'
            rules={{ required: 'Custom message is required' }}
            label='Customer Message'
            placeholder='e.g., Cannabis products cannot be shipped to your state'
          />

          {/* Notes */}
          <TextAreaField
            control={control}
            name='notes'
            label='Internal Notes'
            placeholder='e.g., THC products restricted in these states'
          />

          {/* Active Status */}
          <CheckboxField
            name='isActive'
            label='Active'
            control={control}
            labelWidth={160}
            labelAxis='horizontal'
            helperText='Enable or disable this restriction'
          />

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 border-t border-stroke pt-4 dark:border-dark-3'>
            <Button type='button' label='Reset' variant='outlineDark' onClick={handleReset} disabled={isLoading} />
            <Button
              type='button'
              label={existingRestriction ? 'Update Restrictions' : 'Create Restrictions'}
              disabled={isLoading || selectedStates.length === 0}
              loading={isLoading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </Grid>
      </div>
    </Card>
  )
}
