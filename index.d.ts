/// <reference types="@amap/amap-jsapi-types" />
/// <reference types="@types/geojson" />

declare global {
  interface Window {
    Loca: typeof Loca;
  }

  export namespace Loca {


    /**
     * Loca 的核心控制类，可以控制光源、视角变换、图层渲染等。
     */
    export class Container {
      constructor(opts: {
        map: AMap.Map
      })
      // 已废弃，请使用 AmbientLight
      ambLight?: any;

      // 已废弃，请使用 DirectionalLight
      dirLight?: any;

      // 已废弃，请使用 PointLight
      pointLight?: any;

      // 地图的视角控制器，支持连续的视角动画过渡控制。详细说明看ViewConTrol说明。
      viewControl: ViewControl;

      // 帧控制器，控制地图渲染。和loca一起初始化，不需要使用者创建。 对于一些支持动画效果的图层（比如Scatter、PulseLine），需要使用animate启动动画。
      animate: Animate;

      /**
       * get属性，获取所有光源对象
       */
      lights(): Array<AmbientLight | DirectionalLight | PointLight>

      /**
       * 主动触发地图渲染
       */
      requestRender(): void;

      /**
       * 将一个图层添加到地图上
       * @param {Layer} layer 图层
       */
      add(layer: Layer<any>): void;

      /**
       * 将一个图层从地图上移除
       * @param {Layer} layer 图层
       */
      remove(layer: Layer<any>): void;

      /**
       * 清空所有图层，包括图层的光源
       */
      clear(): void;

      /**
       * 获取控件的 dom 容器
       */
      getControlContainer(): HTMLDivElement;

      /**
       * 添加光源
       * @param {AmbientLight | DirectionalLight | PointLight} light 光源对象
       */
      addLight(light: AmbientLight | DirectionalLight | PointLight): void;

      /**
       * 移除光源
       * @param {AmbientLight | DirectionalLight | PointLight} light 光源对象
       */
      removeLight(light: AmbientLight | DirectionalLight | PointLight): void;

      /**
       * 清空所有光源
       */
      clearLight(): void;

      /**
       * 销毁 Loca 实例，如果希望同时销毁 map，那么需要先销毁 Loca 实例，然后销毁 Map 实例。
       */
      destroy(): void;

    }

    export interface AnimateConfigItemConfig {
      // 动画终点的经纬度
      value: number | number[];
      // 过渡中的轨迹控制点
      control: number[][];
      // 动画时间控制点
      timing: number[];
      // 过渡时间，毫秒（ms）
      duration: number;
    }

    /**
     * 动画配置
     */
    export interface AnimateConfig {
      /**
       * 地图中心点动画
       */
      center?: AnimateConfigItemConfig;
      /**
       * 俯仰角动画
       */
      pitch?: AnimateConfigItemConfig;
      /**
       * 缩放等级动画
       */
      zoom?: AnimateConfigItemConfig;
      /**
       * 旋转动画
       */
      rotation?: AnimateConfigItemConfig;
    }


    /**
     * 视角控制器。不需要使用者主动创建。它的实例和 loca 一起初始化，会在 loca.viewControl 属性上挂载，如果使用的话，请直接使用 loca 实例上的 viewControl 属性。
     */
    export class ViewControl {

      /**
       * 添加自定义的镜头动画，如果传入了多个镜头动画配置，那么动画会按次序依次执行。 timing 时间字段和 control 控制点代表的贝塞尔曲线参考：https://cubic-bezier.com
       * @param {AnimateConfig} configs 动画配置数组，动画会依次执行。支持地图中心点、俯仰角、旋转角、地图缩放等级四个状态的动画控制。
       * @param finised 所有动画结束的回调函数。
       * @example
       */
      addAnimates(configs: Array<AnimateConfig>, finised?: () => void);

      /**
       * 添加一个镜头轨迹动画，镜头会按照指定的路径进行追踪
       * @param config 轨迹配置
       * @param callback 动画完成的回调函数
       */
      addTrackAnimate(config: {
        // 完成时间，毫秒
        duration: number,
        // 动画速度控制器，使用贝塞尔曲线控制 [详细请看](https://cubic-bezier.com)
        timing: number[][],
        // 路径
        path: AMap.LngLatLike[],
        // 在拐弯处每秒旋转多少度
        rotationSpeed: number,
      }, callback?: () => void);

      /**
       * 清除所有动画
       */
      clearAnimates(): void;

      /**
       * 暂停所有动画
       */
      pauseAnimate(): void;

      /**
       * 恢复暂停的动画，当调用过 pauseAnimate() 方法暂停动画播放之后，用此方法来恢复动画的继续播放。
       */
      resumeAnimate(): void;

    }

    export class Animate {
      constructor();
      // 启动帧
      start(): void;
      // 暂停帧
      pause(): void;
      // 停止帧
      stop(): void;
    }

    /**
     * 环境光，对于可以接受光照的图层（PolygonLayer 等）会增加环境光的影响。环境光只能有一个，多余的会被忽略。
     */
    export class AmbientLight{

      /**
       * @param opts 参数
       * @param {string} opts.color 环境光颜色
       * @param {number} opts.intensity 环境光强度
       * @param loca 可选，如果传入将自动添加光源到loca
       */
      constructor(opts: {
        color?: string,
        intensity?: number
      }, loca?: Container)
    }

    /**
     * 平行光，对于可以接受光照的图层（PolygonLayer 等）会增加平行光的影响。平行光一般用来模拟太阳的光照。
     * 它的方向由 position 射向 target。position和target的坐标是一个位置加 z 值（单位米）高度决定。比如: [1, 1, 1000] 代表x:1, y:1, 高度1000米。
     * 如果模拟一个从正南方向的平行光，可以设置target: [0,0,0], position: [0,-1,0]
     */
    export class DirectionalLight{

      /**
       *
       * @param opts
       * @param {string} opts.color 平行光颜色
       * @param {number} opts.intensity 光照强度
       * @param {number[]} opts.position 坐标位置
       * @param {number[]} opts.target 光射向的目标位置
       * @param loca 可选，如果传入将自动添加光源到loca
       */
      constructor(opts: {
        color?: string,
        intensity?: number,
        position?: number[],
        target?: number[]
      }, loca?: Container)
    }

    /**
     * 平行光，对于可以接受光照的图层（PolygonLayer 等）会增加平行光的影响。平行光一般用来模拟太阳的光照。
     * 它的方向由 position 射向 target。position和target的坐标是一个位置加 z 值（单位米）高度决定。比如: [1, 1, 1000] 代表x:1, y:1, 高度1000米。
     * 如果模拟一个从正南方向的平行光，可以设置target: [0,0,0], position: [0,-1,0]
     */
    export class PointLight{

      /**
       *
       * @param opts
       * @param {string} opts.color 点光颜色
       * @param {number} opts.intensity 光照强度
       * @param {number[]} opts.position 点光的位置
       * @param {number[]} opts.distance 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
       * @param loca 可选，如果传入将自动添加光源到loca
       */
      constructor(opts: {
        color?: string,
        intensity?: number,
        position?: number[],
        distance?: number
      }, loca?: Container)
    }

    /**
     * geojson 格式的数据源，一个数据源可以给多个图层同时提供数据。一个geojson数据源可以同时拥有点、线、面的数据类型，每个图层绘制的时候会自动获取 合适的数据类型进行渲染。 关于 geojson 格式的数据说明可以访问：https://geojson.org/ 查看。
     */
    export class GeoJSONSource {
      /**
       * 参数
       * @param opts 参数
       * @param {GeoJSON.FeatureCollection} opts.data 数据对象。如果你不想使用 url 方式请求数据，可以直接填写请求好的 geojson 对象。
       * @param {string} opts.url 数据源的链接地址，一般是接口地址，返回的数据必须是 geojson 格式。
       */
      constructor(opts: {
        data?: GeoJSON.FeatureCollection,
        url?: string
      })

      /**
       * 销毁数据源对象
       */
      destroy(): void;
    }

    /**
     * protocol-buffers(PBF) 格式的数据源，能够大幅压缩数据体积，有效减少数据传输时间。
     *
     * 目前仅支持基于 mapbox/geobuf 的 GeoJSON PBF 实现。
     */
    export class GeoBufferSource {

      /**
       * 参数
       * @param opts 参数
       * @param {ArrayBuffer} opts.data 数据对象。如果你不想使用 url 方式请求数据，可以直接填写请求好的 ArrayBuffer 数据。
       * @param {string} opts.url 数据源的链接地址，一般是接口地址，返回的数据必须是 PBF 格式。
       */
      constructor(opts: {
        data?: ArrayBuffer,
        url?: string
      })

      /**
       * 销毁数据源对象
       */
      destroy(): void;

    }

    export interface LegendStyleOptions {
      // 图例的标题和样式
      title?: {
        // 标题名
        label?: string;
        // 标题文字大小
        fontSize?: string;
        // 标题文字颜色
        fontColor: string;
        // 标题文字粗细"
        fontWeight: string;
        // 标题内填充
        padding: string;
        // 标题外边距
        margin: number;
      };
      // 图例的样式
      style?: {
        // 图例的背景颜色
        backgroundColor?: string;
        // 图例的文字大小
        fontSize?: string;
        // 图例的文字颜色
        fontColor?: string;
        // 图例的背板边角圆弧半径
        borderRadius?: string;
        // 图例的相对定位
        position?: string;
        // 图例的顶部定位
        top?: string;
        // 图例的底部定位
        bottom?: string;
        // 图例的左边定位
        left?: string;
        // 图例的右边定位
        right?: string;
        // 图例的内填充
        padding: string;
      };
    }

    export interface LegendOptions extends LegendStyleOptions{
      // 有此参数, 默认会把图例添加到loca上
      loca?: Container;
      // 图例的值和颜色信息，label 代表显示的文本，color 代表色块图例。
      dataMap: {
        label: string;
        color: string;
      }[]
    }

    /**
     * 基础图例，可以表达颜色和数值或者种类的映射关系。
     */
    export class Legend {

      /**
       * 参数
       * @param {LegendOptions} opts 参数
       */
      constructor(opts: LegendOptions);

      /**
       * 设置图例样式
       * @param userStyle
       */
      setStyle(userStyle: LegendStyleOptions): void;

      /**
       * 将图例添加到地图上
       * @param loca
       */
      addTo(loca: Container | null): void

      /**
       * 将图例从地图上移除
       */
      remove(): void;
    }

    /**
     * 默认的图层参数
     */
    export interface LayerOptions {
      // 默认会添加到地图上
      loca?: Container;
      // 图层显示层级
      zIndex?: number;
      // 图层是否可见
      visible?: boolean;
      // 图层缩放等级范围
      zooms?: [number, number];
      // 图层整体透明度
      opacity?: number;
    }

    /**
     * 图层动画的配置
     */
    export interface LayerAnimateConfig {
      // 动画的属性 key
      key: string;
      // 动画的过渡值，范围是[0~1]之间，1 代表真实设定的值
      value: number[];
      // 动画时长，单位毫秒
      duration: number;
      // 动画过渡函数，详情请看： https://redmed.github.io/chito/example/easing.html
      easing: string;
      // 一个动画 duration 中，从哪个时间开始动画
      startAt: number;
      // 是否开启来回摆动
      yoyo: boolean;
      // 是否开启随机执行动画，如果开启，图层中每个要素的动画开始的时间将随机延时，适合每个数据不同时间出现的效果
      random: boolean;
      // 随机动画延迟的时间段，每个要素的随机延迟将会在 delay 时间段内取值，单位毫秒，random为 true 时生效
      delay?: number;
      // 随机动画的动画执行时间，单位毫秒，random为 true 时生效
      transform?: number;
    }

    /**
     * 基础图层类，是一个抽象类，是其他图层的基础。有通用的方法和参数。
     */
    abstract class Layer<T> {

      protected constructor(opts: LayerOptions)

      /**
       * 将图层添加到地图上，如果使用 setLoca(null)，将会从地图上移除图层。
       * @param loca loca对象
       */
      setLoca(loca: Container | null): void;

      /**
       * 设置图层的 opacity 透明度，将会影响整个图层的透明度信息。
       * @param opacity 透明度
       */
      setOpacity(opacity: number): void;

      /**
       * 设置图层的 zIndex 渲染循序，有的图层如果主动开启了深度检测：depth: true，那么深度可能将会影响显示顺序。
       * @param zIndex 图层层级
       */
      setzIndex(zIndex: number): void;

      /**
       * 设置图层的 zooms，图层将在 zooms 范围内渲染。
       * @param zooms 图层显示的级别
       */
      setZooms(zooms: [number, number]): void;

      /**
       * 设置图层的 visible 为 true，图层可见。
       * @param duration 淡入效果，单位毫秒。图层将会按照设置的时间将透明度从 0 过渡到 opacity 设置的值。
       * @param callback 完全显示之后执行的回调函数
       */
      show(duration?: number, callback?: () => void): void;

      /**
       * 设置图层的 visible 为 false，图层不可见。
       * @param duration 淡出效果，单位毫秒。图层将会按照设置的时间将透明度从 opacity 的值过渡到 0，最后 visible: false，隐藏图层。
       * @param callback 完全隐藏之后执行的回调函数
       */
      hide(duration?: number, callback?: () => void): void;

      /**
       * 从地图上移除图层
       */
      remove(): void;

      /**
       * 销毁图层，此操作会先调用 remove 从地图上移除，然后释放内存资源。
       */
      destroy(): void;

      /**
       * 根据地图像素点，获取图层的渲染要素。如果查询为空，将返回 undefined
       * @param position 像素点位置，一般来说是鼠标相对地图容器的像素位置 [x, y]。
       */
      queryFeature(position: [number, number]): GeoJSON.Feature | undefined;

      /**
       * 设置图层支持的动画属性。
       * 比如面图层支持高度和海拔（height、altitude）生长动画、圆点和图标图层支持半径（radius）动画、热力图支持半径和高度（radius、height）动画。 具体每个图层支持的动画属性请查阅每个图层对应的样式文档。
       * 动画曲线详细：https://redmed.github.io/chito/example/easing.html
       * @param config 动画的配置
       * @param callback 动画结束的回调函数
       */
      addAnimate(config: LayerAnimateConfig, callback?: () => void);

      /**
       * 给图层设置数据源，支持 geojson 和 geobuffer 两种类型的数据源
       * @param source 给图层设置的数据源，需要预先创建数据源实例
       */
      setSource(source: GeoJSONSource | GeoBufferSource): void;

      /**
       * 更新图层样式，如果有的字段被缺省，那么它的值将会被重置为默认值。
       * @param style
       */
      setStyle(style: T): void;

      /**
       * 设置图层的渲染中心点，当loca与AMap.GlCustomLayer 同时使用时需要调用该方法重置loca的中心点，避免渲染时丢失显示
       * @param center
       */
      setCustomCenter(center: [number, number]);

    }

    export interface PointLayerOptions extends LayerOptions {
      // 图层里面元素的叠加效果，normal：正常透明度叠加，lighter：叠加后可能更加明亮
      blend?: string;
    }
    
    type StyleCallback<T> = (index: number,feature: GeoJSON.Feature) => T;

    export type StyleCallbackType<T> = T | StyleCallback<T>;

    export type StyleUnitType = 'px' | 'meter';

    /**
     * 圆点图层样式
     */
    export interface PointLayerStyle {
      // 半径（默认单位: px）。支持动画过渡效果。
      radius?: StyleCallbackType<number>;
      // 填充色，支持回调设置不同的颜色（Hex颜色）
      color?: StyleCallbackType<string>;
      // 点的单位，会影响半径和边宽度。可选值：px：像素，meter：地理单位米
      unit?: StyleUnitType;
      // 边框宽度（默认单位:px）
      borderWidth?: StyleCallbackType<number>;
      // 边框填充色，支持回调设置不同的颜色
      borderColor?: StyleCallbackType<string>;
      // 模糊半径，从哪个位置开始向边缘模糊。负数代表不进行模糊。
      blurWidth?: StyleCallbackType<number>;
    }

    /**
     * 圆点图层，拥有描边的原点，可以支持边缘模糊特效。 支持对每个圆点的半径、颜色、描边信息单独设置。
     */
    export class PointLayer extends Layer<PointLayerStyle> {
      constructor(opts: PointLayerOptions)
    }

    export interface IconLayerOptions extends LayerOptions{

    }

    /**
     * 图标图层样式
     */
    export interface IconLayerStyle {
      // 图标资源,接受三种值（Svg,Image,Url），可通过回调函数对每个点进行设置
      icon?: StyleCallbackType<string>;
      // iconSize 的单位，可以是 'px' 和 'meter'，meter 是实际地理的米，px 是屏幕像素。
      unit?: StyleUnitType;
      // 图标大小，影响宽高。支持动画过渡效果，动画 key 字段名称为 iconSize。
      iconSize?: StyleCallbackType<[number, number]>;
      // 图标的旋转角度，可以通过回调为每个点设置不同的旋转角（单位:角度）
      rotation?: StyleCallbackType<number>;
      // 透明度,支持通过回调函数为每个点设置不同的透明度
      opacity?: StyleCallbackType<number>;
      // 图标偏移的位置大小。右上方为正方向。单位取决于 unit 的值。
      offset?: StyleCallbackType<[number, number]>;
    }

    /**
     * 图标图层
     */
    export class IconLayer extends Layer<IconLayerStyle> {
      constructor(opts: IconLayerOptions)
    }

    /**
     * 标注图层参数
     */
    export interface LabelsLayerOptions extends LayerOptions {
      // 标注是否避让
      collision?: boolean;
      // 标注是否允许其它标注层对它避让
      allowCollision?: boolean;
    }

    interface LabelsLayerIcon {

    }

    /**
     * 标注图层样式
     */
    export interface LabelsLayerStyle {
      // 图标资源,接受三种值（Svg,Image,Url），可通过回调函数对每个点进行设置
      icon?: StyleCallbackType<string>;
      // iconSize 的单位，可以是 'px' 和 'meter'，meter 是实际地理的米，px 是屏幕像素。
      unit?: StyleUnitType;
      // 图标大小，影响宽高。支持动画过渡效果，动画 key 字段名称为 iconSize。
      iconSize?: StyleCallbackType<[number, number]>;
      // 图标的旋转角度，可以通过回调为每个点设置不同的旋转角（单位:角度）
      rotation?: StyleCallbackType<number>;
      // 透明度,支持通过回调函数为每个点设置不同的透明度
      opacity?: StyleCallbackType<number>;
      // 图标偏移的位置大小。右上方为正方向。单位取决于 unit 的值。
      offset?: StyleCallbackType<[number, number]>;
    }

    /**
     * 标注图层，使用Loca数据源渲染JSAPI的标注图层（AMap.LabelsLayer）
     */
    export class LabelsLayer extends Layer<LabelsLayerStyle> {
      constructor(opts: LabelsLayerOptions);

      /**
       * 获取标注层是否支持内部标注避让
       */
      getCollision(): boolean;

      /**
       * 设置标注层是否支持内部标注避让
       * @param {boolean} collision
       */
      setCollision(collision: boolean): void;

      /**
       * 获取标注层是否允许其它层标注避让
       */
      getAllowCollision(): boolean;

      /**
       * 设置标注层是否允许其它层标注避让，开启该功能可实现地图标注对 LabelMarker 的避让
       * @param {boolean} allowCollision
       */
      setAllowCollision(allowCollision: boolean): void
    }

    /**
     * 棱柱图层参数
     */
    export interface PrismLayerOptions extends LayerOptions {
      // 剔除背面/前面的面（选择剔除将会提升性能），可选：back/front/none，back是剔除背面的面，front是剔除前面的面，none是不进行剔除。
      cullface?: 'back' | 'front' | 'none';
      // 面是否接受光照，光照信息在 loca 对象中配置
      acceptLight?: boolean;
      // 立体网格的粗糙度，值越高，说明表面越粗糙。
      shininess?: boolean;
      // 当面有厚度的时候，有没有侧面和底面
      hasSide?: boolean;
      // 是否开启深度检测，开启后可能会影响zIndex
      depth?: boolean;
      // 文字标注图层配置，配置同 AMap.LabelsLayer
      labelsLayerOptions?: AMap.LabelsLayerOptions
    }

    /**
     * 棱柱图层样式
     */
    export interface PrismLayerStyle {
      // 半径（默认单位: px）。支持动画过渡效果。
      radius?: StyleCallbackType<number>;
      // 图层的单位。可选值：px：像素，meter：地理单位米
      unit?: StyleUnitType;
      // 棱柱的边数，默认是 3，如果希望做成圆柱体效果，可以尝试此字段设置一个较大的值，例如：32。
      sideNumber?: number;
      // 每个棱柱的旋转角度，取值范围 0 ~ 360；可以支持动画效果。
      rotation?: StyleCallbackType<number>;
      // 海拔高度，代表棱柱的离地高度。单位是 unit 的值。支持动画过渡效果。
      altitude?:  number;
      // 棱柱的高度。单位是 unit 的值。支持动画过渡效果。
      height?: StyleCallbackType<number>;
      // 棱柱的顶面颜色值。
      topColor?: StyleCallbackType<string>;
      // 棱柱的侧面顶部颜色值。
      sideTopColor?: StyleCallbackType<string>;
      // 棱柱的侧面底部颜色值。
      sideBottomColor?: StyleCallbackType<string>;
      // 棱柱中心位置的文字标注，配置同 AMap.LabelMarker
      label?: StyleCallbackType<AMap.LabelMarkerOptions>;
      // 文字标注相对于顶面的海拔高度。单位是 unit 的值。
      labelAltitude?: StyleCallbackType<number>;
    }

    /**
     * 棱柱图层，使用点类型数据表达带有高度的立体棱柱，使用高度、颜色、半径等样式表达点数据的不同维度属性信息。支持动画、光照效果。
     */
    export class PrismLayer extends Layer<PrismLayerStyle> {
      constructor(opts: PrismLayerOptions);
    }

    /**
     * 垂直于大地表面的 Marker 图层 参数
     */
    export interface ZMarkerLayerOptions extends LayerOptions {
    }

    /**
     * 垂直于大地表面的 Marker 图层 样式
     */
    export interface ZMarkerLayerStyle {
      // size 的单位，可以是 'px' 和 'meter'，meter 是实际地理的米，px 是屏幕像素
      unit?: StyleUnitType;
      // Marker 的内容，是一个 HTML 的片段字符串，可以通过 dom 的 style 设置 dom 样式， 并且支持 img 等各种类型的 dom，可通过回调函数对每个点进行设置。目前此类型尚不支持 IE 浏览器。
      content?: StyleCallbackType<string>;
      // Marker 大小，影响宽高。
      size?: StyleCallbackType<[number, number]>;
      // Marker 的旋转角度，以正北方向为起点，顺时的针角度。可以通过回调为每个点设置不同的旋转角（单位:角度）
      rotation?: StyleCallbackType<number>;
      // 是否让每个 Marker 总是朝向视角方向。
      alwaysFront?: boolean;
      // 每个 Marker 的海拔高度，单位是米，可以通过函数回调对每个 Marker 设置不同的海拔。当然，如果你的坐标数据中有第三维度的海拔值秒啊么他将会自动获取坐标中的值。
      altitude?: StyleCallbackType<number>;
    }

    /**
     * 垂直于大地表面的 Marker 图层，支持传入自定义 DOM 进行绘制。你可以使用它展示一些 和数据相关的文字、图片信息，而且它还支持永远朝向屏幕的特性，非常适合对文字类信息的展示。
     */
    export class ZMarkerLayer extends Layer<ZMarkerLayerStyle> {
      constructor(opts: ZMarkerLayerOptions);
    }

    export interface LineLayerOptions extends LayerOptions {}

    export interface LineLayerStyle {
      // 线的颜色
      color?: StyleCallbackType<string>;
      // 线的宽度
      lineWidth?: StyleCallbackType<number>;
      // 线的描边颜色
      borderColor?: StyleCallbackType<string>;
      // 线的描边宽度
      borderWidth?: StyleCallbackType<number>;
      // 线的虚线配置信息：[实线长度, 虚线长度, 实线长度, 虚线长度];
      dash?: StyleCallbackType<[number, number, number, number]>;
      // 海拔高度，优先级低于数据中的高度信息。单位：米
      altitude?: StyleCallbackType<number>;
    }

    /**
     * 线图层，支持设置描边和虚线。
     */
    export class LineLayer extends Layer<LineLayerStyle> {
      constructor(opts: LineLayerOptions);
    }

    export interface LinkLayerOptions extends LayerOptions {}

    /**
     * 链接线图层样式
     */
    export interface LinkLayerStyle {
      // 线的颜色
      lineColors?: StyleCallbackType<string[]>;
      // 高度，单位为米，代表弧顶的最高高度。 类型为Function时，返回每根线的高度。参数为(index,item)，item中有distance属性，代表两点间的距离（米），可以用该属性处理高度。
      height?: StyleCallbackType<number>;
      // 平滑步数，代表弧线的分隔段数，越大平滑度越好，默认为100。
      smoothSteps?: StyleCallbackType<number>;
    }

    /**
     * 链接线图层
     */
    export class LinkLayer extends Layer<LinkLayerStyle> {
      constructor(opts: LinkLayerOptions);
    }

    /**
     * 面图层参数
     */
    export interface PolygonLayerOptions extends LayerOptions{
      // 剔除背面/前面的面（选择剔除将会提升性能），可选：back/front/none，back是剔除背面的面，front是剔除前面的面，none是不进行剔除。
      cullface?: 'back' | 'front' | 'none';
      // 面是否接受光照，光照信息在 loca 对象中配置
      acceptLight?: boolean;
      // 立体网格的粗糙度，值越高，说明表面越粗糙。
      shininess?: boolean;
      // 当面有厚度的时候，有没有侧面和底面
      hasSide?: boolean;
      // 是否开启深度检测，开启后可能会影响zIndex
      depth?: boolean;
      // 是否开启被遮挡的面隐藏，默认开启，如果关闭，在有透明度的时候，会显示出被遮挡的面。
      blockHide?: boolean;
      // 文字标注图层配置，配置同 AMap.LabelsLayer
      labelsLayerOptions?: AMap.LabelsLayerOptions
    }

    /**
     * 面图层样式
     */
    export interface PolygonLayerStyle {
      // 面的顶面颜色。
      topColor?: StyleCallbackType<string>;
      // 面的侧面颜色（已废弃）
      sideColor?: StyleCallbackType<string>;
      // 面的侧面顶部的颜色。
      sideTopColor?: StyleCallbackType<string>;
      // 面的侧面底部的颜色。
      sideBottomColor?: StyleCallbackType<string>;
      // 面的底部的颜色
      bottomColor?: StyleCallbackType<string>;
      // 海拔高度，也就是面的底面的高度。单位：米。支持动画过渡效果。
      altitude?:  StyleCallbackType<number>;
      // 面的厚度。单位：米。支持动画过渡效果。
      height?: StyleCallbackType<number>;
      // 带有高度的时候，侧面的贴图纹理，目前仅支持侧面。如果需要纹理在侧面重复贴图，需要图片的宽高是 2 的 n 次方像素值。比如：256x256，64x1024
      texture?: HTMLCanvasElement | URL | HTMLImageElement | string;
      // 一个纹理图片覆盖的大小，[宽度, 高度]，单位是米，默认是宽 20 米，高 3 米贴一张纹理，会重复贴图。
      textureSize?: StyleCallbackType<[number, number]>;
      // 面中心位置的文字标注，配置同 AMap.LabelMarker
      label?: StyleCallbackType<AMap.LabelMarkerOptions>;
      // 文字标注相对于顶面的海拔高度。单位是 unit 的值。
      labelAltitude?: StyleCallbackType<number>;
    }

    /**
     * 面图层，支持多边形、复杂多边形、带洞多边形的绘制。支持底面海拔高度和面的厚度效果。 并且还支持对每个多边形设置不同的个性化样式，而且性能依然很好。
     * 我们还对重复设置图层样式进行了性能优化，保证在某些频繁切换面样式的情况下依然流畅。
     * 当你的希望你的面有透明度效果，并且面和面直接有高度的压盖关系时，我们对渲染效果进行了优化。 能让你看到清晰的透明面！
     * 注意：在侧面进行贴图的时候，如果你希望图片在侧面进行重复贴图，那么必须要求贴图纹理的宽高大小一定是 2 的 n 次方。 例如：256x512、1024x1024 等
     */
    export class PolygonLayer extends Layer<PolygonLayerStyle> {
      constructor(opts: PolygonLayerOptions);

      /**
       * 获取图层标注的AMap.LabelsLayer
       */
      getLabelsLayer(): AMap.LabelsLayer;
    }

    export interface HeatMapLayerOptions extends LayerOptions{

    }

    export interface HeatMapLayerStyle {
      // 热力的聚合半径，支持每个点的半径单独设置，单位取决于 unit 字段。支持动画过渡效果。
      radius?: StyleCallbackType<number>;
      // 每个热力点的值，会影响最终的聚合结果，值越高代表越热。
      value?: StyleCallbackType<number>;
      // 热力的颜色梯度，值是对象映射的形式。
      gradient?: Record<number, string>;
      // 热力颜色的透明度区间，热力颜色的透明度过渡将在此区间取值，可以用来调节热力图的透明度效果。
      opacity?: [number, number];
      // 热力最高点的高度值，单位取决于 unit 字段。支持动画过渡效果。
      height?: number;
      // 热力的最低点到最高点的变化曲线。
      heightBezier?: number[];
      // 热力值的最大值，默认为数据中的最高值，也可以自定义设置，会控制热力的最热区域的显示效果。
      max?: number;
      // 热力值的最小值，默认为数据中的最小值，也可以自定义设置，会控制热力的最冷区域的显示效果。
      min?: number;
      // 热力的单位，可选值是 px 和 meter。meter 代表地理真实的距离。
      unit?: StyleUnitType;
      // 热力图默认的过渡效果，颜色默认会渐变过渡，如果开启 difference，将会有明显的边缘效果。
      difference?: boolean;
    }

    /**
     * 热力图，支持 3D 和不同颜色设置的聚合点数据显示。并且支持像素单位和米单位的热力聚合。 针对部分业务场景，还能够支持颜色边缘的模糊过渡和硬过渡效果。详细查看 difference 属性。
     */
    export class HeatMapLayer extends Layer<HeatMapLayerStyle> {
      constructor(opts: HeatMapLayerOptions);
    }

    export interface HexagonLayerOptions extends LayerOptions {
      // 剔除背面/前面的面（选择剔除将会提升性能），可选：back/front/none，back是剔除背面的面，front是剔除前面的面，none是不进行剔除。
      cullface?: 'back' | 'front' | 'none';
      // 面是否接受光照，光照信息在 loca 对象中配置
      acceptLight?: boolean;
      // 立体网格的粗糙度，值越高，说明表面越粗糙。
      shininess?: boolean;
      // 当面有厚度的时候，有没有侧面和底面
      hasSide?: boolean;
      // 是否开启深度检测，开启后可能会影响zIndex
      depth?: boolean;
      // 是否开启被遮挡的面隐藏，默认开启，如果关闭，在有透明度的时候，会显示出被遮挡的面。
      blockHide?: boolean;
      // 文字标注图层配置，配置同 AMap.LabelsLayer
      labelsLayerOptions?: AMap.LabelsLayerOptions
    }

    export interface HexagonLayerStyle {
      value?: (index: number, feature: GeoJSON.Feature) => number;
      // 顶面颜色。
      topColor?: StyleCallbackType<string>;
      // 侧面颜色（ v2.1.0 已废弃）
      sideColor?: StyleCallbackType<string>;
      // 面的侧面顶部的颜色。
      sideTopColor?: StyleCallbackType<string>;
      // 面的侧面底部的颜色。
      sideBottomColor?: StyleCallbackType<string>;
      // 海拔高度，也就是立面的底面的高度。单位：米。支持动画过渡效果
      altitude?:  StyleCallbackType<number>;
      // 网格高度，也就是立面的顶面的高度。单位：米。支持动画过渡效果
      height?: StyleCallbackType<number>;
      // 一个网格的半径大小，只能是一个常量值。单位由 unit 决定。
      radius?: StyleCallbackType<number>;
      // 相邻网格的间隙大小，只能是一个常量值。单位由 unit 决定。
      gap?: number;
      // 单位，只能是一个常量值。可选项: px, meter。一个是屏幕像素单位，一个是地理单位。地理单位性能更加优异。
      unit?: StyleUnitType;
      // 网格中心位置的文字标注，配置同 AMap.LabelMarker
      label?: StyleCallbackType<AMap.LabelMarkerOptions>;
      // 文字标注相对于顶面的海拔高度。单位是 unit 的值。
      labelAltitude?: StyleCallbackType<number>;
    }

    /**
     * 蜂窝网格图，将普通的点数据按照蜂窝网格划分成若干区域，每个蜂窝网格区域都会包含落在此区域内的点数据信息。
     * 每个蜂窝网格格子支持单独设置自定义的高度信息、颜色信息。
     * 要注意的是：我们认为所有蜂窝网格格子必须是唯一的大小（radius）和间隙（gap）。
     * 我们还在带有高度的蜂窝网格中加入了可接受光照信息的属性：acceptLight。假如设置了光照并在图层中开启接受光照， 那么每个立体蜂窝网格将会有光照反射的效果。
     */
    export class HexagonLayer extends Layer<HexagonLayerStyle> {
      constructor(opts: HexagonLayerOptions);

      /**
       * 获取图层标注的AMap.LabelsLayer
       */
      getLabelsLayer(): AMap.LabelsLayer;
    }

    /**
     * 网格图参数
     */
    export interface GridLayerOptions extends LayerOptions {
      // 剔除背面/前面的面（选择剔除将会提升性能），可选：back/front/none，back是剔除背面的面，front是剔除前面的面，none是不进行剔除。
      cullface?: 'back' | 'front' | 'none';
      // 面是否接受光照，光照信息在 loca 对象中配置
      acceptLight?: boolean;
      // 立体网格的粗糙度，值越高，说明表面越粗糙。
      shininess?: boolean;
      // 当面有厚度的时候，有没有侧面和底面
      hasSide?: boolean;
      // 是否开启深度检测，开启后可能会影响zIndex
      depth?: boolean;
      // 是否开启被遮挡的面隐藏，默认开启，如果关闭，在有透明度的时候，会显示出被遮挡的面。
      blockHide?: boolean;
      // 文字标注图层配置，配置同 AMap.LabelsLayer
      labelsLayerOptions?: AMap.LabelsLayerOptions
    }

    /**
     * 网格图样式
     */
    export interface GridLayerStyle {
      value?: (index: number, feature: GeoJSON.Feature) => number;
      // 顶面颜色。
      topColor?: StyleCallbackType<string>;
      // 侧面颜色（ v2.1.0 已废弃）
      sideColor?: StyleCallbackType<string>;
      // 面的侧面顶部的颜色。
      sideTopColor?: StyleCallbackType<string>;
      // 面的侧面底部的颜色。
      sideBottomColor?: StyleCallbackType<string>;
      // 海拔高度，也就是立面的底面的高度。单位：米。支持动画过渡效果
      altitude?:  StyleCallbackType<number>;
      // 网格高度，也就是立面的顶面的高度。单位：米。支持动画过渡效果
      height?: StyleCallbackType<number>;
      // 一个网格的半径大小，只能是一个常量值。单位由 unit 决定。
      radius?: StyleCallbackType<number>;
      // 相邻网格的间隙大小，只能是一个常量值。单位由 unit 决定。
      gap?: number;
      // 单位，只能是一个常量值。可选项: px, meter。一个是屏幕像素单位，一个是地理单位。地理单位性能更加优异。
      unit?: StyleUnitType;
      // 网格中心位置的文字标注，配置同 AMap.LabelMarker
      label?: StyleCallbackType<AMap.LabelMarkerOptions>;
      // 文字标注相对于顶面的海拔高度。单位是 unit 的值。
      labelAltitude?: StyleCallbackType<number>;
    }

    /**
     * 网格图，将普通的点数据按照网格划分成若干区域，每个网格区域都会包含落在此区域内的点数据信息。
     * 每个网格格子支持单独设置自定义的高度信息、颜色信息。 要注意的是：我们认为所有网格格子必须是唯一的大小（radius）和间隙（gap）。
     * 我们还在带有高度的网格中加入了可接受光照信息的属性：acceptLight。假如设置了光照并在图层中开启接受光照， 那么每个立体网格将会有光照反射的效果。
     */
    export class GridLayer extends Layer<GridLayerStyle> {
      constructor(opts: GridLayerOptions);

      /**
       * 获取图层标注的AMap.LabelsLayer
       */
      getLabelsLayer(): AMap.LabelsLayer;

    }

    /**
     * 大地面上的点参数
     */
    export interface ScatterLayerOptions extends LayerOptions {

    }

    /**
     * 大地面上的点 样式
     */
    export interface ScatterLayerStyle {
      // 图标长宽，单位取决于 unit 字段。
      size?: StyleCallbackType<[number, number]>;
      // 图标的旋转角度，以正北方向为起点，沿顺时针方向旋转。
      rotation?: StyleCallbackType<number>;
      // 没有纹理的情况下，圆片的填充颜色。
      color?: StyleCallbackType<string>;
      // 图标的海拔高度。单位：米。
      altitude?: StyleCallbackType<number>;
      // 描边宽度，单位和 size 保持一致。
      borderWidth?: StyleCallbackType<number>;
      // 没有纹理的情况下，圆片的描边颜色。
      borderColor?: StyleCallbackType<string>;
      // 图标纹理资源，如果需要有动态效果，请使用帧序列图片资源：url，并且为了效果更好，我们建议使用宽高: 4096x128 像素的图片。⚠: 帧序列图片是头尾相连可以循环的图片。
      texture?: HTMLCanvasElement | URL | string;
      // size 和 borderWidth 的单位，可以是 'px' 和 'meter'，meter 是实际地理的米，px 是屏幕像素。
      unit?: StyleUnitType;
      // 是否有动画，动画开启需要使用序列帧的纹理，否则没有动画效果。
      animate?: boolean;
      // 一轮动画的时长，单位毫秒(ms)。需要开启 animate 才能使用。
      duration?: number;
    }

    /**
     * 大地面上的点，可展示三种类型：颜色圆、图标、动画图标
     */
    export class ScatterLayer extends Layer<ScatterLayerStyle> {
      constructor(opts: ScatterLayerOptions);
    }

    /**
     * 轨迹线图层参数
     */
    export interface PulseLineLayerOptions extends LayerOptions {

    }

    /**
     * 轨迹线图层样式
     */
    export interface PulseLineLayerStyle {
      // 脉冲线的宽度
      lineWidth?: StyleCallbackType<number>;
      // 脉冲头部颜色，每段脉冲的颜色由头部到尾部渐变
      headColor?: StyleCallbackType<string>;
      // 脉冲尾部颜色
      trailColor?: StyleCallbackType<string>;
      // 线整体海拔高度
      altitude?: number;
      // 每段脉冲占整条路径长度的比例，例如interval = 0.25, 则表示每条路径上同时有4段脉冲
      interval?: number;
      // 表示一条脉冲动画从头走到尾的时间（毫秒）
      duration?: number;
    }

    /**
     * 轨迹线图层，支持设置轨迹样式和轨迹点。
     */
    export class PulseLineLayer extends Layer<PulseLineLayerStyle> {
      constructor(opts: PulseLineLayerOptions);
    }

    /**
     * 连接飞线图层参数
     */
    export interface PulseLinkLayerOptions extends LayerOptions {
      // 图层中的要素是否具有前后遮盖关系，默认开启
      depth?: boolean;
    }

    /**
     * 连接飞线图层样式
     */
    export interface PulseLinkLayerStyle {
      // 链接线颜色数组。 类型为String时代表单根线的颜色，支持16进制，rgb，rgba和"red"，"blue"等color keywords； 类型为Array时，可设置颜色渐变，color[0]为起始色，color[color.lenth-1]为终止色，中间为过渡色； 类型为Function时，返回每根线的颜色。参数为(index,item)，item为一个对象{link,distance}，link为该条线的初始信息。返回结果必须是颜色数组 Array(渐变)。
      lineColors?: StyleCallbackType<string[]>;
      // 高度，单位为米，代表弧顶的高度。
      height?: StyleCallbackType<number>;
      // 弧顶位置，代表距离起点的哪个位置是弧顶最高点，可以用来模拟抛物线。 类型为Function时，返回每根线的高度。参数为(index,item)，item中有distance属性，代表两点间的距离（米），可以用该属性处理高度。
      maxHeightScale?: number;
      // 平滑步数，代表弧线的分隔段数，越大平滑度越好，但更消耗性能，默认为50。
      smoothSteps?: number;
      // 连接线的头尾宽度设置：[起点宽度，终点宽度];单位跟随 unit 字段变化。
      lineWidth?: number;
      // px 和 meter，代表此图层的样式单位，像素或者米。
      unit?: StyleUnitType;
      // 连接线的虚线配置信息：[实线长度, 虚线长度, 实线长度, 虚线长度];
      dash?: StyleCallbackType<[number, number, number, number]>;
      // 速度，每个脉冲点行进的速度（可以针对每个线路进行单独设置速度）。单位：米/秒 或者 像素/秒。
      speed?: StyleCallbackType<number>;
      // 脉冲点的头部颜色。
      headColor?: string;
      // 脉冲点的尾部颜色。
      trailColor?: string;
      // 脉冲点的长度。单位跟随 unit 字段变化。如果不希望有脉冲动画，设置此长度为 0 即可。
      flowLength?: number;
    }

    /**
     * 连接飞线图层，可以支持弧度，宽度，过渡色等能力。 并且还支持脉冲动画，可以表达数据的朝向。
     */
    export class PulseLinkLayer extends Layer<PulseLinkLayerStyle> {
      constructor(opts: PulseLinkLayerOptions);
    }

    /**
     * 激光图层参数
     */
    export interface LaserLayerOptions extends LayerOptions {
      // 图层中的要素是否具有前后遮盖关系，默认开启
      depth?: boolean;
    }

    /**
     * 激光图层样式
     */
    export interface LaserLayerStyle {
      // 图层的单位。可选值：px：像素，meter：地理单位米
      unit?: StyleUnitType;
      // 最大放射高度
      height?: StyleCallbackType<number>;
      // 激光颜色
      color?: StyleCallbackType<string>;
      // 倾斜角度，取值0～360deg，默认垂直向上，180时表示垂直向下
      angle?: StyleCallbackType<number>;
      // 激光线宽度
      lineWidth?: number;
      // 激光线长度
      trailLength?: number;
      // 接近最高点时的颜色衰减
      fadeOpacity?: number;
      // 单次放射的时长（毫秒）
      duration?: StyleCallbackType<number>;
      // 每次放射的间隔时间（毫秒）
      interval?: StyleCallbackType<number>;
      // 首次放射的延迟时间（毫秒）
      delay?: StyleCallbackType<number>;
      // 放射次数，默认循环
      repeat?: number;
    }

    /**
     * 激光图层，支持展示点类型数据的激光放射效果。
     */
    export class LaserLayer extends Layer<LaserLayerStyle> {
      constructor(opts: LaserLayerOptions)
    }

    export {};
  }
}

export {}