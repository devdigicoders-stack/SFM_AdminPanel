import Swal from 'sweetalert2';

// Custom SweetAlert2 theme matching SFM Luxury Palette (#0b1d3a navy & #c1121f crimson)
export const showConfirmDialog = async ({
  title = 'Are you sure?',
  text = 'This action cannot be undone.',
  confirmButtonText = 'Yes, Proceed',
  cancelButtonText = 'Cancel',
  icon = 'warning',
  confirmButtonColor = '#c1121f'
}) => {
  return await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor: '#0b1d3a',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl font-sans shadow-2xl border border-slate-200',
      title: 'text-slate-900 font-black text-lg',
      htmlContainer: 'text-slate-600 text-xs',
      confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md',
      cancelButton: 'px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider'
    }
  });
};

export const showSuccessAlert = (title, text = '') => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2500,
    showConfirmButton: false,
    customClass: {
      popup: 'rounded-2xl font-sans shadow-2xl border border-slate-200',
      title: 'text-slate-900 font-black text-lg',
      htmlContainer: 'text-slate-600 text-xs'
    }
  });
};

export const showErrorAlert = (title, text = '') => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#c1121f',
    customClass: {
      popup: 'rounded-2xl font-sans shadow-2xl border border-slate-200',
      title: 'text-slate-900 font-black text-lg',
      htmlContainer: 'text-slate-600 text-xs',
      confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider'
    }
  });
};

// Toast notification using SweetAlert2
export const showToast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'rounded-2xl font-sans shadow-xl border border-slate-200 text-xs font-bold'
    }
  });

  return Toast.fire({
    icon,
    title
  });
};
