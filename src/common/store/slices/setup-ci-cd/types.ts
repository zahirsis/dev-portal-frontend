import {DataValue, LabelValue, optionValue, ResourceValues} from "@/common/types";

type EnvData = {
    code: string,
    label: string,
    accent_color: string,
    default_active: boolean,
    default_replicas: ResourceValues,
    concurrences: string[]
}

type Env = { data: EnvData, active: boolean, replicas: ResourceValues }
type Manifest = LabelValue & { active: boolean }

type Resources = { cpu: ResourceValues, memory: ResourceValues }

type ApplicationBase = {
    rootPath: DataValue,
    healthCheckPath: DataValue,
    port: number
    rootPathEdited?: boolean,
    healthCheckPathEdited?: boolean,
}

type ApplicationTemplate = ApplicationBase & Resources

type Application = ApplicationBase & { name: string, resources: Resources }

type Ingress = {
    host: DataValue,
    path: DataValue,
    authentication: boolean,
    hostEdited?: boolean,
    pathEdited?: boolean,
}

export type Template = {
    code: string,
    label: string,
    applicationDefaults: ApplicationTemplate,
    ingressDefaults: Ingress,
    manifests: LabelValue[]
}

export interface SetupCiCdState {
    loaded: boolean,
    sending: boolean,
    processId: string,
    errors: {
        [key: string]: string[]
    }[],
    errorMessage: string,

    templates: Template[],
    template: Template | null,
    envs: Env[],
    manifests: Manifest[],

    squads: optionValue[],
    squad: optionValue | null,

    application: Application,
    ingress: Ingress,
}