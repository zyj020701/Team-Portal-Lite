\#Team Portal Lite——项目说明书（spec.d21md）

\*项目中文名\*\*:团队内部门户·简易版

\*项目英文代号\*\*:team-portal-lite\*项目定位\*\*:内部教学练习项目(非商用)，用于演练前端架构设计全流程。

一.项目目的：

我们不写具体的“公告列表”或“待办清单”功能。今天的唯一目标是:\*搭起-个能容纳后续所有功能代码的“超级大架

确保未来在这个项目上练习的同事，能清晰理解“什么代码该放什么位置”。为后续两天(Day22写组件、Day23做性能优化)准备好干净、规整的代码容器。产出一份能让\*\*AI编程助手\*精准理解的《施工蓝图与总章程》二.项目功能

界面要统一:公告卡片、待办清单、头像组件......所有零件的风格必须一致，改一个地方全界面自动同步，不能东拼西凑。数据要共享:用户登录状态、待办完成状态....·.多个页面/多个组件之间要共享同一份数据，不能各存各的导致数据不一致。代码要干净:虽然是10个人的小项目，但分层、组件化、代码规范的练习一个都不能少，为后面做大项目打底。新人要能看懂:代码结构要清晰到任何一个新来的同事，10分钟内能跑起来并找到“公告内容在哪里改”

二、项目功能

虽然只有1天，但要产出6项具体“资产”

1|\*\*需求确认单\*\*|用“4个问题”捋清这个公告板给谁用、解决什么痛点、做成啥样。

2|\*\*架构决策日志(ADR)\*\*|把"为什么选择这样分层、为什么用大仓模式”白纸黑字写下来，作为后期不扯皮的依据。，

3|\*\*超级总仓(Monorepo骨架)\*\*|建立好1个总仓库，并在里面规划出4个预留隔间(主站、通用零件、业务零件、工具箱)

4\*\*跨层交通管制规则(ESLint规则)\*\*设置好红绿灯，禁止“底层零件”直接调用"外部接口”。

5|\*\*试跑第一个"最小流程"\*\*|用一个最简单的例子(在首页显示当前时间)，把"页面业务零件工具”这4层全部串起来跑通。

6|\*\*新人30秒指南(README)\*\*|写一份超简短的入门文档，保证明天来的新同事能秒懂结构。

\##三.核心约束

这些规矩一旦打破，后期项目必然失控:

1|\*\*单向楼梯(依赖单向)\*\*|代码的依赖关系只能从上往下走。\*\*通用零件层\*\*绝对不能去引用\*\*具体业务层\*\*的东西。(就像"螺丝钉"不能去依赖"发动机"的图纸)。

2|\*\*各扫门前雪(模块独立)\*\*|业务模块之间必须互相独立。比如“公告模块”不能直接调用“待办模块”的内部数据，必须通过公共出口共享。

3|\*\*页面要薄(Page薄)\*\*|具体的页面文件(Page)只能做“组装”工作，里面不允许写超过100行的复杂业务逻辑，逻辑必须下沉到业务层处理。

\##四.技术限制

\*\*主框架\*\*|Next.js 14(带App

Router)|必须用Next.js 14的app/目录模式，不能用 pages/旧模式。这是第25天实战项目的同款框架。

|\*\*包管理工具\*\*|‘pnpm|省空间、速度快，配合 workspace 协议管理内部包。

\*\*构建加速工具\*\*|Turbo|配置任务缓存，让改过的文件才重新编译，没改的直接复用缓存。

\*\*代码检查工具\*\*|ESLint|必须强制用来执行“约束1(单向楼梯)启用import/no-restricted-paths`规则，11

|\*\*项目结构\*\*|根目录必须包含 apps/和 packages/ apps/web 放 Next.js主站，packages/放所有共享零件。\*\*编程语言\*\*TypeScript严格模式所有文件必须用.tsx'或.ts，不允许用.js。

代码风格Prettier

五、完成步骤

S1.4问开局(定需求)任务:写清1给谁用?2解决啥?3做成啥样?4怎么衡量成功?并列出3个核心用户使用场景(看公告、看任务、看寿星)。

验收:产出含3个场景的需求单.

请在项目根目录下创建

docs/requirements/目录，并在其中新建 requirements-confirmation.md。

文件内容必须包含以下4个问题，并针对本项目逐一回答:

1.给谁用?(目标用户)

2.解决啥?(核心痛点)

3.做成啥样?(核心形态/界面特征)

4.怎么衡量成功?(验收指标)

在文末另起一节"3个核心用户使用场景"，按以下格式列出3个场景:

\-场景1:看公告(用户故事+期望结果) -场景2:看任务(用户故事+期望结果 -场景3:看寿星(用户故事+期望结果)要求:语言通俗，答案不超过3句话/问题;写完后用pnpm 不需要做任何安装，仅创建Markdown文件。\*\*验收标准\*\*根目录下存在

docs/requirements/requirements- confirmation.md

\-文件包含4个问题+3个用户场景，结构完整。

\-任意一个回答缺失即视为不通过。

S2.写决策日志(ADR)

任务:创建‘docs/adr/文件夹|撰写第一篇‘ADR-001-分层架构决策.md，写明为什么选这4层，不选别的方案。

验收:ADR含背景、备选方案、最终选择、选择理由4个部分

请在项目根目录下创建docs/adr/目录，并在其中新建文件 ADR-001-layered-architecture.md。 ADR必须严格按照以下4部分结构撰写:#ADR-001:分层架构决策##1.背景(Context)说明今天要解决的问题

\##2.考虑的其它方案(Considered Alternatives)至少列出2个备选方案##3.最终选择(Decision)

明确选择"4层Monorepo分层": apps/web

packages/features-packages/ui -packages/lib

\##4.选择理由(Rationale)说明为什么选这个方案

要求:Markdown格式，不超过80行;写完后用 pnpm无需做任何安装。"\*验收标准\*\*:

\-根目录下存在 docs/adr/ADR-001-layered- architecture.md

\-文件结构严格包含"背景考虑的其它方案最终选择选择理由”4个二级标题。 -缺任意一部分即视为不通过。

S3.搭建总仓库(Monorepo骨架)

任务:创建apps/web,packages/uipackages/lib’这4个目录，分别初始化‘package.json。

验收:根目录有apps/和packages/，每个子目录都有package.json

请完成以下 Monorepo 骨架初始化工作:

1.在项目根目录创建 pnpm-workspace.yaml文件，内容声明以下4个workspace: -apps/

\-packages/ui

packages/features packages/lib

2.创建以下4个目录，并在每个目录下初始化 package.json

apps/web	(name: @team-portal-lite/web)	

packages/ui/	(name:@team-portal-lite/ui)	

packages/features/(name: @team-portal- lite/features)

packages/lib/(name:@team-portal-lite/lib)

3.每个package.json 至少包含 name 和 version 字段。

4.在根目录的 package.json 中声明 workspaces 指向这4个包。

执行完后请列出最终的目录树(用文字树状图)。\*\*验收标准\*\*

\-根目录下可见‘apps/和‘packages/的明确区分

\- packages/下至少有3个不同子文件夹(ui、 features,， lib)

pnpm-workspace.yaml文件存在且配置正确 -4个 package.json 全部创建成功

S4.贴“跨层”罚单(ESLint规则)

任务:设定 build和 lint 任务，在根目录安装ESLint，配置好禁止跨层引用的规则。

验收:故意在ui里写fetch代码跑lint必须报错，不报错算失败

请完成以下配置文件，所有操作在项目根目录进行:

1.创建turbo.json，至少包含两个任务:

\-"build": dependsOn \["^build"], outputs配置为\["dist/\*\*",".next/\*\*"]

"lint":dependsOn\["^lint"]

2.在根目录安装并配置ESLint(如果尚未安装

pnpm add -D -w eslint @typescript-

eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import

3.在根目录创建.eslintrc.cjs(注意:必须用.cjs后缀，因为package.json 是"type”:“module”)，内容至少包含:

\-parser:"@typescript-eslint/parser" -extends:\["eslint:recommended"

"plugin:@typescript-eslint/recommended"] - plugins:\["import"]

\-rules:启用以下关键规则

"import/no-restricted-paths":\["error",{"zones":

{"target":"./packages/lib", "from":\["./packages/ui","/packages/features",

apps"]，“message”:"lib是最底层，不能被上层反向引用"}，

{"target":"./packages/ui","from":

\["/packf,不能业层"，! Lapps"],"message":

{"target":"./packages/features","from":\["./apps"]，"message":"features 不能被 app 直接侵入其内部”}



加 ignorePatters 忽略 node modules、.next、 dist

4.在根目录 package.json的scripts 中确保有:"lint":"turbo run Tint

5.在 packages/lib/package.json 添加 script:"lint":"eslint src-ext.ts,.tsx'

对 packages/ui,packages/features、 apps/web同样添加lint脚本。

6.自检测试:在packages/ui/src 下随便建一个test-violation.ts文件，内容为 console.log("test"),

然后在 packages/ui/test-violation.ts 顶部加一行import{xxx}from

../../apps/web/src/something'(故意违规)在根自录执行 pnpm lint，\*必须看到 ESLint报错\*\*(包含"no-restricted-paths"字样)看到报错后，删除 test-violation.ts这个测试文件。

\*\*\*验收标准\*\*

根目录存在‘turbo.json和.eslintrc.cjs -在 packages/ui 内故意写一个跨层引用(如 import自apps/web)，执行 pnpm lint\*\*必须报错

报错后删除测试文件，再执行 pnpm lint不再报此错。

\-这正是验收标准第2条"违规拦截测试”的实现。

S5..跑通第一个小流程(第一个Feature)任务:写一个“时间格式化”工具函数|放在‘packages/lib’里;在packages/ui里写一个“显示文字”的零件;在‘apps/web 的首页调用这个零件并传递格式化后的时间。

验收:启动项目后浏览器首页能看到当前时间，证明4层全串通

请严格按以下4步，在4个包中分别写代码:

1.在packages/lib/src/下创建文件 formatTime.ts:

export function formatTime(date: Date): string{

const pad =(n: number)=> n.toString(.padStart(2,'0');

return	$\[date.getFullYear()}-	

${pad(date.getMonth()+1)}-$\[pad(date.getDate())

S{pad(date.getHours())}:${pad(date.getMinu tes())}:${pad(date.getSeconds())};

在 packages/lib/src/index.ts 中 export{formatTime} from './formatTime';

2.在packages/ui/src/下创建组件 TimeCard.tsx:

import React from 'react';

export function TimeCard({ time }:{time: string}){

return <div style={{ padding: 16, border:'1px solid #ccc', borderRadius: 8}}>

<h2>当前时间</h2>

<p style={{ fontSize: 24, fontFamily: monospace'}}>\[time}</p ></div>;

在 packages/ui/src/index.ts 中 export{TimeCard}from'./TimeCard';3.在 packages/features/src/下创建 time/feature.ts:

import{formatTime} from'@team-portal- lite/lib';

export function

getCurrentFormattedTime(): string{

retur formatTime(new Date());

&#x20;packages/features/src/index.ts 中 export\*from./time/feature':

4.在 apps/web/下配置 Next.js 14 (App Router)

创建apps/web/next.config.js apps/web/next.config.js(extends根自录tsconfig，开启 strict)

创建apps/web/app/layout.tsx(最小可用布局)

创建 apps/web/app/page.tsx:

import{TimeCard}from'@team-portal- lite/ui';

import{getCurrentFormattedTime} from@team-portal-lite/features';

export default function Home(){

return <main style={{ padding: 32 }}><h1>团队内部门户·简易版</h1><TimeCard

time=\[getCurrentFormattedTime()}/>

</main>;\*验收标准\*\*:

在 packages/lib的‘src/下能找到 formatTime.t

在 packages/ui的 src/下能找到 TimeCard.tsx

在apps/web/app/下能找到 page.tsx且代码量≤30行(满足“页面要薄

\-执行 pnpm-filter web dev 浏览器访问 http://localhost:3000，能看到"当前时间"字样+动态时间字符串

这正是验收标准第1条"新人测试"的最小可运行 Demo。

S6.写新人说明书(README)

任务:在根目录README.md中，用不超过10句话写明“怎么安装依赖”、‘怎么启动项目”、“项目结构图(用文字树状图)

验收:另一个同事拿到代码后10分钟内能跑起来看到页面

六、常见陷阱

01.目录不清，混为一谈

把所有代码全塞进一个‘src里，分不清哪些是“通用零件’，哪些是”具体业务“必须在物理层面隔开(放进 packages和 apps/不同文件夹)，不能只靠口头约定。

02.循环依赖死锁

模块A引用了模块B，模块B又引用了模块A，导致编译时死循环卡死。严格执行“只能上层引用下层”。如果发现两个模块非得互相调用，说明这部分代码应该抽到更下层的 packages/lib中

03.ESLint只装不用

安装了ESLint,但没有配置 import/no-restricted-paths 规

则，导致“跨层引用”只是口头吓唬人。

配置完规则后，必须像验收标准第2条那样，故意写个违规

代码测一下，确认它会报错才算生效。

4.ADR写成流水账

架构决策记录只写了“我们用了pnpm”，没写“为什么不

用npm/yam”ADR必须包含\*\*“背景>考虑的其它方案最终选择选择理由”\*这4部分，哪怕只写3句话都行，但结构必须全。

