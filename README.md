# @amap/amap-loca-types

@amap/amap-loca-types 是高德Loca 2.0 的typings文件。

## 安装

`npm i -S @amap/amap-loca-types`

## 用法

### tsconfig.json配置示例

#### 配置types

```json
{
  "compilerOptions": {
    "types": ["@amap/amap-loca-types"]
  }
}
```

#### 配置files

```json
{
  "files": ["node_modules/@amap/amap-jsapi-types/index.d.ts", "node_modules/@amap/amap-loca-types/index.d.ts"]
}

```

### ts文件使用

```ts
/// <reference types="@amap/amap-loca-types" />
```

### 

