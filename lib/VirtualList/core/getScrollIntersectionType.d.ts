declare type Params = {
    y: number;
    height: number;
    scrollY: number;
    scrollHeight: number;
};
declare type Result = 'hidden-at-top' | 'hidden-at-bottom' | 'fully-visible' | 'partially-visible' | 'partially-visible-at-top' | 'partially-visible-at-bottom';
export declare const getScrollIntersectionType: (params: Params) => Result;
export {};
