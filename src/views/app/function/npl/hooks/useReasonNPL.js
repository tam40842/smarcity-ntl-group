import { ref } from 'vue';
import nplAPI from "@/api/modules/nplAPI";

const useReasonNPL = () => {
    const keyString = ''
    const listReasonCoordinator = ref([]);
    const listReasonCustomer = ref([]);
    const listReasonSale = ref([]);
    const errorReason = ref(null);
    const isLoadingReason = ref(false);

    const getListReasonCoordinator = () => {
        isLoadingReason.value = true;
        nplAPI.getListReasonCoordinator().then(res => {
            listReasonCoordinator.value = []
            let arr = res.status ? res.data : []
            arr.forEach(e => {
                let obj ={
                    ...e,
                    id:e.ID,
                    label:e.CancelReasonName,
                }
                listReasonCoordinator.value.push(obj)
            });
            isLoadingReason.value = false;
        }).catch(err => {
            errorReason.value = err.message;
            isLoadingReason.value = false;
        });
    }

    const getListReasonByCustomer = () => {
        isLoadingReason.value = true;
        nplAPI.getListReasonByCustomer().then(res => {
            listReasonCustomer.value = []
            let arr = res.status ? res.data : []
            arr.forEach(e => {
                let obj ={
                    ...e,
                    id:e.ID,
                    label:e.CancelReasonName,
                }
                listReasonCustomer.value.push(obj)
            });
            isLoadingReason.value = false;
        }).catch(err => {
            errorReason.value = err.message;
            isLoadingReason.value = false;
        });
    }

    const getListReasonBySale = () => {
        isLoadingReason.value = true;
        nplAPI.getListReasonBySale().then(res => {
            listReasonSale.value = []
            let arr = res.status ? res.data : []
            arr.forEach(e => {
                let obj ={
                    ...e,
                    id:e.ID,
                    label:e.CancelReasonName,
                }
                listReasonSale.value.push(obj)
            });
            isLoadingReason.value = false;
        }).catch(err => {
            errorReason.value = err.message;
            isLoadingReason.value = false;
        });
    }

    return { listReasonCoordinator,listReasonCustomer,listReasonSale, getListReasonCoordinator,getListReasonByCustomer,getListReasonBySale };
}

export default useReasonNPL;
