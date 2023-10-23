// 各平台的搜索建议

// baidu
export interface IBaiduSuggestion {
  // 输入的搜索关键词
  q: string;
  // 不知道干嘛的
  p: boolean;
  // 联想返回
  s: string[];
}
