"use client"

import dynamic from "next/dynamic"

const ServicePage = dynamic(() => import("./page"), { ssr: false })

export default ServicePage
