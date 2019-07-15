const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const shelljs = require('shelljs')
const ora = require('ora')

module.exports = function (creater, params, helper, cb) {
  const { projectName, description, template, date, src, css } = params
  const configDirName = 'config'
  const cwd = process.cwd()
  const projectPath = path.join(cwd, projectName)

  const modelDir = path.join(projectPath, 'models')
  const serviceDir = path.join(projectPath, 'services')
  const modelName=projectName+'_model.js';
  const serviceName=projectName+'_service.js';
  const projectMainName=projectName+'.js';
  const projectMainCSSName=projectName+'.scss';

  const version = helper.getPkgVersion()
  fs.ensureDirSync(projectPath)
  fs.ensureDirSync(path.join(projectPath, 'models'))
  fs.ensureDirSync(path.join(projectPath, 'services'))

  creater.template(template, 'defaultjs', path.join(modelDir, modelName), {
    description,
    projectName,
    version
  })

  creater.template(template, 'defaultjs', path.join(serviceDir, serviceName), {
    description,
    projectName,
    version
  })

  creater.template(template, 'defaultjs', path.join(projectPath, projectMainName), {
    description,
    projectName,
    version
  })

  creater.template(template, 'defaultscss', path.join(projectPath, projectMainCSSName), {
    description,
    projectName,
    version
  })


  creater.fs.commit(() => {
    console.log()
    console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
    console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`))
    console.log(chalk.green(`请进入项目目录 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
    if (typeof cb === 'function') {
      console.log('cb')
      cb()
    }
  })
}
