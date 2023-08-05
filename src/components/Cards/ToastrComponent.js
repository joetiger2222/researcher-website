import { useEffect } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const ToastrComponent = () => {
  useEffect(() => {
    // Toastr configuration
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: 'toast-top-center',
      preventDuplicates: false,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
    };

    // // Example usage
    // toastr.success('Success message', 'Success');
    // toastr.info('Info message', 'Info');
    // toastr.warning('Warning message', 'Warning');
    // toastr.error('Error message', 'Error');
  }, []);

  return null;
};

export default ToastrComponent;
