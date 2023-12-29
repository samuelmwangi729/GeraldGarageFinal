require('dotenv').config()
const path = require('path')
const UploadFiles = (files,Location=null)=>{
    const dirname = require('path').dirname;
    const absPath = (dirname(__filename)).toString()
    const splittedPath = absPath.split("\\")
    const newPath = []
    for(let i=0;i<splittedPath.length-1;i++){
        newPath.push(splittedPath[i])
    }
    const projectRoot = newPath.join("\\").toString()
    const fileNameArray = []
    if(files){
        Object.keys(files).map((item)=>{
            fileNameArray.push(files[item].name)
            // upload the files to the server 
            const filePath = path.join(projectRoot,process.env.STATIC_FILES_DIR,Location?Location:process.env.FILE_UPLOAD_PATH,files[item].name)
            files[item].mv(filePath,(err)=>{
                if(err){
                    console.log('Could not upload the images')
                }else{
                    console.log('uploaded the image')
                }
            })
        })
        return fileNameArray
    }else{
        return fileNameArray
    }
}
const UploadSingleFile = (file,Location=null) =>{
    const dirname = require('path').dirname;
    const absPath = (dirname(__filename)).toString()
    const splittedPath = absPath.split("\\")
    const newPath = []
    for(let i=0;i<splittedPath.length-1;i++){
        newPath.push(splittedPath[i])
    }
    const projectRoot = newPath.join("\\").toString()
    const fileName = file.name
    const filePath = path.join(projectRoot,process.env.STATIC_FILES_DIR,Location?Location:process.env.FILE_UPLOAD_PATH,file.name)
    file.mv(filePath,(err)=>{
        if(err){
            console.log('Could not upload the images')
        }else{
            console.log(`Uploaded the Image ${fileName}`)
        }
    })
    return fileName
}
module.exports={UploadFiles,UploadSingleFile}