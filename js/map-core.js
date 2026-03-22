/**
 * AMap jQuery-style Loader Lib
 * 功能：自动加载 SDK + 初始化地图 + 常用工具
 */
(function (window) {
    const MAP_CONFIG = {
        key: 'e4b4780997e21991c081e45262218b04',
        securityJsCode: '796c01aa978823734dd9cc2e708909e9',
        version: '2.0'
    };

    const MyMap = {
        instance: null,

        // 1. 内部私有方法：动态加载高德脚本
        _loadSDK() {
            return new Promise((resolve, reject) => {
                if (window.AMap) return resolve(window.AMap);

                // 配置安全密钥
                window._AMapSecurityConfig = { securityJsCode: MAP_CONFIG.securityJsCode };

                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `https://webapi.amap.com/maps?v=${MAP_CONFIG.version}&key=${MAP_CONFIG.key}`;
                script.onerror = reject;
                script.onload = () => resolve(window.AMap);
                document.head.appendChild(script);
            });
        },

        // 2. 初始化函数 (支持异步)
        async init(containerId, options = {}) {
            try {
                await this._loadSDK();
                this.instance = new AMap.Map(containerId, {
                    zoom: 11,
                    center: [116.397, 39.908],
                    ...options
                });
                console.log('Map Ready');
                return this.instance;
            } catch (e) {
                console.error('地图加载失败', e);
            }
        },

        // 3. 像 jq 一样封装快捷功能
        addMarker(lng, lat, title) {
            if (!this.instance) return;
            const marker = new AMap.Marker({
                position: [lng, lat],
                title: title,
                map: this.instance
            });
            
            // 联动 TDesign (如果存在)
            if (window.TDesign) {
                window.TDesign.MessagePlugin.info(`已标记: ${title}`);
            }
            return marker;
        },

        // 4. 快速切换图层
        setTheme(type) {
            // normal, dark, light, fresh
            this.instance.setMapStyle(`amap://styles/${type}`);
        }
    };

    window.$map = MyMap;
})(window);
