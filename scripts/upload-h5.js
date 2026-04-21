import config from "../build/server.js"
import fs from "fs/promises" // 使用 promise 版本的 fs
import path from "path"
import { fileURLToPath } from "url"
import Client from "ssh2-sftp-client"
import dayjs from "dayjs"
import { Client as ClientOrg } from "ssh2"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rawArgv = process.argv.slice(2)
const filterStage = rawArgv.includes("--production") ? "production" : "test"

const log = (...args) => console.log(`[${dayjs().format("HH:mm:ss")}]`, ...args)

/**
 * 通用的 SSH 命令执行函数
 */
function executeSSHCommand(item, command) {
  return new Promise((resolve, reject) => {
    const conn = new ClientOrg()
    conn
      .on("ready", () => {
        log(`[${item.host}] 开始执行远程命令: ${command}`)
        conn.exec(command, (err, stream) => {
          if (err) return reject(err)
          stream
            .on("close", code => {
              conn.end()
              if (code === 0) resolve()
              else reject(new Error(`命令执行失败，退出码: ${code}`))
            })
            .on("data", data => log(`[${item.host} STDOUT]: ${data}`))
            .stderr.on("data", data => console.error(`[${item.host} STDERR]: ${data}`))
        })
      })
      .on("error", err => reject(err))
      .connect({
        host: item.host,
        port: item.port,
        username: item.username,
        password: item.password
      })
  })
}

/**
 * 核心部署逻辑
 */
async function deployToServer(item) {
  const sftp = new Client()
  const localDistPath = path.resolve(__dirname, "../dist/build/h5")
  const timestamp = dayjs().format("HH_mm_ss")
  const dateFolder = dayjs().format("YYYY-MM-DD")
  const backupPath = path.resolve(__dirname, `../distbak/${item.host}/${dateFolder}/dist-${timestamp}`)

  try {
    log(`>>> 正在连接服务器: ${item.host} ...`)
    await sftp.connect({
      host: item.host,
      port: item.port,
      username: item.username,
      password: item.password
    })

    // 1. 备份：先创建本地备份目录，再下载
    log(`[${item.host}] --- 正在备份远程文件到本地 ---`)
    await fs.mkdir(backupPath, { recursive: true })
    // 检查远程路径是否存在，存在才下载备份
    const remoteExists = await sftp.exists(item.path)
    if (remoteExists) {
      await sftp.downloadDir(item.path, backupPath)
      log(`[${item.host}] --- 备份完成，存放于: ${backupPath} ---`)

      // 2. 删除：清理旧文件
      log(`[${item.host}] --- 正在清理远程旧目录 ---`)
      await sftp.rmdir(item.path, true)
    }

    // 3. 上传：同步本地新文件
    log(`[${item.host}] --- 正在上传新文件 ---`)
    await sftp.uploadDir(localDistPath, item.path)
    log(`[${item.host}] --- 文件上传成功 ---`)

    // 关闭 SFTP 链接，准备执行 SSH 命令
    await sftp.end()

    // 4. 权限设置/额外指令：仅在配置了 postCmd 时执行
    if (item.postCmd) {
      log(`[${item.host}] 检测到额外指令，准备执行...`)
      try {
        await executeSSHCommand(item, item.postCmd)
        log(`[${item.host}] 额外指令执行成功`)
      } catch (cmdErr) {
        log(`[${item.host}] 警告: 额外指令执行失败，但文件已上传成功。原因: ${cmdErr.message}`)
        // 这里可以决定是否抛出错误。如果不抛出，流程会继续完成。
      }
    } else {
      log(`[${item.host}] 未配置额外指令 (postCmd)，跳过此步骤`)
    }

    log(`[${item.host}] SUCCESS: 部署流程全部完成！`)
  } catch (err) {
    log(`[${item.host}] ERROR: 部署失败! 原因: ${err.message}`)
    throw err // 向上抛出以便 runStart 捕获
  } finally {
    // 确保连接被关闭
    await sftp.end()
  }
}

/**
 * 程序入口
 */
async function runStart() {
  log("当前环境：", filterStage)

  if (!Array.isArray(config) || config.length === 0) {
    log("config 配置为空，终止部署")
    return
  }

  const targets = config.filter(item => item.nodeEnv === filterStage)

  // 使用 for 循环逐个执行，避免多台服务器并发日志混乱
  for (const item of targets) {
    try {
      await deployToServer(item)
    } catch {
      // 一台机器失败，继续下一台还是直接退出，取决于你的需求
      log(`跳过 ${item.host}，继续后续任务...`)
    }
  }

  log("所有部署任务处理完毕。")
}

runStart()
