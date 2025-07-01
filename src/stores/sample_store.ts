import {defineStore} from "pinia";
import {Sample} from "../types/sample";
import {computed, ref} from "vue";
import {FETCH_SAMPLE_URL, WS_HEARTBEAT_INTERVAL, WS_SAMPLE_STATUS_URL} from "../utils/constant";
import {auth_store} from "./auth_store";
import apiClient from "../utils/asiox_instance";
import { getDatetimeByArrayTimeFormat, getKBFormatedSize, getStatusName } from "../utils/common_utils";


export const useSampleStore = defineStore("sample-store", () => {
    const samples = ref(new Map<number, Sample>())
    const loading = ref(false)
    const wsConnection = ref(null)
    const wsConnected = ref(false)
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0,
    })
    const heartbeatInterval = ref(0)
    const getSampleList = computed(() => {
        return Array.from(samples.value.values())
            .sort((a, b) => b.id - a.id)  // 按 id 降序
            .slice(0, pagination.value.pageSize)
            .map((sample) => ({
                id: sample.id,
                name: sample.filename,
                size: getKBFormatedSize(sample.fileSize),
                status: getStatusName(sample.disposeStatus),
                createTime: getDatetimeByArrayTimeFormat(sample.createTime),
                hash: sample.fileMd5
            }));
    })

    const handlers: Map<string, (data) => void> = new Map()

    function connectWebSocket() {
        if (wsConnection.value && wsConnection.value.readyState === WebSocket.OPEN) {
            console.log("WebSocket already connected")
            return;
        }
        // 先注册处理函数
        registerHandler()
        const token = auth_store().token
        console.log("Connecting to the websocket")
        wsConnection.value = new WebSocket(`${WS_SAMPLE_STATUS_URL}?auth=${token}`)

        wsConnection.value.onopen = () => {
            console.log("Connection opened")
            wsConnected.value = true
            startHeartbeat()
        }

        wsConnection.value.onmessage = (event) => {
            try {
                if (event.data === 'pong') {
                    // 心跳检测的响应
                    return;
                }
                const data = JSON.parse(event.data)
                if (data.code === 0) {
                    handleSampleStatusUpdate(data)
                }
            } catch (e) {
                console.error("Failed to parse data: ", e)
            }
        }

        wsConnection.value.onclose = () => {
            console.log("WebSocket Connection closed")
        }

        function startHeartbeat() {
            heartbeatInterval.value = setInterval(() => {
                wsConnection.value.send("ping")
            }, WS_HEARTBEAT_INTERVAL)
        }

        function handleSampleStatusUpdate(data) {
            const handler = handlers.get(data.message)
            if (handler) {
                handler(data)
            }
            // const sampleId = data.sampleId
            // const status = data.sampleStatus
            // const sample = samples.value.get(sampleId)
            // console.log(isRef(sample))
            // if (sample) {
            //     sample.value.disposeStatus = status
            // }
        }

        function registerHandler() {
            handlers.set("SampleStatusUpdate", onSampleStatusUpdate)
            handlers.set("SampleUploadSuccess", onSampleUploadSuccess)
        }

        function onSampleStatusUpdate(data) {
            console.log("Received onSampleStatusUpdate", JSON.stringify(data, null, 2))
            const sampleId = data.data.sampleId
            const status = data.data.status
            console.log("Received sample id ", sampleId)
            console.log("Received status ", status)
            const sample = samples.value.get(sampleId)
            if (sample) {
                sample.disposeStatus = status
            }
        }

        function onSampleUploadSuccess(data) {
            const sample = data.data
            const curSampleId = sample.id;
            samples.value.set(curSampleId, sample)
            if (samples.value.get(curSampleId)) return
            // 处理溢出
            if (pagination.value.pageSize < samples.value.size) {

            }
            // console.log("Received data: ", JSON.stringify(data, null, 2))
        }

    }

    async function fetchSamples() {
        const response = await apiClient.get(FETCH_SAMPLE_URL, {
            params: {
                pageNum: pagination.value.page,
                pageSize: pagination.value.pageSize,
            }
        })

        if (response && response.data.code === 0) {
            const responseData = response.data.data
            pagination.value.total = responseData.total
            const sampleList = responseData.list as Sample[]
            samples.value.clear() // 清空当前页
            sampleList.forEach((sample) => {
                const id = sample.id
                samples.value.set(id, sample)
            })
        }
    }

    return {
        samples,
        loading,
        wsConnection,
        wsConnected,
        pagination,
        heartbeatInterval,
        connectWebSocket,
        fetchSamples,
        getSampleList
    }

})