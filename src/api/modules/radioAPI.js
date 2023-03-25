import axiosClient from '../index'

const radioAPI = {
    radioStationByID: (body) => {
        const url = '/api/RadioStations/GetByRegionID'
        return axiosClient.post(url, body)
    },
    changePlaybackAndVocal: (body) => {
        const url = '/api/RadioSchedules/UpdatePlayback'
        return axiosClient.post(url, body)
    },

    //function
    radioScheduleList: (body) => {
        const url = '/api/RadioSchedules/GetRadioScheduleList'
        return axiosClient.post(url, body)
    },
    radioScheduleByID: (body) => {
        const url = '/api/RadioSchedules/GetRadioScheduleById'
        return axiosClient.post(url, body)
    },
    radioSchedulesAdd: (body) => {
        const url = '/api/RadioSchedules/Add'
        return axiosClient.post(url, body)
    },
    radioSchedulesEdit: (body) => {
        const url = '/api/RadioSchedules/Edit'
        return axiosClient.post(url, body)
    },
    radioSchedulesChangeStatus: (body) => {
        const url = '/api/RadioSchedules/ChangeStatus'
        return axiosClient.post(url, body)
    },
    radioSchedulesDelete: (body) => {
        const url = '/api/RadioSchedules/Delete'
        return axiosClient.post(url, body)
    },
    getRadioListActive: (body) => {
        const url = '/api/RadioStations/GetActive'
        return axiosClient.post(url, body)
    },
    radioRelayListActive: (body) => {
        const url = '/api/RadioRelay/GetActive'
        return axiosClient.post(url, body)
    },
    radioFMListActive: (body) => {
        const url = '/api/RadioFMTransceiver/GetActive'
        return axiosClient.post(url, body)
    },
    //get history-play
    getReportHistoryPlay: (body) => {
        const url = '/api/RadioSchedulesReports/Get'
        return axiosClient.post(url, body)
    },
    //category
    getExportID: (body) => {
        const url = '/api/Stations/GetExport'
        return axiosClient.post(url, body)
    },
    getRadioByID: (body) => {
        const url = '/api/RadioStations/GetStationById'
        return axiosClient.post(url, body)
    },
    getRadioList: (body) => {
        const url = '/api/RadioStations/Get'
        return axiosClient.post(url, body)
    },
    radioChangeStatus: (body) => {
        const url = '/api/RadioStations/ChangeStatus'
        return axiosClient.post(url, body)
    },
    //category-FM
    radioFMList: (body = null) => {
        const url = '/api/RadioFMTransceiver/Get'
        return axiosClient.post(url, body)
    },
    radioFMListActive: (body = null) => {
        const url = '/api/RadioFMTransceiver/GetActive'
        return axiosClient.post(url, body)
    },
    radioFMByID: (body = null) => {
        const url = '/api/RadioFMTransceiver/GetById'
        return axiosClient.post(url, body)
    },
    radioFMAdd: (body = null) => {
        const url = '/api/RadioFMTransceiver/Add'
        return axiosClient.post(url, body)
    },
    radioFMEdit: (body = null) => {
        const url = '/api/RadioFMTransceiver/Edit'
        return axiosClient.post(url, body)
    },
    radioFMChangeStatus: (body = null) => {
        const url = '/api/RadioFMTransceiver/ChangeStatus'
        return axiosClient.post(url, body)
    },
    radioFMDelete: (body = null) => {
        const url = '/api/RadioFMTransceiver/Delete'
        return axiosClient.post(url, body)
    },
    //category-replay
    radioRelayList: (body = null) => {
        const url = '/api/RadioRelay/Get'
        return axiosClient.post(url, body)
    },
    radioRelayListActive: (body = null) => {
        const url = '/api/RadioRelay/GetActive'
        return axiosClient.post(url, body)
    },
    radioRelayByID: (body = null) => {
        const url = '/api/RadioRelay/GetById'
        return axiosClient.post(url, body)
    },
    radioRelayAdd: (body = null) => {
        const url = '/api/RadioRelay/Add'
        return axiosClient.post(url, body)
    },
    radioRelayEdit: (body = null) => {
        const url = '/api/RadioRelay/Edit'
        return axiosClient.post(url, body)
    },
    radioRelayChangeStatus: (body = null) => {
        const url = '/api/RadioRelay/ChangeStatus'
        return axiosClient.post(url, body)
    },
    radioRelayDelete: (body = null) => {
        const url = '/api/RadioRelay/Delete'
        return axiosClient.post(url, body)
    },
}

export default radioAPI