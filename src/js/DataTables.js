/**
 * Constants values used by the application
 */
const DataTables = Object.freeze({
    constants: Object.freeze({
        SPECIFIC_WATER_WEIGHT_kN_m3: 10,
        SPECIFIC_WATER_WEIGHT_kgf_m3: 1000,
        PRESSURE_MIN_LIMIT_KPA: 10,
        PRESSURE_MIN_LIMIT_MCA: 1,
        PRESSURE_MAX_LIMIT_KPA: 400,
        PRESSURE_MAX_LIMIT_MCA: 40,
        VELOCITY_LIMIT_M_S: 3,
    }),

    decimalSeparators: Object.freeze({
        DOT: ".",
        COMMA: ","
    }),

    materials: Object.freeze({
        SMOOTH: "SMOOTH",
        ROUGH: "ROUGH",
    }),

    diameters: Object.freeze({
        DN20: 17.0,
        DN25: 21.6,
        DN32: 27.8,
        DN40: 35.2,
        DN50: 44.0,
        DN60: 53.5,
        DN75: 66.6,
        DN85: 75.6,
        DN110: 97.8,
    }),

    units: Object.freeze({
        KPA: "kPa",
        MCA: "mca",
        L_S: "L/s",
        M3_H: "m³/h",
        M_S: "m/s",
        MM: "mm",
        M: "m",
        CV: "CV",
        W: "W",
        M3: "m³",
        H: "h",
    }),

    unitConvertionFactor: Object.freeze({
        KPA_TO_MCA: 0.101974,
        MCA_TO_KPA: 9.806421,
        M3_H_TO_L_S: 0.277778,
        M3_H_To_M3_S: 1 / 3600
    }),

    equivalentLengthIndexes: Object.freeze({
        SMOOTH_MATERIAL_INDEX: 0,
        ROUGH_MATERIAL_INDEX: 1,
        DN20_INDEX: 0,
        DN25_INDEX: 1,
        DN32_INDEX: 2,
        DN40_INDEX: 3,
        DN50_INDEX: 4,
        DN60_INDEX: 5,
        DN75_INDEX: 6,
        DN85_INDEX: 7,
        DN110_INDEX: 8,
    }),

    equivalentLengthForPipeConnections: Object.freeze({
        J90: [
            [1.1, 1.2, 1.5, 2.0, 3.3, 3.4, 3.7, 3.9, 4.3], //smooth material index 0
            [0.5, 0.7, 0.9, 1.2, 1.4, 1.9, 2.4, 2.8, 3.8] //rough material index 1
        ],
        J45: [
            [0.4, 0.5, 0.7, 1.0, 1.0, 1.3, 1.7, 1.8, 1.9],
            [0.2, 0.3, 0.4, 0.5, 0.6, 0.9, 1.1, 1.3, 1.7]
        ],
        C90: [
            [0.4, 0.5, 0.6, 0.7, 1.2, 1.3, 1.4, 1.5, 1.6],
            [0.3, 0.5, 0.7, 0.8, 1.0, 1.4, 1.7, 2.0, 2.7]
        ],
        C45: [
            [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1, 5]
        ],
        TPD: [
            [0.7, 0.8, 0.9, 1.5, 2.2, 2.3, 2.4, 2.5, 2.6],
            [0.1, 0.1, 0.2, 0.2, 0.2, 0.3, 0.4, 0.5, 0.7]
        ],
        TPL: [
            [2.3, 2.4, 3.1, 4.6, 7.3, 7.6, 7.8, 8.0, 8.3],
            [0.7, 1.0, 1.4, 1.7, 2.1, 2.7, 3.4, 4.1, 5.5]
        ],
        TPBL: [
            [2.3, 2.4, 3.1, 4.6, 7.3, 7.6, 7.8, 8.0, 8.3],
            [0.7, 1.0, 1.4, 1.7, 2.1, 2.7, 3.4, 4.1, 5.5]
        ],
        SC: [
            [0.8, 0.9, 1.3, 1.4, 3.2, 3.3, 3.5, 3.7, 3.9],
            [0.4, 0.5, 0.7, 0.9, 1.0, 1.5, 1.9, 2.2, 3.2],
        ],
        EN: [
            [0.3, 0.4, 0.5, 0.6, 1.0, 1.5, 1.6, 2.0, 2.2],
            [0.2, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 1.1, 1.6],
        ],

        EB: [
            [0.9, 1.0, 1.2, 1.8, 2.3, 2.8, 3.3, 3.7, 4.0],
            [0.4, 0.5, 0.7, 0.9, 1.0, 1, 5, 1.9, 2.2, 3.3],
        ],
        RGA: [
            [0.1, 0.2, 0.3, 0.4, 0.7, 0.8, 0.9, 0.9, 1.0],
            [0.1, 0.1, 0.2, 0.2, 0.3, 0.4, 0.4, 0.5, 0.7],
        ],
        RGL: [
            [11.1, 11.4, 15.0, 22.0, 35.8, 37.9, 38.0, 40.0, 42.3],
            [4.9, 6.7, 8.2, 11.3, 13.4, 17.4, 21.0, 26.0, 34.0],
        ],
        RAN: [
            [5.9, 6.2, 8.4, 10.5, 17.0, 18.5, 19.0, 20.0, 22.1],
            [2.6, 3.6, 4.6, 5.6, 6.7, 8.5, 10.0, 13.0, 17.0],
        ],
        VPC: [
            [8.1, 9.5, 13.3, 15.5, 18.3, 23.7, 25.0, 26.8, 28.6],
            [3.6, 5.6, 7.3, 10.0, 11.6, 14.0, 17.0, 20.0, 23.0],
        ],
        VRL: [
            [2.5, 2.7, 3.8, 4.9, 6.8, 7.1, 8.2, 9.3, 10.4],
            [1.1, 1.6, 2.1, 2.7, 3.2, 4.2, 5.2, 6.3, 8.4],
        ],
        VRP: [
            [3.6, 4.1, 5.8, 7.4, 9.1, 10.8, 12.5, 14.2, 16.0],
            [1.6, 2.4, 3.2, 4.0, 4.8, 6.4, 8.1, 9.7, 12.9],
        ]
    }),

    maxFlowRateForHydrometers: Object.freeze({
        NONE: 0,
        Q1_5: 1.5,
        Q3: 3,
        Q5: 5,
        Q7: 7,
        Q10: 10,
        Q20: 20,
        Q30: 30,
    }),

    flowRateWeightsForSanitaryEquipments: Object.freeze({
        BSC: 0.3,
        BSV: 32,
        BH: 1,
        BE: 0.1,
        BI: 0.1,
        CHD: 0.4,
        CH: 0.1,
        LVRP: 1,
        LV: 0.3,
        MCC: 0.3,
        MCV: 2.8,
        PI: 0.7,
        PITE: 0.1,
        TQ: 0.7,
        TJL: 0.4,
    }),

    dataStructure: Object.freeze({
        unit: "",
        material: "",
        pumpingSegmentData: Object.seal({
            dailyConsumption: 0, 
            pumpYield: 60,
            pumpingTime: 6, 
            suctionLength: 0,
            suctionManometricHeight: 0,
            suctionNominalDiameter: "DN50",
            suctionPipeConnections: {},
            pumpingLength: 0,
            pumpingManometricHeight: 0,
            pumpingNominalDiameter: "DN60",
            pumpingPipeConnections: {},
        }),
        listOfPipeSegmentData: [
            Object.freeze({
                id: 0,
                name: "",
                initialPressure: 0,
                length: 0,
                heightVariation: 0,
                predecessorPipeSegmentId: 0,
                nominalDiameter: "DN20",
                hydrometerMaxFlowRate: 0,
                flowRateWeights: 0,
                pipeConnections: {},
            })
        ]
    })
})
