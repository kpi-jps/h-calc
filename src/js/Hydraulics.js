/**
 * Definitions of objects
 */
/**
 * Pipe connections list and their quantities
* @typedef {Object} PipeConnections
* @property {Number} C45 Quantity of pipe connection of acronym C45 
* @property {Number} C90 Quantity of pipe connection of acronym C90
* @property {Number} EB Quantity of pipe connection of acronym EB
* @property {Number} EN Quantity of pipe connection of acronym EN
* @property {Number} J45 Quantity of pipe connection of acronym J45
* @property {Number} J90 Quantity of pipe connection of acronym J90
* @property {Number} RAN Quantity of pipe connection of acronym RAN
* @property {Number} RGA Quantity of pipe connection of acronym RGA
* @property {Number} RGL Quantity of pipe connection of acronym RGL
* @property {Number} SC Quantity of pipe connection of acronym SC
* @property {Number} TPBL Quantity of pipe connection of acronym TPBL
* @property {Number} TPD Quantity of pipe connection of acronym TPD
* @property {Number} TPL Quantity of pipe connection of acronym TPL
* @property {Number} VPC Quantity of pipe connection of acronym VPC
* @property {Number} VRL Quantity of pipe connection of acronym VRL
* @property {Number} VRP Quantity of pipe connection of acronym VRP
*/

/**
* @typedef {Object} CalculatedPressureResults
* @property {String} flowRateUnit Flow rate unit
* @property {Number} flowRate Flow rate value
* @property {String} velocityUnit Velocity unit
* @property {Number} velocity Velocity value
* @property {String} pressureUnit Pressure unit
* @property {Number} unitaryPressureLoss Unitary pressure loss value
* @property {String} unitaryPressureLossUnit Unitary pressure loss unit
* @property {Number} equivalentLength Equivalent length value
* @property {String} equivalentLengthUnit Equivalent length unit
* @property {Number} pressureLoss Pressure loss value
* @property {NUmber} pressure Pressure value
* @property {boolean} velocityWarning Flag for velocity warning
* @property {boolean} pressureMinWarning Flag for minimum pressure warning
* @property {boolean} pressureMaxWarning Flag for maximum pressure warning
*/

/**
 * @typedef {Object} CalculatedPumpingResults
 * @property {String} flowRateUnit Flow rate unit
 * @property {Number} flowRate Flow rate value
 * @property {boolean} flowRateWarning Flag for flow rate warning
 * @property {boolean} velocityWarning Flag for velocity warning
 * @property {String} manometricHeightUnit Manometric height unit
 * @property {Number} manometricHeight Manometric height value
 * @property {Number} suctionSegmentEquivalentLength Suction segment length
 * @property {Number} pumpingSegmentEquivalentLength Pumping segment length
 * @property {String} equivalentLengthUnit Equivalent length unit
 * @property {Number} suctionUnitaryPressureLoss Unitary pressure loss for suction pipe segment
 * @property {Number} pumpingSegmentEquivalentLength Unitary pressure loss for pumping pipe segment
 * @property {String} unitaryPressureLossUnit Unitary pressure loss unit
 * @property {String} powerUnit Power unit
 * @property {Number} calculatedPumpPower Calculated pump power
 * @property {Number} selectedPumpPower Selected pump power
 * @property {boolean} inadequateDiametersWarning Flag for inadequate suction and pumping diameters
 */

/**
  * Pipe connections quantities grouped by diameters
  * @typedef {Object} PipeConnectionsAndDiameters
  * @property {PipeConnections} DN20 Pipeconnections of DN20
  * @property {PipeConnections} DN25 Pipeconnections of DN25
  * @property {PipeConnections} DN32 Pipeconnections of DN32
  * @property {PipeConnections} DN40 Pipeconnections of DN40
  * @property {PipeConnections} DN50 Pipeconnections of DN50
  * @property {PipeConnections} DN60 Pipeconnections of DN60
  * @property {PipeConnections} DN75 Pipeconnections of DN75
  * @property {PipeConnections} DN85 Pipeconnections of DN85
  * @property {PipeConnections} DN110 Pipeconnections of DN110
  */

/**
 * Javascript object that containg the core application logic for dimensionating water hidraulic instalation
 */
const Hydraulics = Object.freeze({

    /**
     * Object that containg methods relative to hydroulic features of hydrometers
     */
    Hydrometer: Object.freeze({

        /**
        * List all max flow rates for hydrometer  
        * @returns {Array<Number>}
        */
        listMaxFlowRates: () => {
            return Object.values(DataTables.maxFlowRateForHydrometers)
        },
        /**
         * Check if a value is a valid max flow rate
         * @param {Number} maxFlowRate 
         * Numeric value to checked
         * @returns {Boolean}
         */
        isValidValue(maxFlowRate) {
            if (!Utilities.validator.isNumber(maxFlowRate)) throw new Error("Invalid parameters!")
            for (let value of Hydraulics.Hydrometer.listMaxFlowRates())
                if (maxFlowRate === value) return true
            return false
        },

        /**
         * Calculates the pressure loss for hydrometer, according NBR 5626:1998 
         * @param {Number} maxFlowRate
         * Input to get hydrometer's max flow rate value im m³/h
         * @param {Number} flowRate 
         * Flow rate, in L/s (liters per second), for the hydrometer
         * @returns {Number}
         */
        calculatesPressureLoss(maxFlowRate, flowRate) {
            if (!Utilities.validator.isNumber(flowRate) || !Hydraulics.Hydrometer.isValidValue(maxFlowRate))
                throw new Error("Invalid parameters!")
            return maxFlowRate === 0 ? 0 : Math.pow(36 * flowRate / maxFlowRate, 2)
        }

    }),

    /**
     * Checks if a unit acronym is valid 
     * @param {String} unit Unit acronym
     * @returns {Boolean}
     */
    isValidUnit(unit) {
        return Object.values(DataTables.units).includes(unit)
    },

    /**
     * Checks if a diameter is valid 
     * @param {Number} diameter Diameter as numeric value
     * @returns {Boolean}
     */
    isValidDiameter(diameter) {
        return Object.values(DataTables.diameters).includes(diameter)
    },

    /**
    * Checks if a material is valid 
    * @param {Number} material Material name
    * @returns {Boolean}
    */
    isValidMaterial(material) {
        return Object.values(DataTables.materials).includes(material)
    },

    /**
    * Checks if a pipe connection acronym is valid 
    * @param {Number} pipeConnectionAcronym Pipe connection acronym 
    * @returns {Boolean}
    */
    isValidPipeConnectionAcronym(pipeConnectionAcronym) {
        return Object.keys(DataTables.equivalentLengthForPipeConnections)
            .includes(pipeConnectionAcronym)
    },

    /**
     * Gets the equivalent length im meters [m] for a specific pipe connection with a 
     * specific diameter and made by a specific material, according NBR 5626:1998
     * @param {String} pipeConnectionAcronym Pipe connection acronym
     * @param {String} material Material name
     * @param {Number} diameter Diameter as numeric value
     * @returns {Number}
     */
    getEquivalentLength(pipeConnectionAcronym, material, diameter) {
        if (!this.isValidPipeConnectionAcronym(pipeConnectionAcronym) ||
            !this.isValidMaterial(material) ||
            !this.isValidDiameter(diameter)) throw new Error("Invalid parameters!")
        let materialIndex, diameterIndex
        switch (material) {
            case DataTables.materials.SMOOTH:
                materialIndex = DataTables.equivalentLengthIndexes.SMOOTH_MATERIAL_INDEX
                break;
            default:
                materialIndex = DataTables.equivalentLengthIndexes.ROUGH_MATERIAL_INDEX
                break;
        }
        switch (diameter) {
            case DataTables.diameters.DN20:
                diameterIndex = DataTables.equivalentLengthIndexes.DN20_INDEX
                break;
            case DataTables.diameters.DN25:
                diameterIndex = DataTables.equivalentLengthIndexes.DN25_INDEX
                break;
            case DataTables.diameters.DN32:
                diameterIndex = DataTables.equivalentLengthIndexes.DN32_INDEX
                break;
            case DataTables.diameters.DN40:
                diameterIndex = DataTables.equivalentLengthIndexes.DN40_INDEX
                break;
            case DataTables.diameters.DN50:
                diameterIndex = DataTables.equivalentLengthIndexes.DN50_INDEX
                break;
            case DataTables.diameters.DN60:
                diameterIndex = DataTables.equivalentLengthIndexes.DN60_INDEX
                break;
            case DataTables.diameters.DN75:
                diameterIndex = DataTables.equivalentLengthIndexes.DN75_INDEX
                break;
            case DataTables.diameters.DN85:
                diameterIndex = DataTables.equivalentLengthIndexes.DN85_INDEX
                break;
            case DataTables.diameters.DN110:
                diameterIndex = DataTables.equivalentLengthIndexes.DN110_INDEX
                break;
        }
        return DataTables.equivalentLengthForPipeConnections[pipeConnectionAcronym][materialIndex][diameterIndex]
    },

    /**
     * Gets the unitary pressure loss for a pipe, in kilopascal [kPa], according NBR 5626:1998
     * @param {String} material
     * Pipe material type
     * @param {Number} flowRate
     * Pipe fluid flow rate in  liters per second [L/s]
     * @param {String} diameter
     * Pipe diameter in millimeters [mm]
     * @returns {Number}
     */
    calculatesUnitaryPressureLoss(material, flowRate, diameter) {
        if (!Utilities.validator.isNumber(flowRate) ||
            !Utilities.validator.isNumber(diameter) ||
            !this.isValidDiameter(diameter) ||
            !this.isValidMaterial(material)) throw new Error("Invalid parameters!")
        if (DataTables.materials.SMOOTH) return 20.2e6 * Math.pow(flowRate, 1.88) * Math.pow(diameter, -4.88)
        return 8.69e6 * Math.pow(flowRate, 1.75) * Math.pow(diameter, -4.75)
    },

    /**
     * Calculates the flow rate in liters per second [L/s], using flow rate weights 
     * according NBR 5626:1998
     * @param {Number} flowRateWeight 
     * Sum of flow rate weights
     * @returns {Number}
     */
    calculatesFlowRateUsingflowRateWeight(sumOfFlowRateWeight) {
        if (!Utilities.validator.isNumber(sumOfFlowRateWeight)) throw new Error("Invalid parameters!")
        return 0.3 * Math.sqrt(sumOfFlowRateWeight)

    },

    /**
     * Calculates the fluid velocity, in meters per second [m/s], through pipe segment, acoording NBR 5626:1998
     * @param {Number} flowRate
     * Pipe fluid flow rate in  liters per second [L/s]
     * @param {String} diameter
     * Pipe diameter in millimeters [mm]
     * @returns {Number}
     */
    calculatesVelocity(flowRate, diameter) {
        if (!Utilities.validator.isNumber(flowRate) ||
            !Utilities.validator.isNumber(diameter) ||
            !this.isValidDiameter(diameter)) throw new Error("Invalid parameters!")
        return 4e3 * flowRate / (Math.pow(diameter, 2) * Math.PI)
    },

    /**
     * Calculates a sum of equivalent length for a list of pipe connections
     * @param {PipeConnections} pipeConnections List of pipe connections and their quantities
     * @param {String} material Material of pipe connections
     * @param {Number} diameter Diameter as numeric value
     * @returns {Number} 
     */
    calculatesSumOfEquivalentLength(pipeConnections, material, diameter) {
        try {
            let sum = 0
            for (const key in pipeConnections)
                sum += this.getEquivalentLength(key, material, diameter) * pipeConnections[key]
            return sum
        } catch (error) {
            throw error
        }
    },

    /**
     * Calculates the pressure at the end of a pipe segment, considering all pressure lossess (distributed and localized) throught it 
     * @param {PipewayData} pipewayData The pipeway data
     * @param {PipeSegmentData} pipeSegmentData The pipe segment data
     * @returns {CalculatedPressureResults}
     */
    calculatesPressure(pipewayData, pipeSegmentData) {
        try {
            if (pipeSegmentData === null) throw new Error(Texts.PIPE_SEGMENT_NOT_FOUND)
            const isUnitMCA = pipewayData.unit === DataTables.units.MCA
            const unitConverterFactor = isUnitMCA ? DataTables.unitConvertionFactor.KPA_TO_MCA : 1
            const diameter = DataTables.diameters[pipeSegmentData.nominalDiameter]
            const flowRate = this.calculatesFlowRateUsingflowRateWeight(pipeSegmentData.flowRateWeights)
            const velocity = this.calculatesVelocity(flowRate, diameter)
            const unitaryPressureLoss = this.calculatesUnitaryPressureLoss(
                pipewayData.material, flowRate, diameter) * unitConverterFactor
            const hydrometerPressureLoss = this.Hydrometer.calculatesPressureLoss(
                pipeSegmentData.hydrometerMaxFlowRate, flowRate) * unitConverterFactor
            const equivalentLength = this.calculatesSumOfEquivalentLength(pipeSegmentData.pipeConnections,
                pipewayData.material, diameter)
            const pressureLoss = ((equivalentLength + pipeSegmentData.length) * unitaryPressureLoss) + hydrometerPressureLoss
            let pressure = pipeSegmentData.initialPressure //here is not necessary unit conversion
            pressure += pipeSegmentData.heightVariation * DataTables.constants.SPECIFIC_WATER_WEIGHT_kN_m3 * unitConverterFactor

            if (pipeSegmentData.predecessorPipeSegmentId === 0) {
                return {
                    flowRateUnit: DataTables.units.L_S,
                    flowRate: flowRate,
                    velocityUnit: DataTables.units.M_S,
                    velocity: velocity,
                    pressureUnit: pipewayData.unit,
                    unitaryPressureLoss: unitaryPressureLoss,
                    unitaryPressureLossUnit: `${pipewayData.unit} / ${DataTables.units.M}`,
                    equivalentLength: equivalentLength,
                    equivalentLengthUnit: DataTables.units.M,
                    pressureLoss: pressureLoss,
                    pressure: pressure - pressureLoss,
                    velocityWarning: velocity > DataTables.constants.VELOCITY_LIMIT_M_S,
                    pressureMinWarning: isUnitMCA ?
                        pressure - pressureLoss < DataTables.constants.PRESSURE_MIN_LIMIT_MCA :
                        pressure - pressureLoss < DataTables.constants.PRESSURE_MIN_LIMIT_KPA,
                    pressureMaxWarning: isUnitMCA ?
                        pressure - pressureLoss > DataTables.constants.PRESSURE_MAX_LIMIT_MCA :
                        pressure - pressureLoss > DataTables.constants.PRESSURE_MAX_LIMIT_KPA
                }
            }

            let predecessorPipeSegment = null
            for (let data of pipewayData.listOfPipeSegmentData) {
                if (pipeSegmentData.predecessorPipeSegmentId === data.id) {
                    predecessorPipeSegment = data
                    break
                }
            }
            //recussion
            const result = this.calculatesPressure(pipewayData, predecessorPipeSegment)
            pressure += result.pressure

            return {
                flowRateUnit: DataTables.units.L_S,
                flowRate: flowRate,
                velocityUnit: DataTables.units.M_S,
                velocity: velocity,
                pressureUnit: pipewayData.unit,
                unitaryPressureLoss: unitaryPressureLoss,
                unitaryPressureLossUnit: `${pipewayData.unit} / ${DataTables.units.M}`,
                equivalentLength: equivalentLength,
                equivalentLengthUnit: DataTables.units.M,
                pressureLoss: pressureLoss,
                pressure: pressure - pressureLoss,
                velocityWarning: velocity > DataTables.constants.VELOCITY_LIMIT_M_S,
                pressureMinWarning: isUnitMCA ?
                    pressure - pressureLoss < DataTables.constants.PRESSURE_MIN_LIMIT_MCA :
                    pressure - pressureLoss < DataTables.constants.PRESSURE_MIN_LIMIT_KPA,
                pressureMaxWarning: isUnitMCA ?
                    pressure - pressureLoss > DataTables.constants.PRESSURE_MAX_LIMIT_MCA :
                    pressure - pressureLoss > DataTables.constants.PRESSURE_MAX_LIMIT_KPA
            }
        } catch (error) {
            throw error
        }
    },

    /**
     * Calculates the pressure, velocity, flowrate for pumping segment
     * @param {PipewayData} pipewayData The pipeway data
     * @param {PumpingSegmentData}} pumpingSegmentData The pumping segment data
     * @returns {CalculatedPumpingResults}
     */
    calculatePumping(pipewayData, pumpingSegmentData) {
        const minFlowRate = 0.15 * pumpingSegmentData.dailyConsumption // m³/h
        const flowRate = pumpingSegmentData.dailyConsumption / pumpingSegmentData.pumpingTime
        const fractionOfDailyPumpingTime = pumpingSegmentData.pumpingTime / 24
        const minPumpingDiameter = 1300 / 60 * Math.sqrt(flowRate) * Math.sqrt(Math.sqrt(fractionOfDailyPumpingTime)) // mm
        const suctionDiameter = DataTables.diameters[pumpingSegmentData.suctionNominalDiameter]
        const pumpingDiameter = DataTables.diameters[pumpingSegmentData.pumpingNominalDiameter]
        const suctionVelocity = this.calculatesVelocity(
            flowRate * DataTables.unitConvertionFactor.M3_H_TO_L_S, suctionDiameter)
        const pumpingVelocity = this.calculatesVelocity(
            flowRate * DataTables.unitConvertionFactor.M3_H_TO_L_S, pumpingDiameter)
        const suctionSegmentEquivalentLength = this.calculatesSumOfEquivalentLength(
            pumpingSegmentData.suctionPipeConnections, pipewayData.material, suctionDiameter)
        const pumpingSegmentEquivalentLength = this.calculatesSumOfEquivalentLength(
            pumpingSegmentData.pumpingPipeConnections, pipewayData.material, pumpingDiameter)
        const suctionUnitaryPressureLoss = this.calculatesUnitaryPressureLoss(
            pipewayData.material, flowRate * DataTables.unitConvertionFactor.M3_H_TO_L_S, suctionDiameter) *
            DataTables.unitConvertionFactor.KPA_TO_MCA
        const pumpingUnitaryPressureLoss = this.calculatesUnitaryPressureLoss(
            pipewayData.material, flowRate * DataTables.unitConvertionFactor.M3_H_TO_L_S, pumpingDiameter) *
            DataTables.unitConvertionFactor.KPA_TO_MCA
        const manometricHeight = pumpingSegmentData.suctionManometricHeight +
            pumpingSegmentData.pumpingManometricHeight +
            (pumpingSegmentData.pumpingLength + pumpingSegmentEquivalentLength) * pumpingUnitaryPressureLoss +
            (pumpingSegmentData.suctionLength + suctionSegmentEquivalentLength) * suctionUnitaryPressureLoss
        const calculatedPumpPower = (DataTables.constants.SPECIFIC_WATER_WEIGHT_kgf_m3 *
            flowRate * DataTables.unitConvertionFactor.M3_H_To_M3_S * manometricHeight) /
            (75 * (pumpingSegmentData.pumpYield / 100))
        let selectedPumpPower = 0
        switch (true) {
            case calculatedPumpPower <= 2:
                selectedPumpPower = calculatedPumpPower * 1.50
                break;
            case calculatedPumpPower > 2 && calculatedPumpPower <= 5:
                selectedPumpPower = calculatedPumpPower * 1.30
                break;
            case calculatedPumpPower > 5 && calculatedPumpPower <= 10:
                selectedPumpPower = calculatedPumpPower * 1.20
                break;
            case calculatedPumpPower > 10 && calculatedPumpPower <= 20:
                selectedPumpPower = calculatedPumpPower * 1.15
                break;
            default:
                selectedPumpPower = calculatedPumpPower * 1.10
                break;
        }
        const result = {
            flowRateUnit: DataTables.units.M3_h,
            flowRate: flowRate,
            flowRateWarning: flowRate < minFlowRate,
            suctionVelocity: suctionVelocity,
            pumpingVelocity: pumpingVelocity,
            velocityWarning: suctionVelocity > DataTables.constants.VELOCITY_LIMIT_M_S ||
                pumpingVelocity > DataTables.constants.VELOCITY_LIMIT_M_S,
            manometricHeightUnit: DataTables.units.M,
            manometricHeight: manometricHeight,
            suctionSegmentEquivalentLength: suctionSegmentEquivalentLength,
            pumpingSegmentEquivalentLength: pumpingSegmentEquivalentLength,
            equivalentLengthUnit: DataTables.units.M,
            suctionUnitaryPressureLoss: suctionUnitaryPressureLoss,
            pumpingUnitaryPressureLoss: pumpingUnitaryPressureLoss,
            unitaryPressureLossUnit: `${DataTables.units.MCA}/${DataTables.units.M}`,
            powerUnit: DataTables.units.CV,
            calculatedPumpPower: calculatedPumpPower,
            selectedPumpPower: selectedPumpPower,
            inadequateDiametersWarning: pumpingDiameter < minPumpingDiameter ||
                suctionDiameter < minPumpingDiameter || suctionDiameter <= pumpingDiameter
        }
        return result
    },
    /**
     * Calculates the total of pipe length grouped by diameters
     * @param {Array<{nominalDiameter: String, length: number}>} listOfPipeLengthAndDiameters A list of objects 
     * containing length and diameter values
     */
    calulateTotalOfPipeLengthGroupedByDiameter(listOfPipeLengthAndDiameters) {
        try {
            const pipeLengths = {}
            for (const item of listOfPipeLengthAndDiameters) {
                if (!this.isValidDiameter(item.nominalDiameter)) throw new Error("Invalid parameters!")
                if (!pipeLengths[item.nominalDiameter]) pipeLengths[item.nominalDiameter] = item.length
                else pipeLengths[item.nominalDiameter] += item.length
            }
            return pipeLengths
        } catch (error) {
            throw error
        }
    },


    /**
     * Calculates the total of pipe connections 
     * @param {PipeConnectionsAndDiameters} listOfPipeConnectionsAndDiameters 
     * @returns {PipeConnectionsAndDiameters}
     */
    /*
    calculateTotalOfPipeConnectionsGroupedByDiameter(listOfPipeConnectionsAndDiameters) {
        try {
            const pipeConnections = {}
            for (const item of listOfPipeConnectionsAndDiameters) {
                if (!this.isValidDiameter(item.nominalDiameter)) throw new Error("Invalid parameters!")
                if (!pipeConnections[item.nominalDiameter]) pipeConnections[item.nominalDiameter] = {}
                if (!pipeConnections[item.nominalDiameter][item.pipeConnection]) pipeConnections[item.nominalDiameter][item.pipeConnection] = item.quantity
                else pipeConnections[item.nominalDiameter][item.pipeConnection] += item.quantity
            }
            return pipeConnections
        } catch (error) {
            throw error
        }
    }
    */
    
})