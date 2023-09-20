'use client';

import Breadcrumb from "@/components/reusable/Breadcrumb"
import Title from "@/components/reusable/Title"
import {useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux'
import Select from "react-tailwindcss-select";
import {AppDispatch, RootState} from "@/common/store/store";
import {
    changeApplicationName, changeApplicationPort, changeHealthCheckPath, changeIngressHost, changeIngressPath,
    changeReplicas,
    changeResource, changeRootPath,
    changeSquad,
    changeTemplate, clearSetupState,
    loadData, sendSetup,
    toggleEnv, toggleIngressAuthentication,
    toggleManifest
} from "@/common/store/slices/setup-ci-cd";
import {formatCpu, formatMemory} from "@/common/utils/resources";
import {checkboxColor} from "@/common/utils/colors";
import {useRouter} from "next/navigation";

const Error = ({errors, input}: { errors: any, input: string }) => {
    if (errors[input] === undefined) return (<></>)
    return <div className="text-red-700 text-sm capitalize flex flex-col">
        {errors[input].map((e: string, i: number) => <span key={i}>{e}</span>)}
    </div>
}

const ErrorAlert = ({error}: { error: string }) => {
    if (!error || error == "") return (<></>)
    return <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div>
            <span className="font-medium">Error!</span> {error}.
        </div>
    </div>
}

export default function SetupCiCd() {
    const router = useRouter()
    const {
        templates,
        template,
        envs,
        squads,
        squad,
        manifests,
        application,
        ingress,
        errors,
        errorMessage,
        processId,
    } = useSelector((state: RootState) => state.SetupCiCd)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(loadData())
    }, []);

    useEffect(() => {
        if (processId) {
            router.push(`/setup-ci-cd/${processId}`)
            dispatch(clearSetupState())
        }
    }, [processId])

    return (
        <div className="p-4">
            <Breadcrumb items={[
                {name: "Setup CI/CD", href: "/setup-ci-cd", current: true},
            ]}/>
            <Title>Setup CI/CD</Title>
            <div className="mb-4">
                <div className="grid grid-cols-4 gap-4 mb-4">
                    {/* LEFT SIDE */}
                    <div className="col-span-4 xl:col-span-1 flex flex-col gap-4">
                        {/* TEMPLATE */}
                        <div
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                                Tipo de aplicação</h5>
                            {templates.map((type, index) => (
                                <div className="flex items-center my-2" key={index}>
                                    <input id={`application-type-${index}`} type="radio" value={type.code}
                                           name="application-type"
                                           checked={template?.code === type.code}
                                           onChange={() => dispatch(changeTemplate(type.code))}
                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <label htmlFor={`application-type-${index}`}
                                           className="ml-2 text-lg font-medium text-gray-900 dark:text-gray-300">
                                        {type.label}
                                    </label>
                                </div>
                            ))}
                            <Error errors={errors} input="template"/>
                        </div>
                        {/* ENVIRONMENTS */}
                        <div
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Ambientes</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Selecione os ambientes onde a aplicação será implantada
                            </p>
                            {envs.map((env, index) => (
                                <div className="flex items-center my-2" key={index}>
                                    <input id={`environment-${index}`} type="checkbox" value={env.data.code}
                                           name={`envs.${env.data.code}`}
                                           className={`${checkboxColor(env.data.accent_color)} w-4 h-4 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                                           checked={env.active}
                                           onChange={() => dispatch(toggleEnv(env.data.code))}
                                    />
                                    <label htmlFor={`environment-${index}`}
                                           className="ml-2 text-lg font-medium text-gray-900 dark:text-gray-300">
                                        {env.data.label}
                                    </label>
                                    <Error errors={errors} input={`envs.${env.data.code}`}/>
                                </div>
                            ))}
                            <Error errors={errors} input="envs"/>
                        </div>
                        {/* MANIFESTS */}
                        <div
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                                Manifestos
                            </h5>
                            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                Selecione os tipos de manifestos a serem gerados para o micro serviço
                            </p>
                            <div className="flex">
                                {manifests.map((manifest, index) => (
                                    <div className="flex flex-col" key={index}>
                                        <div className="flex items-center mr-4">
                                            <input id={`manifests-${manifest.code}`} type="checkbox"
                                                   value={manifest.code}
                                                   name={`manifests.${manifest.code}`}
                                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                   checked={manifest.active}
                                                   onChange={() => dispatch(toggleManifest(manifest.code))}
                                            />
                                            <label htmlFor={`manifests-${manifest.code}`}
                                                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{manifest.label}</label>
                                        </div>
                                        <Error errors={errors} input={`manifests.${manifest.code}`}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* RESOURCES */}
                        <div
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Recursos</h5>
                            <div className="mb-4 flex flex-col gap-2">
                                <div>
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-10">
                                            <label htmlFor="min-cpu"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Min
                                                Cpu</label>
                                            <input id="min-cpu" type="range" min={application.resources.cpu.min.min}
                                                   max={application.resources.cpu.min.max}
                                                   value={application.resources.cpu.min.value}
                                                   onChange={(e) => dispatch(
                                                       changeResource({resource: "cpu", type: "min", value: e.target.value})
                                                   )}
                                                   step={application.resources.cpu.min.step}
                                                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                                        </div>
                                        <div className="col-span-2 flex itens-end">
                                            <span
                                                className="inline-block align-bottom p-2 pt-7">{formatCpu(application.resources.cpu.min.value)}</span>
                                        </div>
                                    </div>
                                    <Error errors={errors} input="application.resources.cpu.min"/>
                                </div>
                                <div>
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-10">
                                            <label htmlFor="max-cpu"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Max
                                                Cpu</label>
                                            <input id="max-cpu" type="range" min={application.resources.cpu.max.min}
                                                   max={application.resources.cpu.max.max}
                                                   value={application.resources.cpu.max.value}
                                                   onChange={(e) => dispatch(
                                                       changeResource({resource: "cpu", type: "max", value: e.target.value})
                                                   )}
                                                   step={application.resources.cpu.max.step}
                                                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                                        </div>
                                        <div className="col-span-2 flex itens-end">
                                            <span
                                                className="inline-block align-bottom p-2 pt-7">{formatCpu(application.resources.cpu.max.value)}</span>
                                        </div>
                                    </div>
                                    <Error errors={errors} input="application.resources.cpu.max"/>
                                </div>
                                <div>
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-10">
                                            <label htmlFor="min-memory"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Min
                                                Memory</label>
                                            <input id="min-memory" type="range"
                                                   min={application.resources.memory.min.min}
                                                   max={application.resources.memory.min.max}
                                                   value={application.resources.memory.min.value}
                                                   onChange={(e) => dispatch(
                                                       changeResource({resource: "memory", type: "min", value: e.target.value})
                                                   )}
                                                   step={application.resources.memory.min.step}
                                                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                                        </div>
                                        <div className="col-span-2 flex itens-end">
                                            <span
                                                className="inline-block align-bottom p-2 pt-7">{formatMemory(application.resources.memory.min.value)}</span>
                                        </div>
                                    </div>
                                    <Error errors={errors} input="application.resources.memory.min"/>
                                </div>
                                <div>
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-10">
                                            <label htmlFor="max-memory"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Max
                                                Memory</label>
                                            <input id="max-memory" type="range"
                                                   min={application.resources.memory.max.min}
                                                   max={application.resources.memory.max.max}
                                                   value={application.resources.memory.max.value}
                                                   onChange={(e) => dispatch(
                                                       changeResource({resource: "memory", type: "max", value: e.target.value})
                                                   )}
                                                   step={application.resources.memory.max.step}
                                                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                                        </div>
                                        <div className="col-span-2 flex itens-end">
                                        <span
                                            className="inline-block align-bottom p-2 pt-7">{formatMemory(application.resources.memory.max.value)}</span>
                                        </div>
                                    </div>
                                    <Error errors={errors} input="application.resources.memory.max"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* RIGHT SIDE */}
                    <div className="col-span-4 xl:col-span-3 flex flex-col gap-4">
                        {/* APPLICATION */}
                        <div
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                                Dados do micro serviço: <span>{application.name || 'template-app'}</span>
                            </h5>
                            <div className="mb-4">
                                <label htmlFor="application-name"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Url do repositório
                                </label>
                                <div className="flex">
                                    <div className="flex-none p-3">
                                        <span>https://bitbucket.org/Project/</span>
                                    </div>
                                    <input type="text" name="application-name" id="application-name"
                                           className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                           placeholder={application.name || 'template-app'}
                                           value={application.name}
                                           onChange={e => dispatch(changeApplicationName(e.target.value))}
                                           required
                                    />
                                </div>
                                <Error errors={errors} input="application.name"/>
                            </div>
                            <div className="mb-4 custom-select">
                                <label htmlFor="application-port"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Squad responsável
                                </label>
                                <Select
                                    primaryColor={'#2563EB'}
                                    value={squad}
                                    onChange={(e) => e && !Array.isArray(e) && dispatch(changeSquad(e))}
                                    options={squads}
                                    isSearchable={true}
                                />
                                <Error errors={errors} input="squad"/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="root-path"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Path raiz da aplicação
                                </label>
                                <input type="text" name="root-path" id="root-path"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                       placeholder={application.rootPath.default}
                                       value={application.rootPath.custom ?? ""}
                                       onChange={e => dispatch(changeRootPath(e.target.value))}
                                       required
                                />
                                <Error errors={errors} input="application.rootPath"/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="health-check-path"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Path do health check da aplicação
                                </label>
                                <input type="text" name="health-check-path" id="health-check-path"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                       placeholder={application.healthCheckPath.default}
                                       value={application.healthCheckPath.custom ?? ""}
                                       onChange={e => dispatch(changeHealthCheckPath(e.target.value))}
                                       required
                                />
                                <Error errors={errors} input="application.healthCheckPath"/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="application-port"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Porta da aplicação
                                </label>
                                <input type="number" name="application-port" id="application-port" placeholder="8080"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                       value={application.port}
                                       onChange={e => dispatch(changeApplicationPort(e.target.value))}
                                       required/>
                                <Error errors={errors} input="application.port"/>
                            </div>
                        </div>
                        {/* INGRESS */}
                        <div
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                                Ingress
                            </h5>
                            <div className="mb-4">
                                <label htmlFor="custom-ingress"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Url do micro serviço
                                </label>
                                <div className="flex">
                                    {template?.ingressDefaults.host.customizable && (
                                        <input type="text" name="custom-ingress" id="custom-ingress"
                                               className="w-80 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                               placeholder={application.name || 'template-app'}
                                               required
                                               value={ingress.host.custom ?? ""}
                                               onChange={e => dispatch(changeIngressHost(e.target.value))}
                                        />
                                    )}
                                    <div className={"flex-none p-3"}>
                                        <span>{ingress.host.fixed}{ingress.path.fixed}</span>
                                    </div>
                                    {(!template || !template.ingressDefaults.host.customizable) && (
                                        <input type="text" name="custom-ingress" id="custom-ingress"
                                               className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                               placeholder={application.name || 'template-app'}
                                               required
                                               value={ingress.path.custom ?? ""}
                                               onChange={e => dispatch(changeIngressPath(e.target.value))}
                                        />)}
                                </div>
                                <Error errors={errors} input="ingress.customHost"/>
                                <Error errors={errors} input="ingress.customPath"/>
                            </div>
                            <div className="mb-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer"
                                           checked={ingress.authentication}
                                           onChange={() => dispatch(toggleIngressAuthentication())}/>
                                    <div
                                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Aplicar Autenticação</span>
                                </label>
                            </div>
                        </div>
                        {/* AUTO SCALING */}
                        <div
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                                Auto Scaling
                            </h5>
                            <div className="grid grid-cols-3 divide-x">
                                {envs.filter((env) => env.active).map((env, index) => <div
                                    className="px-4" key={index}>
                                    <h6 className="text-lg font-medium text-gray-800 dark:text-white mb-4">{env.data.label}</h6>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <div>
                                            <div className="grid grid-cols-12">
                                                <div className="col-span-10">
                                                    <label htmlFor={`replicas.${env.data.code}.min`}
                                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Min</label>
                                                    <input id={`replicas.${env.data.code}.min`}
                                                           name={`replicas.${env.data.code}.min`}
                                                           type="range" min={env.replicas.min.min.toFixed(0)}
                                                           max={env.replicas.min.max.toFixed(0)}
                                                           value={env.replicas.min.value}
                                                           onChange={(e) => dispatch(
                                                               changeReplicas({env: env.data.code, type: "min", value: e.target.value})
                                                           )}
                                                           step={env.replicas.min.step}
                                                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                                                </div>
                                                <div className="col-span-2 flex itens-end">
                                                    <span
                                                        className="inline-block align-bottom p-2 pt-7">{env.replicas.min.value.toFixed(0)}</span>
                                                </div>
                                            </div>
                                            <Error errors={errors} input={`env.${env.data.code}.replicas.min`}/>
                                        </div>
                                        <div>
                                            <div className="grid grid-cols-12">
                                                <div className="col-span-10">
                                                    <label htmlFor={`replicas.${env.data.code}.max`}
                                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Max</label>
                                                    <input id={`replicas.${env.data.code}.max`}
                                                           name={`replicas.${env.data.code}.max`}
                                                           type="range" min={env.replicas.max.min.toFixed(0)}
                                                           max={env.replicas.max.max.toFixed(0)}
                                                           value={env.replicas.max.value}
                                                           onChange={(e) => dispatch(
                                                               changeReplicas({env: env.data.code, type: "max", value: e.target.value})
                                                           )}
                                                           step={env.replicas.max.step}
                                                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                                                </div>
                                                <div className="col-span-2 flex itens-end">
                                                    <span
                                                        className="inline-block align-bottom p-2 pt-7">{env.replicas.max.value.toFixed(0)}</span>
                                                </div>
                                            </div>
                                            <Error errors={errors} input={`env.${env.data.code}.replicas.max`}/>
                                        </div>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="button" onClick={() => dispatch(sendSetup())}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Setup CI/CD
                    </button>
                </div>
            </div>
            <ErrorAlert error={errorMessage}/>
        </div>
    )
}
