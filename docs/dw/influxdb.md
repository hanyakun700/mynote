### 介绍
  开源时序型数据库，专注于海量时序数据的高性能读写、高效存储与实时分析，广泛应用于DevOps监控、IoT监控、实时分析等场景
  通过实现高度可扩展的数据接收和存储引擎，可以高效地实时收集、存储、查询、可视化显示和执行预定义操作。
#### 基础概念(与mysql比较)
##### 概念
  1. 时序数据库与普通数据库区别
    为时间创建索引列 纳秒 UTC时区 需要自己改为UTC-8
    以时间进行分块(share group)存储 方便按照时间范围查询和过期数据删除

  2. database-measurement-point
    measurement 表
      度量 因为记录的是那一时刻的数据 所以用 '度量' 更能体现其时序数据库的特点
      第一次写入自动创建 没数据自动删除  不支持update

    point = time + fields + tags 一行数据
      time   主索引 纳秒 时区 UTC
      fields 普通列 value类型支持 float integer string boolean
      tags   索引列 value只支持string

    fields和tags的字段名严格区分大小写

series=measurement +tags set+retention policy
series是measurement +tags set + retention policy 组成的数据集合。同个 database中，retention policy、measurement、tags set完全相同的数据同属于一个 series，同个series的数据在物理上会按照时间顺序排列存储在一起。series的key为measurement + 所有 tags组成的字符串。


  3. 数据类型
    float 默认
    integer i
    string ""
    boolean T TRUE

influxDB中的时间
utc时间 1970年开始 跟时区无关
precision 写入时指定时间的格式 ms ns


##### 性能
与mysql相比 读写相同数据 速度更快 但耗费的内存和cpu更高
influx是通过wal及compact将随机写改为顺序写 写入速度肯定快 但因为要周期性的刷盘和文件合并 计算耗费就多
将相关index存在内存中 读取速度也肯定块 但消耗内存更多

#### 写入和存储
__存储结构__
  TSM-tree vs  vs LSM-tree
b+tree
  写入太慢 读取很快

LSM树
  随机写变成顺序写 写入速度块 读取一般
  wal + memtable +  immutable memtable + sstable + compact
  层级合并目的 减少sstable数量 清除过期数据
  问题 0层有overlap 1层以下就没有了 涉及到comapct时 文件打开太多
TSM
  时序数据库场景：按照时间让数据过期 数据不存在overlap随时间不断生成
  lsm不满足 批量数据过期 且compat时打开文件太多 但优化写入速度是值得借鉴的

  按时间分块存储 + wal + cache + tsm file + compact
  层级合并目的:
    将write-optimized的数据存储格式优化为read-optimized的数据存储格式的过程
    压缩：冷热数据的方式不同
    索引优化: 数据合并后 查询时一个时间范围只在一个文件中
  tsm的compact将写优化数据存储格式优化成了读优化的数据存储格式 冷热采用不同压缩 及

一般时序数据库应对数据过期有两种方式 ttl vs 数据分区存
TSM的设计目标一是解决LevelDB的level compact文件句柄过多问题 二是解决BoltDB的写入性能问题




LevelCompaction: InfluxDB将TSM文件分为4个层级(Level 1-4)，compaction只会发生在同层级文件内，同层级的文件compaction后会晋升到下一层级。从这个规则看，根据时序数据的产生特性，level越高数据生成时间越旧，访问热度越低。由Cache数据初次生成的TSM文件称为Snapshot，多个Snapshot文件compaction后产生Level1的TSM文件，Level1的文件compaction后生成level2的文件，依次类推。低Level和高Level的compaction会采用不同的算法，低level文件的compaction采用低CPU消耗的做法，例如不会做解压缩和block合并，而高level文件的compaction则会做block解压缩以及block合并，以进一步提高压缩率。我理解这种设计是一种权衡，compaction通常在后台工作，为了不影响实时的数据写入，对compaction消耗的资源是有严格的控制，资源受限的情况下必然会影响compaction的速度。而level越低的数据越新，热度也越高，需要有一种更快的加速查询的compaction，所以InfluxDB在低level采用低资源消耗的compaction策略，这完全是贴合时序数据的写入和查询特性来设计的。
IndexOptimizationCompaction: 当Level4的文件积攒到一定个数后，index会变得很大，查询效率会变的比较低。影响查询效率低的因素主要在于同一个TimeSeries数据会被多个TSM文件所包含，所以查询不可避免的需要跨多个文件进行数据整合。所以IndexOptimizationCompaction的主要作用就是将同一TimeSeries下的数据合并到同一个TSM文件中，尽量减少不同TSM文件间的TimeSeries重合度。
FullCompaction: InfluxDB在判断某个Shard长时间内不会再有数据写入之后，会对数据做一次FullCompaction。FullCompaction是LevelCompaction和IndexOptimization的整合，在做完一次FullCompaction之后，这个Shard不会再做任何的compaction，除非有新的数据写入或者删除发生。这个策略是对冷数据的一个规整，主要目的在于提高压缩率。
Leveled

 Compaction

SSTable被划分到不同的level中，详细的Leveled Compaction算法描述如下：

每个SSTable文件的固定大小为160M

从ImmutableMemTable创建的SSTable文件划分到Level-0中

每个Level有SSTable文件数量的限制。在除了Level-0的任意Level中，两级Level之间的SSTable文件数量呈指数级倍数。比如：Level-1中有10个SSTable文件，Level-2有100个SSTable文件

在除了Level-0的任意Level中，SSTable文件之间所包含的key的范围不重叠。（也就是说，每个Level的所有SSTable文件，可以看做是一个大的SSTable文件）

如果Level-0中SSTable数量超过限制（比如：4），那么自动回将这4个Level-0的SSTable文件与Level-1的所有10个SSTable文件进行Compaction。（这里需要特别注意：level-0比较特殊，各个SSTable之间是有重叠的，所以只能将4个SSTable与Level1中所有进行整体上的Merge和切分（如原博客所述）。但level-1及其以上，各个SSTable之间没有重叠key，当SSTable个数超过阈值时，可以只选择一个或者多个SSTable与下一level值域对应的SSTable进行合并，由于每一级的SSTable大小相同，可以有效避免写放大）

在Compaction过程中，首先对所有的SSTable文件按key进行归并排序，然后将排序后结果写入到新的SSTable文件中，如果SSTable文件大小到了160M上限，就新生成SSTable继续写。如此类推，直到写完所有数据。

删除参与Compaction的Level-0的4个和Level-1的10个旧的SSTable文件

此时Level-0的SSTable便merge到Level-1中了，那么如果Level-1的SSTable文件数量超过上限，那么就从Level-1中选出 1 个超量的SSTable文件，然后将其与Level-2中的SSTable文件进行Compaction。

查看选出的Level-1 SSTable文件中key的范围

从Level-2中选出能覆盖该范围的所有SSTable文件

将以上的所有SSTable文件根据上面介绍的算法继续进行Compaction

注：一般情况下，Level-1和Level-2的Compaction，只会涉及Level-2内大概1/10的SSTable文件，这样可以大幅降低参与Compcation的SSTable文件数量（相比于Size-Tired Compaction），进一步提升提升性能

如果Level-2中的文件数量超过限制，则继续按照上述算法选出超量的SSTable文件与Level-3中的SSTable文件进行Compaction


LSM Tree 的读取效率并不高，当需要读取指定 key 的数据时，先在内存中的 MemTable 和 Immutable MemTable 中查找，如果没有找到，则继续从 Level 0 层开始，找不到就从更高层的 SSTable 文件中查找，如果查找失败，说明整个 LSM Tree 中都不存在这个 key 的数据。如果中间在任何一个地方找到这个 key 的数据，那么按照这个路径找到的数据都是最新的。

在每一层的 SSTable 文件的 key 值范围是不重复的，所以只需要查找其中一个 SSTable 文件即可确定指定 key 的数据是否存在于这一层中。Level 0 层比较特殊，因为数据是 Immutable MemTable 直接写入此层的，所以 Level 0 层的 SSTable 文件的 key 值范围可能存在重复，查找数据时有可能需要查找多个文件。


__关键概念__
  tsm引擎
cache、wal、tsm file、compactor
    tsm file 磁盘存储


        block存储的是某个TimeSeries的一段时间范围内的值，即某个时间段下某个measurement的某组tag set对应的某个field的所有值，Block内部会根据field的不同的值的类型采取不同的压缩策略，以达到最优的压缩效率


        0-50 引擎1 + 3.ov 记录存储引擎 及版本

        51-150  block1 0-1点  blocks 存放block 最小数据存储单元  data crc32
        151-250 block2 1-2点
        251-350 block3 2-3点
        350-400 block4 3-4点 数据还在写入

        400-410 index 0-1点在51-150 1-2点在151-250

        410-418 固定8字节  400 记录index的起始偏移量 方便将index信息加载到内存中

    wal 磁盘存储
      1.防丢掉没有写入tsm的数据 2.重启时 从此处构建cache

    cache 内存
      storemap(seriesKey+fieldName,value) 按照时间排序

      默认上限为 25MB，每当 cache 中的数据达到阀值后，会将当前的 cache 进行一次快照，之后清空当前 cache 中的内容，再创建一个新的 wal 文件用于写入，剩下的 wal 文件最后会被删除，快照中的数据会经过排序写入一个新的 tsm 文件中

    compactor 压缩过程文件 Compaction起到的作用主要在于压缩和索引优化。
      将cache落地到新的tsm文件
      合并tsm文件 使每个tsm文件都达到单个文件的最大值


retention policy 过期策略
  过期策略决定了一个share group跨时间区间
      < 2 days  1h
      >= 2 days and <= 6 months 1 day
      > 6 months  7 days
  retention policy是数据库级别的属性，也是数据结构的一部分。一个database可以有多个保留策略retention policy，但是只能有一个默认retention policy。

share group
  逻辑容器装载share，其按时间段分组，使得查询性能和批量清理数据变得简单高效
  数据写入时 先根据时间戳判断写入哪个share group 然后根据hash 选择写入哪个share

__数据写入过程__
  先写入wal 保证数据落盘后 写入cache map(series+field ， value) 顺序存储
  cache满了落盘 按照时间写入share group 按照map.key。hash写入share 因为是顺序 追加写
  定期合并tsm文件 最大为2.1G

### 下载安装
brew install influxdb
路径 /usr/local/Cellar/influxdb/2.4.0 安装完成后看readme.md 查看具体启动及写入等
启动后 通过influx config 查看本地端口 默认8086

__命令行操作数据__
写入数据
influx write --bucket gio --precision s "m v=2 $(date +%s)"
查询数据
influx query 'from(bucket:"gio") |> range(start:-1h)'

#### 配置文件
cat  /usr/local/Cellar/influxdb/2.4.0/homebrew.influxdb.service
  /usr/local/etc/influxdb2/config.yml

从配置文件可以看到文件存储位置
  engine-path: /usr/local/var/lib/influxdb2/engine

### 可视化界面中 flux操作数据
from(bucket:"example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )
  |> yield()

聚合函数
|> aggregateWindow(every: 5m, fn: mean)
|> yield(name: "mean")

### 升级和备份数据
数据库数据如何备份
  //将所有数据备份到一个目录
  influx backup /path/to/backup/dir/
  //将特定存储桶备份到目录
  influx backup --bucket example-bucket /path/to/backup/dir/

执行update命令
