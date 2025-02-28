import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formClasses } from '../common/FormStyles';

const CustomerForm = ({ onClose, initialData }) => {
  const { customers, setCustomers } = useAppContext();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: initialData || {
      name: '',
      type: 'one-time',
      phone: '',
      email: '',
      address: '',
      creditLimit: 0
    }
  });

  const customerType = watch('type');

  const onSubmit = (data) => {
    if (initialData) {
      setCustomers(customers.map(c => c.id === initialData.id ? { ...data, id: initialData.id } : c));
    } else {
      setCustomers([...customers, { ...data, id: Date.now().toString(), currentCredit: 0 }]);
    }
    onClose();
  };

  return (
    <div className={formClasses.container}>
      <div className={formClasses.form}>
        <div className={formClasses.header}>
          <h2 className={formClasses.title}>
            {initialData ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button onClick={onClose} className={formClasses.closeButton}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={formClasses.label}>Customer Name</label>
            <input
              type="text"
              {...register('name', { required: 'Customer name is required' })}
              className={formClasses.input}
            />
            {errors.name && (
              <p className={formClasses.error}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={formClasses.label}>Customer Type</label>
            <select
              {...register('type')}
              className={formClasses.input}
            >
              <option value="one-time">One-time Customer</option>
              <option value="regular">Regular Customer</option>
            </select>
          </div>

          <div>
            <label className={formClasses.label}>Phone Number</label>
            <input
              type="tel"
              {...register('phone')}
              className={formClasses.input}
            />
          </div>

          <div>
            <label className={formClasses.label}>Email</label>
            <input
              type="email"
              {...register('email')}
              className={formClasses.input}
            />
          </div>

          <div>
            <label className={formClasses.label}>Address</label>
            <textarea
              {...register('address')}
              rows={3}
              className={formClasses.input}
            />
          </div>

          {customerType === 'regular' && (
            <div>
              <label className={formClasses.label}>Credit Limit (₹)</label>
              <input
                type="number"
                {...register('creditLimit')}
                className={formClasses.input}
              />
            </div>
          )}

          <div className={formClasses.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={formClasses.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={formClasses.submitButton}
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CustomerForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    creditLimit: PropTypes.number,
  }),
};

export default CustomerForm;