const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const semver = require('semver')

const Creator = require('./creator')

const {
  shouldUseYarn,
  shouldUseCnpm,
  getPkgVersion
} = require('./util')
const { SOURCE_DIR } = require('./config')

class Project extends Creator {
  constructor (options) {
    super()
    const unSupportedVer = semver.lt(process.version, 'v7.6.0')
    if (unSupportedVer) {
      throw new Error('Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+')
    }
    this.rootPath = this._rootPath

    this.conf = Object.assign({
      projectName: null,
      template: "default",
      description: ''
    }, options)
  }

  init () {
    console.log(chalk.green(`Taro即将创建一个新项目!`))
    console.log('Need help? Go and open issue: https://github.com/NervJS/taro/issues/new')
    console.log()
  }

  create () {
    this.ask()
      .then(answers => {
        const date = new Date()
        this.conf = Object.assign(this.conf, answers)
        this.conf.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`
        this.write()
      })
  }

  ask () {
    const prompts = []
    const conf = this.conf
    if (typeof conf.projectName !== 'string') {
      prompts.push({
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称！',
        validate (input) {
          if (!input) {
            return '项目名不能为空！'
          }
          if (fs.existsSync(input)) {
            return '当前目录已经存在同名项目，请换一个项目名！'
          }
          return true
        }
      })
    } else if (fs.existsSync(conf.projectName)) {
      prompts.push({
        type: 'input',
        name: 'projectName',
        message: '当前目录已经存在同名项目，请换一个项目名！',
        validate (input) {
          if (!input) {
            return '项目名不能为空！'
          }
          if (fs.existsSync(input)) {
            return '项目名依然重复！'
          }
          return true
        }
      })
    }
    if (typeof conf.description !== 'string') {
      prompts.push({
        type: 'input',
        name: 'description',
        message: '请输入项目介绍！'
      })
    }
    return inquirer.prompt(prompts)
  }

  write (cb) {
    const { template } = this.conf
    this.conf.src = SOURCE_DIR
    console.log(template+'write')
    const templateCreate = require(path.join(this.templatePath(), template, 'index.js'))
    templateCreate(this, this.conf, {
      shouldUseYarn,
      shouldUseCnpm,
      getPkgVersion
    }, cb)
  }
}

module.exports = Project
