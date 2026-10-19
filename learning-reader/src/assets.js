export const appRoot=new URL('../',import.meta.url);
export const assetURL=path=>new URL(String(path).replace(/^\//,''),appRoot).href;
