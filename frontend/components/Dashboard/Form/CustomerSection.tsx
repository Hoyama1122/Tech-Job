import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { WorkFormValues } from '@/lib/Validations/SchemaForm';
import { User, Phone, Home, AlertCircle } from 'lucide-react';

interface CustomerSectionProps {
  register: UseFormRegister<WorkFormValues>;
  errors: FieldErrors<WorkFormValues>;
}

const CustomerSection: React.FC<CustomerSectionProps> = ({ register, errors }) => {
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d+)/, "$1-$2");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
    }
    e.target.value = value.slice(0, 12);
  };

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <User className="w-4 h-4 text-primary" />
          ชื่อลูกค้า <span className="text-red-500">*</span>
        </label>
        <input
          {...register("customerName")}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400"
          placeholder="กรอกชื่อ-นามสกุลลูกค้า"
        />
        {errors.customerName && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
            <AlertCircle className="w-4 h-4" />
            {errors.customerName.message}
          </div>
        )}
      </div>

      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Phone className="w-4 h-4 text-primary" />
          เบอร์โทรศัพท์ลูกค้า <span className="text-red-500">*</span>
        </label>
        <input
          {...register("customerPhone")}
          type="tel"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400"
          placeholder="000-000-0000"
          onInput={handlePhoneInput}
          maxLength={12}
        />
        {errors.customerPhone && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
            <AlertCircle className="w-4 h-4" />
            {errors.customerPhone.message}
          </div>
        )}
      </div>

      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Home className="w-4 h-4 text-primary" />
          ที่อยู่ <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("address")}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400 resize-none"
          rows={4}
          placeholder="กรอกที่อยู่ลูกค้า (บ้านเลขที่, หมู่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)"
        />
        {errors.address && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
            <AlertCircle className="w-4 h-4" />
            {errors.address.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSection;