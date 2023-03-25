import { inject } from "vue";

const useToasts = () => {
  const $tuToast = inject("$tuToast");

  const showToast = (status = 'success',title='THÔNG BÁO',text='Xử lí mặc định !') => {
    $tuToast(status, title,text, {
      duration: 3000,
      permanent: false,
    });
  };

  return {  showToast };
}

export default useToasts;
