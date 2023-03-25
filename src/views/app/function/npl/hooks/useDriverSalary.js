import { watchEffect, computed, ref, onBeforeMount } from 'vue';
import nplAPI from "@/api/modules/nplAPI";
import systemAPI from "@/api/modules/systemAPI";
import handling from "@/constants/handling";

const useTransportRequest = () => {
  const keyString = 'AJ_INCREASESALARY'
  const listSalaryDriver = ref([]);
  const listSalaryDriverActive = ref([]);
  const selectedSalaryDriver = ref(null)
  const dataSalaryDriverByID = ref(null)
  const objectKeySalaryDriver = ref(null)
  const listColumnShow = ref(null)
  const listColumnAdd = ref(null)
  const errorSalaryDriver = ref(null);
  const isLoadingSalaryDriver = ref(false);
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

  const getListSalaryDriver = () => {
    isLoadingSalaryDriver.value = true;
    nplAPI.getListDriverSalary().then(res => {
      listSalaryDriver.value = res.status ? res.data : []
      objectKeySalaryDriver.value = res.status && res.data.length > 0 ? Object.keys(res.data[0]) : null;
      isLoadingSalaryDriver.value = false;
      if(!selectedSalaryDriver.value){
        let objLast = res.data[res.data.length - 1]
        let body = {
          OID:objLast.OID
        }
        getSalaryDriverByID(body)
      }
    }).catch(err => {
      errorSalaryDriver.value = err.message;
      isLoadingSalaryDriver.value = false;
    });
  }

  const getTransportRequestActive = () => {
    isLoadingSalaryDriver.value = true;
    nplAPI.getListTransportRequestActive().then(res => {
      listSalaryDriverActive.value = res.status ? res.data : []
      objectKeySalaryDriver.value = res.status && res.data.length > 0 ? Object.keys(res.data[0]) : null;
      isLoadingSalaryDriver.value = false;
    }).catch(err => {
      errorSalaryDriver.value = err.message;
      isLoadingSalaryDriver.value = false;
    });
  }

  const getSalaryDriverByID = (body) => {
    nplAPI.getSalaryDriverByID(body).then(res => {
      dataSalaryDriverByID.value = res.status ? res.data : null
      selectedSalaryDriver.value = res.status ? mergeDataForm(res.data) : null
    }).catch(err => {
      errorSalaryDriver.value = 'Lỗi getSalaryDriverByID';
    });
  }

  const mergeDataForm = (obj) => {
    const arr = obj.Properties
    const results = {}
    for (const key in obj) {
      arr.forEach(e => {
        if (e.ClName.toUpperCase() === key.toUpperCase()) {
          let newObj = {
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

  const handleFormAddSalaryDriver = () => {
    const arr = listColumnAdd.value
    selectedSalaryDriver.value = {}
    arr.forEach(e => {
      let newObj = {
        label: e.ShwName,
        value: null,
        type: e.TypeCol,
        isHide: e.IsHide,
        class: e.TypeCol.toUpperCase() === 'NUMBER' ? 'text-right' : e.TypeCol.toUpperCase() === 'STRING' || e.TypeCol.toUpperCase() === 'NOTE' ? 'text-left' : 'text-center',
        valid: true
      }
      Object.assign(selectedSalaryDriver.value, { [e.ClName]: newObj });
    });
  }

  const addSalaryDriver = async (body) => {
    let result = await nplAPI.addSalaryDriver(body)
    return result
  }

  const editSalaryDriver = async (body) => {
    let result = await nplAPI.editSalaryDriver(body)
    return result
  }

  const copySalaryDriver = async (body) => {
    let result = await nplAPI.copySalaryDriver(body)
    return result
  }

  const deleteSalaryDriver = async (body) => {
    let result = await nplAPI.deleteSalaryDriver(body)
    return result
  }

  const changeStatusSalaryDriver = async (body) => {
    let result = await nplAPI.changeStatusSalaryDriver(body)
    return result
  }

  const approvalTransportRequest = async (body) => {
    let result = await nplAPI.approvalTransportRequest(body)
    return result
  }

  const handleSearch = async (body) => {
    let result = await nplAPI.search(body)
    return result
  }

  watchEffect(() => {
    if (objectKeySalaryDriver.value) {
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

  const fieldSalaryDriverFinal = computed(() => {
    return handling.mergeKeyDynamic(
      objectKeySalaryDriver.value,
      listColumnShow.value
    );
  })

  return { optionOperators, listColumnShow, fieldSalaryDriverFinal, listSalaryDriver, listSalaryDriverActive, selectedSalaryDriver, dataSalaryDriverByID, errorSalaryDriver, isLoadingSalaryDriver, getListSalaryDriver, getTransportRequestActive, getSalaryDriverByID, getDataFormAdd, handleFormAddSalaryDriver, editSalaryDriver, changeStatusSalaryDriver, handleSearch, approvalTransportRequest, addSalaryDriver, deleteSalaryDriver, copySalaryDriver };
}

export default useTransportRequest;
