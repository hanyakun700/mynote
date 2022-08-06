module.exports = {
    title: '技术文档',

    // sidebar: 'auto',  // 侧边栏
    port: 8765,
    themeConfig: {
        // 导航栏相关
        logo: '/assets/img/logo.png', // 导航栏logo
        // navbar: true,  // 禁用导航栏
        nav: [ // 导航栏链接
            {text: '首页', link: '/'},
            {text: '埋点', link: '/nowcoder/'},
            {text: '前端', link: '/fronted/'},
            {text: '后端', link: '/server/'},
            {text: '离线数仓', link: '/dw/'},
            {text: '实时数仓', link: '/dwreal/'}, // 导航栏名称及其对应的url中的地址
            {text: '网易云', link: 'https://music.163.com/'}, // 外部链接
            {
                text: '部门文档',
                items: [ // 嵌套 一个导航栏下可以多选
                    {
                        text: '算法',
                        items: [
                            {text: '推荐', link: '/chinese/'},
                            {text: '搜索', link: '/japanese/'}
                        ]
                    },
                    {
                        text: '模型',
                        items: [
                            {text: 'java', link: '/language/chinese/'},
                            {text: 'python', link: '/language/japanese/'}
                        ]
                    },
                    {
                        text: '其他',
                        items: [
                            {
                                text: 'bi',
                                items: [
                                    {text: 'metabase', link: '/language/chinese/'},
                                    {text: 'olap', link: '/language/japanese/'}
                                ]
                            },
                            {
                                text: '数仓',
                                items: [
                                    {text: '规范', link: '/language/chinese/'},
                                    {text: '建模', link: '/language/japanese/'}
                                ]
                            },
                            {
                                text: '工具',
                                items: [
                                    {text: 'ab试验', link: '/language/chinese/'},
                                    {text: '圈人', link: '/language/japanese/'}
                                ]
                            },
                        ]
                    }
                ]
            }
        ]
    },

    sidebar: 'auto' // 侧边栏
};
