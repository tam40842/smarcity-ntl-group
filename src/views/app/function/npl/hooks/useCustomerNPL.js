import { watchEffect, computed, ref, onBeforeMount } from 'vue';
import nplAPI from "@/api/modules/nplAPI";
import systemAPI from "@/api/modules/systemAPI";
import handling from "@/constants/handling";

const useCustomerNPL = () => {
  const isLoadingCustomers = ref(false)
  const listCustomer = ref([])
  const listContact = ref([])
  const objectKeylistCustomer = ref(null)
  const errorListCustomers = ref(null)
  
  const getListCustomerActive = () => {
    isLoadingCustomers.value = true;
    nplAPI.getCustomerListActive().then(res => {
      listCustomer.value = res.status ? res.data : []
      objectKeylistCustomer.value = res.status && res.data.length > 0 ? Object.keys(res.data[0]) : null;
      isLoadingCustomers.value = false;
    }).catch(err => {
      errorListCustomers.value = err.message;
      isLoadingCustomers.value = false;
    });
  }

  const getListCustomerByUserID = () => {
    isLoadingCustomers.value = true;
    nplAPI.getListCustomerByUserID().then(res => {
      listCustomer.value = res.status ? res.data : []
      isLoadingCustomers.value = false;
    }).catch(err => {
      errorListCustomers.value = err.message;
      isLoadingCustomers.value = false;
    });
  }

  const getListContactByCusID = (body) => {
    isLoadingCustomers.value = true;
    nplAPI.getListContactByCusID(body).then(res => {
      listContact.value = res.status ? res.data : []
      isLoadingCustomers.value = false;
    }).catch(err => {
      errorListCustomers.value = err.message;
      isLoadingCustomers.value = false;
    });
  }

  return { listCustomer,listContact,getListCustomerActive,getListCustomerByUserID,getListContactByCusID };
}

export default useCustomerNPL;
