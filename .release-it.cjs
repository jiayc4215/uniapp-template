const version = "${version}"
const packageName = process.env.npm_package_name || require("./package.json").name
const scope = packageName.includes("/") ? packageName.split("/")[1] : packageName

module.exports = {
  plugins: {
    "@release-it/conventional-changelog": {
      path: ".",
      infile: "CHANGELOG.md", //设置用于写入变更日志的文件名infile。如果该文件尚不存在，则会创建该文件并包含完整的变更历史记录。
      preset: "conventionalcommits", // 预设 使用 conventionalcommits
      ignoreRecommendedBump: true, // 忽略提交记录推荐的版本类型，改为交互选择 patch/minor/major。
      //您可以使用以下选项将合并提交包含在变更日志中
      gitRawCommitsOpts: {
        path: "."
      },
      context: {
        host: "https://github.com",
        owner: "jiayc4215",
        repository: "uniapp-template"
      }
    }
  },
  git: {
    push: true, //如果不需要false，则跳过推送释放步骤。
    tagName: `${packageName}-v${version}`, //自定义标签名称，可能与（带前缀的）版本不同。
    pushRepo: "https://github.com/jiayc4215/uniapp-template.git", //要推送版本到的远程名称或 Git URL（默认origin）
    commitsPath: ".", //发布变更中应包含的目录路径
    commitMessage: `feat(${scope}): released version v${version} [no ci]`, //要添加到提交步骤中的消息
    requireCommits: true, //如果自上个版本以来没有任何提交，则停止该过程。
    requireCommitsFail: false //如果没有提交，则继续，但使用退出代码
  },
  npm: {
    publish: false, //设置为false跳过 npm 发布步骤
    versionArgs: ["--workspaces false"] //如果需要向 npm 提供额外的参数来进行版本控制操作
  },
  // 禁用 GitLab Release 功能（仅使用 Git Tag 和 Push）
  gitlab: {
    release: false
  },
  // 流程生命周期钩子（Hooks）
  hooks: {
    // 1. 在初始化之前执行：通常用于代码格式检查
    "before:init": ["npm run lint"],
    // 3. 在 Git 推送和发布之后执行
    "after:git:release": "echo After git push, before github release",
    // 4. 整个发布流程完成后执行
    "after:release": "echo Successfully released ${name} v${version} to ${repo.repository}."
  }
}
