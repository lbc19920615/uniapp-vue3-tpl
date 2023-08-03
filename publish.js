const fse = require('fs-extra');

const srcDir = `./dist/build/h5`;
const assetsDir = `D:\\projects\\android\\WebApp\\app\\src\\main\\assets\\web\\assets`;
const destDir = `D:\\projects\\android\\WebApp\\app\\src\\main\\assets\\web`;

// To copy a folder or file, select overwrite accordingly
try {
  const now = new Date();
  const isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  fse.emptyDirSync(assetsDir);

  fse.copySync(srcDir, destDir, { overwrite: true | false });
  console.log('success!', isoDate.toISOString());
} catch (err) {
  console.error(err);
}
