export default {
  dbV1: {
    action: {
      downloadBackup: '下载备份数据',
      start: '开始使用',
      upgrade: '一键升级',
    },
    description: 'LobeChat 的数据存储有了巨大的飞跃，只需点击升级按钮即可开始使用',
    features: {
      capability: {
        desc: '足以装下你一生的会话消息',
        title: '大容量',
      },
      performance: {
        desc: '千万条消息，毫秒级查询',
        title: '高性能',
      },
      use: {
        desc: '支持标题、描述、消息，乃至翻译文本的查询',
        title: '更易用',
      },
    },
    title: '数据进化',
    upgrade: {
      error: {
        subTitle:
          '非常抱歉，数据库升级过程发生异常，升级失败。请尝试重新升级，或 <1>提交问题</1> 给我们，我们将会第一时间帮你排查',
        title: '数据库升级失败',
      },
      success: {
        subTitle: 'LobeChat 的数据库已经升级到最新版本，立即开始体验吧',
        title: '数据库已升级到最新版',
      },
    },
    upgradeTip: '升级过程大致需要 1~2 秒，取决于您的数据量',
  },
  upgradeWarning: '请不要关闭 LobeChat，直到升级完成',
};
