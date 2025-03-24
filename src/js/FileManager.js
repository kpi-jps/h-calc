/**
 * Javscript object responsible for all files operations in the application
 */
const FileManager = Object.seal({

    /**
     * @type {?FileSystemFileHandle} fileHandle Stores the actual filehandle being handle by the application
     */
    fileHandle: null,

    /**
     * Gets the name of the file being handle by the application
     * @returns {String}
     */
    getFileName() {
        if (this.fileHandle === null) throw new Error(Texts.NULL_FILE_HANDLE)
        if (this.fileHandle.name.indexOf(".") !== -1) {
            const [fileName] = this.fileHandle.name.split(".")
            return fileName
        }
        return this.fileHandle.name
    },

    /**
     * Checks if the file being handle by the application has a valid structure 
     * @param {String} dataAsText The file content as a string
     * @returns {boolean}
     */
    isValidFileStructure(dataAsText) {
        function getHash(obj) {
            const arr = Object.keys(obj)
            return arr.reduce((initial, current) => initial + current)
        }
        try {
            const data = JSON.parse(dataAsText)
            if (typeof data !== "object") return false
            const dataStructure = DataTables.dataStructure
            const firstHash = getHash(dataStructure)
            if(firstHash !== getHash(data)) return false
            if(!data.pumpingSegmentData || !data.listOfPipeSegmentData) return false
            if(JSON.stringify(data.pumpingSegmentData) !== "{}") {
                const secondHash = getHash(dataStructure.pumpingSegmentData)
                if(secondHash !== getHash(data.pumpingSegmentData)) return false
            }
            if(data.listOfPipeSegmentData.length > 0) {
                const thirdHash = getHash(dataStructure.listOfPipeSegmentData[0])
                for (let item of data.listOfPipeSegmentData) if(!item || thirdHash !== getHash(item)) return false
            }            
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },

    /**
     * Creates a new file and assing its reference to the filehandle property
     * @param {String} content Content for file creation
     * @return {Promise<?FileSystemHandle>}
     */
    async create(content) {
        const tempFileHandle = this.fileHandle
        try {
            const saveFileOptions = {
                suggestedName: 'Untitled.json',
                types: [{
                    description: 'H-cal .json files',
                    accept: {
                        'application/json': ['.json'],
                    },
                }],
            }
            this.fileHandle = await window.showSaveFilePicker(saveFileOptions)
            this.save(content)
        } catch (error) {
            this.fileHandle = tempFileHandle
            throw error
        }
    },

    /**
     * Opens a file, assing its reference to the filehandle property and retuns your content as a string
     * @returns {Promise<String | Error}
     */
    async open() {
        const tempFileHandle = this.fileHandle
        try {
            const openFileOptions = {
                types: [{
                    description: 'hcal json files',
                    accept: {
                        'application/json': ['.json'],
                    },
                }],
                multiple: false,
            }
            const [fileHandle] = await window.showOpenFilePicker(openFileOptions)
            const file = await fileHandle.getFile()
            const dataAsText = await file.text()
            if (!this.isValidFileStructure(dataAsText)) throw new Error(Texts.INVALID_FILE_DATA_STRUCTURE)
            this.fileHandle = fileHandle
            return this.read()
        } catch (error) {
            this.fileHandle = tempFileHandle
            throw error
        }
    },

    /**
     * Reads the content of the file being handle by the application
     * @returns {Promise<String | Error}
     */
    async read() {
        try {
            const file = await FileManager.fileHandle.getFile()
            return await file.text()
        } catch (error) {
            Promise.reject(error)
        }
    },

    /**
     * Saves the content in the file being handle by the application
     * @param {String} content The file content as a string
     * @return {Promise<undefined>}
     */
    async save(content) {
        try {
            const writable = await this.fileHandle.createWritable()
            await writable.write(content)
            return await writable.close()
        } catch (error) {
            Promise.reject(error)
        }
    },
})




