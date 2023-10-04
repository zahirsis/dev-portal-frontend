import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import listTemplates from "@/common/actions/templates/listTemplates";
import listSquads from "@/common/actions/squads/listSquads";
import listEnvironments from "@/common/actions/environments/listEnvironments";
import {optionValue} from "@/common/types";
import {SetupCiCdState} from "@/common/store/Slices/setup-ci-cd/types";
import setupCiCd, {SetupData} from "@/common/actions/ci-cd/setupCiCd";
import {INPUT_ERROR} from "@/common/errors/inputError";
import getCiCdData from "@/common/actions/ci-cd/getData";

export const loadData = createAsyncThunk(
    'setupCiCd/loadData',
    async () => {
        const templates = await listTemplates()
        const squads = await listSquads()
        const envs = await listEnvironments()
        const data = await getCiCdData()
        return {
            templates,
            squads,
            envs,
            data,
        }
    }
)

export const sendSetup = createAsyncThunk(
    'setupCiCd/sendSetup',
    async (_, thunkAPI) => {
        const {SetupCiCd} = thunkAPI.getState() as { SetupCiCd: SetupCiCdState }
        try {
            return await setupCiCd(createSetupData(SetupCiCd))
        } catch (e: any) {
            if (e.name === INPUT_ERROR) {
                return thunkAPI.rejectWithValue({message: e.message, errors: e.getErrors()})
            }
            return thunkAPI.rejectWithValue(e.message())
        }
    }
)

const createSetupData = (state: SetupCiCdState): SetupData => {
    return {
        template: state.template?.code ?? "",
        envs: state.envs.filter(e => e.active).map(e => {
            return {
                code: e.data.code,
                replicas: {
                    min: e.replicas.min.value,
                    max: e.replicas.max.value
                }
            }
        }),
        manifests: state.manifests.filter(m => m.active).map(m => m.code),
        squad: state.squad?.value ?? "",
        application: {
            name: state.application.name,
            rootPath: state.application.rootPath.custom ?? "",
            healthCheckPath: state.application.healthCheckPath.custom ?? "",
            resources: {
                cpu: {
                    min: state.application.resources.cpu.min.value,
                    max: state.application.resources.cpu.max.value
                },
                memory: {
                    min: state.application.resources.memory.min.value,
                    max: state.application.resources.memory.max.value
                }
            },
            port: state.application.port
        },
        ingress: {
            customHost: state.ingress.host.custom ?? "",
            customPath: state.ingress.path.custom ?? "",
            authentication: state.ingress.authentication
        }
    }
}

const initialState: SetupCiCdState = {
    loaded: false,
    sending: false,
    processId: "",
    errorMessage: "",
    errors: [],
    repositoryBaseUrl: "",
    templates: [],
    template: null,
    envs: [],
    manifests: [],
    squads: [],
    squad: null,
    application: {
        name: "application-name",
        rootPath: {fixed: "", default: "", custom: "", customizable: true},
        healthCheckPath: {fixed: "", default: "", custom: "", customizable: true},
        resources: {
            cpu: {min: {value: 0, step: 0, min: 0, max: 0}, max: {value: 0, step: 0, min: 0, max: 0}},
            memory: {min: {value: 0, step: 0, min: 0, max: 0}, max: {value: 0, step: 0, min: 0, max: 0}},
        },
        port: 0
    },
    ingress: {
        host: {fixed: "", default: "", custom: "", customizable: true},
        path: {fixed: "", default: "", custom: "", customizable: true},
        authentication: false
    }
}

const changeDefaultIngress = (state: SetupCiCdState) => {
    if (!state.template) {
        return
    }
    let applicationName = state.application.name != "" ? state.application.name : "application-name"
    let squadName = state.squad?.value ?? "<squad-name>"
    const hostFixed = state.template.ingressDefaults.host.fixed
    const pathFixed = state.template.ingressDefaults.path.fixed
    const hostDefault = state.template.ingressDefaults.host.default ?? ""
    const pathDefault = state.template.ingressDefaults.path.default ?? ""
    state.ingress.authentication = state.template.ingressDefaults.authentication
    state.ingress.host.fixed = hostFixed.replace("{applicationName}", applicationName).replace("{squadName}", squadName)
    state.ingress.path.fixed = pathFixed.replace("{applicationName}", applicationName).replace("{squadName}", squadName)
    state.ingress.host.default = hostDefault.replace("{applicationName}", applicationName).replace("{squadName}", squadName)
    if (!state.ingress.hostEdited) {
        state.ingress.host.custom = state.ingress.host.default ?? ""
    }
    state.ingress.path.default = pathDefault.replace("{applicationName}", applicationName).replace("{squadName}", squadName)
    if (!state.ingress.pathEdited) {
        state.ingress.path.custom = state.ingress.path.default ?? ""
    }
}

const changeApplicationDefaultPaths = (state: SetupCiCdState) => {
    if (!state.template) {
        return
    }
    let applicationName = state.application.name != "" ? state.application.name : "application-name"
    let squadName = state.squad?.value ?? "<squad-name>"
    const rootPath = state.template.applicationDefaults.rootPath.default ?? ""
    const healthCheckPath = state.template.applicationDefaults.healthCheckPath.default ?? ""

    state.application.rootPath.default = rootPath.replace("{applicationName}", applicationName).replace("{squadName}", squadName)
    if (!state.application.rootPathEdited) {
        state.application.rootPath.custom = state.application.rootPath.default ?? ""
    }
    state.application.healthCheckPath.default = healthCheckPath.replace("{applicationName}", applicationName).replace("{squadName}", squadName)
    if (!state.application.healthCheckPathEdited) {
        state.application.healthCheckPath.custom = state.application.healthCheckPath.default ?? ""
    }
}

const changeTemplateData = (state: SetupCiCdState) => {
    if (!state.template) {
        return
    }
    state.manifests = state.template.manifests.map(m => ({...m, active: true}))
    state.application.resources = {
        cpu: state.template.applicationDefaults.cpu,
        memory: state.template.applicationDefaults.memory
    }
    state.application.port = state.template.applicationDefaults.port
    state.application.rootPath = JSON.parse(JSON.stringify(state.template.applicationDefaults.rootPath))
    state.application.healthCheckPath = JSON.parse(JSON.stringify(state.template.applicationDefaults.healthCheckPath))
    state.ingress = JSON.parse(JSON.stringify(state.template.ingressDefaults))
}

const clearState = (state: SetupCiCdState) => {
    for (let key in state) {
        // @ts-ignore
        state[key] = initialState[key]
    }
}

export const setupCiCdSlice = createSlice({
    name: 'setupCiCd',
    initialState,
    reducers: {
        changeTemplate: (state, action: PayloadAction<string>) => {
            state.template = state.templates.find(t => t.code === action.payload) || null
            changeTemplateData(state)
            changeDefaultIngress(state)
            changeApplicationDefaultPaths(state)
        },
        changeApplicationName: (state, action: PayloadAction<string>) => {
            state.application.name = action.payload
            changeDefaultIngress(state)
            changeApplicationDefaultPaths(state)
        },
        changeSquad: (state, action: PayloadAction<optionValue>) => {
            state.squad = action.payload
            changeDefaultIngress(state)
            changeApplicationDefaultPaths(state)
        },
        toggleEnv: (state, action: PayloadAction<string>) => {
            const env = state.envs.find(e => e.data.code === action.payload)
            if (!env) {
                return
            }
            if (!env.active) {
                const concurrences = env.data.concurrences ?? []
                state.envs.filter(e => concurrences.includes(e.data.code)).forEach(e => {
                    e.active = false
                })
            }
            env.active = !env.active
        },
        toggleManifest: (state, action: PayloadAction<string>) => {
            const manifest = state.manifests.find(m => m.code === action.payload)
            if (!manifest) {
                return
            }
            manifest.active = !manifest.active
        },
        changeReplicas: (state, action: PayloadAction<{ env: string, type: "min" | "max", value: string }>) => {
            const env = state.envs.find(e => e.data.code === action.payload.env)
            if (!env) {
                return
            }
            env.replicas[action.payload.type].value = parseInt(action.payload.value)
        },
        changeResource: (state, action: PayloadAction<{ resource: "cpu" | "memory", type: "min" | "max", value: string }>) => {
            state.application.resources[action.payload.resource][action.payload.type].value = parseFloat(action.payload.value)
        },
        changeRootPath: (state, action: PayloadAction<string>) => {
            state.application.rootPath.custom = action.payload
            state.application.rootPathEdited = true
        },
        changeHealthCheckPath: (state, action: PayloadAction<string>) => {
            state.application.healthCheckPath.custom = action.payload
            state.application.healthCheckPathEdited = true
        },
        changeApplicationPort: (state, action: PayloadAction<string>) => {
            state.application.port = parseInt(action.payload)
        },
        changeIngressHost(state, action: PayloadAction<string>) {
            state.ingress.host.custom = action.payload
            state.ingress.hostEdited = true
        },
        changeIngressPath(state, action: PayloadAction<string>) {
            state.ingress.path.custom = action.payload
            state.ingress.pathEdited = true
        },
        toggleIngressAuthentication(state) {
            state.ingress.authentication = !state.ingress.authentication
        },
        clearSetupState(state) {
            clearState(state)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadData.pending, (state) => {
            clearState(state)
        })
        builder.addCase(loadData.rejected, (state, action) => {
            console.log("untreated error: ", action.payload)
        })
        builder.addCase(loadData.fulfilled, (state, action) => {
            state.templates = action.payload.templates
            state.repositoryBaseUrl = action.payload.data.repositoryBaseUrl
            state.envs = action.payload.envs.map(env => {
                return {
                    data: env,
                    active: env.default_active,
                    replicas: env.default_replicas
                }
            })
            state.squads = action.payload.squads.map(squad => ({value: squad.code, label: squad.label}))
            state.template = action.payload.templates[0]
            changeTemplateData(state)
            changeDefaultIngress(state)
            changeApplicationDefaultPaths(state)
            state.loaded = true
        })
        builder.addCase(sendSetup.pending, (state) => {
            state.sending = true
            state.errorMessage = ""
            state.processId = ""
            state.errors = []
        })
        builder.addCase(sendSetup.rejected, (state, action) => {
            state.sending = false
            state.processId = ""
            const payload = action.payload as { errors?: { [key: string]: string[], }[], message: string  }
            if (payload.errors) {
                state.errors = payload.errors
                state.errorMessage = payload.message ?? ""
                return
            }
            console.log("untreated error: ", action.payload)
        })
        builder.addCase(sendSetup.fulfilled, (state, action) => {
            state.processId = action.payload.code
            state.sending = false
        })
    },
})

// Action creators are generated for each case reducer function
export const {
    changeTemplate,
    changeApplicationName,
    toggleEnv,
    toggleManifest,
    changeResource,
    changeReplicas,
    changeSquad,
    changeRootPath,
    changeHealthCheckPath,
    changeApplicationPort,
    changeIngressHost,
    changeIngressPath,
    toggleIngressAuthentication,
    clearSetupState,
} = setupCiCdSlice.actions



export default setupCiCdSlice.reducer