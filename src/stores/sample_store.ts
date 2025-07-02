import {defineStore} from "pinia";
import {Sample} from "../types/sample";
import {computed, ref, watch} from "vue";
import {FETCH_SAMPLE_URL, WS_HEARTBEAT_INTERVAL, WS_SAMPLE_STATUS_URL} from "../utils/constant";
import {auth_store} from "./auth_store";
import apiClient from "../utils/asiox_instance";
import { getDatetimeByArrayTimeFormat, getKBFormatedSize, getStatusName } from "../utils/common_utils";

export const useSampleStore = defineStore("sample-store", () => {
    const samplesRaw = ref<Sample[]>([]); // 用来持久化
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
        return samplesRaw.value
            .sort((a, b) => b.id - a.id)
            .slice(0, pagination.value.pageSize)
            .map((sample) => {
                return {
                    id: sample.id,
                    name: sample.filename,
                    size: getKBFormatedSize(sample.fileSize),
                    status: getStatusName(sample.disposeStatus),
                    createTime: getDatetimeByArrayTimeFormat(sample.createTime),
                    hash: sample.fileMd5
                }
            })
    })
    const handlers: Map<string, (data) => void> = new Map()

    function connectWebSocket() {
        if (wsConnection.value && wsConnection.value.readyState === WebSocket.OPEN) {
            console.log("WebSocket already connected")
            return;
        }

        // 先注册处理函数
        if (handlers.size === 0) {
            registerHandler()
        }

        const token = auth_store().token
        // const isLoggedIn = auth_store().isLoggedIn
        // if (!isLoggedIn || token === null) return // 没有登录成功之前不能建立链接

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
            samplesRaw.value
                .filter(sample => sample.id === sampleId)
                .forEach((sample) => {
                    sample.disposeStatus = status
                })
        }

        function onSampleUploadSuccess(data) {
            const newSample = data.data
            const curSampleId = newSample.id;

            const existingIndex = samplesRaw.value.findIndex(sample => sample.id === curSampleId)
            if (existingIndex != -1) {
                samplesRaw.value[existingIndex] = newSample
            } else {
                samplesRaw.value.push(newSample)
            }
            // console.log("Received data: ", JSON.stringify(data, null, 2))
        }

    }

    function disconnectWebSocket() {
        if (wsConnection.value && wsConnection.value.readyState === WebSocket.OPEN) {
            wsConnection.value.close()
            wsConnected.value = false
        }
    }

    async function fetchSamples() {
        // 没有登录之前，不能调用
        const isLoggedIn = auth_store().isLoggedIn
        if (!isLoggedIn) return

        // 首先设置加载状态
        loading.value = true
        try {
            const response = await apiClient.get(FETCH_SAMPLE_URL, {
                params: {
                    pageNum: pagination.value.page,
                    pageSize: pagination.value.pageSize,
                }
            })

            if (response && response.data.code === 0) {
                const responseData = response.data.data
                pagination.value.total = responseData.total
                samplesRaw.value = responseData.list as Sample[] // 直接刷新
            }
        } catch (error) {
            console.error(error)
        }
        loading.value = false
    }

    // 根据登录情况自动链接或者断开WS
    const authStore = auth_store()
    watch(() => authStore.isLoggedIn, (newState, oldState) => {
        if (newState && !oldState) {
            // 登录成功
            connectWebSocket()
        } else {
            disconnectWebSocket()
        }
    })

    return {
        samplesRaw,
        loading,
        wsConnection,
        wsConnected,
        pagination,
        heartbeatInterval,
        connectWebSocket,
        disconnectWebSocket,
        fetchSamples,
        getSampleList
    }
},
    {
        persist: true
    } as any)