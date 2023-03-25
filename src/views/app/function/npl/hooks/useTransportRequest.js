import { watchEffect, computed, ref, onBeforeMount } from 'vue';
import nplAPI from "@/api/modules/nplAPI";
import systemAPI from "@/api/modules/systemAPI";
import handling from "@/constants/handling";

const useTransportRequest = () => {
  const keyString = 'RC_SHIPREQUETS'
  const listTransportRequest = ref([]);
  const listTransportRequestActive = ref([]);
  const selectedTransportRequest = ref(null)
  const dataTransportRequestByID = ref(null)
  const objectKeyTransportRequest = ref(null)
  const listColumnShow = ref(null)
  const listColumnAdd = ref(null)
  const errorTransportRequest = ref(null);
  const isLoadingTransportRequest = ref(false);
  const optionOperators = ref(null)


  onBeforeMount(async () => {
    await getOperators()
    await getDataFormAdd()
  })

  const getOperators = () => {
    nplAPI.getMethodSearch().then(val => {
      optionOperators.value = val.status ? val.data : null
    }).catch(err => console.log(err))
  }

  const getTransportRequest = () => {
    isLoadingTransportRequest.value = true;
    nplAPI.getListTransportRequest().then(res => {
      listTransportRequest.value = res.status ? res.data : []
      objectKeyTransportRequest.value = res.status && res.data.length > 0 ? Object.keys(res.data[0]) : null;
      isLoadingTransportRequest.value = false;
      if(!selectedTransportRequest.value){
        let objLast = res.data[res.data.length - 1]
        let body = {
          OID:objLast.OID
        }
        getTransportRequestByID(body)
      }
    }).catch(err => {
      errorTransportRequest.value = err.message;
      isLoadingTransportRequest.value = false;
    });
  }

  const getTransportRequestActive = () => {
    isLoadingTransportRequest.value = true;
    nplAPI.getListTransportRequestActive().then(res => {
      listTransportRequestActive.value = res.status ? res.data : []
      objectKeyTransportRequest.value = res.status && res.data.length > 0 ? Object.keys(res.data[0]) : null;
      isLoadingTransportRequest.value = false;
    }).catch(err => {
      errorTransportRequest.value = err.message;
      isLoadingTransportRequest.value = false;
    });
  }

  const getTransportRequestByID = (body) => {
    nplAPI.getTransportRequestByID(body).then(res => {
      dataTransportRequestByID.value = res.status ? res.data : null
      selectedTransportRequest.value = res.status ? mergeDataForm(res.data) : null
      console.log('byID',body.OID,selectedTransportRequest.value )
      console.log(dataTransportRequestByID.value )
    }).catch(err => {
      errorTransportRequest.value = 'Lỗi getTransportRequestByID';
    });
  }

  const mergeDataForm = (obj) => {
    const arr = obj.Properties
    const results = {}
    for (const key in obj) {
      arr.forEach(e => {
        if (e.ClName.toUpperCase() === key.toUpperCase()) {
          let newObj = {
            name:e.ClName,
            label: e.ShwName,
            value: obj[key],
            type: e.TypeCol,
            isHide: e.IsHide,
            class: e.TypeCol.toUpperCase() === 'NUMBER' ? 'text-right' : e.TypeCol.toUpperCase() === 'STRING' || e.TypeCol.toUpperCase() === 'NOTE' ? 'text-left' : 'text-center',
            valid: true
          }
          Object.assign(results, { [e.ClName]: newObj });
        }
      });
    }
    return results
  }

  const handleFormAddTransportRequest = () => {
    const arr = listColumnAdd.value
    selectedTransportRequest.value = {}
    arr.forEach(e => {
      let newObj = {
        name:e.ClName,
        label: e.ShwName,
        value: null,
        type: e.TypeCol,
        isHide: e.IsHide,
        class: e.TypeCol.toUpperCase() === 'NUMBER' ? 'text-right' : e.TypeCol.toUpperCase() === 'STRING' || e.TypeCol.toUpperCase() === 'NOTE' ? 'text-left' : 'text-center',
        valid: true
      }
      Object.assign(selectedTransportRequest.value, { [e.ClName]: newObj });
    });
  }

  const addTransportRequest = async (body) => {
    let result = await nplAPI.addTransportRequest(body)
    return result
  }

  const editTransportRequest = async (body) => {
    let result = await nplAPI.editTransportRequest(body)
    return result
  }

  const deleteTransportRequestByID = async (body) => {
    let result = await nplAPI.deleteTransportRequestByID(body)
    return result
  }

  const changeStatusTransportRequest = async (body) => {
    let result = await nplAPI.changeStatusTransportRequest(body)
    return result
  }

  const approvalTransportRequest = async (body) => {
    let result = await nplAPI.approvalTransportRequest(body)
    return result
  }

  const approvalSaleProcess = async (body) => {
    let result = await nplAPI.approvalSaleProcess(body)
    return result
  }

  const handleSearch = async (body) => {
    let result = await nplAPI.search(body)
    return result
  }

  watchEffect(() => {
    if (objectKeyTransportRequest.value) {
      try {
        let body = {
          ObjectName: keyString,
        };
        systemAPI
          .tableFields(body)
          .then((val) => {
            listColumnShow.value = val.status ? val.data : [];
          }).catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log('watchEffect', error)
      }
    }
  });

  const getDataFormAdd = () => {
    let body = {
      ObjectName: keyString,
    };
    systemAPI.modalFields(body)
      .then((val) => {
        listColumnAdd.value = val.status ? val.data : [];
      }).catch((err) => {
        console.log(err);
      });
  }

  const fieldTransportRequestFinal = computed(() => {
    return handling.mergeKeyDynamic(
      objectKeyTransportRequest.value,
      listColumnShow.value
    );
  })

  return { optionOperators, listColumnShow, fieldTransportRequestFinal, listTransportRequest, listTransportRequestActive, selectedTransportRequest, dataTransportRequestByID, errorTransportRequest, isLoadingTransportRequest, getTransportRequest, getTransportRequestActive, getTransportRequestByID, getDataFormAdd, deleteTransportRequestByID, handleFormAddTransportRequest, addTransportRequest, editTransportRequest, changeStatusTransportRequest, handleSearch, approvalTransportRequest,approvalSaleProcess };
}

export default useTransportRequest;
