//constants and global variables
const dataManager = DataManagerFactory.create()
let decimalPlaces = 2
let decimalSeparator = ","

/**
 * Creates a new pipeway data
 * @returns {Promise<void>}
 */
async function newPipewayData() {
    try {
        await dataManager.createsPipewayData()
        createMenu(5)
        mainContent()
    } catch (error) {
        console.log(error)
    }
}

/**
 * Opens a pipeway data
 * @returns {Promise<void>}
 */
async function openPipewayData() {
    try {
        await dataManager.openPipewayData()
        createMenu(5)
        mainContent()
    } catch (error) {
        console.log(error)
        if (error.message === Texts.INVALID_FILE_DATA_STRUCTURE) alert(error.message)
    }
}

/**
 * Shows a specific content when the browser can not run the application
 */
function AppNotWorkContent() {
    const mainEl = document.querySelector("main")
    const pEl = document.createElement("p")
    mainEl.innerHTML = ""
    pEl.innerText = Texts.APP_NOT_WORK_IN_THIS_BROWSER
    mainEl.append(pEl)
}

/**
 * Changes the pipe material type and reload the main content accordingly
 * @param {Event} event The event triggered by html element responsible by change material
 */
async function changeMaterial(event) {
    try {
        const val = event.target.value
        await dataManager.setPipewayDataProperty("material", val)
        mainContent()
    } catch (error) {
        console.log(error)
    }
}

/**
 * Changes the pressure unit and reload the main content accordingly
 * @param {Event} event The event triggered by html element responsible by change unit
 */
async function changeUnit(event) {
    try {
        const val = event.target.value
        await dataManager.setPipewayDataProperty("unit", val)
        mainContent()
    } catch (error) {
        console.log(error)
    }
}

/**
 * Clear the main content html element
 */
function clearMainContentElement() {
    document.querySelector("main").innerHTML = ""
}

/**
 * Fills the html element with specific content 
 * @param {Array<HTMLElement | String>} content 
 */
function insertContentToMainElement(content) {
    const main = document.querySelector("main")
    main.append(...content)
}

/**
 * Loads and presents the application main content
 */
function mainContent() {

    try {
        let option, label, tr, th, td, button, table, thead, tbody
        const pipewayData = dataManager.getPipewayData()
        const mainEl = document.querySelector("main")
        mainEl.innerHTML = ""
        //creating header for the project opened
        const h4 = document.createElement("h4")
        h4.innerText = `Projeto de dimensionamento: ${dataManager.getPipewayDataName()}`
        mainEl.append(h4)

        //creating container for material and pression unit selectors and a button to add a pipe segment
        const containerEl = document.createElement("div")
        containerEl.setAttribute("id", "main-ctrl")
        //creating material selector
        const materialSelector = document.createElement("select")
        materialSelector.setAttribute("id", "material-selector")
        label = document.createElement("label")
        label.innerText = `${Texts.MATERIAL}: `
        option = document.createElement("option")
        option.innerText = Texts.SMOOTH
        option.value = DataTables.materials.SMOOTH
        materialSelector.append(option)
        option = document.createElement("option")
        option.innerText = Texts.ROUGH
        option.value = DataTables.materials.ROUGH
        materialSelector.append(option)
        materialSelector.value = pipewayData.material
        materialSelector.addEventListener("change", changeMaterial)
        label.append(materialSelector)
        containerEl.append(label)

        //Creating pression unit selector
        const unitSelector = document.createElement("select")
        unitSelector.setAttribute("id", "unit-selector")
        label = document.createElement("label")
        label.innerText = `${Texts.UNIT}: `
        option = document.createElement("option")
        option.innerText = DataTables.units.KPA
        option.value = DataTables.units.KPA
        unitSelector.append(option)
        option = document.createElement("option")
        option.innerText = DataTables.units.MCA
        option.value = DataTables.units.MCA
        unitSelector.append(option)
        unitSelector.value = pipewayData.unit
        unitSelector.addEventListener("change", changeUnit)
        label.append(unitSelector)
        containerEl.append(label)

        //creating button to add a pipesegment
        button = document.createElement("button")
        button.innerText = Texts.ADD_PIPE_SEGMENT
        button.addEventListener("click", addNewPipeSegment)
        containerEl.append(button)

        //creating button to dimensionate a pumping pipe segment
        button = document.createElement("button")
        button.innerText = Texts.DIMENSIONING_PUMPING
        button.addEventListener("click", addNewOrEditPumpingSegment)
        containerEl.append(button)

        //appending the container to main element
        mainEl.append(containerEl)

        //creating pumping segment info
        table = document.createElement("table")
        thead = document.createElement("thead")
        tr = document.createElement("tr")
        th = document.createElement("th")
        th.innerText = Texts.PUMPING_SEGMENT
        tr.append(th)
        th = document.createElement("th")
        th.innerText = `${Texts.VAR_FLOW_RATE} (${DataTables.units.M3_H})`
        tr.append(th)
        th = document.createElement("th")
        th.innerText = `${Texts.VAR_MANOMETRIC_HEIGHT} (${DataTables.units.M})`
        tr.append(th)
        th = document.createElement("th")
        th.innerText = `${Texts.VAR_PUMP_POWER} (${DataTables.units.CV})`
        tr.append(th)
        thead.append(tr)
        th = document.createElement("th")
        th.innerText = ``
        tr.append(th)
        thead.append(tr)
        table.append(thead)

        tbody = document.createElement("tbody")
        tr = document.createElement("tr")
        td = document.createElement("td")
        tr.append(td)
        td.innerText = "-"

        //populating the pumping segment table
        if (JSON.stringify(pipewayData.pumpingSegmentData) === "{}") {
            td = document.createElement("td")
            td.innerText = Texts.THERE_ARE_NOT_PUMPING_SEGMENT
            td.setAttribute("colspan", "4")
            tr.append(td)
            tbody.append(tr)
        } else {

            const result = Hydraulics.calculatePumping(pipewayData, pipewayData.pumpingSegmentData)
            td = document.createElement("td")
            td.innerText = result.flowRate.toFixed(decimalPlaces).replace(".", decimalSeparator)
            tr.append(td)
            tbody.append(tr)
            td = document.createElement("td")
            td.innerText = result.manometricHeight.toFixed(decimalPlaces).replace(".", decimalSeparator)
            tr.append(td)
            tbody.append(tr)
            td = document.createElement("td")
            td.innerText = result.selectedPumpPower.toFixed(decimalPlaces).replace(".", decimalSeparator)
            tr.append(td)
            td = document.createElement("td")
            button = document.createElement("button")
            button.classList.add("del-btn")
            button.addEventListener("click", (e) => delPumpingSegment(e))
            td.append(button)
            tr.append(td)
            tbody.append(tr)

        }

        table.append(tbody)
        mainEl.append(table)

        //creating table containing the data of pipe segments
        table = document.createElement("table")
        thead = document.createElement("thead")
        tr = document.createElement("tr")
        th = document.createElement("th")
        th.innerText = Texts.SEGMENT
        tr.append(th)
        th = document.createElement("th")
        th.innerText = Texts.PREDECESSOR_PIPESEGMENT
        tr.append(th)
        th = document.createElement("th")
        th.innerText = `${Texts.VAR_NOMINAL_DIAMETER} (${DataTables.units.MM})`
        tr.append(th)
        th = document.createElement("th")
        th.innerText = `${Texts.VAR_FLOW_RATE} (${DataTables.units.L_S})`
        tr.append(th)
        th = document.createElement("th")
        th.innerText = `${Texts.VAR_VELOCITY} (${DataTables.units.M_S})`
        tr.append(th)
        th = document.createElement("th")
        th.innerText = `${Texts.VAR_PRESSURE_LOSS} (${pipewayData.unit})`
        tr.append(th)
        th = document.createElement("th")
        th.innerText = `${Texts.VAR_PRESSURE} (${pipewayData.unit})`
        tr.append(th)
        tr.append(th)
        th = document.createElement("th")
        th.innerText = ""
        tr.append(th)

        thead.append(tr)
        table.append(thead)

        tbody = document.createElement("tbody")
        if (pipewayData.listOfPipeSegmentData.length === 0) {
            tr = document.createElement("tr")
            td = document.createElement("td")
            td.innerText = Texts.THERE_ARE_NOT_SEGMENTS
            td.setAttribute("colspan", "8")
            tr.append(td)
            tbody.append(tr)
        }
        else {
            //populating the pipe segment table
            for (let pipeSegmentData of pipewayData.listOfPipeSegmentData) {

                const predecessorPipeSegmentData = dataManager.findPipeSegmentDataById(pipeSegmentData.predecessorPipeSegmentId)
                const predecessorPipeSegmentName = predecessorPipeSegmentData === null ? Texts.NONE : predecessorPipeSegmentData.name
                const result = Hydraulics.calculatesPressure(pipewayData, pipeSegmentData)
                tr = document.createElement("tr")
                td = document.createElement("td")
                td.innerText = pipeSegmentData.name
                tr.append(td)
                td = document.createElement("td")
                td.innerText = predecessorPipeSegmentName
                tr.append(td)
                td = document.createElement("td")
                td.innerText = pipeSegmentData.nominalDiameter
                tr.append(td)

                td = document.createElement("td")
                td.innerText = result.flowRate.toFixed(decimalPlaces).replace(".", decimalSeparator)
                tr.append(td)

                td = document.createElement("td")
                td.innerText = result.velocity.toFixed(decimalPlaces).replace(".", decimalSeparator)
                tr.append(td)

                td = document.createElement("td")
                td.innerText = result.pressureLoss.toFixed(decimalPlaces).replace(".", decimalSeparator)
                tr.append(td)

                td = document.createElement("td")
                td.innerText = result.pressure.toFixed(decimalPlaces).replace(".", decimalSeparator)
                tr.append(td)

                td = document.createElement("td")
                button = document.createElement("button")
                button.innerText = ""
                button.classList.add("edit-btn")
                button.addEventListener("click", (e) => editPipeSegment(e, pipeSegmentData.id))
                td.append(button)
                button = document.createElement("button")
                button.innerText = ""
                button.classList.add("del-btn")
                button.addEventListener("click", (e) => delPipeSegment(e, pipeSegmentData.name, pipeSegmentData.id))
                td.append(button)
                tr.append(td)
                tbody.append(tr)
            }
        }

        table.append(tbody)
        mainEl.append(table)

    } catch (error) {
        throw error
    }
}

/**
 * Shows or hiddens the application modal content
 */
function showOrHiddenModal() {
    const modalContainer = document.getElementById("modal-container")
    modalContainer.classList.toggle("hidden")
}

/**
 * Clears the application modal content
 */
function clearModalContent() {
    document.getElementById("modal").innerHTML = ""
}

/**
 * Inserts content into the application modal content
 * @param {Array<String | HTMLElement>} content Content to be inserted into modal
 */
function insertContentToModal(content) {
    const modal = document.getElementById("modal")
    modal.append(...content)
}

/**
 * Creates configuration content using a modal viewr
 */
function createConfigContent() {
    let label, formRow, select, option, input, legend, container
    const modalEl = document.getElementById("modal")
    const formEl = document.createElement("form")
    modalEl.innerHTML = ""

    //close button
    const button = document.createElement("button")
    button.classList.add("close-btn", "red-btn")
    button.innerText = ""
    button.addEventListener("click", showOrHiddenModal)
    modalEl.append(button)

    //fildset container
    container = document.createElement("fieldset")
    legend = document.createElement("legend")
    legend.innerText = `${Texts.CONFIGURATIONS}:`
    container.append(legend)

    //first form row
    formRow = document.createElement("div")
    //decimal places input
    label = document.createElement("label")
    label.innerText = `${Texts.DECIMAL_PLACES}: `
    input = document.createElement("input")
    input.setAttribute("type", "text")
    input.setAttribute("id", "decimalPlaces")
    input.value = localStorage.getItem("decimalPlaces") ? Number(localStorage.getItem("decimalPlaces")) : 2
    input.setAttribute("name", "decimalPlaces")
    input.classList.add("config-input")
    input.addEventListener("input", (e) => Utilities.inputMasks.posIntMaskWithInterval(e, 5))
    input.addEventListener("change", (e) => {
        const value = e.target.value
        localStorage.setItem("decimalPlaces", value)
        decimalPlaces = Number(value)
        if (dataManager.hasOpenedPipewayData()) mainContent()
    })
    label.append(input)
    formRow.append(label)

    //decimal separator select element
    label = document.createElement("label")
    label.innerText = `${Texts.DECIMAL_SEPARATOR}): `
    select = document.createElement("select")
    select.setAttribute("id", "decimalSeparator")
    select.setAttribute("name", "decimalSeparator")
    select.addEventListener("change", (e) => {
        const value = e.target.value
        localStorage.setItem("decimalSeparator", value)
        decimalSeparator = value
        if (dataManager.hasOpenedPipewayData()) mainContent()
    })
    select.classList.add("config-input")
    for (let ds of Object.values(DataTables.decimalSeparators)) {
        option = document.createElement("option")
        option.innerText = ds
        option.value = ds
        select.append(option)
    }
    select.value = localStorage.getItem("decimalSeparator")
    label.append(select)
    formRow.append(label)
    container.append(formRow)
    //second row
    formRow = document.createElement("div")
    container.append(formRow)
    formEl.append(container)
    modalEl.append(formEl)
    showOrHiddenModal()
}

/**
 * Creates legend element to be used in the legend vizualition
 */
function createLegendElement() {
    const data = [
        `${Texts.VAR_FLOW_RATE} - ${Texts.FLOW_RATE} (${DataTables.units.L_S})`,
        `${Texts.VAR_NOMINAL_DIAMETER} - ${Texts.NOMINAL_DIAMETER} (${DataTables.units.MM})`,
        `${Texts.VAR_PRESSURE} - ${Texts.PRESSURE} (${DataTables.units.MCA} | ${DataTables.units.KPA})`,
        `${Texts.VAR_INITIAL_PRESSURE} - ${Texts.INITIAL_PRESSURE} (${DataTables.units.MCA} | ${DataTables.units.KPA})`,
        `${Texts.VAR_UNITARY_PRESSURE_LOSS} - ${Texts.UNITARY_PRESSURE_LOSS} (${DataTables.units.MCA}/${DataTables.units.M} | ${DataTables.units.KPA}/${DataTables.units.M})`,
        `${Texts.VAR_PRESSURE_LOSS} - ${Texts.PRESSURE_LOSS} (${DataTables.units.MCA} | ${DataTables.units.KPA})`,
        `${Texts.VAR_EQUIVALENT_LENGTH} - ${Texts.EQUIVALENT_LENGTH} (${DataTables.units.M})`,
        `${Texts.VAR_REAL_LENGTH} - ${Texts.REAL_LENGTH} (${DataTables.units.M})`,
        `${Texts.VAR_HEIGHT_VARIATION} - ${Texts.HEIGHT_VARIATION} (${DataTables.units.M})`,
        `${Texts.VAR_MANOMETRIC_HEIGHT} - ${Texts.MANOMETRIC_HEIGHT} (${DataTables.units.M})`,
        `${Texts.VAR_SUM_OF_WEIGHTS} - ${Texts.SUM_OF_WEIGHTS}`,
        `${Texts.VAR_DAILY_CONSUMPTION} - ${Texts.DAILY_CONSUMPTION} (${DataTables.units.M3})`,
        `${Texts.VAR_PUMPING_TIME} - ${Texts.PUMPING_TIME} (${DataTables.units.H})`,
        `${Texts.VAR_PUMP_YIELD} - ${Texts.PUMP_YIELD} (%)`,
        `${Texts.VAR_PUMP_POWER} - ${Texts.PUMP_POWER} (%)`
    ]
    const content = []
    for (const item of data) content.push(Utilities.HTMLFactory.createHTMLPElement(null, null, [item]))
    return Utilities.HTMLFactory.createHTMLDivElement(null, null, content)
}

/**
 * Shows the legend content using a modal vizualization
 */
function showLegendContent() {
    clearModalContent()
    const modalEl = document.getElementById("modal")
    const legend = createLegendElement()
    const title = Utilities.HTMLFactory.createHTMLH4Element(null, null, [Texts.LEGEND_FOR_VARIABLE])
    const closeButton = Utilities.HTMLFactory.createHTMLButtonElement(null, ["close-btn", "red-btn"], "", showOrHiddenModal)
    const container = Utilities.HTMLFactory.createHTMLDivElement("variable-legend", null, [title, legend])
    insertContentToModal([closeButton, container])
    showOrHiddenModal()
}

function createFlowRateWeightsCalculatorContent() {
    let label, formRow, input, legend, container, span, div
    const modalEl = document.getElementById("modal")
    const formEl = document.createElement("form")
    modalEl.innerHTML = ""

    //close button
    const button = document.createElement("button")
    button.classList.add("close-btn", "red-btn")
    button.addEventListener("click", showOrHiddenModal)
    modalEl.append(button)

    //fildset container
    container = document.createElement("fieldset")
    legend = document.createElement("legend")
    legend.innerText = `${Texts.SANITARY_EQUIPMENTS}:`
    container.append(legend)
    //first row

    formRow = document.createElement("div")
    //div = document.createElement("div")
    span = document.createElement("span")
    span.setAttribute("id", "flowRateResult")
    formRow.append(`${Texts.VAR_FLOW_RATE} = `)
    span.innerText = "0"
    formRow.append(span)
    formRow.append(` ${DataTables.units.L_S}`)
    //formRow.append(div)

    //div = document.createElement("div")
    span = document.createElement("span")
    span.setAttribute("id", "sumOfFlowRateWeightsResult")
    formRow.append(` | ${Texts.VAR_SUM_OF_WEIGHTS} = `)
    span.innerText = "0"
    formRow.append(span)
    //formRow.append(div)

    formEl.append(formRow)


    for (const s of Object.keys(DataTables.flowRateWeightsForSanitaryEquipments)) {
        formRow = document.createElement("div")
        label = document.createElement("label")
        label.innerText = `${Texts[s]}: `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", s)
        input.classList.add("input-weight")
        input.addEventListener("input", (e) => Utilities.inputMasks.posIntMask(e, decimalSeparator))
        input.addEventListener("change", (e) => {
            let sum = 0
            const inputs = document.querySelectorAll(".input-weight")
            const flowRateOutput = document.getElementById("flowRateResult")
            const flowRateWeightsOutput = document.getElementById("sumOfFlowRateWeightsResult")
            for (const input of inputs) sum += DataTables.flowRateWeightsForSanitaryEquipments[input.id] * Number(input.value)
            const flowRate = Hydraulics.calculatesFlowRateUsingflowRateWeight(sum)
            flowRateOutput.innerText = flowRate.toFixed(decimalPlaces).replace(".", decimalSeparator)
            flowRateWeightsOutput.innerText = sum.toFixed(decimalPlaces).replace(".", decimalSeparator)
        })
        label.append(input)
        formRow.append(label)
        formEl.append(formRow)
    }

    container.append(formEl)
    modalEl.append(container)
    showOrHiddenModal()
}

function createPumpingCalculatorContent() {
    try {
        createMenu(4)
        const pipewayData = dataManager.getPipewayData()

        let label, formRow, select, option, input, legend, button, container, span
        const mainEl = document.querySelector("main")
        const formEl = document.createElement("form")

        mainEl.innerHTML = ""

        //first form row
        formRow = document.createElement("fieldset")
        legend = document.createElement("legend")
        legend.innerText = `${Texts.PARAMETERS}:`
        formRow.append(legend)


        //velocities results
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "suctionVelocity")
        container.append(`${Texts.VAR_VELOCITY} (${Texts.SUCTION_SEGMENT}) = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.M_S}`)
        formRow.append(container)

        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "pumpingVelocity")
        container.append(`${Texts.VAR_VELOCITY} (${Texts.PUMPING_SEGMENT}) = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.M_S}`)
        formRow.append(container)

        //equivalent length results
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "suctionSegmentEquivalentLength")
        container.append(`${Texts.VAR_EQUIVALENT_LENGTH} (${Texts.SUCTION_SEGMENT}) = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.M}`)
        formRow.append(container)

        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "pumpingSegmentEquivalentLength")
        container.append(`${Texts.VAR_EQUIVALENT_LENGTH} (${Texts.PUMPING_SEGMENT}) = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.M}`)
        formRow.append(container)

        //unitary pressure loss results
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "suctionUnitaryPressureLoss")
        container.append(`${Texts.VAR_UNITARY_PRESSURE_LOSS} (${Texts.SUCTION_SEGMENT}) = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.MCA}/${DataTables.units.M}`)
        formRow.append(container)

        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "pumpingUnitaryPressureLoss")
        container.append(`${Texts.VAR_UNITARY_PRESSURE_LOSS} (${Texts.PUMPING_SEGMENT}) = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.MCA}/${DataTables.units.M}`)
        formRow.append(container)


        //flow rate 
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "flowRate")
        container.append(`${Texts.VAR_FLOW_RATE} = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.M3_H}`)
        formRow.append(container)

        //Manometric Height 
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "manometricHeight")
        container.append(`${Texts.VAR_MANOMETRIC_HEIGHT} = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.M}`)
        formRow.append(container)


        //calculated pump power
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "calculatedPumpPower")
        container.append(`${Texts.VAR_PUMP_POWER} (${Texts.CALCULATED}) = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.CV}`)
        formRow.append(container)

        //selected pump power
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "selectedPumpPower")
        container.append(`${Texts.VAR_PUMP_POWER} (${Texts.SELECTED}) = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.CV}`)
        formRow.append(container)

        formEl.append(formRow)

        //second form row
        formRow = document.createElement("fieldset")
        legend = document.createElement("legend")
        legend.innerText = `${Texts.PUMPING_INFO}:`
        formRow.append(legend)

        //Daily comsuption
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_DAILY_CONSUMPTION} (${DataTables.units.M3}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "dailyConsumption")
        input.setAttribute("name", "dailyConsumption")
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPumping)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //percentage of daily comsumption 
        label = document.createElement("label")
        //label.innerText = `${Texts.PUMP_YIELD} (%): `
        label.innerText = `${Texts.VAR_PUMPING_TIME} (${DataTables.units.H}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "pumpingTime")
        input.setAttribute("name", "pumpingTime")
        input.value = "6"
        input.addEventListener("change", setResultsDimensionatingPumping)
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMaskWithInterval(e, decimalSeparator, 24))
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //pump yield 
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_PUMP_YIELD} (%): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "pumpYield")
        input.setAttribute("name", "pumpYield")
        input.value = "50"
        input.addEventListener("change", setResultsDimensionatingPumping)
        input.addEventListener("input", (e) => Utilities.inputMasks.posIntMaskWithInterval(e, 100))
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //DN of pumping segment 
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_NOMINAL_DIAMETER} (${Texts.PUMPING_SEGMENT}): `
        select = document.createElement("select")
        select.setAttribute("id", "pumpingNominalDiameter")
        select.setAttribute("name", "pumpingNominalDiameter")
        select.addEventListener("change", setResultsDimensionatingPumping)
        select.classList.add("input")

        for (let dn of Object.keys(DataTables.diameters)) {
            option = document.createElement("option")
            option.innerText = dn
            option.value = dn
            select.append(option)
        }
        label.append(select)
        formRow.append(label)

        //DN of suction segment 
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_NOMINAL_DIAMETER} (${Texts.SUCTION_SEGMENT}): `
        select = document.createElement("select")
        select.setAttribute("id", "suctionNominalDiameter")
        select.setAttribute("name", "suctionNominalDiameter")
        select.addEventListener("change", setResultsDimensionatingPumping)
        select.classList.add("input")

        for (let dn of Object.keys(DataTables.diameters)) {
            option = document.createElement("option")
            option.innerText = dn
            option.value = dn
            select.append(option)
        }
        label.append(select)
        formRow.append(label)

        //pumping manometric height variantion input
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_MANOMETRIC_HEIGHT} - ${Texts.PUMPING_SEGMENT} (${DataTables.units.M}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "pumpingManometricHeight")
        input.setAttribute("name", "pumpingManometricHeight")
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPumping)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //suction manometric height variantion input
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_MANOMETRIC_HEIGHT} - ${Texts.SUCTION_SEGMENT} (${DataTables.units.M}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "suctionManometricHeight")
        input.setAttribute("name", "suctionManometricHeight")
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPumping)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //pumping lenght height variantion input
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_REAL_LENGTH} - ${Texts.PUMPING_SEGMENT} (${DataTables.units.M}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "pumpingLength")
        input.setAttribute("name", "pumpingLength")
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPumping)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //suction manometric height variantion input
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_REAL_LENGTH} - ${Texts.SUCTION_SEGMENT} (${DataTables.units.M}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "suctionLength")
        input.setAttribute("name", "suctionLength")
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPumping)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        formEl.append(formRow)

        //third form row
        formRow = document.createElement("fieldset")
        formRow.classList.add("pumping-pipeconnection")
        legend = document.createElement("legend")
        legend.innerText = `${Texts.REGISTERS} / ${Texts.PIPE_CONNECTIONS} (${Texts.PUMPING_SEGMENT}):`
        formRow.append(legend)

        //pumping pipe connections inputs
        for (const pipeConnection of Object.keys(DataTables.equivalentLengthForPipeConnections)) {
            label = document.createElement("label")
            input = document.createElement("input")
            input.classList.add(pipeConnection)
            label.innerText = `${Texts[pipeConnection]}: `
            input.setAttribute("type", "text")
            //input.setAttribute("id", pipeConnection)
            input.setAttribute("name", pipeConnection)
            input.addEventListener("input", Utilities.inputMasks.posIntMask)
            input.addEventListener("change", setResultsDimensionatingPumping)
            //input.classList.add("input")
            input.value = 0
            label.append(input)
            formRow.append(label)
        }
        formEl.append(formRow)

        //fouth form row
        formRow = document.createElement("fieldset")
        formRow.classList.add("suction-pipeconnection")
        legend = document.createElement("legend")
        legend.innerText = `${Texts.REGISTERS} / ${Texts.PIPE_CONNECTIONS} (${Texts.SUCTION_SEGMENT}):`
        formRow.append(legend)

        //pumping pipe connections inputs
        for (const pipeConnection of Object.keys(DataTables.equivalentLengthForPipeConnections)) {
            label = document.createElement("label")
            input = document.createElement("input")
            input.classList.add(pipeConnection)
            label.innerText = `${Texts[pipeConnection]}: `
            input.setAttribute("type", "text")
            //input.setAttribute("id", pipeConnection)
            input.setAttribute("name", pipeConnection)
            input.addEventListener("input", Utilities.inputMasks.posIntMask)
            input.addEventListener("change", setResultsDimensionatingPumping)
            //input.classList.add("input")
            input.value = 0
            label.append(input)
            formRow.append(label)
        }
        formEl.append(formRow)

        //sixth row
        formRow = document.createElement("div")
        //save button or edit button
        button = document.createElement("button")
        button.classList.add("save-btn")
        button.addEventListener("click", (e) => savePumpingSegment(e))

        formRow.append(button)
        //back button
        button = document.createElement("button")
        button.classList.add("back-btn")
        button.addEventListener("click", back)
        formRow.append(button)
        formEl.append(formRow)
        mainEl.append(formEl)
    } catch (error) {
        console.log(error)
    }
}

function secondaryContent(newData) {
    try {
        createMenu(4)
        const pipewayData = dataManager.getPipewayData()

        let label, formRow, select, option, input, legend, button, container, span
        const mainEl = document.querySelector("main")
        const formEl = document.createElement("form")

        mainEl.innerHTML = ""

        //first form row
        formRow = document.createElement("fieldset")
        legend = document.createElement("legend")
        legend.innerText = `${Texts.PARAMETERS}:`
        formRow.append(legend)
        //flowrate result
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "flowRate")
        container.append(`${Texts.VAR_FLOW_RATE} = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.L_S}`)
        formRow.append(container)
        //velocity result
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "velocity")
        container.append(`${Texts.VAR_VELOCITY} = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.M_S}`)
        formRow.append(container)
        //equivalent length 
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "equivalentLength")
        container.append(`${Texts.VAR_EQUIVALENT_LENGTH} = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${DataTables.units.M}`)
        formRow.append(container)

        //unitary pressure loss 
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "unitaryPressureLoss")
        container.append(`${Texts.VAR_UNITARY_PRESSURE_LOSS} = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${pipewayData.unit} / ${DataTables.units.M}`)
        formRow.append(container)
        //pressure loss result
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "pressureLoss")
        container.append(`${Texts.VAR_PRESSURE_LOSS} = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${pipewayData.unit}`)
        formRow.append(container)
        //pressure result
        container = document.createElement("div")
        span = document.createElement("span")
        span.classList.add("result")
        span.setAttribute("id", "pressure")
        container.append(`${Texts.VAR_PRESSURE} = `)
        span.innerText = "0"
        container.append(span)
        container.append(` ${pipewayData.unit}`)
        formRow.append(container)

        formEl.append(formRow)

        //second form row
        formRow = document.createElement("fieldset")
        legend = document.createElement("legend")
        legend.innerText = `${Texts.PIPESEGMENT_INFO}:`
        formRow.append(legend)
        //segment id
        input = document.createElement("input")
        input.setAttribute("type", "hidden")
        input.setAttribute("id", "id")
        input.setAttribute("name", "id")
        input.classList.add("input")
        formRow.append(input)
        //segment name
        label = document.createElement("label")
        label.setAttribute("id", "name-label")
        label.innerText = `${Texts.NAME}: `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "name")
        input.setAttribute("name", "name")
        input.classList.add("input")
        label.append(input)
        formRow.append(label)
        //DN select element
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_NOMINAL_DIAMETER}: `
        select = document.createElement("select")
        select.setAttribute("id", "nominalDiameter")
        select.setAttribute("name", "diameter")
        select.addEventListener("change", setResultsDimensionatingPipeSegments)
        select.classList.add("input")

        for (let dn of Object.keys(DataTables.diameters)) {
            option = document.createElement("option")
            option.innerText = dn
            option.value = dn
            select.append(option)
        }
        label.append(select)
        formRow.append(label)

        //predecessor pipe segment select element
        label = document.createElement("label")
        label.innerText = `${Texts.PREDECESSOR_PIPESEGMENT}: `
        select = document.createElement("select")
        select.setAttribute("id", "predecessorPipeSegmentId")
        select.setAttribute("name", "predecessorPipeSegmentId")
        select.addEventListener("change", setResultsDimensionatingPipeSegments)
        select.classList.add("input")
        option = document.createElement("option")
        option.innerText = Texts.NONE
        option.value = 0
        select.append(option)
        for (let info of dataManager.listPipeSegmentsData()) {
            option = document.createElement("option")
            option.innerText = info.name
            option.value = info.id
            select.append(option)
        }
        label.append(select)
        formRow.append(label)
        //hydrometer select element
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_MAX_FLOW_RATE} (${Texts.HYDROMETER}) (${DataTables.units.M3_H}): `
        select = document.createElement("select")
        select.setAttribute("id", "hydrometerMaxFlowRate")
        select.setAttribute("name", "hydrometerMaxFlowRate")
        select.addEventListener("change", setResultsDimensionatingPipeSegments)
        select.classList.add("input")
        for (let maxFlowRate of Hydraulics.Hydrometer.listMaxFlowRates()) {
            option = document.createElement("option")
            option.innerText = maxFlowRate
            option.value = maxFlowRate
            select.append(option)
        }
        label.append(select)
        formRow.append(label)

        //flowRateWeights
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_SUM_OF_WEIGHTS} : `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "flowRateWeights")
        input.setAttribute("name", "flowRateWeights")
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPipeSegments)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //initial pressure input
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_INITIAL_PRESSURE} (${pipewayData.unit}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "initialPressure")
        input.setAttribute("name", "initialPressure")
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPipeSegments)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //initial height variantion input
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_HEIGHT_VARIATION} (${DataTables.units.M}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "heightVariation")
        input.setAttribute("name", "heightVariation")
        input.addEventListener("input", (e) => Utilities.inputMasks.realNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPipeSegments)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)

        //length input
        label = document.createElement("label")
        label.innerText = `${Texts.VAR_REAL_LENGTH} (${DataTables.units.M}): `
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("id", "length")
        input.setAttribute("name", "length")
        input.addEventListener("input", (e) => Utilities.inputMasks.posNumberMask(e, decimalSeparator))
        input.addEventListener("change", setResultsDimensionatingPipeSegments)
        input.classList.add("input")
        label.append(input)
        formRow.append(label)
        formEl.append(formRow)

        //third form row
        formRow = document.createElement("fieldset")
        legend = document.createElement("legend")
        legend.innerText = `${Texts.REGISTERS} / ${Texts.PIPE_CONNECTIONS}:`
        formRow.append(legend)

        //pipe connections inputs
        for (const pipeConnection of Object.keys(DataTables.equivalentLengthForPipeConnections)) {
            label = document.createElement("label")
            input = document.createElement("input")
            label.innerText = `${Texts[pipeConnection]}: `
            input.setAttribute("type", "text")
            input.setAttribute("id", pipeConnection)
            input.setAttribute("name", pipeConnection)
            input.addEventListener("input", Utilities.inputMasks.posIntMask)
            input.addEventListener("change", setResultsDimensionatingPipeSegments)
            input.classList.add("input")
            input.value = 0
            label.append(input)
            formRow.append(label)
        }
        formEl.append(formRow)

        //sixth row
        formRow = document.createElement("div")
        //save button or edit button
        button = document.createElement("button")
        button.classList.add("save-btn")
        button.addEventListener("click", (e) => savePipeSegment(e, newData))
        formRow.append(button)
        //back button
        button = document.createElement("button")
        button.classList.add("back-btn")
        button.addEventListener("click", back)
        formRow.append(button)
        formEl.append(formRow)
        mainEl.append(formEl)
    } catch (error) {
        console.log(error)
    }
}

/**
 * Saves the pipe segment data
 * @param {Event} event The event triggered by the button that runs the function
 * @param {*} newData Bollean flag for new data 
 */
async function savePipeSegment(event, newData) {
    let warnings = ""
    try {
        event.preventDefault()
        const pipeSegmentData = getFormDataDimensionatingPipeSegment()
        const results = setResultsDimensionatingPipeSegments()
        if (results.pressureMinWarning || results.pressureMaxWarning || results.velocityWarning) {
            if (results.velocityWarning) warnings += `${Texts.VELOCITY_LIMIT_WARNING} `
            if (results.pressureMinWarning) warnings += `${Texts.PRESSURE_MIN_LIMIT_WATNING} `
            if (results.pressureMaxWarning) warnings += `${Texts.PRESSURE_MAX_LIMIT_WATNING} `
            throw new Error(Texts.NOT_ALLOWED_SAVE)
        }
        await dataManager.addOrReplacePipeSegmentData(pipeSegmentData, newData)
        createMenu(5)
        mainContent()
    } catch (error) {
        console.log(error)
        if (error.message === Texts.NOT_ALLOWED_SAVE) {
            alert(`${error.message} ${warnings}`)
            return
        }
        //alert(error.message)
    }
}

/**
 * Saves the pumping segment data
 * @param {Event} event The event triggered by the button that runs the function
 */
async function savePumpingSegment(event) {
    let warnings = ""
    try {
        event.preventDefault()
        const pumpingSegmentData = getFormDataDimensionatingPumping()
        const results = setResultsDimensionatingPumping()
        if (results.velocityWarning) {
            let warnings = ""
            if (results.velocityWarning) warnings += `${Texts.VELOCITY_LIMIT_WARNING} `
            alert(warnings)
        }
        if (results.velocityWarning || results.inadequateDiametersWarning || results.flowRateWarning) {
            if (results.velocityWarning) warnings += `${Texts.VELOCITY_LIMIT_WARNING} `
            if (results.inadequateDiametersWarning) warnings += `${Texts.INADEQUATE_DIAMETERS_WARNING} `
            if (results.flowRateWarning) warnings += `${Texts.FLOW_RATE_WARNING} `
            throw new Error(Texts.NOT_ALLOWED_SAVE)
        }
        await dataManager.addOrReplacePumpingSegment(pumpingSegmentData)
        createMenu(5)
        mainContent()
    } catch (error) {
        console.log(error)
        if (error.message === Texts.NOT_ALLOWED_SAVE) {
            alert(`${error.message} ${warnings}`)
            return
        }
        //alert(error.message)
    }

}

/**
 * Edits a specific pipe segment data
 * @param {Event} event The event triggered by the button that runs the function
 * @param {Number} pipeSegmentDataId The id of pipe segment to be edited
 */
async function editPipeSegment(event, pipeSegmentDataId) {
    try {
        event.preventDefault()
        const pipeSegmentData = dataManager.findPipeSegmentDataById(pipeSegmentDataId)
        await dataManager.addOrReplacePipeSegmentData(pipeSegmentData, false)
        secondaryContent(false)
        setFormDataDimensionatingPipeSegment(pipeSegmentData)
        setResultsDimensionatingPipeSegments()
    } catch (error) {
        console.log(error)
        //alert(error.message)
    }
}

/**
 * Deletes a specific pipe segment data
 * @param {Event} event The event triggered by the button that runs the function
 * @param {String} pipeSegmentDataName The name of pipe segment data to be deleted 
 * @param {Number} pipeSegmentDataId The id of pipe segment to be deleted
 * @returns 
 */
async function delPipeSegment(event, pipeSegmentDataName, pipeSegmentDataId) {
    try {
        event.preventDefault()
        const ask = confirm(`${Texts.DO_YOU_HAVE_TO_DELETE_THE_PIPE_SEGMNET}: ${pipeSegmentDataName}?`)
        if (!ask) return
        await dataManager.deletePipeSegmentData(pipeSegmentDataId)
        mainContent()
    } catch (error) {
        console.log(error)
        //alert(error.message)
    }
}
/**
 * Deletes the pumping segment data
 * @param {Event} event The event triggered by the button that runs the function
 * @returns 
 */
async function delPumpingSegment(event) {
    try {
        event.preventDefault()
        const ask = confirm(`${Texts.DO_YOU_HAVE_TO_DELETE_THE_PUMPING_SEGMNET}?`)
        if (!ask) return
        await dataManager.deletePumpingSegment()
        mainContent()
    } catch (error) {
        console.log(error)
        //alert(error.message)
    }
}

/**
 * Brings the navegation to the main content
 * @param {Event} event The event triggered by a button that execute back function
 */
function back(event) {
    event.preventDefault()
    createMenu(5)
    mainContent()
}

/**
 * Triggers the process of add new pipe segment
 */
function addNewPipeSegment() {
    secondaryContent(true)
    setFormDataDimensionatingPipeSegment(dataManager.createPipeSegmentData())

}

/**
 * Triggers the process of add or edit a pumping segment
 */
function addNewOrEditPumpingSegment() {
    const pipewayData = dataManager.getPipewayData()
    createPumpingCalculatorContent()
    const pumpingSegmentData = (JSON.stringify(pipewayData.pumpingSegmentData) === "{}") ?
        dataManager.createPumpingSegmentData() :
        pipewayData.pumpingSegmentData
    setFormDataDimensionatingPumping(pumpingSegmentData)
    setResultsDimensionatingPumping()
}

/**
 * Creates the header content
 */
function createHeader() {
    const headerEl = document.querySelector("header")
    const h1 = Utilities.HTMLFactory.createHTMLH1Element(null, null, [Texts.TITLE])
    const h4 = Utilities.HTMLFactory.createHTMLH4Element(null, null, [Texts.SUBTITLE])
    headerEl.innerHTML = ""
    headerEl.append(h1, h4)
}

function createMenu(numberOfButtons) {

    const navEl = document.querySelector("nav")
    const menuContainer = document.createElement("ul")
    menuContainer.classList.add("menu")
    const menus = [
        {
            title: Texts.NEW,
            config: function () {
                const menuItemContainer = document.createElement("li")
                const title = document.createElement("p")
                title.innerText = this.title
                menuItemContainer.append(title)
                menuItemContainer.addEventListener("click", newPipewayData)
                menuItemContainer.classList.add("menu-item")
                return menuItemContainer
            },
            subMenus: []
        },

        {
            title: Texts.OPEN,
            config: function () {
                const menuItemContainer = document.createElement("li")
                const title = document.createElement("p")
                title.innerText = this.title
                menuItemContainer.append(title)
                menuItemContainer.addEventListener("click", openPipewayData)
                menuItemContainer.classList.add("menu-item")
                return menuItemContainer
            },
            subMenus: []
        },
        {
            title: Texts.TOOLS,
            config: function () {
                const menuItemContainer = document.createElement("li")
                const submenuContainer = document.createElement("ul")
                submenuContainer.classList.add("submenu", "hidden")
                submenuContainer.setAttribute("id", "tools-submenu")
                const title = document.createElement("p")
                title.innerText = this.title
                menuItemContainer.classList.add("menu-item")
                menuItemContainer.append(title)
                menuItemContainer.addEventListener("click", (e) => {
                    submenuContainer.classList.remove("hidden")
                    console.log("tools")
                })
                submenuContainer.addEventListener("mouseleave", (e) => {
                    e.target.classList.add("hidden")
                })
                for (const submenu of this.subMenus) submenuContainer.append(submenu.config())
                menuItemContainer.append(submenuContainer)
                return menuItemContainer
            },

            subMenus: [
                {
                    title: Texts.REPORT,
                    config: function () {
                        const submenuItemContainer = document.createElement("li")
                        const title = document.createElement("p")
                        title.innerText = this.title
                        submenuItemContainer.append(title)
                        submenuItemContainer.addEventListener("click", (e) => {
                            e.stopPropagation()
                            document.getElementById("tools-submenu").classList.add("hidden")
                            createReport()
                        })
                        submenuItemContainer.classList.add("submenu-item")
                        return submenuItemContainer
                    },
                },

                {
                    title: Texts.FLOW_RATE_CALCULATOR,
                    config: function () {
                        const submenuItemContainer = document.createElement("li")
                        const title = document.createElement("p")
                        title.innerText = this.title
                        submenuItemContainer.append(title)
                        submenuItemContainer.addEventListener("click", (e) => {
                            e.stopPropagation()
                            document.getElementById("tools-submenu").classList.add("hidden")
                            createFlowRateWeightsCalculatorContent()
                        })
                        submenuItemContainer.classList.add("submenu-item")
                        return submenuItemContainer
                    },
                },
            ]
        },
        {
            title: Texts.LEGEND_FOR_VARIABLE,
            config: function () {
                const menuItemContainer = document.createElement("li")
                const title = document.createElement("p")
                title.innerText = this.title
                menuItemContainer.append(title)
                menuItemContainer.addEventListener("click", showLegendContent)
                menuItemContainer.classList.add("menu-item")
                return menuItemContainer
            },
            subMenus: []
        },

        {
            title: Texts.CONFIGURATIONS,
            config: function () {
                const menuItemContainer = document.createElement("li")
                const title = document.createElement("p")
                title.innerText = this.title
                menuItemContainer.append(title)
                menuItemContainer.addEventListener("click", createConfigContent)
                menuItemContainer.classList.add("menu-item")
                return menuItemContainer
            },
            subMenus: []
        }

    ]
    let count = 0
    const total = numberOfButtons > menus.length ? menus.length : numberOfButtons
    navEl.innerHTML = ""
    while (count < total) {
        const menu = menus[count].config()
        menuContainer.append(menu)
        count++
    }
    navEl.append(menuContainer)
}

/**
 * Creates the footer content
 */
function createFooter() {
    const footerEl = document.querySelector("footer")
    footerEl.innerHTML = ""
    footerEl.innerText = `${Texts.FOOTER} - v.0.0.0`
}

/**
 * 
 * @returns Checks if the app works in the browser that runs it
 */
function itAppWorks() {
    const windowKeys = Object.keys(window)
    for (const key of windowKeys)
        if (localStorage && (key === "showOpenFilePicker" || key === "showSaveFilePicker")) return true
    return false
}

/**
 * Initiates the application
 */
function init() {
    createHeader()
    createFooter()
    if (!itAppWorks()) {
        AppNotWorkContent()
        return
    }
    createMenu(2)
    if (!localStorage.getItem("decimalSeparator"))
        localStorage.setItem("decimalSeparator", DataTables.decimalSeparators.COMMA)
    if (!localStorage.getItem("decimalPlaces"))
        localStorage.setItem("decimalPlaces", "2")

    decimalPlaces = Number(localStorage.getItem("decimalPlaces"))
    decimalSeparator = localStorage.getItem("decimalSeparator")
    window.addEventListener("keydown", (e) => {
        const modalContainer = document.getElementById("modal-container")
        if (e.key === "Escape") {
            console.log(e.key)
            if (modalContainer.classList.contains("hidden")) {
                modalContainer.classList.remove("hidden")
                return
            }
            modalContainer.classList.add("hidden")
        }
    })
}

/**
 * Checks if all inputs are filled
 * @returns {Boolean}
 */
function isAllInputsFullFilled() {
    try {
        const inputs = document.querySelectorAll(".input")
        for (const input of inputs) if (input.value === "") return false
        return true
    } catch (error) {
        console.log(error)
        throw error
    }
}

/**
 * Fills with zeros all empty inputs
 */
function fillWithZerosTheEmptyInputs() {
    try {
        const inputs = document.querySelectorAll(".input")
        for (const input of inputs) if (input.value === "") input.value = "0"
    } catch (error) {
        console.log(error)
    }
}

/**
 * Gets the data from forms when dimensionating pipe segments
 * @returns { {id: Number; name: String; initialPressure: Number; length: Number; heightVariation: Number;
 *             predecessorPipeSegmentId: Number; nominalDiameter: String; hydrometerMaxFlowRate: Number;
 *             flowRateWeights: Number; pipeConnections: {C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; 
 *             RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
 *             VRL: Number; VRP: Number;} }
 * }
 */
function getFormDataDimensionatingPipeSegment() {
    try {
        fillWithZerosTheEmptyInputs()
        if (!isAllInputsFullFilled()) throw new Error(Texts.EMPTY_FORM_FIELD_ERROR)
        const inputs = document.querySelectorAll(".input")
        const pipeSegmentData = dataManager.createPipeSegmentData()
        const pipeConnections = {}
        for (const input of inputs) {
            const id = input.getAttribute("id")
            const value = document.getElementById(id).value
            const number = Number(value.replace(decimalSeparator, "."))
            if (Hydraulics.isValidPipeConnectionAcronym(id)) {
                pipeConnections[id] = Utilities.validator.isNumber(number) ? number : value
                continue
            }
            pipeSegmentData[id] = Utilities.validator.isNumber(number) ?
                number : value
        }
        pipeSegmentData.pipeConnections = pipeConnections
        return pipeSegmentData
    } catch (error) {
        console.log(error)
        throw error
    }
}

/**
 * Gets the data from forms when dimensionating pumping segment
 * @returns { {dailyConsumption:  Number; pumpYield: Number; pumpingTime: Number; suctionLength: Number;
 *             suctionManometricHeight: Number; suctionNominalDiameter: String; 
 *             suctionPipeConnections: {C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; 
 *             RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
 *             VRL: Number; VRP: Number;},
 *             pumpingLength: Number; pumpingManometricHeight: Number; pumpingNominalDiameter: String;
 *             pumpingPipeConnections: {C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; 
 *             RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
 *             VRL: Number; VRP: Number;}}
 * }
 */
function getFormDataDimensionatingPumping() {
    try {
        fillWithZerosTheEmptyInputs()
        if (!isAllInputsFullFilled()) throw new Error(Texts.EMPTY_FORM_FIELD_ERROR)
        const inputs = document.querySelectorAll(".input")
        const pumpingSegmentData = dataManager.createPumpingSegmentData()
        const suctionPipeConnections = {}
        const pumpingPipeConnections = {}
        for (const input of inputs) {
            const id = input.getAttribute("id")
            const value = document.getElementById(id).value
            const number = Number(value.replace(decimalSeparator, "."))
            pumpingSegmentData[id] = Utilities.validator.isNumber(number) ? number : value
        }
        const suctionPipeConnectionContainer = document.querySelector(".suction-pipeconnection")
        const pumpingPipeConnectionContainer = document.querySelector(".pumping-pipeconnection")
        for (const pipeConnection of Object.keys(DataTables.equivalentLengthForPipeConnections)) {
            const suctionPipeConnectionElement = suctionPipeConnectionContainer.querySelector(`.${pipeConnection}`)
            const pumpingPipeConnectionElement = pumpingPipeConnectionContainer.querySelector(`.${pipeConnection}`)
            suctionPipeConnections[pipeConnection] = Number(suctionPipeConnectionElement.value)
            pumpingPipeConnections[pipeConnection] = Number(pumpingPipeConnectionElement.value)
        }
        pumpingSegmentData.suctionPipeConnections = suctionPipeConnections
        pumpingSegmentData.pumpingPipeConnections = pumpingPipeConnections
        return pumpingSegmentData
    } catch (error) {
        console.log(error)
        throw error
    }
}
/**
 * Sets the resuts when dimensionating pumping segments
 * @returns { { flowRateUnit: String; flowRate: Number;  flowRateWarning: Boolean; suctionVelocity: Number;
 *              pumpingVelocity: Number; velocityWarning: Boolean; manometricHeightUnit: String;
 *              manometricHeight: Number; suctionSegmentEquivalentLength: Number; 
 *              pumpingSegmentEquivalentLength: NUmber;  equivalentLengthUnit: String; 
 *              suctionUnitaryPressureLoss: Number; pumpingUnitaryPressureLoss: Number; 
 *              unitaryPressureLossUnit: String, powerUnit: String; calculatedPumpPower: Number,
 *              selectedPumpPower: Number; inadequateDiametersWarning: Boolean }}
 */
function setResultsDimensionatingPumping() {
    try {
        const pipewayData = dataManager.getPipewayData()
        const pumpingSegmentData = getFormDataDimensionatingPumping()
        const results = Hydraulics.calculatePumping(pipewayData, pumpingSegmentData)
        const ids = Object.keys(results)
        for (const id of ids) {
            const htmlEl = document.getElementById(id)
            if (htmlEl !== null) htmlEl.innerText = results[id].toFixed(decimalPlaces).replace(".", decimalSeparator)
        }
        return results
    } catch (error) {
        console.log(error)
        //alert(error.message)
    }
}

/**
 * Sets results when dimensionating pipe segments
 * @returns { { flowRateUnit: String; flowRate: Number; velocityUnit: String; velocity: Number;
 *              pressureUnit: String; unitaryPressureLoss: Numner; unitaryPressureLossUnit: String;
 *              equivalentLength: Number; equivalentLengthUnit: String; pressureLoss: Number,
 *              pressure: Number; velocityWarning: Boolean; pressureMinWarning: Boolean; 
 *              pressureMaxWarning: Boolean }}
 */
function setResultsDimensionatingPipeSegments() {
    try {
        const pipewayData = dataManager.getPipewayData()
        const pipeSegmentData = getFormDataDimensionatingPipeSegment()
        const results = Hydraulics.calculatesPressure(pipewayData, pipeSegmentData)
        const ids = Object.keys(results)
        for (const id of ids) {
            const htmlEl = document.getElementById(id)
            if (htmlEl !== null) htmlEl.innerText = results[id].toFixed(decimalPlaces).replace(".", decimalSeparator)
        }
        return results
    } catch (error) {
        console.log(error)
        alert(error.message)
    }

}

/**
 * Sets data in the form when dimensionating pipe segments
 * @param { {  id: Number; name: String; initialPressure: Number; length: Number; heightVariation: Number;
 *             predecessorPipeSegmentId: Number; nominalDiameter: String; hydrometerMaxFlowRate: Number;
 *             flowRateWeights: Number; pipeConnections: {C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; 
 *             RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
 *             VRL: Number; VRP: Number;} } } pipeSegmentData The pipe segment data
 */
function setFormDataDimensionatingPipeSegment(pipeSegmentData) {
    try {
        const keys = Object.keys(pipeSegmentData)
        for (const key of keys) {
            const htmlEl = document.getElementById(key)
            if (htmlEl !== null) {
                const value = pipeSegmentData[key]
                if (htmlEl instanceof HTMLSelectElement) {
                    htmlEl.value = value
                    continue
                }
                if (Utilities.validator.isNumber(Number(value)) &&
                    !Utilities.validator.isInteger(value)) {
                    htmlEl.value = Number(value).toFixed(decimalPlaces).replace(".", decimalSeparator)
                    continue
                }
                htmlEl.value = value
            }
        }
        const pipeConnections = pipeSegmentData.pipeConnections
        for (const key in pipeConnections) {
            const htmlEl = document.getElementById(key)
            if (htmlEl !== null) htmlEl.value = pipeConnections[key]
        }

    } catch (error) {
        console.log(error)
        //alert(error.message)
    }
}

/**
 * Sets data in the form when dimensionating pumping segment
 * @param {{ flowRateUnit: String; flowRate: Number;  flowRateWarning: Boolean; suctionVelocity: Number;
 *           pumpingVelocity: Number; velocityWarning: Boolean; manometricHeightUnit: String;
*            manometricHeight: Number; suctionSegmentEquivalentLength: Number; 
*            pumpingSegmentEquivalentLength: NUmber;  equivalentLengthUnit: String; 
*            suctionUnitaryPressureLoss: Number; pumpingUnitaryPressureLoss: Number; 
*            unitaryPressureLossUnit: String, powerUnit: String; calculatedPumpPower: Number,
*            selectedPumpPower: Number; inadequateDiametersWarning: Boolean }} pumpingSegmentData The pumping segment data
*/
function setFormDataDimensionatingPumping(pumpingSegmentData) {
    try {
        const keys = Object.keys(pumpingSegmentData)
        for (const key of keys) {
            const htmlEl = document.getElementById(key)
            if (htmlEl !== null) {
                const value = pumpingSegmentData[key]
                if (htmlEl instanceof HTMLSelectElement) {
                    htmlEl.value = value
                    continue
                }
                if (Utilities.validator.isNumber(Number(value)) &&
                    !Utilities.validator.isInteger(value)) {
                    htmlEl.value = Number(value).toFixed(decimalPlaces).replace(".", decimalSeparator)
                    continue
                }
                htmlEl.value = value
            }
        }
        const pumpingPipeConnectionContainer = document.querySelector(".pumping-pipeconnection")
        const pumpingPipeConnections = pumpingSegmentData.pumpingPipeConnections

        for (const key in pumpingPipeConnections) {
            const htmlEl = pumpingPipeConnectionContainer.querySelector(`.${key}`)
            if (htmlEl !== null) htmlEl.value = pumpingPipeConnections[key]
        }
        const suctionPipeConnectionContainer = document.querySelector(".suction-pipeconnection")
        const suctionPipeConnections = pumpingSegmentData.suctionPipeConnections
        for (const key in suctionPipeConnections) {
            const htmlEl = suctionPipeConnectionContainer.querySelector(`.${key}`)
            if (htmlEl !== null) htmlEl.value = suctionPipeConnections[key]
        }

    } catch (error) {
        console.log(error)
        //alert(error.message)
    }
}

/**
 * Creates pipe connections report info content
 * @param {{C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; 
 *          RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
 *          VRL: Number; VRP: Number;}} pipeConnections List of pipe connections
 * @returns {HTMLParagraphElement}
 */
function createsPipeConnectionsReportInfo(pipeConnections) {
    const pipeConnectionsInfoContent = [`${Texts.PIPE_CONNECTIONS} / ${Texts.REGISTERS}: `]
    for (const pc in pipeConnections)
        if (pipeConnections[pc] !== 0) pipeConnectionsInfoContent.push(`${pipeConnections[pc]} ${Texts[pc]}; `)
    return Utilities.HTMLFactory.createHTMLPElement(null, null, pipeConnectionsInfoContent)
}

/**
 * Creates the pumping segment report info
 * @param {{ dailyConsumption:  Number; pumpYield: Number; pumpingTime: Number; suctionLength: Number;
 *           suctionManometricHeight: Number; suctionNominalDiameter: String; suctionPipeConnections: {
 *           C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; 
 *           RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
 *           VRL: Number; VRP: Number;}, pumpingLength: Number; pumpingManometricHeight: Number; 
 *           pumpingNominalDiameter: String; pumpingPipeConnections: {C45: Number; C90: Number; EB: Number; 
 *           EN: Number; J45: Number; J90: Number; RAN: Number; RGA: Number; RGL: Number; SC: Number; 
 *           TPBL: Number; TPD: Number; TPL: Number; VPC: Number; VRL: Number; VRP: Number;}}} pumpingSegmentData The pumping segment data
 * @param {{ flowRateUnit: String; flowRate: Number;  flowRateWarning: Boolean; suctionVelocity: Number;
 *           pumpingVelocity: Number; velocityWarning: Boolean; manometricHeightUnit: String;
 *           manometricHeight: Number; suctionSegmentEquivalentLength: Number; 
 *           pumpingSegmentEquivalentLength: NUmber;  equivalentLengthUnit: String; 
 *           suctionUnitaryPressureLoss: Number; pumpingUnitaryPressureLoss: Number; 
 *           unitaryPressureLossUnit: String, powerUnit: String; calculatedPumpPower: Number,
 *           selectedPumpPower: Number; inadequateDiametersWarning: Boolean }} pumpingCalculationResult The obtained results for the pumping segment calculation
 * @returns {Array<HTMLElement>}
 */
function createPumpingSegmentReportInfo(pumpingSegmentData, pumpingCalculationResult) {
    const pumpingSegmentInfoContent = [
        Utilities.HTMLFactory.createHTMLH3Element(null, null, [Texts.PUMPING_INFO]),
        Utilities.HTMLFactory.createHTMLPElement(null, null, [
            `${Texts.VAR_DAILY_CONSUMPTION} = ${pumpingSegmentData.dailyConsumption.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M3}`,
            `; ${Texts.VAR_FLOW_RATE} = ${pumpingCalculationResult.flowRate.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M3_H}`,
            `; ${Texts.VAR_PUMPING_TIME} = ${pumpingSegmentData.pumpingTime.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.H}`,
            `; ${Texts.VAR_MANOMETRIC_HEIGHT} = ${pumpingCalculationResult.manometricHeight.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pumpingCalculationResult.manometricHeightUnit}`,
            `; ${Texts.VAR_PUMP_POWER} (${Texts.CALCULATED}) = ${pumpingCalculationResult.calculatedPumpPower.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.CV}`,
            `; ${Texts.VAR_PUMP_POWER} (${Texts.SELECTED}) = ${pumpingCalculationResult.selectedPumpPower.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.CV}`,
            `; ${Texts.VAR_PUMP_YIELD} = ${pumpingSegmentData.pumpYield.toFixed(decimalPlaces).replace(".", decimalSeparator)} %`
        ]),
        Utilities.HTMLFactory.createHTMLH4Element(null, null, [Texts.PUMPING_SEGMENT]),
        Utilities.HTMLFactory.createHTMLPElement(null, null, [
            `${Texts.VAR_NOMINAL_DIAMETER}: ${pumpingSegmentData.pumpingNominalDiameter}`,
            `; ${Texts.VAR_VELOCITY} = ${pumpingCalculationResult.pumpingVelocity.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M_S}`,
            `; ${Texts.VAR_EQUIVALENT_LENGTH} = ${pumpingCalculationResult.pumpingSegmentEquivalentLength.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pumpingCalculationResult.equivalentLengthUnit}`,
            `; ${Texts.VAR_UNITARY_PRESSURE_LOSS} = ${pumpingCalculationResult.pumpingUnitaryPressureLoss.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pumpingCalculationResult.unitaryPressureLossUnit}`,
            `; ${Texts.VAR_REAL_LENGTH} = ${pumpingSegmentData.pumpingLength.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M}`,
            `; ${Texts.VAR_MANOMETRIC_HEIGHT} = ${pumpingSegmentData.pumpingManometricHeight.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M}`,
            createsPipeConnectionsReportInfo(pumpingSegmentData.pumpingPipeConnections)
        ]),
        Utilities.HTMLFactory.createHTMLH4Element(null, null, [Texts.SUCTION_SEGMENT]),
        Utilities.HTMLFactory.createHTMLPElement(null, null, [
            `${Texts.VAR_NOMINAL_DIAMETER}: ${pumpingSegmentData.suctionNominalDiameter}`,
            `; ${Texts.VAR_VELOCITY} = ${pumpingCalculationResult.suctionVelocity.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M_S}`,
            `; ${Texts.VAR_EQUIVALENT_LENGTH} = ${pumpingCalculationResult.suctionSegmentEquivalentLength.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pumpingCalculationResult.equivalentLengthUnit}`,
            `; ${Texts.VAR_UNITARY_PRESSURE_LOSS} = ${pumpingCalculationResult.suctionUnitaryPressureLoss.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pumpingCalculationResult.unitaryPressureLossUnit}`,
            `; ${Texts.VAR_REAL_LENGTH} = ${pumpingSegmentData.suctionLength.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M}`,
            `; ${Texts.VAR_MANOMETRIC_HEIGHT} = ${pumpingSegmentData.suctionManometricHeight.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M}`,
            createsPipeConnectionsReportInfo(pumpingSegmentData.suctionPipeConnections)
        ])
    ]
    return pumpingSegmentInfoContent
}

/**
 * Creates the pipe segment report info
 * @param {{ id: Number; name: String; initialPressure: Number; length: Number; heightVariation: Number;
 *           predecessorPipeSegmentId: Number; nominalDiameter: String; hydrometerMaxFlowRate: Number;
 *           flowRateWeights: Number; pipeConnections: {{C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; 
*            RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
*            VRL: Number; VRP: Number;}} }} pipeSegmentData The pipe segment data
 * @param {{ id: Number; name: String; initialPressure: Number; length: Number; heightVariation: Number;
 *           predecessorPipeSegmentId: Number; nominalDiameter: String; hydrometerMaxFlowRate: Number;
 *           flowRateWeights: Number; pipeConnections: {{C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; 
*            RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
*            VRL: Number; VRP: Number;}} }} predecessorPipeSegmentData The predecessor pipe segment data
 * @param {{ flowRateUnit: String; flowRate: Number; velocityUnit: String; velocity: Number;
 *           pressureUnit: String; unitaryPressureLoss: Numner; unitaryPressureLossUnit: String;
 *           equivalentLength: Number; equivalentLengthUnit: String; pressureLoss: Number,
 *           pressure: Number; velocityWarning: Boolean; pressureMinWarning: Boolean; 
 *           pressureMaxWarning: Boolean }} pipeSegmentCalculationResult The obtained results for the pipe segments calculation
 * @returns {Array<HTMLElement>}
 */
function createPipeSegmentReportInfo(pipeSegmentData, predecessorPipeSegmentData, pipeSegmentCalculationResult) {
    const pipeSegmentSegmentInfoContent = [
        Utilities.HTMLFactory.createHTMLH4Element(null, null, [pipeSegmentData.name]),
        Utilities.HTMLFactory.createHTMLPElement(null, null, [
            `${Texts.PREDECESSOR_PIPESEGMENT}: ${predecessorPipeSegmentData === null ? "- " : predecessorPipeSegmentData.name}`,
            `; ${Texts.VAR_NOMINAL_DIAMETER}: ${pipeSegmentData.nominalDiameter}`,
            `; ${Texts.VAR_VELOCITY} = ${pipeSegmentCalculationResult.velocity.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pipeSegmentCalculationResult.velocityUnit}`,
            `; ${Texts.VAR_EQUIVALENT_LENGTH} = ${pipeSegmentCalculationResult.equivalentLength.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pipeSegmentCalculationResult.equivalentLengthUnit}`,
            `; ${Texts.VAR_REAL_LENGTH} = ${pipeSegmentData.length.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M}`,
            `; ${Texts.VAR_HEIGHT_VARIATION} = ${pipeSegmentData.heightVariation.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M}`,
            `; ${Texts.VAR_SUM_OF_WEIGHTS} = ${pipeSegmentData.flowRateWeights.toFixed(decimalPlaces).replace(".", decimalSeparator)}`,
            `; ${Texts.VAR_MAX_FLOW_RATE} (${Texts.HYDROMETER}) = ${pipeSegmentData.hydrometerMaxFlowRate.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${DataTables.units.M3_H}`,
            `; ${Texts.VAR_FLOW_RATE} = ${pipeSegmentCalculationResult.flowRate.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pipeSegmentCalculationResult.flowRateUnit}`,
            `; ${Texts.VAR_UNITARY_PRESSURE_LOSS} = ${pipeSegmentCalculationResult.unitaryPressureLoss.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pipeSegmentCalculationResult.unitaryPressureLossUnit}`,
            `; ${Texts.VAR_PRESSURE_LOSS} = ${pipeSegmentCalculationResult.pressureLoss.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pipeSegmentCalculationResult.pressureUnit}`,
            `; ${Texts.VAR_PRESSURE} = ${pipeSegmentCalculationResult.pressure.toFixed(decimalPlaces).replace(".", decimalSeparator)} ${pipeSegmentCalculationResult.pressureUnit}`,
            createsPipeConnectionsReportInfo(pipeSegmentData.pipeConnections)
        ])
    ]
    return pipeSegmentSegmentInfoContent
}
/**
 * Creates the pumping segment report info
 * @param {{unit: String; material: String; pumpingSegmentData: { dailyConsumption:  Number; pumpYield: Number; pumpingTime: Number; suctionLength: Number;
 *          suctionManometricHeight: Number; suctionNominalDiameter: String; suctionPipeConnections: {C45: Number; C90: Number; 
 *          EB: Number; EN: Number; J45: Number; J90: Number; RAN: Number; RGA: Number; RGL: Number; SC: Number; TPBL: Number;       
 *          TPD: Number; TPL: Number; VPC: Number; VRL: Number; VRP: Number}; pumpingLength: Number; pumpingManometricHeight: Number; 
 *          pumpingNominalDiameter: String; pumpingPipeConnections: {C45: Number; C90: Number; EB: Number; EN: Number; J45: Number; J90: 
 *          Number; RAN: Number; RGA: Number; RGL: Number; SC: Number; TPBL: Number; TPD: Number; TPL: Number; VPC: Number;
 *          VRL: Number; VRP: Number}}; listOfPipeSegmentData: [{ flowRateUnit: String; flowRate: Number; 
 *          velocityUnit: String; velocity: Number; pressureUnit: String; unitaryPressureLoss: Numner; unitaryPressureLossUnit: String;
 *          equivalentLength: Number; equivalentLengthUnit: String; pressureLoss: Number, pressure: Number; velocityWarning: Boolean; 
 *          pressureMinWarning: Boolean; pressureMaxWarning: Boolean }]}} pipewayData The pipeway data
*/
function createQuantitativeReportInfo(pipewayData) {
    const pumpingSegmentData = pipewayData.pumpingSegmentData
    const listOfPipeSegmentData = pipewayData.listOfPipeSegmentData
    const pipesLengthsAndDiameters = [
        { nominalDiameter: pumpingSegmentData.suctionNominalDiameter, length: pumpingSegmentData.suctionLength },
        { nominalDiameter: pumpingSegmentData.pumpingNominalDiameter, length: pumpingSegmentData.pumpingLength }
    ]

    const pipeConnectionsAndDiameters = [
        
    ]



    for (const psd of listOfPipeSegmentData) {
        pipesLengthsAndDiameters.push({ nominalDiameter: psd.nominalDiameter, length: psd.length })
    }

    const quantitativeInfoContent = [
        Utilities.HTMLFactory.createHTMLH3Element(null, null, [Texts.PIPE_QUANTITATIVE]),
    ]

    return quantitativeInfoContent
}

/**
 * Cretaes the dimensionating report
 */
function createReport() {
    try {
        const allContent = []
        const pipewayData = dataManager.getPipewayData()
        const pumpingSegmentData = pipewayData.pumpingSegmentData
        allContent.push(
            Utilities.HTMLFactory.createHTMLH2Element(null, null, [Texts.REPORT_TITLE]),
            Utilities.HTMLFactory.createHTMLH3Element(null, null, [dataManager.getPipewayDataName()]),
            Utilities.HTMLFactory.createHTMLPElement(null, null, [
                pipewayData.material === DataTables.materials.SMOOTH ?
                    `${Texts.MATERIAL}: ${Texts.SMOOTH}` : `${Texts.MATERIAL} : ${Texts.ROUGH}`
            ])
        )
        if (JSON.stringify(pumpingSegmentData) !== "{}") {
            const results = Hydraulics.calculatePumping(pipewayData, pumpingSegmentData)
            allContent.push(Utilities.HTMLFactory.createHTMLDivElement(
                null, null, createPumpingSegmentReportInfo(pumpingSegmentData, results))
            )
        }
        if (pipewayData.listOfPipeSegmentData.length !== 0) {
            allContent.push(Utilities.HTMLFactory.createHTMLH3Element(null, null, [Texts.DIMENSIONATING_INFO])
            )
            for (const psd of pipewayData.listOfPipeSegmentData) {
                const results = Hydraulics.calculatesPressure(pipewayData, psd)
                const ppsd = dataManager.findPipeSegmentDataById(psd.predecessorPipeSegmentId)
                allContent.push(Utilities.HTMLFactory.createHTMLDivElement(
                    null, null, createPipeSegmentReportInfo(psd, ppsd, results))
                )
            }
        }
        allContent.push(
            Utilities.HTMLFactory.createHTMLDivElement(
                null, null, [
                Utilities.HTMLFactory.createHTMLH3Element(null, null, [Texts.LEGEND_FOR_VARIABLE]),
                createLegendElement()
            ])
        )
        allContent.push(
            Utilities.HTMLFactory.createHTMLButtonElement(null, ["back-btn"], "", back),
            Utilities.HTMLFactory.createHTMLButtonElement(null, ["print-btn"], "", (e) => { window.print() })
        )
        const reportContainer = Utilities.HTMLFactory.createHTMLDivElement("reportContainer", null, allContent)
        clearMainContentElement()
        createMenu(2)
        insertContentToMainElement([reportContainer])
    } catch (error) {
        console.log(error)
    }
}

//starting the app
window.addEventListener("load", init)