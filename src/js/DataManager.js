/**
 * Defining objects
 */

/**
 * @typedef {Object} PipeSegmentData
 * @property {Number} id Pipe segment id
 * @property {String | null} name Pipe segment name
 * @property {Number} initialPressure Initial pressure, in kilopasckal (kPa), of a pipe segment
 * @property {Number} minReservatoryLevel Minimum reservatory level, in meters (m), for a pipe segment 
 * @property {Number} length Pipe segment length, in meters (m)
 * @property {Number} heightVariation Pipe segment height variation, in meters (m)
 * @property {Number | null} predecessorPipeSegmentId Predecessor pipe segment id
 * @property {String} nominalDiameter Nominal diameter for a pipe segment
 * @property {String | null} hydrometerInfo Hydrometer info 
 * @property {Array<String>} sanitaryEquipments List of sanitary equipements
 * @property {PipeConnections} pipeConnections List of pipe connections
 * @property {Number} registers Number of registers in pipe segment
 */

/**
 * @typedef {Object} PumpingSegmentData
 * @property {Number} dailyConsumption Daily consuptionn im cunic meters (m3)
 * @property {Number} pumpYield Pump yield in percent
 * @property {Number} pumpingTime Pumping time in hours
 * @property {Number} suctionLength Suction pipeway length in meters (m)
 * @property {number} suctionManometricHeight Suction pipeway manometric height in meters (m)
 * @property {String} suctionNominalDiameter Nominal diameter of suction pipeway 
 * @property {PipeConnections} suctionPipeConnections List of pipe connections in suction pipeway
 * @property {Number} pumpingLength Pumping pipeway length im meters (m)
 * @property {Number} pumpingManometricHeight Pumping pipeway manometric height in meters (m)
 * @property {String} pumpingNominalDiameter Nominal diameter of pumping pipeway 
 * @property {PipeConnections} pumpingPipeConnections List of pipe connections in pumping pipeway
 */

/**
 * @typedef {Object} PipewayData
 * @property {String} unit Unit
 * @property {String} material: Material
 * @property {PumpingSegmentData} pumpingSegmentData Pumping segment data
 * @property {PipeSegmentData []} listOfPipeSegmentData List of pipe segment data
 */

/**
 * @typedef {Object} DataManager
 * @property {() => boolean} hasOpenedPipewayData
 * @property {() => Promise<?FileSystemHandle>} createsPipewayData
 * @property {() => Promise<void>} openPipewayData
 * @property {() => String} getPipewayDataName
 * @property {(property : String, value : String) => Promise<undefined>} setPipewayDataProperty
 * @property {(pipewayData : PipewayData) => void} setPipewayData
 * @property {() => PipewayData} getPipewayData
 * @property {() => PipeSegmentData} getPipeSegmentData
 * @property {() => PipewayData} getPipewayData
 * @property {() => PipeSegmentData} getPipeSegmentData
 * @property {() => PipeSegmentData} createPipeSegmentData
 * @property {() => String []} listPipeSegmentsData
 * @property {(pipeSegmentName : String) => ?PipeSegmentData} findPipeSegmentDataByName  findPipeSegmentDataById
 * @property {(id : Number) => ?PipeSegmentData} findPipeSegmentDataById 
 * @property {(id : Number) => ?PipeSegmentData} pipeSegmentDataAlreadyExist 
 * @property {(newOrEditedPipeSegmentData : PipeSegmentData, newData : boolean ) => Promise<undefined>} addOrReplacePipeSegmentData
 * @property {(id : Number) => ?PipeSegmentData} openPipeSegmentData 
 * @property {(id : Number) => Promise<undefined>} deletePipeSegmentData 
 * @property {() => PumpingSegmentData} createPumpingSegmentData 
 * @property {(newOrEditedPumpingSegmentData : PumpingSegmentData) => Promise<undefined>} addOrReplacePumpingSegment deletePumpingSegment
 * @property {() => Promise<undefined>} deletePumpingSegment
 */

/**
 * Data manager factory 
 */
const DataManagerFactory = Object.freeze({

    /**
     * Creates a data manager object
     * @returns {DataManager}
     */
    create() {
        return Object.seal({

            pipewayData: null,
            pipeSegmentData: null,
            pumpingSegmentData: null,
            /**
             * Checks if has a pipeway data opened
             * @returns {boolean}
             */
            hasOpenedPipewayData() {
                return this.pipewayData !== null
            },

            /**
             * Creates a new pipeway data
             * @returns {Promise<?FileSystemHandle>}
             */
            async createsPipewayData() {
                const tempPipewayData = this.pipewayData
                try {
                    const pipewayData = Object.seal({
                        unit: DataTables.units.MCA,
                        material: DataTables.materials.SMOOTH,
                        pumpingSegmentData: {},
                        listOfPipeSegmentData: []
                    })
                    this.pipewayData = pipewayData
                    return await FileManager.create(JSON.stringify(pipewayData))

                } catch (error) {
                    this.pipewayData = tempPipewayData
                    throw error
                }

            },

            /**
             * Opens a pipeway data
             * @returns {Promise<void>}
             */
            async openPipewayData() {
                try {
                    const pipewayDataAsText = await FileManager.open()
                    const pipewayData = JSON.parse(pipewayDataAsText)
                    this.setPipewayData(pipewayData)
                    return Promise.resolve()
                } catch (error) {
                    throw error
                }
            },

            /**
             * Gets a pipeway data name
             * @returns {String}
             */
            getPipewayDataName() {
                try {
                    return FileManager.getFileName()
                } catch (error) {
                    throw error
                }
            },

            /**
             * Sets pipeway data property
             * @param {String} property The pipeway data property
             * @param {String} value The pipeway property value
             * @returns {Promise<undefined>}
             */
            async setPipewayDataProperty(property, value) {
                try {
                    if (this.pipewayData === null) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                    switch (property) {
                        case "unit":
                            if (!Hydraulics.isValidUnit(value)) throw new Error("Invalid parameters!")
                            this.pipewayData.unit = value
                            for (pipeSegmentData of this.pipewayData.listOfPipeSegmentData) {
                                if (value === DataTables.units.KPA) {
                                    pipeSegmentData.initialPressure *= DataTables.unitConvertionFactor.MCA_TO_KPA
                                    continue
                                }
                                pipeSegmentData.initialPressure *= DataTables.unitConvertionFactor.KPA_TO_MCA
                            }
                            break;
                        case "material":
                            if (!Hydraulics.isValidMaterial(value)) throw new Error("Invalid parameters!")
                            this.pipewayData.material = value
                            break;
                    }
                    return await FileManager.save(JSON.stringify(this.pipewayData))
                } catch (error) {
                    throw error
                }
            },

            /**
             * Sets a pipeway data
             * @param {PipewayData} pipewayData The pipeway data
             */
            setPipewayData(pipewayData) {
                this.pipewayData = pipewayData
            },

            /**
             * Gets a pipeway data
             * @returns {PipewayData}
             */
            getPipewayData() {
                if (this.pipewayData === null) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                return this.pipewayData
            },

            /**
             * Gets a pipeway segment data
             * @returns {PipeSegmentData}
             */
            getPipeSegmentData() {
                if (this.pipeSegmentData === null) throw new Error(Texts.PIPESEGMENT_DATA_NOT_FOUND)
                return this.pipeSegmentData
            },

            /**
             * Creates a new pipe segment data
             * @returns {PipeSegmentData}
             */
            createPipeSegmentData() {
                try {
                    const pipeSegmentData = Object.seal({
                        id: new Date().getTime(),
                        name: "Trecho",
                        initialPressure: 0,
                        length: 0,
                        heightVariation: 0,
                        predecessorPipeSegmentId: 0,
                        nominalDiameter: "DN20",
                        hydrometerMaxFlowRate: 0,
                        flowRateWeights: 0,
                        pipeConnections: {},
                    })

                    this.pipeSegmentData = pipeSegmentData
                    return pipeSegmentData

                } catch (error) {
                    throw error
                }

            },

            /**
             * List the name of a list of pipe segment data
             * @returns {String []}
             */
            listPipeSegmentsData() {
                if (this.pipewayData === null) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                const pipeSegmentNames = []
                for (let data of this.pipewayData.listOfPipeSegmentData)
                    pipeSegmentNames.push({ name: data.name, id: data.id })
                return pipeSegmentNames

            },

            /**
             * Finds a pipe segment data by its name
             * @param {String} pipeSegmentName the pipe segment name
             * @returns {?PipeSegmentData}
             */
            findPipeSegmentDataByName(pipeSegmentName) {
                if (!this.pipewayData) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                for (let data of this.pipewayData.listOfPipeSegmentData) if (pipeSegmentName == data.name) return data
                return null
            },

            /**
             * Finds a pipe segment data by its id
             * @param {Number} id The pipe segment id
             * @returns {?PipeSegmentData}
             */
            findPipeSegmentDataById(id) {
                if (!this.pipewayData) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                for (let data of this.pipewayData.listOfPipeSegmentData) if (id == data.id) return data
                return null
            },

            /**
             * Checks if a pipe segment exist
             * @param {Number} id The pipe segment id
             * @returns {Number}
             */
            pipeSegmentDataAlreadyExist(id) {
                if (!this.pipewayData) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                for (let i = 0; i < this.pipewayData.listOfPipeSegmentData.length; i++)
                    if (id == this.pipewayData.listOfPipeSegmentData[i].id) return i
                return -1
            },

            /**
             * Adds a new or replaces a pipesegment 
             * @param {PipeSegmentData} newOrEditedPipeSegmentData New or edited pipesegment data
             * @param {boolean} newData Flag to indicates a a creation of a ne pipe segment data
             * @returns {Promise<undefined>}
             */
            async addOrReplacePipeSegmentData(newOrEditedPipeSegmentData, newData) {
                try {
                    if (!this.pipewayData) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                    if (newData) {
                        for (let pipeSegmentData of this.pipewayData.listOfPipeSegmentData) {
                            if (pipeSegmentData.name.toUpperCase() === newOrEditedPipeSegmentData.name.toUpperCase())
                                throw new Error(Texts.NAME_ALREADY_USED)
                        }
                    }
                    if (newOrEditedPipeSegmentData.id === newOrEditedPipeSegmentData.predecessorPipeSegmentId)
                        throw new Error(Texts.PIPESEGMENT_ID_EQUAL_TO_PREDECESSOR_PIPESEGMENT_ID)
                    const index = this.pipeSegmentDataAlreadyExist(newOrEditedPipeSegmentData.id)
                    if (index === -1) this.pipewayData.listOfPipeSegmentData.push(newOrEditedPipeSegmentData)
                    else this.pipewayData.listOfPipeSegmentData[index] = newOrEditedPipeSegmentData
                    return await FileManager.save(JSON.stringify(this.pipewayData))
                } catch (error) {
                    throw error
                }
            },

            /**
             * Opens a pipe segment data
             * @param {number} id The pipe segment id
             * @returns {?PipeSegmentData}
             */
            openPipeSegmentData(id) {
                try {
                    this.pipeSegmentData = this.findPipeSegmentDataById(id)
                    return this.pipeSegmentData;
                } catch (error) {
                    throw error
                }
            },

            /**
             * Deletes a pipe segment data
             * @param {number} id The pipe segment id
             * @returns {Promise<undefined>}
             */
            async deletePipeSegmentData(id) {
                try {
                    const pipeSegmentDataSelected = this.findPipeSegmentDataById(id)
                    for (let pipeSegmentData of this.pipewayData.listOfPipeSegmentData) {
                        if (pipeSegmentData.predecessorPipeSegmentId === pipeSegmentDataSelected.id)
                            throw new Error(Texts.PIPESEGMENT_IS_A_PREDECESSOR_SEGMENT)
                    }
                    const newList = []
                    for (let pipeSegmentData of this.pipewayData.listOfPipeSegmentData) {
                        if (pipeSegmentData.id !== pipeSegmentDataSelected.id) newList.push(pipeSegmentData)
                    }
                    this.pipewayData.listOfPipeSegmentData = newList
                    return await FileManager.save(JSON.stringify(this.pipewayData))
                } catch (error) {
                    throw error
                }
            },

            /**
             * Creates a pumping segment data
             * @returns {PumpingSegmentData}
             */
            createPumpingSegmentData() {
                try {
                    const pumpingSegmentData = Object.seal({
                        dailyConsumption: 0, //m³
                        pumpYield: 60, //%
                        pumpingTime: 6, // h
                        suctionLength: 0,
                        suctionManometricHeight: 0,
                        suctionNominalDiameter: "DN50",
                        suctionPipeConnections: {},
                        pumpingLength: 0,
                        pumpingManometricHeight: 0,
                        pumpingNominalDiameter: "DN60",
                        pumpingPipeConnections: {},
                    })

                    this.pumpingSegmentData = pumpingSegmentData
                    return pumpingSegmentData

                } catch (error) {
                    throw error
                }

            },

            /**
             * Adds or replace a pumping segment data
             * @param {PumpingSegmentData} newOrEditedPumpingSegmentData New or edited pumping segment data
             * @returns {Promise<undefined>}
             */
            async addOrReplacePumpingSegment(newOrEditedPumpingSegmentData) {
                try {
                    if (!this.pipewayData) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                    this.pipewayData.pumpingSegmentData = newOrEditedPumpingSegmentData
                    return await FileManager.save(JSON.stringify(this.pipewayData))
                } catch (error) {
                    throw error
                }
            },

            /**
             * Deletes a pumping segment data
             * @returns {Promise<undefined>}
             */
            async deletePumpingSegment() {
                try {
                    if (!this.pipewayData) throw new Error(Texts.PIPEWAY_DATA_NOT_FOUND)
                    this.pipewayData.pumpingSegmentData = {}
                    return await FileManager.save(JSON.stringify(this.pipewayData))
                } catch (error) {
                    throw error
                }
            },
        })
    }
})

