const twdAmount = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 });

export function formatTwd(value: number) {
  return `NT$ ${twdAmount.format(value)}`;
}
