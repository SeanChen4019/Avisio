/**
 * Avisio - AI-powered diagram editor
 * Developer: Sean Chen (seanchen4019@gmail.com)
 */
// null'ing of global vars need to be after init.js
window.ICONSEARCH_PATH = null;

/**
 * AI Visio Copilot: Full Chinese translation patch
 * Handles stencil/shape names that dia_zh.txt cannot translate.
 */
(function() {
  var ZH = {
    // --- Shape sidebar labels (stencil tooltips) ---
    "Text": "文本",
    "Heading": "标题",
    "Vertical Container": "垂直容器",
    "Horizontal Container": "水平容器",
    "List": "列表",
    "List Item": "列表项",
    "Item 1": "项目 1",
    "Item 2": "项目 2",
    "Item 3": "项目 3",
    "Label": "标签",
    "Source": "源",
    "Target": "目标",
    "Rectangle": "矩形",
    "Rounded Rectangle": "圆角矩形",
    "Ellipse": "椭圆",
    "Diamond": "菱形",
    "Hexagon": "六边形",
    "Circle": "圆形",
    "Triangle": "三角形",
    "Parallelogram": "平行四边形",
    "Cylinder": "圆柱体",
    "Actor": "角色",
    "Cloud": "云",
    "Line": "直线",
    "Arrow": "箭头",
    "Link": "链接",
    "Image": "图片",
    "Curve": "曲线",
    "Container": "容器",
    "Table": "表格",
    "Callout": "标注",
    "Note": "备注",
    "Step": "步骤",
    "Process": "流程",
    "Decision": "决策",
    "Document": "文档",
    "Data": "数据",
    "Start": "开始",
    "End": "结束",
    "Connector": "连接线",
    "Flow Arrow": "流程箭头",
    "Sort": "排序",
    "Direct Data": "直接数据",
    "Manual Input": "手动输入",
    "Manual Operation": "手动操作",
    "Preparation": "准备",
    "Delay": "延迟",
    "Display": "显示",
    "Loop Limit": "循环限制",
    "Terminator": "终止符",
    "Merge": "合并",
    "Extract": "提取",
    "Collate": "校对",
    "Off Page Reference": "离页引用",
    "Stored Data": "存储数据",
    "Sequential Data": "顺序数据",
    "Internal Storage": "内部存储",
    "Card": "卡片",
    "Summing Junction": "汇总连接",
    "Or": "或",
    "Database": "数据库",
    "Hard Disk": "硬盘",
    "Striped Cylinder": "条纹圆柱",
    "Multi Document": "多文档",
    "Message": "消息",
    "Timer": "定时器",
    "Email": "邮件",
    "Web Service": "Web 服务",
    "1/2": "二分之一",
    "Server": "服务器",
    "Server 2": "服务器 2",
    "Firewall": "防火墙",
    "Folder": "文件夹",
    "User": "用户",
    "Users": "多个用户",
    "Magnifier": "放大镜",
    "Question": "问题",
    "Star": "星形",
    "Cross": "叉形",
    "Cancel": "取消",
    "Error": "错误",
    "Help": "帮助",
    "Info": "信息",
    "Warning": "警告",
    "Tag": "标签",
    "Pin": "图钉",
    "Paper": "纸张",
    "Key": "密钥",
    "Gear": "齿轮",
    "Lock": "锁",
    "Unlock": "解锁",
    "Telephone": "电话",
    "Printer": "打印机",
    "Fax": "传真",
    "Camera": "相机",
    "Settings": "设置",
    "Search": "搜索",
    "Upload": "上传",
    "Download": "下载",
    "Plus": "加号",
    "Minus": "减号",
    "Check": "勾选",
    "Home": "首页",
    "Menu": "菜单",
    "Location": "位置",
    "Chart": "图表",
    "Bar Chart": "柱状图",
    "Pie": "饼图",
    "Copy": "复制",
    "Paste": "粘贴",
    "Cut": "剪切",
    "Save": "保存",
    "Open": "打开",
    "Print": "打印",
    "New": "新建",
    "Delete": "删除",
    "Edit": "编辑",
    "Properties": "属性",
    "Export": "导出",
    "Import": "导入",
    "Undo": "撤销",
    "Redo": "重做",
    "Zoom In": "放大",
    "Zoom Out": "缩小",
    "Zoom Fit": "适应窗口",
    "Actual Size": "实际尺寸",
    "Show Grid": "显示网格",
    "Snap to Grid": "对齐网格",
    "Scrollbars": "滚动条",
    "Tooltips": "工具提示",
    "Connection Arrows": "连接箭头",
    "Solid": "实线",
    "Dashed": "虚线",
    "Dotted": "点线",
    "Fill Color": "填充颜色",
    "Line Color": "线条颜色",
    "Font Color": "字体颜色",
    "Gradient": "渐变",
    "Rounded": "圆角",
    "Shadow": "阴影",
    "Glow": "发光",
    "Opacity": "透明度",
    "Width": "宽度",
    "Height": "高度",
    "Rotation": "旋转",
    "Border": "边框",
    "Corner Radius": "圆角半径",
    "First": "第一个",
    "Last": "最后一个",
    "Show": "显示",
    "Hide": "隐藏",
    "Group": "分组",
    "Ungroup": "取消分组",
    "Bring Forward": "上移一层",
    "Send Backward": "下移一层",
    "Bring to Front": "移至最前",
    "Send to Back": "移至最后",
    "Align Left": "左对齐",
    "Align Center": "居中对齐",
    "Align Right": "右对齐",
    "Align Top": "顶端对齐",
    "Align Middle": "垂直居中",
    "Align Bottom": "底端对齐",
    "Distribute Horizontally": "水平分布",
    "Distribute Vertically": "垂直分布",
    "Same Width": "等宽",
    "Same Height": "等高",
    "Autolayout": "自动布局",
    "Page View": "页面视图",
    "Page Setup": "页面设置",
    "Background": "背景",
    "Background Color": "背景颜色",
    "Paper Size": "纸张大小",
    "Landscape": "横向",
    "Portrait": "纵向",
    "Copy of": "副本",
    "Scratchpad": "便笺本",
    "More Shapes": "更多形状",
    "Drag elements here": "把元素拖至此处",
    "Click or drag and drop shapes": "点击或拖放图形到此区域",
    "Type / to search": "输入 / 搜索",
    "Search": "搜索",

    "General": "通用",
    "Misc": "杂项",
    "Advanced": "高级",
    "Basic": "基本",
    "Arrows": "箭头",
    "Flowchart": "流程图",
    "Entity Relation": "实体关系",
    "UML": "UML",
    "UML 2.5": "UML 2.5",

    "Clipart / Computer": "剪贴画 / 计算机",
    "Clipart / Finance": "剪贴画 / 财务",
    "Clipart / Various": "剪贴画 / 杂项",
    "Clipart / Networking": "剪贴画 / 网络",
    "Clipart / People": "剪贴画 / 人物",
    "Clipart / Telecommunication": "剪贴画 / 通信",

    "Active Directory": "Active Directory",
    "Android": "Android",
    "Atlassian": "Atlassian",
    "Bootstrap": "Bootstrap",
    "Data Flow Diagram": "数据流图",
    "iOS Icons": "iOS 图标",
    "iOS UI": "iOS 界面",
    "iOS6": "iOS6",
    "Kubernetes": "Kubernetes",
    "Mockup Buttons": "原型按钮",
    "Mockup Containers": "原型容器",
    "Mockup Forms": "原型表单",
    "Mockup Graphics": "原型图形",
    "Mockup Markup": "原型标记",
    "Mockup Misc": "原型杂项",
    "Mockup Navigation": "原型导航",
    "Mockup Text": "原型文本",
    "Sitemap": "站点地图",
    "Salesforce / Components": "Salesforce / 组件",
    "Salesforce / Product": "Salesforce / 产品",
    "Salesforce / Platform": "Salesforce / 平台",
    "Salesforce / Industry": "Salesforce / 行业",

    "Alibaba Cloud": "阿里云",
    "Allied Telesis / Buildings": "Allied Telesis / 楼宇",
    "Allied Telesis / Computer and Terminals": "Allied Telesis / 计算机与终端",
    "Allied Telesis / Media Converters": "Allied Telesis / 媒体转换器",
    "Allied Telesis / Security": "Allied Telesis / 安全",
    "Allied Telesis / Storage": "Allied Telesis / 存储",
    "Allied Telesis / Switch": "Allied Telesis / 交换机",
    "Allied Telesis / Wireless": "Allied Telesis / 无线",

    "AWS17 / Analytics": "AWS17 / 分析",
    "AWS17 / Application Services": "AWS17 / 应用服务",
    "AWS17 / Artificial Intelligence": "AWS17 / 人工智能",
    "AWS17 / Business Productivity": "AWS17 / 企业生产力",
    "AWS17 / Compute": "AWS17 / 计算",
    "AWS17 / Contact Center": "AWS17 / 联络中心",
    "AWS17 / Database": "AWS17 / 数据库",
    "AWS17 / Desktop and App Streaming": "AWS17 / 桌面与应用流",
    "AWS17 / Developer Tools": "AWS17 / 开发工具",
    "AWS17 / Game Development": "AWS17 / 游戏开发",
    "AWS17 / General": "AWS17 / 通用",
    "AWS17 / Groups": "AWS17 / 分组",
    "AWS17 / Internet of Things": "AWS17 / 物联网",
    "AWS17 / Management Tools": "AWS17 / 管理工具",
    "AWS17 / Messaging": "AWS17 / 消息",
    "AWS17 / Migration": "AWS17 / 迁移",
    "AWS17 / Mobile Services": "AWS17 / 移动服务",
    "AWS17 / Network and Content Delivery": "AWS17 / 网络与内容分发",
    "AWS17 / On-Demand Workforce": "AWS17 / 按需劳动力",
    "AWS17 / SDK": "AWS17 / SDK",
    "AWS17 / Security Identity and Compliance": "AWS17 / 安全身份与合规",
    "AWS17 / Storage": "AWS17 / 存储",

    "AWS18 / Arrows": "AWS18 / 箭头",
    "AWS18 / General Resources": "AWS18 / 通用资源",
    "AWS18 / Illustrations": "AWS18 / 插画",
    "AWS18 / Groups (light)": "AWS18 / 分组（浅色）",
    "AWS18 / Groups (dark)": "AWS18 / 分组（深色）",
    "AWS18 / Analytics": "AWS18 / 分析",
    "AWS18 / Application Integration": "AWS18 / 应用集成",
    "AWS18 / AR & VR": "AWS18 / 增强现实与虚拟现实",
    "AWS18 / Cost Management": "AWS18 / 成本管理",
    "AWS18 / Blockchain": "AWS18 / 区块链",
    "AWS18 / Business Productivity": "AWS18 / 企业生产力",
    "AWS18 / Compute": "AWS18 / 计算",
    "AWS18 / Customer Engagement": "AWS18 / 客户互动",
    "AWS18 / Database": "AWS18 / 数据库",
    "AWS18 / Desktop & App Streaming": "AWS18 / 桌面与应用流",
    "AWS18 / Developer Tools": "AWS18 / 开发工具",
    "AWS18 / Game Tech": "AWS18 / 游戏技术",
    "AWS18 / Internet of Things": "AWS18 / 物联网",
    "AWS18 / Machine Learning": "AWS18 / 机器学习",
    "AWS18 / Management & Governance": "AWS18 / 管理与治理",
    "AWS18 / Media Services": "AWS18 / 媒体服务",
    "AWS18 / Migration & Transfer": "AWS18 / 迁移与传输",
    "AWS18 / Mobile": "AWS18 / 移动",
    "AWS18 / Network & Content Delivery": "AWS18 / 网络与内容分发",
    "AWS18 / Quantum Technologies": "AWS18 / 量子技术",
    "AWS18 / Robotics": "AWS18 / 机器人",
    "AWS18 / Satellite": "AWS18 / 卫星",
    "AWS18 / Security & Compliance": "AWS18 / 安全与合规",
    "AWS18 / Serverless": "AWS18 / 无服务器",
    "AWS18 / Storage": "AWS18 / 存储",

    "Azure / AI + Machine Learning": "Azure / AI + 机器学习",
    "Azure / Analytics": "Azure / 分析",
    "Azure / Compute": "Azure / 计算",
    "Azure / Containers": "Azure / 容器",
    "Azure / Databases": "Azure / 数据库",
    "Azure / DevOps": "Azure / DevOps",
    "Azure / Developer Tools": "Azure / 开发工具",
    "Azure / General": "Azure / 通用",
    "Azure / Identity": "Azure / 身份",
    "Azure / Integration": "Azure / 集成",
    "Azure / Internet of Things": "Azure / 物联网",
    "Azure / IT & Management Tools": "Azure / IT 与管理工具",
    "Azure / Media": "Azure / 媒体",
    "Azure / Migration": "Azure / 迁移",
    "Azure / Mobile": "Azure / 移动",
    "Azure / Networking": "Azure / 网络",
    "Azure / Security": "Azure / 安全",
    "Azure / Storage": "Azure / 存储",
    "Azure / Web": "Azure / Web",
    "Azure / Windows IoT": "Azure / Windows IoT",

    "C4 / Container Diagram": "C4 / 容器图",
    "C4 / Context Diagram": "C4 / 上下文图",
    "C4 / Component Diagram": "C4 / 组件图",
    "C4 / Deployment Diagram": "C4 / 部署图",

    "Cisco / Buildings": "Cisco / 楼宇",
    "Cisco / Computers and Terminals": "Cisco / 计算机与终端",
    "Cisco / Gateways and Routers": "Cisco / 网关与路由器",
    "Cisco / Miscellaneous": "Cisco / 杂项",
    "Cisco / Phones": "Cisco / 电话",
    "Cisco / Routers": "Cisco / 路由器",
    "Cisco / Security and VPN": "Cisco / 安全与 VPN",
    "Cisco / Servers and Storage": "Cisco / 服务器与存储",
    "Cisco / Switches and Hubs": "Cisco / 交换机与集线器",
    "Cisco / Telepresence and Video": "Cisco / 远程呈现与视频",
    "Cisco / Wireless": "Cisco / 无线",
    "Cisco / Physical": "Cisco / 物理",
    "Cisco / Enterprise": "Cisco / 企业",
    "Cisco / Industrial": "Cisco / 工业",
    "Cisco / Data Center": "Cisco / 数据中心",
    "Cisco / Small Business": "Cisco / 小型企业",
    "Cisco / Service Provider": "Cisco / 服务提供商",
    "Cisco / Collaboration": "Cisco / 协作",
    "Cisco / Optical": "Cisco / 光纤",

    "GCP / AI": "GCP / 人工智能",
    "GCP / API Management": "GCP / API 管理",
    "GCP / Compute": "GCP / 计算",
    "GCP / Data Analytics": "GCP / 数据分析",
    "GCP / Databases": "GCP / 数据库",
    "GCP / Developer Tools": "GCP / 开发工具",
    "GCP / Hybrid": "GCP / 混合云",
    "GCP / IoT": "GCP / 物联网",
    "GCP / Management Tools": "GCP / 管理工具",
    "GCP / Migration": "GCP / 迁移",
    "GCP / Networking": "GCP / 网络",
    "GCP / Security": "GCP / 安全",
    "GCP / Storage": "GCP / 存储",

    "IBM / Analytics": "IBM / 分析",
    "IBM / Application Services": "IBM / 应用服务",
    "IBM / Blockchain": "IBM / 区块链",
    "IBM / Compute": "IBM / 计算",
    "IBM / Containers": "IBM / 容器",
    "IBM / Database": "IBM / 数据库",
    "IBM / Developer Tools": "IBM / 开发工具",
    "IBM / Integration": "IBM / 集成",
    "IBM / IT Service Management": "IBM / IT 服务管理",
    "IBM / Migrate": "IBM / 迁移",
    "IBM / Networking": "IBM / 网络",
    "IBM / Resilience": "IBM / 弹性",
    "IBM / Security": "IBM / 安全",
    "IBM / Storage": "IBM / 存储",
    "IBM / Video": "IBM / 视频",
    "IBM / VMware": "IBM / VMware",

    "Oracle Cloud / Compute": "Oracle Cloud / 计算",
    "Oracle Cloud / Networking": "Oracle Cloud / 网络",
    "Oracle Cloud / Storage": "Oracle Cloud / 存储",
    "Oracle Cloud / Database": "Oracle Cloud / 数据库",
    "Oracle Cloud / Security": "Oracle Cloud / 安全",
    "Oracle Cloud / Applications": "Oracle Cloud / 应用",
    "Oracle Cloud / Observability": "Oracle Cloud / 可观测性",
    "Oracle Cloud / Analytics & AI": "Oracle Cloud / 分析与 AI",
    "Oracle Cloud / Developer": "Oracle Cloud / 开发",
    "Oracle Cloud / Hybrid": "Oracle Cloud / 混合云",
    "Oracle Cloud / Migration": "Oracle Cloud / 迁移",
    "Oracle Cloud / Integration": "Oracle Cloud / 集成",
    "Oracle Cloud / Governance": "Oracle Cloud / 治理",

    "Rackspace / Monitoring": "Rackspace / 监控",
    "Rackspace / Security": "Rackspace / 安全",
    "Rackspace / Compute": "Rackspace / 计算",
    "Rackspace / Database": "Rackspace / 数据库",
    "Rackspace / Networking": "Rackspace / 网络",
    "Rackspace / Storage": "Rackspace / 存储",
    "Rackspace / Backup": "Rackspace / 备份",
    "Rackspace / Email": "Rackspace / 邮件",

    "Cloud & Enterprise": "云与企业",
    "Google Cloud Platform": "Google Cloud Platform",
    "IBM Cloud": "IBM Cloud",

    "Compute": "计算",
    "Networking": "网络",
    "Storage": "存储",
    "Security": "安全",
    "Containers": "容器",
    "Monitoring": "监控",
    "Analytics": "分析",
    "Migration": "迁移",
    "Integration": "集成",
    "Developer Tools": "开发工具",
    "Management Tools": "管理工具",
    "Internet of Things": "物联网",
    "Machine Learning": "机器学习",
    "Database": "数据库",
    "Media": "媒体",
    "Mobile": "移动",
    "Identity": "身份",
    "Hybrid": "混合云",
    "Backup": "备份",
    "Email": "邮件",
    "Web": "Web",
    "DevOps": "DevOps",
    "API": "API",
    "Desktop": "桌面",
    "Mobile Services": "移动服务",
    "Application Services": "应用服务",
    "Data Analytics": "数据分析",
    "SDK": "SDK",
    "Security Identity and Compliance": "安全身份与合规",
    "Game Development": "游戏开发",
    "Business Productivity": "企业生产力",
    "Contact Center": "联络中心",
  };

  var ZH_KEYS = [];
  for (var k in ZH) ZH_KEYS.push(k);
  ZH_KEYS.sort(function(a, b) { return b.length - a.length; });

  function translateTextNode(text) {
    if (!text || text.length === 0) return text;
    var protected = [];
    var result = text;
    for (var i = 0; i < ZH_KEYS.length; i++) {
      var en = ZH_KEYS[i];
      var idx = 0;
      while (true) {
        var pos = result.indexOf(en, idx);
        if (pos === -1) break;
        var before = pos === 0 ? true : !/[a-zA-Z]/.test(result[pos - 1]);
        var after = pos + en.length >= result.length ? true : !/[a-zA-Z]/.test(result[pos + en.length]);
        var overlaps = false;
        for (var j = 0; j < protected.length; j++) {
          if (pos < protected[j].end && pos + en.length > protected[j].start) {
            overlaps = true;
            break;
          }
        }
        if (before && after && !overlaps) {
          result = result.substring(0, pos) + ZH[en] + result.substring(pos + en.length);
          protected.push({ start: pos, end: pos + ZH[en].length });
          idx = pos + ZH[en].length;
        } else {
          idx = pos + 1;
        }
      }
    }
    return result;
  }

  function translateNode(node) {
    if (node.nodeType === 3) {
      var newVal = translateTextNode(node.nodeValue);
      if (newVal !== node.nodeValue) node.nodeValue = newVal;
    } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      if (node.title) {
        var newTitle = translateTextNode(node.title);
        if (newTitle !== node.title) node.title = newTitle;
      }
      if (node.placeholder) {
        var newPlaceholder = translateTextNode(node.placeholder);
        if (newPlaceholder !== node.placeholder) node.placeholder = newPlaceholder;
      }
      var child = node.firstChild;
      while (child) {
        var next = child.nextSibling;
        translateNode(child);
        child = next;
      }
    }
  }

  function translateDocument() {
    translateNode(document.body);
  }

  var observer = new MutationObserver(function(mutations) {
    var needsTranslate = false;
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) {
          needsTranslate = true;
          break;
        }
      }
    }
    if (needsTranslate) translateDocument();
  });

  function init() {
    translateDocument();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ============================================================
// MathType Paste Support - paste formula as image on canvas
// ============================================================

(function() {
  // Capture the mxGraph instance by intercepting addCells
  var origAddCell = mxGraph.prototype.addCells;
  mxGraph.prototype.addCells = function() {
    if (!window.__avisioGraph) window.__avisioGraph = this;
    return origAddCell.apply(this, arguments);
  };

  function insertImageCell(dataUrl) {
    var graph = window.__avisioGraph;
    if (!graph) return false;
    try {
      var sc = graph.view.scale, tr = graph.view.translate;
      var cx = graph.container.offsetWidth / 2 / sc - tr.x;
      var cy = graph.container.offsetHeight / 2 / sc - tr.y;
      var cell = new mxCell('', new mxGeometry(cx - 120, cy - 40, 240, 80),
        'shape=image;imageAspect=1;image=' + dataUrl);
      cell.vertex = true;
      graph.model.beginUpdate();
      try { graph.addCell(cell); graph.setSelectionCell(cell); }
      finally { graph.model.endUpdate(); }
      return true;
    } catch(ex) { return false; }
  }

  /** Render LaTeX to SVG using MathJax and insert as image */
  function renderAndInsertLatex(latex) {
    // Remove any existing display math delimiters
    latex = latex.replace(/^\\\[|\\\]$/g, '').replace(/^\\\(|\\\)$/g, '').trim();

    var container = document.createElement('div');
    container.style.cssText = 'position:absolute;left:-9999px;top:0;';
    document.body.appendChild(container);

    var wrapped = '\\[' + latex + '\\]';
    container.innerHTML = wrapped;

    function tryInsert() {
      if (!window.__avisioGraph) {
        setTimeout(tryInsert, 300);
        return;
      }
      try {
        MathJax.typesetClear([container]);
        MathJax.typeset([container]).then(function() {
          var svg = container.querySelector('svg');
          if (svg) {
            var clone = svg.cloneNode(true);
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            var str = new XMLSerializer().serializeToString(clone);
            var dataUrl = 'data:image/svg+xml;base64,' +
              btoa(unescape(encodeURIComponent(str)));
            insertImageCell(dataUrl);
          }
          document.body.removeChild(container);
        });
      } catch(ex) {
        document.body.removeChild(container);
      }
    }
    tryInsert();
  }

  document.addEventListener('paste', function(e) {
    var cd = e.clipboardData || window.clipboardData;
    if (!cd) return;

    // Detect MathML (MathType's clipboard signature)
    var hasMathML = false;
    var mathmlData = null;
    try {
      mathmlData = cd.getData('application/x-mathml-presentation+xml') ||
                   cd.getData('text/mathml');
      hasMathML = mathmlData && mathmlData.length > 0;
    } catch(ex) {}

    if (!hasMathML && cd.getData('text/plain')) {
      // Also detect pasted LaTeX with \[ \] delimiters
      var plain = cd.getData('text/plain');
      if (/^\\\[/.test(plain.trim())) {
        e.preventDefault();
        try { e.stopPropagation(); } catch(ex) {}
        renderAndInsertLatex(plain);
        return;
      }
      return;
    }

    if (!hasMathML) return;

    e.preventDefault();
    try { e.stopPropagation(); } catch(ex) {}

    // Priority 1: PNG image in clipboard
    for (var i = 0; i < cd.items.length; i++) {
      if (cd.items[i].type.indexOf('image') !== -1) {
        var blob = cd.items[i].getAsFile();
        if (blob) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            if (!insertImageCell(evt.target.result)) {
              var r = 0, timer = setInterval(function() {
                r++; if (insertImageCell(evt.target.result) || r > 30) clearInterval(timer);
              }, 500);
            }
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
    }

    // Priority 2: Extract LaTeX from MathML annotation and render
    var annMatch = mathmlData.match(/<annotation[^>]*>([\s\S]*?)<\/annotation>/i);
    if (annMatch) {
      renderAndInsertLatex(annMatch[1].trim());
      return;
    }

    var annMatch = mathmlData.match(/<annotation[^>]*>([\s\S]*?)<\/annotation>/i);
    if (annMatch) {
      renderAndInsertLatex(annMatch[1].trim());
      return;
    }

    // Priority 3: Try to render MathML directly with MathJax
    renderAndInsertLatex(mathmlData);
  }, true);
})();

// Listen for formula rendering requests from the parent FormulaModal
(function() {
  var apiBase = 'http://localhost:8000';

  // Inject logo into draw.io menu bar (before "文件")
  function injectLogo() {
    var menubar = document.querySelector('.geMenubarContainer .geMenubar');
    if (!menubar) { setTimeout(injectLogo, 500); return; }
    if (menubar.querySelector('.avisio-logo')) return;
    var logo = document.createElement('img');
    logo.className = 'avisio-logo';
    logo.src = '/logo.png';
    logo.alt = 'Avisio';
    logo.style.cssText = 'height:20px;width:auto;vertical-align:middle;margin:0 4px 0 4px;cursor:pointer;display:inline-block;';
    var firstItem = menubar.querySelector('.geItem');
    menubar.insertBefore(logo, firstItem);
  }

  // Add "公式" button to draw.io menu bar
  function addFormulaButton() {
    var menubar = document.querySelector('.geMenubarContainer .geMenubar');
    if (!menubar) { setTimeout(addFormulaButton, 500); return; }
    if (menubar.querySelector('.geItem.avisio-formula')) return;
    var btn = document.createElement('a');
    btn.className = 'geItem avisio-formula';
    btn.textContent = '公式';
    btn.style.cssText = 'cursor:pointer;padding:0 8px;display:inline-block;';
    btn.title = '在线公式编辑器 (Ctrl+Shift+F)';
    btn.onclick = function() {
      try { window.parent.postMessage(JSON.stringify({event: 'open-formula'}), '*'); } catch(ex) {}
    };
    menubar.appendChild(btn);
  }

  // Add navigation links to menu bar (首页 / 项目 / 设置)
  function addNavLinks() {
    var menubar = document.querySelector('.geMenubarContainer .geMenubar');
    if (!menubar) { setTimeout(addNavLinks, 500); return; }
    if (menubar.querySelector('.avisio-nav-spacer')) return;

    var spacer = document.createElement('span');
    spacer.className = 'avisio-nav-spacer';
    spacer.style.cssText = 'flex:1;';
    menubar.appendChild(spacer);

    var links = [
      { text: '首页', event: 'nav-home' },
      { text: '我的项目', event: 'nav-projects' },
    ];

    links.forEach(function(link) {
      var el = document.createElement('a');
      el.className = 'geItem avisio-nav';
      el.textContent = link.text;
      el.style.cssText = 'cursor:pointer;padding:0 8px;display:inline-block;opacity:0.65;';
      el.title = link.text;
      el.onclick = function() {
        try { window.parent.postMessage(JSON.stringify({event: link.event}), '*'); } catch(ex) {}
      };
      menubar.appendChild(el);
    });
  }

  // Inject AI panel to the left of the format container (right sidebar area)
  function injectAIPanel() {
    var formatContainer = document.querySelector('.geFormatContainer');
    if (!formatContainer) { setTimeout(injectAIPanel, 500); return; }
    if (document.querySelector('.avisio-right-wrapper')) return;

    // Create wrapper div to hold [AI panel | Format panel] side by side
    var wrapper = document.createElement('div');
    wrapper.className = 'avisio-right-wrapper';
    wrapper.style.cssText = 'display:flex;flex-direction:row;height:100%;';

    var formatWidth = formatContainer.offsetWidth;

    // Build AI panel - narrower sidebar
    var aiPanel = document.createElement('div');
    aiPanel.className = 'avisio-ai-panel';
    aiPanel.style.cssText = 'width:260px;display:flex;flex-direction:column;background:#fff;overflow:hidden;font-size:13px;font-family:sans-serif;flex-shrink:0;';

    aiPanel.innerHTML =
      '<div style="background:#f0f0f0;border-bottom:1px solid #ccc;padding:6px 10px;font-size:12px;font-weight:600;color:#333;display:flex;align-items:center;gap:6px;">' +
        '<span style="flex:1;">AI 助手</span>' +
        '<select class="avisio-ai-model" style="font-size:11px;padding:2px 4px;border:1px solid #aaa;border-radius:2px;background:#fff;max-width:100px;">' +
          '<option>GPT-4o</option>' +
          '<option>GPT-4o-mini</option>' +
          '<option>Claude 3.5</option>' +
        '</select>' +
      '</div>' +
      '<div class="avisio-ai-chat" style="flex:2;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#333;background:#fff;border-bottom:1px solid #ddd;min-height:0;">' +
        '<div style="background:#f5f5f5;border:1px solid #e0e0e0;border-radius:4px;padding:8px;color:#888;text-align:center;margin:auto;font-size:11px;">输入项目描述，AI 将生成图示草稿</div>' +
      '</div>' +
      '<div class="avisio-ai-preview" style="flex:1;overflow-y:auto;padding:8px;background:#fafafa;border-bottom:1px solid #ddd;min-height:60px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#aaa;">图示预览将显示在此处</div>' +
      '<div style="display:flex;border-top:1px solid #ccc;padding:6px;gap:4px;background:#f0f0f0;">' +
        '<input class="avisio-ai-input" type="text" placeholder="描述你需要的图示..." style="flex:1;padding:5px 8px;font-size:12px;border:1px solid #aaa;border-radius:2px;outline:none;" />' +
        '<button class="avisio-ai-send-btn" style="padding:5px 14px;font-size:12px;background:#1976d2;color:#fff;border:none;border-radius:2px;cursor:pointer;font-weight:500;white-space:nowrap;">发送</button>' +
      '</div>';

    try {
      var parent = formatContainer.parentNode;

      // Replace formatContainer in DOM with empty wrapper
      parent.replaceChild(wrapper, formatContainer);

      // Now put AI panel and format container inside wrapper
      wrapper.appendChild(aiPanel);
      wrapper.appendChild(formatContainer);

      formatContainer.style.cssText = 'flex:1;min-width:160px;';
    } catch(ex) { return; }

    // Wire up AI panel events...

    // Wire up send button
    var input = aiPanel.querySelector('.avisio-ai-input');
    var sendBtn = aiPanel.querySelector('.avisio-ai-send-btn');
    var chatArea = aiPanel.querySelector('.avisio-ai-chat');
    var previewArea = aiPanel.querySelector('.avisio-ai-preview');

    function addMessage(text, isUser) {
      var msg = document.createElement('div');
      msg.style.cssText = 'padding:7px 9px;border-radius:4px;font-size:12px;line-height:1.4;' +
        (isUser
          ? 'background:#e3f2fd;border:1px solid #bbdefb;align-self:flex-end;max-width:90%;'
          : 'background:#f5f5f5;border:1px solid #e0e0e0;align-self:flex-start;max-width:90%;');
      msg.textContent = text;
      chatArea.appendChild(msg);
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    function showPreview(text) {
      previewArea.innerHTML = '';
      previewArea.style.cssText = 'flex:1;overflow-y:auto;padding:8px;background:#fafafa;border-bottom:1px solid #ddd;min-height:60px;font-size:11px;color:#555;';
      previewArea.textContent = text || '图示预览将显示在此处';
    }

    function sendMessage() {
      var text = input.value.trim();
      if (!text) return;
      addMessage(text, true);
      input.value = '';

      // Call API for outline
      var modelSelect = aiPanel.querySelector('.avisio-ai-model');
      var model = modelSelect ? modelSelect.value : 'default';

      sendBtn.textContent = '...';
      sendBtn.disabled = true;

      var placeholder = document.createElement('div');
      placeholder.style.cssText = 'padding:7px 9px;border-radius:4px;font-size:12px;color:#888;font-style:italic;align-self:flex-start;';
      placeholder.textContent = 'AI 思考中...';
      chatArea.appendChild(placeholder);

      fetch(apiBase + '/api/ai/outline', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_input: text, style: 'technical'})
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        placeholder.remove();
        var summary = '📋 ' + (data.title || '方案概览') + '\n' + (data.summary || '');
        addMessage(summary, false);

        if (data.modules) {
          var modText = '模块构成：\n';
          data.modules.forEach(function(m, i) {
            modText += '  ' + (i+1) + '. ' + m.name + ' - ' + m.description + '\n';
          });
          addMessage(modText, false);
        }

        // Now generate diagram
        addMessage('正在生成图示...', false);

        return fetch(apiBase + '/api/ai/generate-drawio', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({outline: data.title || text, style: 'technical'})
        });
      })
      .then(function(r) { return r.json(); })
      .then(function(result) {
        showPreview('✅ 草稿已生成 - ' + (result.summary || ''));
        aiPanel.__drawioXml = result.drawio_xml;

        // Add apply button if not exists
        if (!aiPanel.querySelector('.avisio-ai-apply-btn')) {
          var applyBtn = document.createElement('button');
          applyBtn.className = 'avisio-ai-apply-btn';
          applyBtn.textContent = '→ 应用到画布';
          applyBtn.style.cssText = 'width:100%;margin-top:6px;padding:5px;background:#1976d2;color:#fff;border:none;font-size:11px;cursor:pointer;';
          applyBtn.onclick = function() {
            var xml = aiPanel.__drawioXml;
            if (!xml) return;
            try {
              var graph = window.__avisioGraph;
              if (graph) {
                var sc = graph.view.scale, tr = graph.view.translate;
                var cx = graph.container.offsetWidth / 2 / sc - tr.x;
                var cy = graph.container.offsetHeight / 2 / sc - tr.y;
                var doc = mxUtils.parseXml(xml);
                var model = new mxGraphModel();
                var codec = new mxCodec(doc);
                codec.decode(doc.documentElement, model);
                graph.model.beginUpdate();
                try { graph.addCells(graph.importCells(model.getChildren(model.getChildAt(model.getRoot(), 0)), cx - 100, cy - 50)); }
                finally { graph.model.endUpdate(); }
              }
            } catch(ex) {}
          };
          previewArea.appendChild(applyBtn);
        }
      })
      .catch(function() {
        placeholder.remove();
        addMessage('⚠️ 生成失败，请确认后端服务是否运行。', false);
      })
      .finally(function() {
        sendBtn.textContent = '发送';
        sendBtn.disabled = false;
      });
    }

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
    sendBtn.addEventListener('click', sendMessage);
  }

  try { injectLogo(); } catch(ex) {}
  try { addFormulaButton(); } catch(ex) {}
  try { addNavLinks(); } catch(ex) {}
  try { injectAIPanel(); } catch(ex) {}
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      try { window.parent.postMessage(JSON.stringify({event: 'open-formula'}), '*'); }
      catch(ex) {}
    }
  });

  // Remove bottom GitHub link to jgraph/drawio
  function removeGitHubLink() {
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href && links[i].href.indexOf('github.com/jgraph/drawio') !== -1) {
        var a = links[i];
        a.style.display = 'none';
        // Also hide parent container if it wraps just the link
        var p = a.parentNode;
        if (p && p.children.length === 1 && p.className.indexOf('geTab') !== -1) {
          p.style.display = 'none';
        }
      }
    }
  }
  try { removeGitHubLink(); } catch(ex) {}
  setTimeout(function() { try { removeGitHubLink(); } catch(ex) {} }, 2000);

  // Intercept Ctrl+S to send save event to parent
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      try {
        var graph = window.__avisioGraph;
        if (graph) {
          var encoder = new mxCodec();
          var node = encoder.encode(graph.getModel());
          var xml = mxUtils.getXml(node);
          window.parent.postMessage(JSON.stringify({event: 'avisio-save', xml: xml}), '*');
        }
      } catch(ex) {}
    }
  });

  // ... rest of formula rendering code ...
  // Store rendered formula SVG data URLs by ID
  var formulaCache = {};
  var cacheId = 0;

  function initMathConfig() {
    try {
      if (window.MathJax && MathJax.config) {
        MathJax.config.svg = { font: 'tex', fontCache: 'local' };
      }
    } catch(ex) {}
  }
  initMathConfig();

  window.addEventListener('message', function(e) {
    // --- Render formula ---
    if (e.data && e.data.type === 'render-formula') {
      var latex = e.data.latex || '';
      var renderId = e.data.id;

      latex = latex.replace(/^\\\[|\\\]$/g, '').replace(/^\\\(|\\\)$/g, '').trim();
      if (!latex) return;

      var container = document.createElement('div');
      container.style.cssText = 'position:absolute;left:-9999px;top:0;width:800px;';
      container.innerHTML = '\\[' + latex + '\\]';
      document.body.appendChild(container);

      try {
        MathJax.typesetClear([container]);
        MathJax.typeset([container]);
        setTimeout(function() {
          var svg = container.querySelector('svg');
          if (svg) {
            var clone = svg.cloneNode(true);
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            var str = new XMLSerializer().serializeToString(clone);
            // Store in cache
            cacheId++;
            formulaCache[cacheId] = str;
            e.source.postMessage({ type: 'formula-preview', id: renderId, renderId: cacheId }, '*');
          } else {
            e.source.postMessage({ type: 'formula-preview', id: renderId, error: 'no svg' }, '*');
          }
          try { document.body.removeChild(container); } catch(ex) {}
        }, 300);
      } catch(ex) {
        e.source.postMessage({ type: 'formula-preview', id: renderId, error: ex.message }, '*');
        try { document.body.removeChild(container); } catch(ex) {}
      }
      return;
    }

    // --- Insert formula ---
    if (e.data && e.data.type === 'insert-formula') {
      var cachedId = e.data.renderId;
      var svgStr = formulaCache[cachedId];
      if (!svgStr) return;

      // Create blob URL for the SVG
      var blob = new Blob([svgStr], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(blob);

      var doInsert = function(graph) {
        try {
          var sc = graph.view.scale, tr = graph.view.translate;
          var cx = graph.container.offsetWidth / 2 / sc - tr.x;
          var cy = graph.container.offsetHeight / 2 / sc - tr.y;
          var cell = new mxCell('', new mxGeometry(cx - 140, cy - 50, 280, 100),
            'shape=image;imageAspect=1;image=' + url);
          cell.vertex = true;
          graph.model.beginUpdate();
          try { graph.addCell(cell); graph.setSelectionCell(cell); }
          finally { graph.model.endUpdate(); }
        } catch(ex) {}
      };

      var graph = window.__avisioGraph;
      if (graph) { doInsert(graph); return; }

      var retries = 0;
      var timer = setInterval(function() {
        retries++;
        if (window.__avisioGraph) {
          doInsert(window.__avisioGraph);
          clearInterval(timer);
        } else if (retries > 30) {
          clearInterval(timer);
        }
      }, 500);
      return;
    }
  });
})();
