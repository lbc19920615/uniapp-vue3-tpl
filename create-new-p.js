const fs = require('fs')
const fse = require('fs-extra')
const {join} = require('path')

function isDirectory(path) {  
    const stats = fs.statSync(path)

    return stats.isDirectory()
}

const DestPath = 'D:\\projects\\uniapp-template'

let rootFiles = fs.readdirSync('./').map(v => {
    return {
        path: v,
        a: isDirectory(v)
    }
}).filter(v => {
    return !v.a
})

console.log(rootFiles);
rootFiles.forEach(v => {
    if (v.path.includes('README.md')) {
        return;
    }
    fse.copySync(v.path, join(DestPath, v.path) )
})

fse.copySync('src', join(DestPath, 'src') )
fse.copySync('.husky', join(DestPath, '.husky') )
fse.copySync('.vscode', join(DestPath, '.vscode') )
fse.copySync('.hbuilderx', join(DestPath, '.hbuilderx') )


fse.emptyDirSync(join(DestPath, 'src/components/com'))

fse.emptyDirSync(join(DestPath, 'src/next/store/com'))
fse.emptyDirSync(join(DestPath, 'src/next/store/test'))

fse.emptyDirSync(join(DestPath, 'src/pages/com'))
fse.emptyDirSync(join(DestPath, 'src/pages/test'))
console.log('done');