import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { WorkFormValues } from '@/lib/Validations/SchemaForm';
import { AlertCircle } from 'lucide-react';
import DatePickerTH from '@/components/DueDate/Date';
import DropdownTechnician from './DropdownTechnician';

interface DateRangeSectionProps {
  errors: FieldErrors<WorkFormValues>;
  technicians: any[];
}

const DateRangeSection: React.FC<DateRangeSectionProps> = ({ errors, technicians }) => {
  return (
    <>
      <DropdownTechnician technicians={technicians} />
      <DatePickerTH />
      {(errors.dateRange?.startAt || errors.dateRange?.endAt) && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
          <AlertCircle className="w-4 h-4" />
          {errors.dateRange?.startAt?.message}
          {errors.dateRange?.endAt?.message}
        </div>
      )}
    </>
  );
};

export default DateRangeSection;